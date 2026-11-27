import type { MetadataRoute } from "next";
import { getProjects } from "@/lib/data";
import { SITE_URL } from "@/lib/utils";
export const revalidate = 3600;
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = ["", "/services", "/realisations", "/a-propos", "/contact", "/mentions-legales"].map((p) => ({ url: `${SITE_URL}${p}`, changeFrequency: "monthly" as const, priority: p === "" ? 1 : 0.7 }));
  const projects = (await getProjects()).map((p) => ({ url: `${SITE_URL}/realisations/${p.slug}`, changeFrequency: "monthly" as const, priority: 0.6 }));
  return [...pages, ...projects];
}
