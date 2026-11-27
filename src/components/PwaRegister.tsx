"use client";
import { useEffect } from "react";

/** Enregistre le service worker : indispensable pour que le site puisse être installé comme application. */
export default function PwaRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch(() => { /* non bloquant */ });
  }, []);
  return null;
}
