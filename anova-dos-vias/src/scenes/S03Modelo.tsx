import React from "react";
import { Appear } from "../components/Appear";
import { Callout, Panel, Scene } from "../components/Scene";
import { Tex } from "../components/Tex";
import { C } from "../theme";

export const S03Modelo: React.FC = () => (
  <Scene n={3} kicker="Modelo estadístico" title="Modelo de efectos fijos con interacción">
    <Appear at={0.3}>
      <Panel style={{ textAlign: "center", padding: "18px 32px" }}>
        <Tex display size={44} tex="y_{ijk}=\mu+\tau_i+\beta_j+(\tau\beta)_{ij}+\varepsilon_{ijk},\qquad \varepsilon_{ijk}\overset{iid}{\sim}N(0,\sigma^2)" />
        <div style={{ fontSize: 24, color: C.muted }}>
          <Tex size={26} tex="i=1,\dots,a;\; j=1,\dots,b;\; k=1,\dots,n" />
        </div>
      </Panel>
    </Appear>
    <div style={{ display: "flex", gap: 36, marginTop: 24 }}>
      <Appear at={1.2} style={{ flex: 1 }}>
        <Panel style={{ height: "100%" }}>
          <div style={{ fontSize: 24, color: C.accent, fontWeight: 700, marginBottom: 6 }}>Restricciones de identificabilidad</div>
          <Tex display size={32} tex="\textstyle\sum_i\tau_i=0,\quad \sum_j\beta_j=0" />
          <Tex display size={32} tex="\textstyle\sum_i(\tau\beta)_{ij}=\sum_j(\tau\beta)_{ij}=0" />
          <div style={{ fontSize: 24, lineHeight: 1.4, color: C.muted }}>
            Sin ellas hay <Tex size={24} tex="1+a+b+ab" /> parámetros para sólo <Tex size={24} tex="ab" /> medias de celda.
          </div>
        </Panel>
      </Appear>
      <Appear at={2.0} style={{ flex: 1 }}>
        <Panel style={{ height: "100%" }}>
          <div style={{ fontSize: 24, color: C.accent, fontWeight: 700, marginBottom: 6 }}>Hipótesis</div>
          <Tex display size={30} tex="H_0^{A}:\ \tau_1=\dots=\tau_a=0" />
          <Tex display size={30} tex="H_0^{B}:\ \beta_1=\dots=\beta_b=0" />
          <Tex display size={30} tex="H_0^{AB}:\ (\tau\beta)_{ij}=0\ \ \forall\, i,j" />
        </Panel>
      </Appear>
      <Appear at={2.8} style={{ flex: 1 }}>
        <Panel style={{ height: "100%" }}>
          <div style={{ fontSize: 24, color: C.accent, fontWeight: 700, marginBottom: 6 }}>Modelo de medias de celda</div>
          <Tex display size={32} tex="y_{ijk}=\mu_{ij}+\varepsilon_{ijk}" />
          <div style={{ fontSize: 24, lineHeight: 1.4, color: C.muted }}>
            Equivalente y sin restricciones. La interacción es el contraste
            <Tex size={24} tex="\ \mu_{ij}-\mu_{i\cdot}-\mu_{\cdot j}+\mu_{\cdot\cdot}" />.
          </div>
        </Panel>
      </Appear>
    </div>
    <Appear at={3.6}>
      <Callout tipo="clave" style={{ marginTop: 24 }}>
        «Fijo» significa que la inferencia se restringe a <b>estos</b> tres catalizadores y temperaturas. Si los niveles fueran una
        muestra aleatoria de una población (lotes de aceite, laboratorios), cambian las esperanzas de los cuadrados medios (sección 6).
      </Callout>
    </Appear>
  </Scene>
);
