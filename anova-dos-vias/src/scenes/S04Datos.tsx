import React from "react";
import { Appear } from "../components/Appear";
import { Callout, Panel, Scene } from "../components/Scene";
import { Tex } from "../components/Tex";
import { R, media } from "../data";
import { num } from "../fmt";
import { C, CAT_COLOR, CAT_LABEL, MONO } from "../theme";

const td: React.CSSProperties = { padding: "14px 22px", textAlign: "center", fontFamily: MONO, fontSize: 30 };

export const S04Datos: React.FC = () => {
  const all = R.celdas.map((c) => c.media);
  const lo = Math.min(...all), hi = Math.max(...all);
  const heat = (v: number) => `rgba(56,189,248,${0.08 + 0.42 * ((v - lo) / (hi - lo))})`;
  return (
    <Scene n={4} kicker="Datos" title="Medias de celda, marginales y media global">
      <div style={{ display: "flex", gap: 48 }}>
        <Appear at={0.3}>
          <Panel style={{ padding: 24 }}>
            <table style={{ borderCollapse: "separate", borderSpacing: 6 }}>
              <thead>
                <tr style={{ color: C.muted, fontSize: 24 }}>
                  <th />
                  {R.factores.B.map((t) => <th key={t} style={{ fontWeight: 600 }}>{t} °C</th>)}
                  <th style={{ color: C.amber }}><Tex size={28} tex="\bar y_{i\cdot\cdot}" /></th>
                </tr>
              </thead>
              <tbody>
                {R.factores.A.map((cat, i) => (
                  <tr key={cat}>
                    <td style={{ fontSize: 28, fontWeight: 700, color: CAT_COLOR[cat], paddingRight: 20 }}>{CAT_LABEL[cat]}</td>
                    {R.factores.B.map((t, j) => (
                      <td key={t} style={{ ...td, background: heat(media(cat, t)), borderRadius: 10 }}>
                        <Appear at={0.8 + 0.12 * (i * 3 + j)} dy={8}>{num(media(cat, t))}</Appear>
                      </td>
                    ))}
                    <td style={{ ...td, color: C.amber }}>
                      <Appear at={2.2 + i * 0.15} dy={8}>{num(R.medias_A[cat as keyof typeof R.medias_A])}</Appear>
                    </td>
                  </tr>
                ))}
                <tr>
                  <td style={{ color: C.amber, paddingRight: 20 }}><Tex size={28} tex="\bar y_{\cdot j\cdot}" /></td>
                  {R.factores.B.map((t, j) => (
                    <td key={t} style={{ ...td, color: C.amber }}>
                      <Appear at={2.7 + j * 0.15} dy={8}>{num(R.medias_B[String(t) as keyof typeof R.medias_B])}</Appear>
                    </td>
                  ))}
                  <td style={{ ...td, color: C.green, fontWeight: 600 }}>
                    <Appear at={3.3} dy={8}>{num(R.media_global)}</Appear>
                  </td>
                </tr>
              </tbody>
            </table>
            <div style={{ fontSize: 20, color: C.muted, marginTop: 10 }}>Rendimiento FAME (%), media de n = 3 réplicas. Color ∝ media de celda.</div>
          </Panel>
        </Appear>
        <div style={{ flex: 1 }}>
          <Appear at={3.8}>
            <Panel>
              <div style={{ fontSize: 24, color: C.accent, fontWeight: 700 }}>Estimadores de mínimos cuadrados</div>
              <Tex display size={32} tex="\hat\tau_i=\bar y_{i\cdot\cdot}-\bar y_{\cdot\cdot\cdot},\quad \hat\beta_j=\bar y_{\cdot j\cdot}-\bar y_{\cdot\cdot\cdot}" />
              <Tex display size={32} tex="\widehat{(\tau\beta)}_{ij}=\bar y_{ij\cdot}-\bar y_{i\cdot\cdot}-\bar y_{\cdot j\cdot}+\bar y_{\cdot\cdot\cdot}" />
            </Panel>
          </Appear>
          <Appear at={5.0}>
            <Callout tipo="cuidado" style={{ marginTop: 24 }}>
              CH₃ONa es el mejor a 60 °C ({num(media("CH3ONa", 60))} %), pero a 70 °C su ventaja desaparece. Las medias marginales
              promedian sobre ese patrón: <b>no describen a ningún catalizador en particular</b> si existe interacción.
            </Callout>
          </Appear>
        </div>
      </div>
    </Scene>
  );
};
