import type { Metadata } from "next";
import { getServices, getSettings } from "@/lib/data";
import { lines, telLink, waLink } from "@/lib/utils";
import PageHero from "@/components/PageHero";
import ContactForm from "@/components/ContactForm";

export const revalidate = 30;
export const metadata: Metadata = { title: "Contact et devis" };

const Ico = ({ children }: { children: React.ReactNode }) => (
  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white/20" aria-hidden="true">
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{children}</svg>
  </span>
);

export default async function ContactPage() {
  const [s, services] = await Promise.all([getSettings(), getServices()]);
  const g = s.general; const c = s.contact;
  const query = encodeURIComponent(`${g.name}, ${g.address1}, ${g.address2}`);
  const phones = [g.phone1, g.phone2].filter(Boolean) as string[];
  return (
    <>
      <PageHero crumb="Accueil / Contact" title={s.pages.contact_title} text={s.pages.contact_text} />
      <section className="bg-mist px-5 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.6fr_1fr]">
          <div id="devis" className="card scroll-mt-28 p-7 sm:p-10">
            <h2 className="text-3xl sm:text-4xl">{c.form_title}</h2>
            <p className="mt-3 text-lg text-ink">{c.form_text}</p>
            <ContactForm services={services.map((x: any) => x.title)} budgets={lines(c.budgets)} consent={c.consent} delay={c.delay} successTitle={c.success_title} successText={c.success_text} whatsapp={g.whatsapp} />
          </div>
          <aside className="space-y-8" aria-label="Coordonnées">
            <div className="rounded-[22px] bg-gradient-to-br from-teal to-navy p-8 text-white shadow-card">
              <h2 className="text-3xl">{c.panel_title}</h2>
              <ul className="mt-7 space-y-6 text-lg">
                {phones.length > 0 && <li className="flex gap-4"><Ico><path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z" /></Ico><span className="font-bold">{phones.map((p) => <a key={p} href={telLink(p)} className="block hover:underline">{p}</a>)}</span></li>}
                {g.email && <li className="flex gap-4"><Ico><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></Ico><a href={`mailto:${g.email}`} className="self-center font-bold hover:underline">{g.email}</a></li>}
                <li className="flex gap-4"><Ico><path d="M12 21s-7-6-7-11a7 7 0 0114 0c0 5-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" /></Ico><span className="font-bold">{g.address1}<br />{g.address2}</span></li>
                {g.hours && <li className="flex gap-4"><Ico><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></Ico><span className="self-center font-bold">{g.hours}</span></li>}
              </ul>
              <a href={waLink(g.whatsapp, "Bonjour, j'aimerais un devis.")} target="_blank" rel="noopener noreferrer" className="btn btn-white mt-8 w-full">Écrire sur WhatsApp<span aria-hidden="true">→</span></a>
            </div>
            <div className="card overflow-hidden">
              {g.map_embed_url ? (
                <iframe src={g.map_embed_url} title={`Plan d'accès : ${g.name}`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="h-80 w-full border-0" />
              ) : (
                <a href={`https://www.google.com/maps/search/?api=1&query=${query}`} target="_blank" rel="noopener noreferrer" className="relative grid h-72 place-items-center bg-[#dde6f0] text-center">
                  <span className="absolute inset-0 opacity-70 [background-image:linear-gradient(#fff_3px,transparent_3px),linear-gradient(90deg,#fff_3px,transparent_3px)] [background-size:54px_54px]" aria-hidden="true" />
                  <span className="relative"><span className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-full bg-teal text-night"><svg viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor" aria-hidden="true"><path d="M12 22s7-6 7-12a7 7 0 10-14 0c0 6 7 12 7 12zm0-9a3 3 0 110-6 3 3 0 010 6z" /></svg></span><span className="block text-lg font-bold">{g.name}</span><span className="mt-1 block font-bold text-teal-deep underline">Ouvrir dans Google Maps</span></span>
                </a>
              )}
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
