import CrudManager from "@/components/admin/CrudManager";
import type { FieldDef } from "@/components/admin/Fields";

const fields: FieldDef[] = [
  { key: "name", label: "Nom", type: "text", required: true },
  { key: "role", label: "Fonction", type: "text" },
  { key: "photo_url", label: "Photo", type: "image", folder: "equipe" },
];
export default function Page() {
  return <CrudManager table="team_members" title="Équipe" intro="Les membres affichés sur la page À propos. Les profils masqués ne sont pas visibles ; si aucun profil n'est publié, la section disparaît." singular="un membre" fields={fields} titleKey="name" subtitleKey="role" imageKey="photo_url" />;
}
