import Link from "next/link";
import PageHero from "@/components/PageHero";

export default function NotFound() {
  return (
    <>
      <PageHero title="Page introuvable" text="Le contenu que vous cherchez n'existe plus ou a été déplacé." />
      <section className="px-5 py-20 text-center sm:px-8"><Link href="/" className="btn btn-primary">Retour à l&apos;accueil</Link></section>
    </>
  );
}
