import "@supabase/functions-js/edge-runtime.d.ts";
import { withSupabase } from "@supabase/server";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json",
};

function jsonResponse(
  body: Record<string, unknown>,
  status = 200,
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: corsHeaders,
  });
}

export default {
  fetch: withSupabase(
    { auth: "user" },
    async (req, ctx) => {
      if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
      }

      if (req.method !== "POST") {
        return jsonResponse(
          {
            error: "method_not_allowed",
            message: "Only POST requests are supported.",
          },
          405,
        );
      }

      if (ctx.authMode !== "user") {
        return jsonResponse(
          {
            error: "invalid_auth_mode",
            message: "This endpoint requires an authenticated user session.",
          },
          401,
        );
      }

      const {
        data: { user },
        error: userError,
      } = await ctx.supabase.auth.getUser();

      if (userError || !user) {
        return jsonResponse(
          {
            error: "unauthorized",
            message: "A valid authenticated user session is required.",
          },
          401,
        );
      }

      const { data: isModerator, error: moderatorError } =
        await ctx.supabase.rpc("is_moderator");

      if (moderatorError) {
        console.error("Moderator authorization check failed:", moderatorError);

        return jsonResponse(
          {
            error: "authorization_check_failed",
            message: "Unable to verify moderator authorization.",
          },
          500,
        );
      }

      if (isModerator !== true) {
        return jsonResponse(
          {
            error: "forbidden",
            message: "Moderator or admin authorization is required.",
          },
          403,
        );
      }

      const { data: isWriteAllowed, error: writeError } =
        await ctx.supabase.rpc("is_write_allowed");

      if (writeError) {
        console.error("Write authorization check failed:", writeError);

        return jsonResponse(
          {
            error: "authorization_check_failed",
            message: "Unable to verify account write authorization.",
          },
          500,
        );
      }

      if (isWriteAllowed !== true) {
        return jsonResponse(
          {
            error: "write_not_allowed",
            message: "The authenticated account is not currently allowed to write.",
          },
          403,
        );
      }

      let body: unknown;

      try {
        body = await req.json();
      } catch {
        return jsonResponse(
          {
            error: "invalid_json",
            message: "Request body must contain valid JSON.",
          },
          400,
        );
      }

      if (
        typeof body !== "object" ||
        body === null ||
        !("current_affair_id" in body)
      ) {
        return jsonResponse(
          {
            error: "invalid_request",
            message: "current_affair_id is required.",
          },
          400,
        );
      }

      const currentAffairId = (body as Record<string, unknown>)
        .current_affair_id;

      if (
        typeof currentAffairId !== "string" ||
        currentAffairId.trim().length === 0
      ) {
        return jsonResponse(
          {
            error: "invalid_current_affair_id",
            message: "current_affair_id must be a non-empty string.",
          },
          400,
        );
      }

      const { data: currentAffair, error: currentAffairError } =
        await ctx.supabaseAdmin
          .from("current_affairs")
          .select("id, status, content_fingerprint")
          .eq("id", currentAffairId)
          .maybeSingle();

      if (currentAffairError) {
        console.error(
          "Current affair lookup failed:",
          currentAffairError,
        );

        return jsonResponse(
          {
            error: "current_affair_lookup_failed",
            message: "Unable to load the requested Current Affairs record.",
          },
          500,
        );
      }

      if (!currentAffair) {
        return jsonResponse(
          {
            error: "current_affair_not_found",
            message: "The requested Current Affairs record was not found.",
          },
          404,
        );
      }

      if (!currentAffair.content_fingerprint) {
        return jsonResponse(
          {
            error: "missing_input_fingerprint",
            message:
              "The Current Affairs record does not have an input fingerprint and cannot be processed safely.",
          },
          409,
        );
      }

      const { data: processingRecord, error: processingError } =
        await ctx.supabaseAdmin
          .from("current_affair_ai_processing")
          .insert({
            current_affair_id: currentAffair.id,
            status: "queued",
            input_fingerprint: currentAffair.content_fingerprint,
            prompt_version: "v1",
          })
          .select("id, current_affair_id, status, input_fingerprint, prompt_version, created_at")
          .single();

      if (processingError) {
        if (processingError.code === "23505") {
          return jsonResponse(
            {
              error: "processing_already_queued",
              message:
                "An AI-processing record already exists for this Current Affairs content fingerprint.",
            },
            409,
          );
        }

        console.error(
          "AI processing record creation failed:",
          processingError,
        );

        return jsonResponse(
          {
            error: "processing_record_creation_failed",
            message: "Unable to create the AI-processing record.",
          },
          500,
        );
      }

      return jsonResponse({
        success: true,
        processing: processingRecord,
        message:
          "AI processing has been queued. No AI provider was invoked and no content was published.",
      });
    },
  ),
};
