"use client";
import { useRef, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";
import { waLink } from "@/lib/utils";

type Props = { services: string[]; budgets: string[]; consent: string; delay: string; successTitle: string; successText: string; whatsapp: string };

export default function ContactForm({ services, budgets, consent, delay, successTitle, successText, whatsapp }: Props) {
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState(""); const [sendFailed, setSendFailed] = useState(false);
  const form = useRef<HTMLFormElement>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    if (fd.get("website")) { setState("done"); return; } // piège anti-robots
    const name = String(fd.get("name") || "").trim(); const phone = String(fd.get("phone") || "").trim(); const email = String(fd.get("email") || "").trim();
    const message = String(fd.get("message") || "").trim(); const file = fd.get("file") as File | null;
    if (!name) return fail("Merci d'indiquer votre nom.");
    if (!phone && !email) return fail("Merci d'indiquer un téléphone ou une adresse e-mail pour que nous puissions vous répondre.");
    if (!message) return fail("Merci de décrire brièvement votre projet.");
    if (!fd.get("consent")) return fail("Merci de cocher la case d'acceptation.");
    if (file && file.size > 10 * 1024 * 1024) return fail("Le fichier joint dépasse 10 Mo.");
    setState("sending"); setError(""); setSendFailed(false);
    try {
      const supabase = supabaseBrowser();
      let attachment_path: string | null = null;
      if (file && file.size > 0) {
        const safe = file.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9._-]+/g, "_");
        const path = `${new Date().getFullYear()}/${crypto.randomUUID()}-${safe}`;
        const up = await supabase.storage.from("attachments").upload(path, file);
        if (!up.error) attachment_path = path;
      }
      const { error: err } = await supabase.from("leads").insert({ name, phone: phone || null, email: email || null, service: String(fd.get("service") || "") || null, budget: String(fd.get("budget") || "") || null, message, attachment_path });
      if (err) throw err;
      setState("done"); form.current?.reset();
    } catch {
      setState("error"); setSendFailed(true); setError("L'envoi n'a pas abouti. Vous pouvez réessayer ou nous écrire directement sur WhatsApp.");
    }
  }
  function fail(msg: string) { setError(msg); setSendFailed(false); setState("error"); }

  if (state === "done") {
    return (
      <div role="status" className="mt-8 rounded-2xl border border-teal/40 bg-teal/10 p-8 text-center">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-teal text-night"><svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7" /></svg></span>
        <h3 className="mt-5 text-2xl">{successTitle}</h3><p className="mt-2 text-lg text-ink">{successText}</p>
        <button type="button" onClick={() => setState("idle")} className="btn btn-ghost mt-6">Envoyer une autre demande</button>
      </div>
    );
  }
  return (
    <form ref={form} onSubmit={onSubmit} noValidate className="relative mt-8 grid gap-5 sm:grid-cols-2">
      <div><label className="label" htmlFor="name">Nom complet *</label><input id="name" name="name" className="field" autoComplete="name" required maxLength={200} /></div>
      <div><label className="label" htmlFor="phone">Téléphone / WhatsApp</label><input id="phone" name="phone" type="tel" className="field" autoComplete="tel" placeholder="+221 …" maxLength={60} /></div>
      <div className="sm:col-span-2"><label className="label" htmlFor="email">Adresse e-mail</label><input id="email" name="email" type="email" className="field" autoComplete="email" maxLength={200} /></div>
      <div><label className="label" htmlFor="service">Service souhaité</label><select id="service" name="service" className="field" defaultValue=""><option value="">Choisir un service</option>{services.map((s) => <option key={s}>{s}</option>)}<option>Autre / je ne sais pas encore</option></select></div>
      <div><label className="label" htmlFor="budget">Budget estimatif</label><select id="budget" name="budget" className="field" defaultValue=""><option value="">Choisir une fourchette</option>{budgets.map((b) => <option key={b}>{b}</option>)}</select></div>
      <div className="sm:col-span-2"><label className="label" htmlFor="message">Votre projet *</label><textarea id="message" name="message" rows={5} className="field" maxLength={5000} placeholder="Décrivez votre besoin, vos délais, vos références…" required /></div>
      <div className="sm:col-span-2"><label className="label" htmlFor="file">Fichier joint (facultatif)</label><input id="file" name="file" type="file" accept=".pdf,.png,.jpg,.jpeg,.webp,.zip,.doc,.docx" className="field file:mr-4 file:rounded-full file:border-0 file:bg-teal/20 file:px-4 file:py-2 file:font-bold file:text-navy" /><p className="mt-1.5 text-sm text-ink">Logo, cahier des charges, références. PDF, images, Word ou ZIP — 10 Mo maximum.</p></div>
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 opacity-0" />
      <div className="sm:col-span-2"><label className="flex cursor-pointer items-start gap-3 text-ink"><input type="checkbox" name="consent" className="mt-1 h-5 w-5 accent-teal" /><span>{consent}</span></label></div>
      {error && <p role="alert" className="rounded-xl bg-red-50 px-5 py-4 font-bold text-red-700 sm:col-span-2">{error} {sendFailed && <a className="underline" href={waLink(whatsapp, "Bonjour, j'aimerais un devis.")} target="_blank" rel="noopener noreferrer">Ouvrir WhatsApp</a>}</p>}
      <div className="sm:col-span-2"><button type="submit" disabled={state === "sending"} className="btn btn-primary w-full">{state === "sending" ? "Envoi en cours…" : "Envoyer ma demande"}<span aria-hidden="true">→</span></button><p className="mt-3 text-center text-sm text-ink">{delay}</p></div>
    </form>
  );
}
