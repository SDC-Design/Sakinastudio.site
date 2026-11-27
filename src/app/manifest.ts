import type { MetadataRoute } from "next";
import { getSettings } from "@/lib/data";

export const revalidate = 3600;

/** Manifeste de l'application web : permet d'installer le site comme une application (Chrome, Edge, Android, iPhone). */
export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const s = await getSettings();
  return {
    id: "/",
    name: `${s.general.name} · ${s.general.tagline}`,
    short_name: s.general.name,
    description: s.seo.description,
    lang: "fr",
    dir: "ltr",
    start_url: "/?source=pwa",
    scope: "/",
    display: "standalone",
    background_color: "#1C2D4F",
    theme_color: "#1C2D4F",
    categories: ["business", "design", "productivity"],
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/maskable-192.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
      { src: "/icons/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    screenshots: [
      { src: "/screenshots/accueil-large.png", sizes: "1280x720", type: "image/png", form_factor: "wide", label: "Page d'accueil" },
      { src: "/screenshots/accueil-mobile.png", sizes: "780x1688", type: "image/png", form_factor: "narrow", label: "Page d'accueil sur mobile" },
    ],
    shortcuts: [
      { name: "Demander un devis", short_name: "Devis", url: "/contact#devis", icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }] },
      { name: "Nos réalisations", short_name: "Réalisations", url: "/realisations", icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }] },
      { name: "Espace client", short_name: "Espace client", url: "/espace-client", icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }] },
    ],
  } as MetadataRoute.Manifest;
}
