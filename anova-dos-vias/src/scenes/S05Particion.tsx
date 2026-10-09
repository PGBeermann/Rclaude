import React from "react";
import { Appear, useProgress } from "../components/Appear";
import { Panel, Scene } from "../components/Scene";
import { Tex } from "../components/Tex";
import { fila } from "../data";
import { num } from "../fmt";
import { C, MONO } from "../theme";

const PARTES = [
  { k: "A" as const, color: C.violet, tex: "SS_A=bn\\sum_i(\\bar y_{i\\cdot\\cdot}-\\bar y_{\\cdot\\cdot\\cdot})^2", gl: "a-1" },
  { k: "B" as const, color: C.amber, tex: "SS_B=an\\sum_j(\\bar y_{\\cdot j\\cdot}-\\bar y_{\\cdot\\cdot\\cdot})^2", gl: "b-1" },
  { k: "AB" as const, color: C.accent, tex: "SS_{AB}=n\\sum_i\\sum_j(\\bar y_{ij\\cdot}-\\bar y_{i\\cdot\\cdot}-\\bar y_{\\cdot j\\cdot}+\\bar y_{\\cdot\\cdot\\cdot})^2", gl: "(a-1)(b-1)" },
  { k: "E" as const, color: C.red, tex: "SS_E=\\sum_i\\sum_j\\sum_k(y_{ijk}-\\bar y_{ij\\cdot})^2", gl: "ab(n-1)" },
];

export const S05Particion: React.FC = () => {
  const total = fila("T").ss;
  const p = useProgress(1.0, 3.0);
  return (
    <Scene n={5} kicker="Partición de la variabilidad" title="Descomposición ortogonal de la suma de cuadrados">
      <Appear at={0.3}>
        <div style={{ textAlign: "center" }}>
          <Tex display size={40} tex="\underbrace{SS_T}_{abn-1}=\underbrace{SS_A}_{a-1}+\underbrace{SS_B}_{b-1}+\underbrace{SS_{AB}}_{(a-1)(b-1)}+\underbrace{SS_E}_{ab(n-1)}" />
        </div>
      </Appear>
      <Appear at={0.9}>
        <div style={{ display: "flex", height: 64, borderRadius: 12, overflow: "hidden", margin: "18px 0 8px", border: `1px solid ${C.border}` }}>
          {PARTES.map((q) => {
            const ss = fila(q.k).ss;
            return (
              <div
                key={q.k}
                style={{
                  width: `${(100 * ss * p) / total}%`, background: q.color, color: C.bg, fontWeight: 700, fontSize: 24,
                  display: "flex", alignItems: "center", justifyContent: "center", whiteSpace: "nowrap", overflow: "hidden",
                }}
              >
                {q.k === "E" ? "E" : q.k} {num((100 * ss) / total, 1)} %
              </div>
            );
          })}
        </div>
        <div style={{ fontSize: 22, color: C.muted, textAlign: "right" }}>
          <Tex size={24} tex={`SS_T=${num(total)}`} /> · proporciones = <Tex size={24} tex="\eta^2" /> clásico
        </div>
      </Appear>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22, marginTop: 18 }}>
        {PARTES.map((q, i) => (
          <Appear key={q.k} at={3.2 + i * 0.6}>
            <Panel style={{ borderLeft: `6px solid ${q.color}`, padding: "16px 24px" }}>
              <Tex size={29} tex={q.tex} />
              <div style={{ display: "flex", justifyContent: "space-between", fontFamily: MONO, fontSize: 26, marginTop: 6, color: C.muted }}>
                <span>= <b style={{ color: C.text }}>{num(fila(q.k).ss, 3)}</b></span>
                <span>gl = <Tex size={26} tex={q.gl} /> = <b style={{ color: C.text }}>{fila(q.k).gl}</b></span>
              </div>
            </Panel>
          </Appear>
        ))}
      </div>
      <Appear at={6.0}>
        <div style={{ fontSize: 25, color: C.muted, marginTop: 20, lineHeight: 1.4 }}>
          La ortogonalidad (productos cruzados nulos) se cumple <b style={{ color: C.text }}>sólo con celdas balanceadas</b>; con
          <Tex size={25} tex="\ n_{ij}" /> desiguales la partición deja de ser única (sección 12).
        </div>
      </Appear>
    </Scene>
  );
};
