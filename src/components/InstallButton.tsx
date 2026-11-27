"use client";
import { useEffect, useState } from "react";

/** Bouton « Installer l'application » (Chrome, Edge, Android) + explication pour iPhone/iPad. */
export default function InstallButton() {
  const [evt, setEvt] = useState<any>(null);
  const [standalone, setStandalone] = useState(false);
  const [ios, setIos] = useState(false);
  useEffect(() => {
    setStandalone(window.matchMedia("(display-mode: standalone)").matches || (navigator as any).standalone === true);
    setIos(/iphone|ipad|ipod/i.test(navigator.userAgent) && !(window as any).MSStream);
    const onPrompt = (e: Event) => { e.preventDefault(); setEvt(e); };
    const onInstalled = () => { setEvt(null); setStandalone(true); };
    window.addEventListener("beforeinstallprompt", onPrompt); window.addEventListener("appinstalled", onInstalled);
    return () => { window.removeEventListener("beforeinstallprompt", onPrompt); window.removeEventListener("appinstalled", onInstalled); };
  }, []);
  if (standalone) return null;
  if (evt) {
    return (
      <button type="button" onClick={async () => { evt.prompt(); await evt.userChoice; setEvt(null); }} className="inline-flex items-center gap-3 rounded-full border border-bright/60 px-5 py-2.5 text-[0.97rem] font-bold text-bright transition hover:bg-bright hover:text-night">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 3v12m0 0l-4-4m4 4l4-4M5 19h14" /></svg>
        Installer l&apos;application
      </button>
    );
  }
  if (ios) {
    return (
      <details className="text-[0.95rem] text-ice/80">
        <summary className="cursor-pointer font-bold text-bright">Installer l&apos;application sur iPhone</summary>
        <p className="mt-2 max-w-xs">Dans Safari, touchez le bouton Partager, puis « Sur l&apos;écran d&apos;accueil ».</p>
      </details>
    );
  }
  return null;
}
