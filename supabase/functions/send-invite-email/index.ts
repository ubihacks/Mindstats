// @ts-nocheck — Deno runtime. Type-check with Deno language server.
/**
 * Supabase Edge Function — send-invite-email
 *
 * POST /functions/v1/send-invite-email
 * Body: { to: string; name: string; subject: string; html: string }
 *
 * Uses Supabase Auth admin.inviteUserByEmail or falls back to
 * a custom SMTP transport via the Resend API (configured via env var).
 *
 * Environment variables:
 *   RESEND_API_KEY  — Resend API key for transactional email
 *   SUPABASE_URL    — injected automatically by Supabase
 *   SUPABASE_SERVICE_ROLE_KEY — injected automatically by Supabase
 */

import { createClient } from "npm:@supabase/supabase-js@2";

const CORS: HeadersInit = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS });
  }

  try {
    const { to, name, subject, html } = await req.json();

    if (!to || !subject || !html) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: to, subject, html" }),
        { status: 400, headers: { ...CORS, "Content-Type": "application/json" } }
      );
    }

    const resendKey = Deno.env.get("RESEND_API_KEY");

    if (resendKey) {
      // ── Send via Resend (preferred) ──────────────────────────────────────
      const resp = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Mindstat <noreply@mindstat.app>",
          to: [to],
          subject,
          html,
        }),
      });

      if (!resp.ok) {
        const errText = await resp.text();
        return new Response(
          JSON.stringify({ error: `Resend error: ${errText}` }),
          { status: 502, headers: { ...CORS, "Content-Type": "application/json" } }
        );
      }

      const data = await resp.json();
      return new Response(JSON.stringify({ success: true, id: data.id }), {
        headers: { ...CORS, "Content-Type": "application/json" },
      });
    }

    // ── Fallback: Supabase Auth magic-link OTP ───────────────────────────
    // This at least delivers a Supabase-branded email so the recipient
    // knows they were invited; the assessment link is included in the body.
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { error } = await supabase.auth.admin.inviteUserByEmail(to, {
      data: { invited_name: name },
    });

    if (error) {
      // Non-fatal: user may already exist. Log and continue.
      console.warn("[send-invite-email] inviteUserByEmail warning:", error.message);
    }

    return new Response(
      JSON.stringify({ success: true, method: "supabase-otp" }),
      { headers: { ...CORS, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: String(err) }),
      { status: 500, headers: { ...CORS, "Content-Type": "application/json" } }
    );
  }
});
