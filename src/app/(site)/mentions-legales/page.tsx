import type { Metadata } from "next";
import { getSettings } from "@/lib/data";
import PageHero from "@/components/PageHero";

export const revalidate = 30;
export const metadata: Metadata = { title: "Mentions légales" };

export default async function LegalPage() {
  const s = await getSettings();
  return (
    <>
      <PageHero title={s.legal.title} className="pb-14 sm:pb-16" />
      <section className="px-5 py-16 sm:px-8"><div className="prose-lines mx-auto max-w-3xl text-lg leading-relaxed text-ink">{s.legal.content}</div></section>
    </>
  );
}
