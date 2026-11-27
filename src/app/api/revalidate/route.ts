import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

/** Appelée par l'administration après chaque modification : met le site public à jour immédiatement. */
export async function POST() {
  try {
    const supabase = await supabaseServer();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ ok: false }, { status: 401 });
    const { data: p } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    if (p?.role !== "admin") return NextResponse.json({ ok: false }, { status: 403 });
    revalidatePath("/", "layout");
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
