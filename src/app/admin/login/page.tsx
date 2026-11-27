"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabaseBrowser } from "@/lib/supabase/client";

export default function AdminLogin() {
  const router = useRouter(); const [err, setErr] = useState(""); const [busy, setBusy] = useState(false);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setBusy(true); setErr(""); const fd = new FormData(e.currentTarget);
    const { error } = await supabaseBrowser().auth.signInWithPassword({ email: String(fd.get("email")).trim(), password: String(fd.get("password")) });
    if (error) { setErr(/Invalid login/i.test(error.message) ? "E-mail ou mot de passe incorrect." : /not confirmed/i.test(error.message) ? "Confirmez d'abord votre adresse e-mail (lien reçu par e-mail)." : error.message); setBusy(false); return; }
    router.push("/admin"); router.refresh();
  }
  return (
    <main className="grid min-h-screen place-items-center bg-gradient-to-br from-night to-navy px-5 py-10">
      <div className="w-full max-w-md">
        <Link href="/" aria-label="Retour au site"><img src="/brand/logo-dark.svg" alt="Sakina Studio" className="mx-auto h-16 w-auto" /></Link>
        <div className="card mt-8 p-8 sm:p-10">
          <h1 className="text-3xl">Administration</h1><p className="mt-2 text-ink">Connectez-vous pour gérer le contenu du site.</p>
          <form onSubmit={submit} className="mt-7 space-y-5">
            <div><label className="label" htmlFor="email">Adresse e-mail</label><input id="email" name="email" type="email" required autoComplete="email" className="field" /></div>
            <div><label className="label" htmlFor="password">Mot de passe</label><input id="password" name="password" type="password" required autoComplete="current-password" className="field" /></div>
            {err && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 font-bold text-red-700">{err}</p>}
            <button className="btn btn-primary w-full" disabled={busy}>{busy ? "Connexion…" : "Me connecter"}</button>
          </form>
        </div>
        <p className="mt-6 text-center text-sm text-white/60">Accès réservé à l&apos;équipe. <Link href="/" className="underline">Retour au site</Link></p>
      </div>
    </main>
  );
}
