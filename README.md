# Sakina Studio · Site web administrable

Site vitrine, portfolio et espace client de Sakina Studio.
**Technologies :** Next.js 15 (React 19), Tailwind CSS 4, Supabase (base de données, comptes, fichiers). Le site est aussi une **application installable** (PWA).

Tout le contenu (textes, images, services, réalisations, équipe, témoignages…) se modifie depuis l'administration : **`/admin`**.

---

## 1. Mise en route en 6 étapes

### Étape 1 : préparer la base de données (Supabase)
1. Ouvrez votre projet sur https://supabase.com, menu **SQL Editor**.
2. Ouvrez le fichier **`supabase/schema.sql`**. **Ligne 17**, remplacez `REMPLACEZ@VOTRE-EMAIL.COM` par l'adresse e-mail qui servira de compte administrateur.
3. Copiez tout le fichier dans le SQL Editor, puis **Run**.
4. Faites de même avec **`supabase/seed.sql`** : il charge le contenu initial (textes, services, réalisations de démonstration…). Il peut être relancé sans rien écraser.

### Étape 2 : créer le compte administrateur
1. Dans Supabase : **Authentication > Users > Add user > Create new user**, avec **l'adresse e-mail de l'étape 1** et un mot de passe solide (cochez « Auto Confirm User »).
2. Ce compte est automatiquement reconnu comme administrateur.

### Étape 3 : régler l'authentification
Dans Supabase : **Authentication > URL Configuration**
- **Site URL** : l'adresse du site (ex. `https://www.votre-domaine.com`, ou `http://localhost:3000` pour tester).
- **Redirect URLs** : ajoutez `https://www.votre-domaine.com/auth/callback` (et `http://localhost:3000/auth/callback` pour les tests).

Pour l'envoi fiable des e-mails de confirmation aux clients en production, configurez votre propre service d'envoi dans **Project Settings > Authentication > SMTP Settings** (le service par défaut de Supabase est limité).

### Étape 4 : tester sur votre ordinateur
Il faut Node.js 20 ou plus.
```bash
npm install
npm run dev
```
Ouvrez http://localhost:3000. L'administration est sur http://localhost:3000/admin/login.
Le fichier `.env.local` contient déjà l'adresse Supabase et la clé publique de votre projet.

