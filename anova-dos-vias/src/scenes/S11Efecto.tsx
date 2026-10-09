import React from "react";
import { Appear, useProgress } from "../components/Appear";
import { Callout, Panel, Scene } from "../components/Scene";
import { Tex } from "../components/Tex";
import { R, fila } from "../data";
import { num } from "../fmt";
import { C, MONO } from "../theme";

const Barra: React.FC<{ label: string; eta: number; omega: number; at: number }> = ({ label, eta, omega, at }) => {
  const p = useProgress(at, at + 1.2);
  return (
    <div style={{ marginBottom: 22 }}>
      <div style={{ fontSize: 25, marginBottom: 6 }}>{label}</div>
      {[{ v: eta, c: C.accent, t: "\\eta^2_p" }, { v: omega, c: C.violet, t: "\\omega^2_p" }].map((b) => (
        <div key={b.t} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
          <div style={{ width: 52 }}><Tex size={22} tex={b.t} /></div>
          <div style={{ flex: 1, height: 22, background: C.panel2, borderRadius: 6 }}>
            <div style={{ width: `${b.v * 100 * p}%`, height: "100%", background: b.c, borderRadius: 6 }} />
          </div>
          <div style={{ width: 80, fontFamily: MONO, fontSize: 22, textAlign: "right" }}>{num(b.v, 3)}</div>
        </div>
      ))}
    </div>
  );
};

export const S11Efecto: React.FC = () => {
  const pw = R.potencia_prospectiva_AB;
  return (
    <Scene n={11} kicker="Magnitud y potencia" title="Más allá de p: tamaño del efecto y planificación">
      <div style={{ display: "flex", gap: 40 }}>
        <Appear at={0.3} style={{ flex: 1.1, minWidth: 0 }}>
          <Panel>
            <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center" }}>
              <Tex size={28} tex="\eta^2_p=\dfrac{SS_{ef}}{SS_{ef}+SS_E}" />
              <Tex size={28} tex="\omega^2_p=\dfrac{gl_{ef}(MS_{ef}-MS_E)}{gl_{ef}(MS_{ef}-MS_E)+N\,MS_E}" />
            </div>
            <div style={{ marginTop: 16 }}>
              {(["A", "B", "AB"] as const).map((k, i) => (
                <Barra key={k} label={{ A: "Catalizador", B: "Temperatura", AB: "Interacción" }[k]} eta={fila(k).eta2p!} omega={fila(k).omega2p!} at={1 + i * 0.6} />
              ))}
            </div>
            <div style={{ fontSize: 21, color: C.muted }}>
              <Tex size={22} tex="\eta^2_p" /> está sesgado al alza; <Tex size={22} tex="\omega^2_p" /> lo corrige. Los parciales <b>no suman 1</b>{" "}
              y no son comparables entre diseños con distintos factores (use <Tex size={22} tex="\eta^2_G" />, Olejnik y Algina, 2003).
            </div>
          </Panel>
        </Appear>
        <div style={{ flex: 1, minWidth: 0 }}>
          <Appear at={3.4}>
            <Panel>
              <div style={{ fontSize: 24, color: C.accent, fontWeight: 700, marginBottom: 6 }}>Potencia prospectiva para A×B</div>
              <Tex display size={26} tex={`\\lambda=f^2N=${num(pw.f, 2)}^2\\cdot ${R.factores.N}=${num(pw.lambda, 2)},\\quad F\\sim F'_{4,\\,18}(\\lambda)`} />
              <div style={{ fontSize: 28, lineHeight: 1.5 }}>
                Para un efecto «grande» (<Tex size={28} tex="f=0.40" />), la potencia con <Tex size={28} tex="n=3" /> es sólo
                <b style={{ color: C.amber }}> {num(pw.potencia * 100, 0)} %</b>. Se requieren
                <b style={{ color: C.green }}> n = {pw.n_por_celda_para_080}</b> réplicas por celda (N = {9 * pw.n_por_celda_para_080}) para 1 − β ≥ 0.80.
              </div>
            </Panel>
          </Appear>
          <Appear at={5.2}>
            <Callout tipo="error" style={{ marginTop: 24 }}>
              No reporte «potencia observada» calculada con el efecto estimado: es una función monótona de p y no aporta
              información (Hoenig y Heisey, 2001). Planifique n antes del experimento.
            </Callout>
          </Appear>
          <Appear at={6.6}>
            <Callout tipo="quimica" style={{ marginTop: 20 }}>
              Aquí la interacción se detectó porque el efecto real es muy grande respecto de σ ≈ {num(Math.sqrt(fila("E").ms!), 2)} %;
              con métodos menos precisos el mismo diseño podría no detectarla.
            </Callout>
          </Appear>
        </div>
      </div>
    </Scene>
  );
};
