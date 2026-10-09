import React from "react";
import { Appear } from "../components/Appear";
import { Callout, Panel, Scene } from "../components/Scene";
import { Tex } from "../components/Tex";
import { C } from "../theme";

const TIPOS = [
  { t: "Tipo I (secuencial)", f: "R(\\tau\\mid\\mu),\\ R(\\beta\\mid\\mu,\\tau),\\ R(\\tau\\beta\\mid\\mu,\\tau,\\beta)", n: "Depende del orden de entrada de los factores. aov() en R." },
  { t: "Tipo II (jerárquico)", f: "R(\\tau\\mid\\mu,\\beta),\\ R(\\beta\\mid\\mu,\\tau),\\ R(\\tau\\beta\\mid\\mu,\\tau,\\beta)", n: "Respeta la marginalidad; más potente si A×B es nula (Langsrud, 2003)." },
  { t: "Tipo III (parcial)", f: "R(\\tau\\mid\\mu,\\beta,\\tau\\beta),\\ \\dots", n: "Hipótesis sobre medias no ponderadas. Exige contrastes de suma cero." },
];

export const S12NoBalanceado: React.FC = () => (
  <Scene n={12} kicker="Casos especiales" title="Celdas desiguales y diseños sin réplica">
    <div style={{ display: "flex", gap: 36 }}>
      <div style={{ flex: 1.25 }}>
        <Appear at={0.3}>
          <div style={{ fontSize: 27, marginBottom: 14, lineHeight: 1.4 }}>
            Si una reacción falla y <Tex size={27} tex="n_{ij}" /> difieren, los efectos dejan de ser ortogonales:
          </div>
        </Appear>
        {TIPOS.map((x, i) => (
          <Appear key={x.t} at={1 + i * 0.8}>
            <Panel style={{ padding: "14px 22px", marginBottom: 14 }}>
              <div style={{ fontSize: 25, fontWeight: 700, color: C.accent }}>{x.t}</div>
              <Tex size={27} tex={x.f} />
              <div style={{ fontSize: 22, color: C.muted, marginTop: 2 }}>{x.n}</div>
            </Panel>
          </Appear>
        ))}
        <Appear at={3.8}>
          <Callout tipo="error">
            Tipo III con contrastes de tratamiento (<span style={{ fontFamily: "monospace" }}>contr.treatment</span>, predeterminado en R)
            prueba hipótesis sin sentido. Use <span style={{ fontFamily: "monospace" }}>contr.sum</span>.
          </Callout>
        </Appear>
      </div>
      <div style={{ flex: 1 }}>
        <Appear at={4.8}>
          <Panel>
            <div style={{ fontSize: 24, fontWeight: 700, color: C.amber }}>n = 1 por celda</div>
            <div style={{ fontSize: 25, lineHeight: 1.4, margin: "6px 0 10px" }}>
              <Tex size={25} tex="ab(n-1)=0" />: la interacción queda <b>confundida con el error</b>. Si se asume aditividad, se
              contrasta con la prueba de no aditividad de Tukey (1 gl):
            </div>
            <Tex display size={26} tex="SS_N=\frac{\left[\sum_i\sum_j y_{ij}(\bar y_{i\cdot}-\bar y_{\cdot\cdot})(\bar y_{\cdot j}-\bar y_{\cdot\cdot})\right]^2}{\sum_i(\bar y_{i\cdot}-\bar y_{\cdot\cdot})^2\sum_j(\bar y_{\cdot j}-\bar y_{\cdot\cdot})^2}" />
            <Tex display size={26} tex="F=\frac{SS_N}{\left(SS_{res}-SS_N\right)/\left[(a-1)(b-1)-1\right]}" />
          </Panel>
        </Appear>
        <Appear at={6.4}>
          <Callout tipo="quimica" style={{ marginTop: 20 }}>
            Ejemplo típico: un analito medido en <b>muestras</b> × <b>métodos</b> sin réplica. Allí la muestra suele ser un
            factor de <b>bloqueo</b>, no de interés.
          </Callout>
        </Appear>
      </div>
    </div>
  </Scene>
);
