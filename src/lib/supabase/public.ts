import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_KEY } from "./env";

/** Client anonyme pour lire le contenu public (sans cookies, compatible avec la mise en cache). */
export function supabasePublic() {
  return createClient(SUPABASE_URL, SUPABASE_KEY, { auth: { persistSession: false, autoRefreshToken: false } });
}
