import raw from "./defaults.json";

/** Contenu de secours : affiché si la base est vide ou injoignable, et valeurs initiales de l'administration. */
export const DEFAULTS = raw as any;
export type Settings = {
  general: Record<string, any>; home: Record<string, any>; pages: Record<string, any>; about: Record<string, any>;
  contact: Record<string, any>; cta: Record<string, any>; footer: Record<string, any>; seo: Record<string, any>; legal: Record<string, any>;
};
export const SETTING_GROUPS = ["general", "home", "pages", "about", "contact", "cta", "footer", "seo", "legal"] as const;
