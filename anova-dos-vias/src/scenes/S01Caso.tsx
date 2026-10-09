import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { Appear } from "../components/Appear";
import { Bullet, Callout, Panel, Scene } from "../components/Scene";
import { R } from "../data";
import { C, CAT_COLOR, CAT_LABEL, MONO } from "../theme";

const Grid: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cell = 190;
  return (
    <div style={{ display: "grid", gridTemplateColumns: `150px repeat(3, ${cell}px)`, gap: 14, alignItems: "center" }}>
      <div />
      {R.factores.B.map((t) => (
        <div key={t} style={{ textAlign: "center", fontSize: 26, color: C.muted, fontWeight: 600 }}>{t} °C</div>
      ))}
      {R.factores.A.map((cat) => (
        <React.Fragment key={cat}>
          <div style={{ fontSize: 28, fontWeight: 700, color: CAT_COLOR[cat] }}>{CAT_LABEL[cat]}</div>
          {R.factores.B.map((t, j) => {
            const corr = R.datos.filter((d) => d.catalizador === cat && d.temperatura === t);
            return (
              <div
                key={t}
                style={{
                  height: 120, borderRadius: 14, border: `1px solid ${C.border}`, background: C.panel2,
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 14,
                }}
              >
                {corr.map((d) => {
                  // cada corrida aparece según su orden aleatorio de ejecución
                  const t0 = 1.2 * fps + d.orden_corrida * 4;
                  const o = interpolate(frame, [t0, t0 + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
                  return (
                    <div key={d.replica} style={{ opacity: o, textAlign: "center", transform: `scale(${0.6 + 0.4 * o})` }}>
                      <div style={{ width: 30, height: 30, borderRadius: 15, background: CAT_COLOR[cat], margin: "0 auto" }} />
                      <div style={{ fontFamily: MONO, fontSize: 16, color: C.muted, marginTop: 6 }}>#{d.orden_corrida}</div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </React.Fragment>
      ))}
    </div>
  );
};

export const S01Caso: React.FC = () => (
  <Scene n={1} kicker="Caso de investigación" title="Transesterificación: ¿catalizador, temperatura… o ambos?">
    <div style={{ display: "flex", gap: 56, height: "100%" }}>
      <div style={{ flex: 1 }}>
        <Appear at={0.4}><Bullet><b>Respuesta</b> <i>y</i>: rendimiento de ésteres metílicos (FAME, % m/m) por GC-FID.</Bullet></Appear>
        <Appear at={0.8}><Bullet color={C.violet}><b>Factor A</b> — catalizador homogéneo básico: KOH, NaOH, CH₃ONa (<i>a</i> = 3, fijo).</Bullet></Appear>
        <Appear at={1.2}><Bullet color={C.amber}><b>Factor B</b> — temperatura: 50, 60, 70 °C (<i>b</i> = 3, fijo).</Bullet></Appear>
        <Appear at={1.6}><Bullet color={C.green}><b><i>n</i> = 3</b> réplicas genuinas por celda → <i>N</i> = 27 corridas en orden <b>completamente aleatorizado</b>.</Bullet></Appear>
        <Appear at={2.4}>
          <Callout tipo="quimica" style={{ marginTop: 18 }}>
            Constantes: relación molar MeOH:aceite 6:1, 1.0 % m/m de catalizador, 60 min. Una réplica = una reacción
            independiente, <b>no</b> una reinyección cromatográfica (eso sería pseudorreplicación).
          </Callout>
        </Appear>
      </div>
      <Panel style={{ width: 800, alignSelf: "flex-start" }}>
        <div style={{ fontSize: 22, color: C.muted, marginBottom: 18 }}>Diseño 3 × 3 · los números indican el orden de corrida</div>
        <Grid />
      </Panel>
    </div>
  </Scene>
);
