import type { FieldDef } from "./Fields";

export type Group = { key: string; label: string; intro?: string; fields: FieldDef[] };
const t = (key: string, label: string, extra: Partial<FieldDef> = {}): FieldDef => ({ key, label, type: "text", ...extra });
const ta = (key: string, label: string, extra: Partial<FieldDef> = {}): FieldDef => ({ key, label, type: "textarea", rows: 3, ...extra });

/** Tous les textes et réglages modifiables du site, regroupés par onglet. */
export const SETTINGS_SCHEMA: Group[] = [
  { key: "general", label: "Coordonnées et réseaux", intro: "Ces informations apparaissent dans l'en-tête, le pied de page, la page contact et le référencement.", fields: [
    t("name", "Nom de l'agence"), t("tagline", "Slogan"), t("city", "Ville et pays"),
    t("phone1", "Téléphone principal"), t("phone2", "Téléphone secondaire"),
    t("whatsapp", "Numéro WhatsApp", { help: "Chiffres uniquement, avec l'indicatif du pays. Exemple : 221778313222" }), { key: "email", label: "Adresse e-mail", type: "email" },
    t("address1", "Adresse (ligne 1)"), t("address2", "Adresse (ligne 2)"), t("hours", "Horaires d'ouverture"),
    { key: "facebook", label: "Facebook (lien)", type: "url" }, { key: "instagram", label: "Instagram (lien)", type: "url" }, { key: "linkedin", label: "LinkedIn (lien)", type: "url" }, { key: "tiktok", label: "TikTok (lien)", type: "url" }, { key: "youtube", label: "YouTube (lien)", type: "url" },
    { key: "map_embed_url", label: "Carte Google Maps (lien d'intégration)", type: "url", wide: true, help: "Sur Google Maps : Partager, puis Intégrer une carte, puis copiez uniquement l'adresse qui suit src= dans le code. Laissez vide pour afficher un simple lien vers Maps." },
    { key: "logo_light_url", label: "Logo pour fond clair", type: "image", folder: "general", help: "Formats conseillés : SVG ou PNG transparent." }, { key: "logo_dark_url", label: "Logo pour fond sombre (en-tête)", type: "image", folder: "general" },
  ] },
  { key: "home", label: "Page d'accueil", intro: "Textes et visuels de la page d'accueil. Les services, réalisations, méthode et témoignages se gèrent dans leurs propres menus.", fields: [
    t("hero_badge", "Bandeau au-dessus du titre"), t("hero_title_1", "Titre : ligne 1"), t("hero_title_2", "Titre : ligne 2"), t("hero_title_accent", "Titre : mot en couleur", { help: "Affiché en turquoise à la suite de la ligne 2." }),
    ta("hero_text", "Texte d'introduction", { wide: true }), t("hero_cta1", "Bouton principal"), t("hero_cta2", "Bouton secondaire"),
    { key: "hero_image", label: "Image principale (mascotte)", type: "image", folder: "hero", help: "Idéalement un PNG ou WebP à fond transparent." },
    t("stat1_value", "Chiffre clé 1 : valeur"), t("stat1_label", "Chiffre clé 1 : légende"), t("stat2_value", "Chiffre clé 2 : valeur"), t("stat2_label", "Chiffre clé 2 : légende"), t("stat3_value", "Chiffre clé 3 : valeur"), t("stat3_label", "Chiffre clé 3 : légende"),
    t("expertises_eyebrow", "Section expertises : sur-titre"), t("expertises_title", "Section expertises : titre"), ta("expertises_text", "Section expertises : texte", { wide: true }),
    t("portfolio_eyebrow", "Section réalisations : sur-titre"), t("portfolio_title", "Section réalisations : titre"), t("portfolio_button", "Section réalisations : bouton"),
    t("method_eyebrow", "Section méthode : sur-titre"), t("method_title", "Section méthode : titre", { wide: true }),
    t("client_eyebrow", "Section espace client : sur-titre"), t("client_title", "Section espace client : titre"), ta("client_text", "Section espace client : texte", { wide: true }),
    { key: "client_bullets", label: "Section espace client : points forts", type: "lines", wide: true }, t("client_button", "Section espace client : bouton"),
    t("testi_eyebrow", "Section témoignages : sur-titre"), t("testi_title", "Section témoignages : titre"),
  ] },
  { key: "pages", label: "Titres des pages", intro: "Titre et phrase d'introduction affichés en haut de chaque page.", fields: [
    t("services_title", "Services : titre"), ta("services_text", "Services : introduction"), t("portfolio_title", "Réalisations : titre"), ta("portfolio_text", "Réalisations : introduction"),
    t("about_title", "À propos : titre"), ta("about_text", "À propos : introduction"), t("contact_title", "Contact : titre"), ta("contact_text", "Contact : introduction"), t("client_title", "Espace client : titre"), ta("client_text", "Espace client : introduction"),
  ] },
  { key: "about", label: "Page À propos", fields: [
    t("eyebrow", "Sur-titre"), t("title", "Titre"), t("title_accent", "Fin de titre (en couleur)"), ta("text", "Premier paragraphe", { rows: 5, wide: true }), ta("text2", "Second paragraphe", { rows: 5, wide: true }),
    { key: "image", label: "Image", type: "image", folder: "general" }, t("values_eyebrow", "Valeurs : sur-titre"), t("values_title", "Valeurs : titre"), t("team_eyebrow", "Équipe : sur-titre"), t("team_title", "Équipe : titre"),
  ] },
  { key: "contact", label: "Formulaire de contact", fields: [
    t("form_title", "Titre du formulaire"), ta("form_text", "Texte du formulaire"), { key: "budgets", label: "Tranches de budget proposées", type: "lines", wide: true, help: "Une tranche par ligne." },
    t("consent", "Texte de la case d'acceptation", { wide: true }), t("delay", "Délai de réponse annoncé"), t("success_title", "Message de confirmation : titre"), ta("success_text", "Message de confirmation : texte"), t("panel_title", "Titre du bloc coordonnées"),
  ] },
  { key: "cta", label: "Bandeau « Parlons-en »", intro: "Bandeau affiché en bas de la plupart des pages.", fields: [t("title", "Titre", { wide: true }), ta("text", "Texte", { wide: true }), t("button1", "Bouton 1 (devis)"), t("button2", "Bouton 2 (WhatsApp)")] },
  { key: "footer", label: "Pied de page", fields: [ta("text", "Texte de présentation", { wide: true }), t("copyright", "Mention de droits", { help: "L'année est ajoutée automatiquement." })] },
  { key: "seo", label: "Référencement (Google)", intro: "Titre et description affichés par les moteurs de recherche et lors du partage du site.", fields: [t("title", "Titre du site", { wide: true }), ta("description", "Description (150 à 160 caractères)", { wide: true }), { key: "og_image", label: "Image de partage", type: "image", folder: "general" }] },
  { key: "legal", label: "Mentions légales", fields: [t("title", "Titre"), ta("content", "Contenu", { rows: 16, wide: true })] },
];
