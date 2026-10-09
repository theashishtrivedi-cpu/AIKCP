import "@supabase/functions-js/edge-runtime.d.ts";
import { withSupabase } from "@supabase/server";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json",
};

function respond(body: Record<string, unknown>, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: corsHeaders,
  });
}

export default {
  fetch: withSupabase({ auth: "none" }, async (req, ctx) => {
    if (req.method === "OPTIONS") {
      return new Response("ok", { headers: corsHeaders });
    }

    if (req.method !== "POST") {
      return respond({ error: "method_not_allowed" }, 405);
    }

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return respond({ error: "invalid_json" }, 400);
    }

    if (typeof body !== "object" || body === null || Array.isArray(body)) {
      return respond({ error: "invalid_request" }, 400);
    }

    const input = body as Record<string, unknown>;
    if (typeof input.searchTerm !== "string") {
      return respond({ error: "invalid_search_term" }, 400);
    }

    const term = input.searchTerm.trim();
    if (!term) {
      return respond({ data: [] });
    }
    if (term.length > 100) {
      return respond({ error: "search_term_too_long" }, 400);
    }

    const requestedLimit = input.limit;
    if (requestedLimit !== undefined &&
        (typeof requestedLimit !== "number" || !Number.isFinite(requestedLimit))) {
      return respond({ error: "invalid_limit" }, 400);
    }

    const limit = Math.max(1, Math.min(Math.trunc(
      typeof requestedLimit === "number" ? requestedLimit : 20
    ) || 20, 50));

    // PostgreSQL RPC handles LIKE escaping and published-only filtering.
    try {
      const { data, error } = await ctx.supabaseAdmin.rpc(
        "search_published_questions_public",
        {
          p_search_term: term,
          p_limit: limit,
        },
      );

      if (error) {
        console.error("Public question search query failed.");
        return respond({ error: "search_unavailable" }, 500);
      }

      return respond({ data: data ?? [] });
    } catch {
      console.error("Public question search failed unexpectedly.");
      return respond({ error: "search_unavailable" }, 500);
    }
  }),
};
