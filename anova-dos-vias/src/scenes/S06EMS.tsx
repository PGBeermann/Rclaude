import React from "react";
import { Appear } from "../components/Appear";
import { Callout, Panel, Scene } from "../components/Scene";
import { Tex } from "../components/Tex";
import { C } from "../theme";

type Celda = { ems: string; F: string };
const FILAS: { fuente: string; fijo: Celda; aleat: Celda; mixto: Celda }[] = [
  {
    fuente: "A",
    fijo: { ems: "\\sigma^2+\\frac{bn\\sum\\tau_i^2}{a-1}", F: "MS_A/MS_E" },
    aleat: { ems: "\\sigma^2+n\\sigma^2_{\\tau\\beta}+bn\\sigma^2_\\tau", F: "MS_A/MS_{AB}" },
    mixto: { ems: "\\sigma^2+n\\sigma^2_{\\tau\\beta}+\\frac{bn\\sum\\tau_i^2}{a-1}", F: "MS_A/MS_{AB}" },
  },
  {
    fuente: "B",
    fijo: { ems: "\\sigma^2+\\frac{an\\sum\\beta_j^2}{b-1}", F: "MS_B/MS_E" },
    aleat: { ems: "\\sigma^2+n\\sigma^2_{\\tau\\beta}+an\\sigma^2_\\beta", F: "MS_B/MS_{AB}" },
    mixto: { ems: "\\sigma^2+an\\sigma^2_\\beta", F: "MS_B/MS_E" },
  },
  {
    fuente: "AB",
    fijo: { ems: "\\sigma^2+\\frac{n\\sum\\sum(\\tau\\beta)_{ij}^2}{(a-1)(b-1)}", F: "MS_{AB}/MS_E" },
    aleat: { ems: "\\sigma^2+n\\sigma^2_{\\tau\\beta}", F: "MS_{AB}/MS_E" },
    mixto: { ems: "\\sigma^2+n\\sigma^2_{\\tau\\beta}", F: "MS_{AB}/MS_E" },
  },
  {
    fuente: "E",
    fijo: { ems: "\\sigma^2", F: "" },
    aleat: { ems: "\\sigma^2", F: "" },
    mixto: { ems: "\\sigma^2", F: "" },
  },
];

const Cell: React.FC<{ c: Celda; hi?: boolean }> = ({ c, hi }) => (
  <td style={{ padding: "10px 16px", borderTop: `1px solid ${C.border}`, verticalAlign: "middle" }}>
    <Tex size={25} tex={c.ems} />
    {c.F ? (
      <div style={{ marginTop: 4, color: hi ? C.amber : C.muted }}>
        <Tex size={22} tex={`F=${c.F}`} />
      </div>
    ) : null}
  </td>
);

export const S06EMS: React.FC = () => (
  <Scene n={6} kicker="Esperanza de los cuadrados medios" title="El denominador de F depende del tipo de factor">
    <Appear at={0.3}>
      <Panel style={{ padding: "14px 20px" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 24 }}>
          <thead>
            <tr style={{ color: C.accent, textAlign: "left", fontSize: 24 }}>
              <th style={{ padding: "8px 16px" }}>Fuente</th>
              <th style={{ padding: "8px 16px" }}>A y B fijos</th>
              <th style={{ padding: "8px 16px" }}>A y B aleatorios</th>
              <th style={{ padding: "8px 16px" }}>Mixto: A fijo, B aleatorio (restringido)</th>
            </tr>
          </thead>
          <tbody>
            {FILAS.map((f) => (
              <tr key={f.fuente}>
                <td style={{ padding: "10px 16px", borderTop: `1px solid ${C.border}`, fontWeight: 700, fontSize: 28 }}>{f.fuente}</td>
                <Cell c={f.fijo} />
                <Cell c={f.aleat} hi={f.fuente !== "AB"} />
                <Cell c={f.mixto} hi={f.fuente === "A"} />
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>
    </Appear>
    <div style={{ display: "flex", gap: 28, marginTop: 24 }}>
      <Appear at={2.2} style={{ flex: 1 }}>
        <Callout tipo="quimica">
          Si B fueran <b>lotes de aceite</b> o <b>laboratorios</b> elegidos al azar (estudio interlaboratorio tipo ISO 5725),
          el efecto del catalizador se contrasta contra <Tex size={26} tex="MS_{AB}" /> con sólo <Tex size={26} tex="(a-1)(b-1)" /> gl.
        </Callout>
      </Appear>
      <Appear at={3.4} style={{ flex: 1 }}>
        <Callout tipo="cuidado">
          En el modelo mixto <b>no restringido</b> (el de <span style={{ fontFamily: "monospace" }}>lme4</span>, SAS PROC MIXED) la
          <Tex size={26} tex="\ E(MS_B)" /> incluye <Tex size={26} tex="n\sigma^2_{\tau\beta}" /> y <Tex size={26} tex="F_B=MS_B/MS_{AB}" />.
          Declare cuál usa.
        </Callout>
      </Appear>
    </div>
  </Scene>
);
