import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT } from "../theme";
import { Appear } from "./Appear";

export const TOTAL_SECCIONES = 14;

export const Scene: React.FC<{
  n: number;
  kicker: string;
  title: string;
  children: React.ReactNode;
}> = ({ n, kicker, title, children }) => (
  <AbsoluteFill style={{ background: C.bg, fontFamily: FONT, color: C.text }}>
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(1200px 700px at 85% -10%, rgba(56,189,248,0.10), transparent 60%), radial-gradient(900px 600px at -10% 110%, rgba(192,132,252,0.08), transparent 60%)",
      }}
    />
    <div style={{ position: "absolute", left: 96, right: 96, top: 64 }}>
      <Appear dy={10}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, color: C.accent, fontSize: 24, fontWeight: 600, letterSpacing: 2.4, textTransform: "uppercase" }}>
          <span style={{ fontVariantNumeric: "tabular-nums" }}>{String(n).padStart(2, "0")}</span>
          <span style={{ width: 40, height: 2, background: C.accent }} />
          <span>{kicker}</span>
        </div>
      </Appear>
      <Appear at={0.15} dy={14}>
        <h1 style={{ margin: "14px 0 0", fontSize: 58, fontWeight: 700, letterSpacing: -1, lineHeight: 1.1 }}>{title}</h1>
      </Appear>
    </div>
    <div style={{ position: "absolute", left: 96, right: 96, top: 230, bottom: 90 }}>{children}</div>
    <div
      style={{
        position: "absolute", left: 96, right: 96, bottom: 34, display: "flex", justifyContent: "space-between",
        fontSize: 20, color: C.faint, borderTop: `1px solid ${C.border}`, paddingTop: 14,
      }}
    >
      <span>ANOVA de dos vías · Diseño factorial en investigación química</span>
      <span style={{ fontVariantNumeric: "tabular-nums" }}>{n} / {TOTAL_SECCIONES}</span>
    </div>
  </AbsoluteFill>
);

export const Panel: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 18, padding: "28px 32px", ...style }}>
    {children}
  </div>
);

const TONO = {
  clave: { c: C.accent, label: "Clave" },
  cuidado: { c: C.amber, label: "Precaución" },
  error: { c: C.red, label: "Error frecuente" },
  quimica: { c: C.green, label: "En el laboratorio" },
} as const;

export const Callout: React.FC<{ tipo: keyof typeof TONO; children: React.ReactNode; style?: React.CSSProperties }> = ({
  tipo, children, style,
}) => {
  const t = TONO[tipo];
  return (
    <div
      style={{
        borderLeft: `5px solid ${t.c}`, background: `${t.c}14`, borderRadius: "0 14px 14px 0",
        padding: "18px 24px", fontSize: 27, lineHeight: 1.45, ...style,
      }}
    >
      <div style={{ color: t.c, fontWeight: 700, fontSize: 20, letterSpacing: 1.6, textTransform: "uppercase", marginBottom: 6 }}>
        {t.label}
      </div>
      {children}
    </div>
  );
};

export const Bullet: React.FC<{ children: React.ReactNode; color?: string }> = ({ children, color = C.accent }) => (
  <div style={{ display: "flex", gap: 18, fontSize: 30, lineHeight: 1.45, marginBottom: 16 }}>
    <span style={{ color, fontWeight: 700, marginTop: 1 }}>▸</span>
    <div>{children}</div>
  </div>
);
