import CrudManager from "@/components/admin/CrudManager";
import type { FieldDef } from "@/components/admin/Fields";

const fields: FieldDef[] = [
  { key: "name", label: "Nom", type: "text", required: true },
  { key: "role", label: "Fonction", type: "text" }, { key: "company", label: "Entreprise", type: "text" },
  { key: "quote", label: "Témoignage", type: "textarea", rows: 5, required: true },
  { key: "avatar_url", label: "Photo (facultatif)", type: "image", folder: "temoignages" },
];
export default function Page() {
  return <CrudManager table="testimonials" title="Témoignages" intro="Les avis clients de la page d'accueil. Les exemples fournis sont masqués : remplacez-les par de vrais témoignages, puis cliquez sur « Publier »." singular="un témoignage" fields={fields} titleKey="name" subtitleKey="quote" imageKey="avatar_url" />;
}
