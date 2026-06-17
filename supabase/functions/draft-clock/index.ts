import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "@supabase/supabase-js";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, apikey, content-type, x-client-info",
};

Deno.serve(async (request: Request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authorization = request.headers.get("Authorization");
    if (!authorization) {
      return Response.json({ error: "Authentication required" }, { status: 401, headers: corsHeaders });
    }

    const { draft_id: draftId } = await request.json();
    if (!draftId) {
      return Response.json({ error: "draft_id is required" }, { status: 400, headers: corsHeaders });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const publishableKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const userClient = createClient(supabaseUrl, publishableKey, {
      global: { headers: { Authorization: authorization } },
      auth: { persistSession: false },
    });
    const { data: visibleDraft, error: visibilityError } = await userClient
      .from("drafts")
      .select("id, status, pick_expires_at")
      .eq("id", draftId)
      .single();

    if (visibilityError || !visibleDraft) {
      return Response.json({ error: "Draft not found" }, { status: 404, headers: corsHeaders });
    }

    const adminClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false },
    });
    const { data, error } = await adminClient.rpc("process_expired_draft_pick", {
      p_draft_id: draftId,
    });

    if (error) throw error;
    return Response.json(
      { processed: Boolean(data), pick: data ?? null },
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Unexpected error" },
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
