import CrudManager from "@/components/admin/CrudManager";
import type { FieldDef } from "@/components/admin/Fields";

const fields: FieldDef[] = [
  { key: "title", label: "Titre du projet", type: "text", required: true, wide: true },
  { key: "slug", label: "Adresse (slug)", type: "slug", slugFrom: "title" },
  { key: "category", label: "Catégorie", type: "select", optionsFrom: { table: "categories", value: "slug", label: "name" } },
  { key: "client", label: "Client", type: "text" }, { key: "year", label: "Année", type: "text" }, { key: "services_label", label: "Services réalisés", type: "text", wide: true },
  { key: "summary", label: "Résumé (liste et haut de page)", type: "textarea", rows: 2 },
  { key: "context", label: "Contexte", type: "textarea", rows: 4 }, { key: "solution", label: "Solution", type: "textarea", rows: 4 }, { key: "result", label: "Résultat", type: "textarea", rows: 4 },
  { key: "cover_url", label: "Image principale", type: "image", folder: "projets" },
  { key: "gallery", label: "Galerie d'images", type: "images", folder: "projets", help: "Affichée sous le projet si elle contient plus d'une image." },
  { key: "featured", label: "Afficher sur la page d'accueil", type: "boolean" },
];
export default function Page() {
  return <CrudManager table="projects" title="Réalisations" intro="Votre portfolio. Ajoutez, classez (flèches) et publiez vos projets." singular="une réalisation" fields={fields} subtitleKey="category" imageKey="cover_url" />;
}
