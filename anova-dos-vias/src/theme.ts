// Fuentes empaquetadas localmente: el render no depende de acceso a Internet
import "@fontsource/inter/latin-400.css";
import "@fontsource/inter/latin-500.css";
import "@fontsource/inter/latin-600.css";
import "@fontsource/inter/latin-700.css";
import "@fontsource/jetbrains-mono/latin-400.css";
import "@fontsource/jetbrains-mono/latin-600.css";

import { continueRender, delayRender } from "remotion";

if (typeof document !== "undefined") {
  const h = delayRender("Cargando fuentes");
  Promise.all(
    ["400 20px Inter", "500 20px Inter", "600 20px Inter", "700 20px Inter", "400 20px 'JetBrains Mono'", "600 20px 'JetBrains Mono'"].map(
      (f) => document.fonts.load(f),
    ),
  ).then(() => continueRender(h), () => continueRender(h));
}

export const FONT = "Inter, system-ui, sans-serif";
export const MONO = "'JetBrains Mono', ui-monospace, monospace";

export const C = {
  bg: "#0A1020",
  panel: "#111A2E",
  panel2: "#16213A",
  border: "#25324F",
  text: "#E7ECF5",
  muted: "#93A1B8",
  faint: "#5B6B86",
  accent: "#38BDF8",
  amber: "#F5B544",
  green: "#4ADE80",
  red: "#F87171",
  violet: "#A78BFA",
};

/** Color fijo por nivel del factor A (catalizador) en todo el video */
export const CAT_COLOR: Record<string, string> = {
  KOH: "#38BDF8",
  NaOH: "#F5B544",
  CH3ONa: "#C084FC",
};

export const CAT_LABEL: Record<string, string> = {
  KOH: "KOH",
  NaOH: "NaOH",
  CH3ONa: "CH₃ONa",
};

export const FPS = 30;
