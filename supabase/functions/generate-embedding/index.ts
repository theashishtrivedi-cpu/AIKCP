import "@supabase/functions-js/edge-runtime.d.ts";
import { withSupabase } from "@supabase/server";

const PROVIDER = "google-gemini";
const MODEL = "gemini-embedding-2";
const DIMENSIONS = 768;
const GEMINI_API_URL =
  `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:embedContent`;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json",
};

type JsonObject = Record<string, unknown>;

function isObject(value: unknown): value is JsonObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function respond(
  body: JsonObject,
  status = 200,
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: corsHeaders,
  });
}

function safeError(
  code: string,
  message: string,
  status = 500,
): Response {
  return respond({ success: false, error: code, message }, status);
}

function normalizeText(value: string | null | undefined): string {
  return (value ?? "")
    .normalize("NFKC")
    .trim()
    .replace(/\s+/g, " ");
}

async function sha256(value: string): Promise<string> {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(value),
  );

  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

async function generateVector(
  apiKey: string,
  canonicalText: string,
): Promise<number[]> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);

  try {
    const response = await fetch(GEMINI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      signal: controller.signal,
      body: JSON.stringify({
        content: {
          parts: [{ text: canonicalText }],
        },
        output_dimensionality: DIMENSIONS,
      }),
    });

    if (!response.ok) {
      console.error(
        "Gemini embedding request failed:",
        JSON.stringify({ status: response.status, model: MODEL }),
      );

      throw Object.assign(new Error("Embedding provider request failed."), {
        code: response.status === 429
          ? "provider_rate_limited"
          : "provider_unavailable",
        httpStatus: response.status === 429 ? 429 : 502,
      });
    }

    const payload: unknown = await response.json();
    const embedding = isObject(payload) ? payload.embedding : undefined;
    const vector = isObject(embedding) ? embedding.values : undefined;

    if (
      !Array.isArray(vector) ||
      vector.length !== DIMENSIONS ||
      !vector.every(
        (value) => typeof value === "number" && Number.isFinite(value),
      )
    ) {
      throw Object.assign(new Error("Invalid embedding response."), {
        code: "invalid_provider_response",
        httpStatus: 502,
      });
    }

    return vector as number[];
  } finally {
    clearTimeout(timeout);
  }
}

export default {
  fetch: withSupabase({ auth: "user" }, async (req, ctx) => {
    if (req.method === "OPTIONS") {
      return new Response("ok", { headers: corsHeaders });
    }

    if (req.method !== "POST") {
      return safeError("method_not_allowed", "Only POST is supported.", 405);
    }

    if (ctx.authMode !== "user") {
      return safeError("unauthorized", "Sign-in is required.", 401);
    }

    const {
      data: { user },
      error: userError,
    } = await ctx.supabase.auth.getUser();

    if (userError || !user) {
      return safeError("unauthorized", "A valid session is required.", 401);
    }

    const { data: moderator, error: moderatorError } =
      await ctx.supabase.rpc("is_moderator");

    if (moderatorError) {
      console.error("Embedding moderator authorization check failed.");
      return safeError(
        "authorization_check_failed",
        "Unable to verify moderator authorization.",
      );
    }

    if (moderator !== true) {
      return safeError(
        "forbidden",
        "Moderator or admin access is required.",
        403,
      );
    }

    const { data: writeAllowed, error: writeError } =
      await ctx.supabase.rpc("is_write_allowed");

    if (writeError) {
      console.error("Embedding write authorization check failed.");
      return safeError(
        "authorization_check_failed",
        "Unable to verify account write eligibility.",
      );
    }

    if (writeAllowed !== true) {
      return safeError(
        "write_not_allowed",
        "This account is not currently allowed to write.",
        403,
      );
    }

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return safeError("invalid_json", "Request body must be valid JSON.", 400);
    }

    if (
      !isObject(body) ||
      typeof body.current_affair_id !== "string" ||
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
        .test(body.current_affair_id)
    ) {
      return safeError(
        "invalid_current_affair_id",
        "A valid current_affair_id UUID is required.",
        400,
      );
    }

    const apiKey = Deno.env.get("GEMINI_API_KEY");
    if (!apiKey) {
      return safeError(
        "provider_not_configured",
        "The server-side embedding provider is not configured.",
        503,
      );
    }

    const currentAffairId = body.current_affair_id;
    const admin = ctx.supabaseAdmin;

    try {
      const { data: article, error: articleError } = await admin
        .from("current_affairs")
        .select("id,status,title,original_content,summary")
        .eq("id", currentAffairId)
        .maybeSingle();

      if (articleError) {
        throw Object.assign(new Error("Article lookup failed."), {
          code: "article_lookup_failed",
        });
      }

      if (!article) {
        return safeError(
          "current_affair_not_found",
          "The Current Affairs record was not found.",
          404,
        );
      }

      if (article.status !== "published") {
        return safeError(
          "article_not_published",
          "Only published articles can be embedded.",
          409,
        );
      }

      const title = normalizeText(article.title);
      const originalContent = normalizeText(article.original_content);
      const summary = normalizeText(article.summary);

      const source = originalContent
        ? "original_content"
        : summary
        ? "summary"
        : null;

      const selectedContent = originalContent || summary;

      if (!selectedContent) {
        return safeError(
          "no_embeddable_text",
          "The article has no content suitable for embedding.",
          422,
        );
      }

      const canonicalText = `title: ${title} | text: ${selectedContent}`;
      const fingerprint = await sha256(canonicalText);

      const { data: existing, error: lookupError } = await admin
        .from("content_embeddings")
        .select("content_fingerprint")
        .eq("current_affair_id", currentAffairId)
        .eq("provider", PROVIDER)
        .eq("model", MODEL)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (lookupError) {
        throw Object.assign(new Error("Embedding lookup failed."), {
          code: "embedding_lookup_failed",
        });
      }

      if (existing?.content_fingerprint === fingerprint) {
        return respond({
          success: true,
          action: "already_embedded",
          currentAffairId,
          fingerprint,
          provider: PROVIDER,
          model: MODEL,
          dimensions: DIMENSIONS,
        });
      }

      const vector = await generateVector(apiKey, canonicalText);

      const vectorLiteral = `[${vector.join(",")}]`;

      const { data: embeddingId, error: persistenceError } =
        await admin.rpc("persist_content_embedding", {
          p_current_affair_id: currentAffairId,
          p_provider: PROVIDER,
          p_model: MODEL,
          p_dimensions: DIMENSIONS,
          p_content_fingerprint: fingerprint,
          p_text_snapshot: canonicalText,
          p_embedding: vectorLiteral,
        });

      if (persistenceError || typeof embeddingId !== "string") {
        console.error("Embedding persistence failed:", persistenceError?.code ?? "no_id");
        throw Object.assign(new Error("Embedding persistence failed."), {
          code: "embedding_persistence_failed",
        });
      }

      // Never return the vector or the provider API key to the caller.
      return respond({
        success: true,
        action: "embedded",
        currentAffairId,
        embeddingId,
        fingerprint,
        source,
        provider: PROVIDER,
        model: MODEL,
        dimensions: DIMENSIONS,
      });
    } catch (error) {
      const e = error as Error & {
        code?: string;
        httpStatus?: number;
      };

      console.error(
        "Embedding workflow failed:",
        e.code || "embedding_workflow_failed",
      );

      return safeError(
        e.code || "embedding_workflow_failed",
        "Embedding processing failed. No article was published or modified.",
        e.httpStatus || 500,
      );
    }
  }),
};
