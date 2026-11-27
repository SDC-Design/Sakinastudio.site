import type { Metadata } from "next";
import { getSettings } from "@/lib/data";
import PageHero from "@/components/PageHero";
import ClientArea from "@/components/ClientArea";

export const revalidate = 30;
export const metadata: Metadata = { title: "Espace client", robots: { index: false } };

export default async function ClientPage() {
  const s = await getSettings();
  return (
    <>
      <PageHero crumb="Accueil / Espace client" title={s.pages.client_title} text={s.pages.client_text} />
      <section className="bg-mist px-5 py-16 sm:px-8 sm:py-20"><div className="mx-auto max-w-7xl"><ClientArea /></div></section>
    </>
  );
}
