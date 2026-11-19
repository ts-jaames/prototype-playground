"use client";

import { useSyncExternalStore } from "react";

function subscribeToRootClass(callback: () => void) {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "style"] });
  return () => observer.disconnect();
}

/**
 * Resolved value of a design token (e.g. "background", "chart-1") for canvas / WebGL,
 * where Tailwind classes can't reach. Updates when the theme changes.
 */
export function useCssColor(token: string, fallback = "transparent"): string {
  return useSyncExternalStore(
    subscribeToRootClass,
    () =>
      getComputedStyle(document.documentElement).getPropertyValue(`--${token}`).trim() || fallback,
    () => fallback,
  );
}

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    (callback) => {
      const query = window.matchMedia(REDUCED_MOTION);
      query.addEventListener("change", callback);
      return () => query.removeEventListener("change", callback);
    },
    () => window.matchMedia(REDUCED_MOTION).matches,
    () => false,
  );
}
