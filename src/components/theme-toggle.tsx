"use client";

import { useSyncExternalStore } from "react";

type Theme = "light" | "dark";

const darkQuery = "(prefers-color-scheme: dark)";

function currentTheme(): Theme {
  const explicit = document.documentElement.dataset.theme;
  if (explicit === "light" || explicit === "dark") return explicit;
  return window.matchMedia(darkQuery).matches ? "dark" : "light";
}

function subscribe(onChange: () => void) {
  const media = window.matchMedia(darkQuery);
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  media.addEventListener("change", onChange);
  return () => {
    observer.disconnect();
    media.removeEventListener("change", onChange);
  };
}

function apply(theme: Theme) {
  const root = document.documentElement;
  // Back to following the OS when the choice matches it.
  const system: Theme = window.matchMedia(darkQuery).matches ? "dark" : "light";
  try {
    if (theme === system) localStorage.removeItem("theme");
    else localStorage.setItem("theme", theme);
  } catch {}
  if (theme === system) delete root.dataset.theme;
  else root.dataset.theme = theme;
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, currentTheme, () => null);

  function toggle(event: React.MouseEvent<HTMLButtonElement>) {
    const next: Theme = currentTheme() === "dark" ? "light" : "dark";
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!document.startViewTransition || reduceMotion) {
      apply(next);
      return;
    }

    const root = document.documentElement;
    const { clientX: x, clientY: y } = event;
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));

    root.classList.add("theme-transition");
    const transition = document.startViewTransition(() => apply(next));
    transition.ready.then(() => {
      const clipPath = [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`];
      const timing = { duration: 520, easing: "cubic-bezier(0.22, 1, 0.36, 1)" };
      for (const pseudoElement of ["::view-transition-new(root)", "::view-transition-new(site-header)"]) {
        root.animate({ clipPath }, { ...timing, pseudoElement });
      }
    });
    transition.finished.finally(() => root.classList.remove("theme-transition"));
  }

  const label = theme === "dark" ? "Switch to light theme" : "Switch to dark theme";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className="grid size-9 place-items-center rounded-full text-fg-muted transition-colors hover:bg-bg-elev hover:text-fg"
    >
      <svg viewBox="0 0 24 24" className="size-[1.125rem]" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
        {/* A half-filled disc reads as "contrast" in either theme. */}
        <circle cx="12" cy="12" r="8.25" />
        <path d="M12 3.75a8.25 8.25 0 0 1 0 16.5Z" fill="currentColor" stroke="none" />
      </svg>
    </button>
  );
}
