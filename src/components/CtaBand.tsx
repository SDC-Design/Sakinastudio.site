import Link from "next/link";
import { waLink } from "@/lib/utils";

export default function CtaBand({ s }: { s: any }) {
  return (
    <section className="px-5 py-16 sm:px-8 sm:py-24">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-gradient-to-br from-teal to-navy px-7 py-14 text-white sm:px-14 sm:py-16">
        <img src="/brand/monogram-white.svg" alt="" aria-hidden="true" className="pointer-events-none absolute -right-10 -top-16 hidden h-[130%] w-auto opacity-[0.14] md:block" />
        <div className="relative max-w-2xl">
          <h2 className="text-4xl sm:text-5xl">{s.cta.title}</h2>
          <p className="mt-4 text-lg text-white/90 sm:text-xl">{s.cta.text}</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/contact#devis" className="btn btn-white">{s.cta.button1}<span aria-hidden="true">→</span></Link>
            <a href={waLink(s.general.whatsapp, "Bonjour, j'aimerais un devis.")} target="_blank" rel="noopener noreferrer" className="btn btn-outline">{s.cta.button2}</a>
          </div>
        </div>
      </div>
    </section>
  );
}
