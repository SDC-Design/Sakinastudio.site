"use client";
import { useState } from "react";
import Link from "next/link";
import { supabaseBrowser } from "@/lib/supabase/client";

export default function ResetPage() {
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null); const [busy, setBusy] = useState(false);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); const pw = String(new FormData(e.currentTarget).get("password") || ""); setBusy(true);
    const { error } = await supabaseBrowser().auth.updateUser({ password: pw });
    setMsg(error ? { ok: false, text: "Le lien a expiré ou le mot de passe est invalide (6 caractères minimum). Refaites une demande." } : { ok: true, text: "Mot de passe mis à jour." });
    setBusy(false);
  }
  return (
    <section className="bg-mist px-5 pb-20 pt-40 sm:px-8">
      <div className="card mx-auto max-w-md p-8 sm:p-10">
        <h1 className="text-3xl">Nouveau mot de passe</h1>
        <form onSubmit={submit} className="mt-7 space-y-5">
          <div><label className="label" htmlFor="password">Nouveau mot de passe</label><input id="password" name="password" type="password" minLength={6} required autoComplete="new-password" className="field" /></div>
          {msg && <p role="status" className={`rounded-xl px-4 py-3 font-bold ${msg.ok ? "bg-teal/10 text-teal-deep" : "bg-red-50 text-red-700"}`}>{msg.text}</p>}
          <button className="btn btn-primary w-full" disabled={busy}>Enregistrer</button>
        </form>
        <Link href="/espace-client" className="mt-6 block font-bold text-teal-deep hover:underline">← Retour à l&apos;espace client</Link>
      </div>
    </section>
  );
}
