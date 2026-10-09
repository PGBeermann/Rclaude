import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Appear } from "../components/Appear";
import { Tex } from "../components/Tex";
import { C, FONT } from "../theme";

export const Portada: React.FC = () => {
  const frame = useCurrentFrame();
  const w = interpolate(frame, [10, 50], [0, 520], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  return (
    <AbsoluteFill style={{ background: C.bg, fontFamily: FONT, color: C.text, padding: "0 140px", justifyContent: "center" }}>
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(1100px 800px at 90% 10%, rgba(56,189,248,0.16), transparent 60%), radial-gradient(900px 700px at 0% 100%, rgba(192,132,252,0.12), transparent 60%)",
        }}
      />
      <div style={{ position: "relative" }}>
        <Appear>
          <div style={{ color: C.accent, fontSize: 28, fontWeight: 600, letterSpacing: 4, textTransform: "uppercase" }}>
            Estadística aplicada · Nivel avanzado
          </div>
        </Appear>
        <Appear at={0.3}>
          <h1 style={{ fontSize: 112, fontWeight: 700, letterSpacing: -3, margin: "18px 0 0", lineHeight: 1.02 }}>
            ANOVA de dos vías
          </h1>
        </Appear>
        <div style={{ height: 4, width: w, background: `linear-gradient(90deg, ${C.accent}, ${C.violet})`, margin: "30px 0" }} />
        <Appear at={0.7}>
          <div style={{ fontSize: 40, color: C.muted, maxWidth: 1300, lineHeight: 1.35 }}>
            Diseño factorial <Tex tex="a\times b" size={40} /> con réplicas: modelo, esperanzas de cuadrados medios,
            interacción, diagnóstico y reporte en un caso de síntesis de biodiésel.
          </div>
        </Appear>
        <Appear at={1.2}>
          <div style={{ marginTop: 60, fontSize: 26, color: C.faint }}>
            Datos simulados con fines didácticos · Análisis reproducible en Python y R
          </div>
        </Appear>
      </div>
    </AbsoluteFill>
  );
};