### Étape 5 : mettre en ligne (exemple avec Vercel)
1. Envoyez le dossier sur GitHub.
2. Sur https://vercel.com : **Add New > Project**, choisissez le dépôt.
3. Dans **Environment Variables**, ajoutez :
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
   - `NEXT_PUBLIC_SITE_URL` (l'adresse définitive du site)
4. **Deploy**, puis rattachez votre nom de domaine. Revenez ensuite à l'étape 3 avec la vraie adresse.

### Étape 6 : remplir le contenu
Connectez-vous sur `/admin` (voir la section suivante).

---

## 2. Utiliser l'administration

| Menu | Ce que vous pouvez faire |
|---|---|
| **Tableau de bord** | Voir les nouvelles demandes et les chiffres clés. |
| **Demandes de devis** | Lire les messages du formulaire, ouvrir les fichiers joints, répondre sur WhatsApp ou par e-mail, changer le statut. |
| **Clients et projets** | Associer des projets à vos clients (avancement, statut), leur déposer des fichiers à télécharger, leur répondre. Les clients créent eux-mêmes leur compte sur la page « Espace client » et apparaissent dans la liste. |
| **Réglages et textes** | Modifier **tous les textes** (accueil, titres de pages, à propos, formulaire, pied de page, mentions légales), les coordonnées, les liens de réseaux sociaux, le logo, l'image d'accueil, le référencement Google. |
| **Services, Réalisations, Catégories, Méthode, Valeurs, Équipe, Témoignages** | Ajouter, modifier, supprimer, **réordonner (flèches)**, **masquer ou publier**. |
| **Médiathèque** | Voir, téléverser, copier l'adresse ou supprimer les images. Les images trop grandes sont réduites automatiquement. |

Les modifications apparaissent sur le site **immédiatement** après l'enregistrement.

### Contenus de démonstration à remplacer avant le lancement
- **Réalisations** : 8 créations d'exemple (affiches, carte de visite, extraits de vidéos). Les textes « Contexte / Solution / Résultat » sont à compléter.
- **Témoignages et équipe** : des exemples sont fournis **masqués**. Remplacez-les puis cliquez sur « Publier » (la section s'affiche seulement si au moins un élément est publié).
- **Mentions légales, texte « À propos » (2e paragraphe), horaires, tranches de budget, délai de réponse** : textes types à valider.
- **Adresse e-mail et réseaux sociaux** : vides par défaut, à renseigner dans « Réglages et textes > Coordonnées et réseaux ».
- **WhatsApp** : le numéro est `221778313222` (à vérifier).

---

## 3. Application installable (PWA)

Le site peut être installé comme une application, sans passer par un magasin d'applications :
- **Chrome / Edge (ordinateur)** : icône d'installation dans la barre d'adresse, ou bouton « Installer l'application » en bas du site.
- **Android** : menu de Chrome > « Installer l'application », ou le bouton du pied de page.
- **iPhone / iPad** : dans Safari, bouton Partager > « Sur l'écran d'accueil ».

Ce qui est inclus : manifeste de l'application (`src/app/manifest.ts`), service worker (`public/sw.js`), page hors connexion (`/offline`), icône de l'application, icône adaptative Android, icône iOS, favicon, raccourcis (Devis, Réalisations, Espace client) et captures d'écran.
**Prérequis :** l'installation fonctionne uniquement en HTTPS (automatique sur Vercel) ou sur `localhost`.

Le service worker ne met **jamais** en cache l'administration, l'espace client ni les échanges avec Supabase.

**Changer l'icône de l'application** : remplacez les fichiers de `public/icons/` (192 et 512 px, normal et « maskable »), `src/app/icon.svg`, `src/app/apple-icon.png` (180 px) et `src/app/favicon.ico`. Le nom de l'application suit automatiquement le « Nom de l'agence » des réglages.

---

## 4. Sécurité : à savoir

- La clé `sb_publishable_…` est **publique par conception** : elle est visible dans le navigateur. La sécurité repose sur les **règles d'accès (RLS)** définies dans `supabase/schema.sql` : le public ne peut que lire le contenu publié et envoyer une demande de devis ; seul l'administrateur peut modifier le contenu ; chaque client ne voit que ses propres projets et fichiers.
- **Ne partagez jamais** la clé « secret » ou `service_role` de Supabase. Elle n'est pas utilisée par ce site.
- Les pièces jointes des devis et les fichiers clients sont **privés** (liens temporaires signés).
- Le formulaire de contact contient un piège anti-robots. Pour une protection renforcée contre le spam, vous pouvez ajouter hCaptcha ou Cloudflare Turnstile.
- Changez le mot de passe administrateur si vous l'avez partagé. Activez l'authentification à deux facteurs sur votre compte Supabase et Vercel.

---

## 5. Structure du projet

```
src/app/(site)/        pages publiques : accueil, services, réalisations, à propos, contact, espace client, mentions légales
src/app/admin/         administration (connexion + panneau)
src/components/        composants du site ; components/admin/ : outils de gestion de contenu
src/lib/               accès Supabase, lecture des données, contenu de secours (defaults.json)
supabase/schema.sql    structure de la base + règles de sécurité + stockage
supabase/seed.sql      contenu initial
public/                logos, mascottes, images, polices, icônes, service worker
scripts/               génération du contenu initial (npm run seed:gen)
```

**Contenu de secours :** si la base est injoignable ou vide, le site affiche automatiquement le contenu de `src/lib/defaults.json`. Pour changer le contenu initial, modifiez `scripts/defaults_source.json` puis lancez `npm run seed:gen` (nécessite Python 3).

**Police :** le site utilise **Candara** (police de votre charte) lorsqu'elle est installée sur l'appareil (Windows), et la police **Carlito** (libre de droits, fournie dans `public/fonts`) sinon.

## 6. Idées d'évolution
Notification par e-mail à chaque nouvelle demande (Supabase Database Webhook + Edge Function), notifications push pour les clients, blog / actualités administrable, version anglaise ou wolof, suivi des visites.
