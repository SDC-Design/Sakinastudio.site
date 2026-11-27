import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

/** Retour des liens e-mail Supabase (confirmation de compte, réinitialisation du mot de passe). */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") || "/espace-client";
  if (code) {
    try { await (await supabaseServer()).auth.exchangeCodeForSession(code); } catch { /* ignoré */ }
  }
  return NextResponse.redirect(`${origin}${next.startsWith("/") ? next : "/espace-client"}`);
}
