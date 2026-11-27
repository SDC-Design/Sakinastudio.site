import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getServices, getSettings } from "@/lib/data";

export const revalidate = 30;

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [s, services] = await Promise.all([getSettings(), getServices()]);
  return (
    <>
      <a href="#contenu" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-teal focus:px-5 focus:py-3 focus:font-bold focus:text-night">Aller au contenu</a>
      <Header logo={s.general.logo_dark_url} name={s.general.name} />
      <main id="contenu">{children}</main>
      <Footer s={s} services={services} />
    </>
  );
}
