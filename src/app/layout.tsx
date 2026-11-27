import "./globals.css";
import type { Metadata, Viewport } from "next";
import { getSettings } from "@/lib/data";
import { SITE_URL } from "@/lib/utils";
import PwaRegister from "@/components/PwaRegister";

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: s.seo.title, template: `%s · ${s.general.name}` },
    description: s.seo.description,
    applicationName: s.general.name,
    appleWebApp: { capable: true, title: s.general.name, statusBarStyle: "black-translucent" },
    formatDetection: { telephone: true },
    openGraph: { title: s.seo.title, description: s.seo.description, siteName: s.general.name, locale: "fr_FR", type: "website", images: s.seo.og_image ? [s.seo.og_image] : [] },
  };
}
export const viewport: Viewport = { themeColor: "#1C2D4F", width: "device-width", initialScale: 1, viewportFit: "cover" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        {children}
        <PwaRegister />
      </body>
    </html>
  );
}
