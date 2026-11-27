import CrudManager from "@/components/admin/CrudManager";
import type { FieldDef } from "@/components/admin/Fields";

const fields: FieldDef[] = [
  { key: "title", label: "Titre du service", type: "text", required: true, wide: true },
  { key: "slug", label: "Adresse (slug)", type: "slug", slugFrom: "title", help: "Utilisée dans les liens. Laissez vide pour la générer." },
  { key: "short_title", label: "Titre court", type: "text", help: "Pour le pied de page et les pastilles." },
  { key: "icon", label: "Icône", type: "icon" },
  { key: "summary", label: "Résumé (une phrase)", type: "textarea", rows: 2 },
  { key: "description", label: "Description détaillée", type: "textarea", rows: 5 },
  { key: "deliverables", label: "Livrables", type: "lines", help: "Un livrable par ligne." },
];
export default function Page() {
  return <CrudManager table="services" title="Services" intro="Les cinq expertises présentées sur l'accueil et la page Services." singular="un service" fields={fields} subtitleKey="summary" />;
}
