import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";
import AdminNav, { SignOut } from "@/components/admin/AdminNav";

export const metadata: Metadata = { title: { absolute: "Administration · Sakina Studio" }, robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  let user: any = null; let profile: any = null;
  try {
    const supabase = await supabaseServer();
    user = (await supabase.auth.getUser()).data.user;
    if (user) profile = (await supabase.from("profiles").select("role,full_name,email").eq("id", user.id).maybeSingle()).data;
  } catch { /* Supabase injoignable */ }
  if (!user) redirect("/admin/login");
  if (profile?.role !== "admin") {
    return (
      <main className="grid min-h-screen place-items-center bg-mist px-5">
        <div className="card max-w-lg p-10 text-center">
          <h1 className="text-3xl">Accès réservé</h1>
          <p className="mt-4 text-lg text-ink">Le compte <strong>{user.email}</strong> n&apos;a pas les droits d&apos;administration. {profile ? "" : "Son profil n'existe pas encore : vérifiez que le fichier supabase/schema.sql a bien été exécuté. "}L&apos;adresse e-mail administrateur se définit dans supabase/schema.sql (table admin_emails).</p>
          <SignOut className="btn btn-dark mt-7" />
        </div>
      </main>
    );
  }
  return (
    <div className="min-h-screen bg-mist lg:flex">
      <AdminNav name={profile.full_name || profile.email || user.email} />
      <main className="min-w-0 flex-1 px-5 py-8 sm:px-10 sm:py-12"><div className="mx-auto max-w-6xl">{children}</div></main>
    </div>
  );
}
