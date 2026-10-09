import React from "react";
import { Appear } from "../components/Appear";
import { Bullet, Panel, Scene } from "../components/Scene";
import { Tex } from "../components/Tex";
import { R, fila } from "../data";
import { num, pval } from "../fmt";
import { C } from "../theme";

export const S13Reporte: React.FC = () => {
  const A = fila("A"), B = fila("B"), AB = fila("AB"), E = fila("E");
  const es = R.efectos_simples_A_en_B;
  const p = (x: number) => (x < 0.001 ? "p < 0.001" : `p = ${pval(x)}`);
  return (
    <Scene n={13} kicker="Comunicación" title="Cómo reportarlo en un artículo">
      <Appear at={0.3}>
        <Panel style={{ fontSize: 28, lineHeight: 1.6, fontFamily: "Georgia, 'Times New Roman', serif", borderLeft: `6px solid ${C.accent}` }}>
          Se aplicó un ANOVA de dos vías de efectos fijos (catalizador 3 × temperatura 3, n = 3 réplicas independientes, orden
          aleatorizado). La interacción catalizador × temperatura fue significativa, <i>F</i>({AB.gl}, {E.gl}) = {num(AB.F!, 2)},{" "}
          {p(AB.p!)}, ω²ₚ = {num(AB.omega2p!, 2)}. Los efectos principales también lo fueron (catalizador: <i>F</i>({A.gl}, {E.gl}) ={" "}
          {num(A.F!, 2)}, {p(A.p!)}; temperatura: <i>F</i>({B.gl}, {E.gl}) = {num(B.F!, 2)}, {p(B.p!)}), pero se interpretan
          condicionados a la interacción. El efecto simple del catalizador fue significativo a 50 y 60 °C (α′ = 0.0167, Bonferroni)
          y no a 70 °C (<i>F</i>(2, {E.gl}) = {num(es[2].F, 2)}, {p(es[2].p)}). Los residuales no mostraron desviaciones relevantes de
          normalidad ni de homocedasticidad (Shapiro–Wilk <i>p</i> = {num(R.supuestos.shapiro_p, 2)};
          Brown–Forsythe <i>p</i> = {num(R.supuestos.brown_forsythe_p, 2)}).
        </Panel>
      </Appear>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 40px", marginTop: 28 }}>
        <Appear at={2.4}><Bullet>Modelo (fijo/aleatorio/mixto) y denominador de cada F.</Bullet></Appear>
        <Appear at={2.8}><Bullet>Tipo de SC y contrastes si hay desbalance.</Bullet></Appear>
        <Appear at={3.2}><Bullet>Medias de celda con EE o IC, no sólo marginales.</Bullet></Appear>
        <Appear at={3.6}><Bullet>Tamaño del efecto (<Tex size={30} tex="\omega^2_p" /> o <Tex size={30} tex="\eta^2_G" />) con su definición.</Bullet></Appear>
        <Appear at={4.0}><Bullet>Método de comparaciones múltiples y control del error.</Bullet></Appear>
        <Appear at={4.4}><Bullet>Diagnóstico de residuales y software/versión utilizados.</Bullet></Appear>
      </div>
    </Scene>
  );
};
