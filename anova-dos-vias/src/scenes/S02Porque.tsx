import React from "react";
import { Appear } from "../components/Appear";
import { Bullet, Callout, Panel, Scene } from "../components/Scene";
import { Tex } from "../components/Tex";
import { C } from "../theme";

export const S02Porque: React.FC = () => (
  <Scene n={2} kicker="Justificación" title="¿Por qué un factorial y no «un factor a la vez»?">
    <div style={{ display: "flex", gap: 48 }}>
      <div style={{ flex: 1.15 }}>
        <Appear at={0.4}><Bullet><b>Replicación oculta:</b> cada efecto principal se estima con las <Tex tex="bn = 9" size={30} /> observaciones de cada nivel, no con 3.</Bullet></Appear>
        <Appear at={1.0}><Bullet><b>Estimación de la interacción</b> <Tex tex="A\times B" size={30} />: imposible con OFAT o con dos ANOVA de una vía.</Bullet></Appear>
        <Appear at={1.6}><Bullet><b>Un único término de error</b> <Tex tex="MS_E" size={30} /> con <Tex tex="ab(n-1)=18" size={30} /> gl para todas las pruebas.</Bullet></Appear>
        <Appear at={2.2}><Bullet><b>Validez de inferencia</b> sobre un intervalo de condiciones, no en un único punto «óptimo».</Bullet></Appear>
      </div>
      <div style={{ flex: 1 }}>
        <Appear at={2.8}>
          <Panel>
            <div style={{ fontSize: 24, color: C.muted, marginBottom: 12 }}>Dos ANOVA de una vía separados</div>
            <Tex display size={34} tex="SS_{E}^{(1)} = SS_E + SS_{B} + SS_{AB}" />
            <div style={{ fontSize: 26, lineHeight: 1.45, marginTop: 10 }}>
              La variación sistemática del otro factor y de la interacción <b>infla el error</b>: pruebas menos potentes
              y conclusiones confundidas.
            </div>
          </Panel>
        </Appear>
        <Appear at={3.6}>
          <Callout tipo="error" style={{ marginTop: 26 }}>
            Optimizar primero la temperatura y luego el catalizador presupone aditividad. Si hay interacción, el
            «óptimo» OFAT puede no ser el óptimo real.
          </Callout>
        </Appear>
      </div>
    </div>
  </Scene>
);
