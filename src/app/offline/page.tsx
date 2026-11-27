import type { Metadata } from "next";
export const metadata: Metadata = { title: "Hors connexion", robots: { index: false } };

export default function OfflinePage() {
  return (
    <main className="grid min-h-screen place-items-center bg-gradient-to-br from-night to-navy px-6 text-center text-white">
      <div className="max-w-md">
        <img src="/brand/logo-dark.svg" alt="Sakina Studio" className="mx-auto h-16 w-auto" />
        <h1 className="mt-10 text-4xl">Vous êtes hors connexion</h1>
        <p className="mt-4 text-lg text-ice/80">Cette page n&apos;est pas disponible sans Internet. Vérifiez votre connexion puis réessayez.</p>
        <a href="/" className="btn btn-primary mt-8">Réessayer</a>
      </div>
    </main>
  );
}
