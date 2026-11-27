"use client";
import { createBrowserClient } from "@supabase/ssr";
import { SUPABASE_URL, SUPABASE_KEY } from "./env";

let client: ReturnType<typeof createBrowserClient> | null = null;
/** Client Supabase côté navigateur (session de l'utilisateur connecté). */
export function supabaseBrowser() {
  if (!client) client = createBrowserClient(SUPABASE_URL, SUPABASE_KEY);
  return client;
}
