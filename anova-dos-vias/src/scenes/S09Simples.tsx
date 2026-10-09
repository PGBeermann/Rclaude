import React from "react";
import { Appear } from "../components/Appear";
import { Callout, Panel, Scene } from "../components/Scene";
import { Tex } from "../components/Tex";
import { R, fila } from "../data";
import { num, pval } from "../fmt";
import { C, MONO } from "../theme";

export const S09Simples: React.FC = () => {
  const es = R.efectos_simples_A_en_B;
  const sumSS = es.reduce((s, e) => s + e.ss, 0);
  const alphaB = 0.05 / es.length;
  const td: React.CSSProperties = { padding: "10px 16px", fontFamily: MONO, fontSize: 27, textAlign: "right", borderTop: `1px solid ${C.border}` };
  return (
    <Scene n={9} kicker="Análisis de seguimiento" title="Efectos simples y comparaciones múltiples">
      <div style={{ display: "flex", gap: 36 }}>
        <div style={{ flex: 1 }}>
          <Appear at={0.3}>
            <Panel style={{ padding: "18px 24px" }}>
              <div style={{ fontSize: 24, color: C.accent, fontWeight: 700 }}>Efecto simple de A en cada nivel de B</div>
              <Tex display size={30} tex={`F_{A|B_j}=\\frac{SS_{A|B_j}/(a-1)}{MS_E},\\quad gl=(2,\\,${fila("E").gl})`} />
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ color: C.muted, fontSize: 22 }}>
                    <th style={{ textAlign: "left", padding: "6px 16px" }}>Temperatura</th>
                    <th style={{ textAlign: "right", padding: "6px 16px" }}>SC</th>
                    <th style={{ textAlign: "right", padding: "6px 16px" }}>F</th>
                    <th style={{ textAlign: "right", padding: "6px 16px" }}>p</th>
                  </tr>
                </thead>
                <tbody>
                  {es.map((e, i) => (
                    <tr key={e.temp} style={{ color: e.p < alphaB ? C.text : C.muted }}>
                      <td style={{ ...td, textAlign: "left", fontFamily: "inherit" }}><Appear at={0.9 + i * 0.4} dy={6}>{e.temp} °C</Appear></td>
                      <td style={td}><Appear at={1.0 + i * 0.4} dy={6}>{num(e.ss, 2)}</Appear></td>
                      <td style={td}><Appear at={1.1 + i * 0.4} dy={6}>{num(e.F, 2)}</Appear></td>
                      <td style={{ ...td, color: e.p < alphaB ? C.green : C.red }}><Appear at={1.2 + i * 0.4} dy={6}>{pval(e.p)}</Appear></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <Appear at={2.8}>
                <div style={{ fontSize: 23, color: C.muted, marginTop: 12 }}>
                  Comprobación: <Tex size={24} tex={`\\sum_j SS_{A|B_j}=${num(sumSS, 2)}=SS_A+SS_{AB}`} /> ·
                  Bonferroni: α′ = 0.05/3 = {num(alphaB, 4)}
                </div>
              </Appear>
            </Panel>
          </Appear>
        </div>
        <div style={{ flex: 1 }}>
          <Appear at={3.6}>
            <Panel style={{ padding: "18px 24px" }}>
              <div style={{ fontSize: 24, color: C.accent, fontWeight: 700 }}>Tukey HSD a 60 °C con <Tex size={24} tex="MS_E" /> agrupado</div>
              <Tex display size={28} tex={`HSD=q_{0.95;\\,3,\\,18}\\sqrt{MS_E/n}=${num(R.tukey_60C.q_crit, 2)}\\times${num(Math.sqrt(fila("E").ms! / 3), 3)}=${num(R.tukey_60C.hsd, 2)}`} />
              {R.tukey_60C.pares.map((q, i) => (
                <Appear key={q.par} at={4.4 + i * 0.4} dy={6}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 27, padding: "8px 0", borderTop: `1px solid ${C.border}` }}>
                    <span>{q.par.replace("CH3ONa", "CH₃ONa")}</span>
                    <span style={{ fontFamily: MONO }}>{num(q.dif, 2)} · p {pval(q.p).startsWith("<") ? pval(q.p) : "= " + pval(q.p)}</span>
                  </div>
                </Appear>
              ))}
            </Panel>
          </Appear>
          <Appear at={6.0}>
            <Callout tipo="cuidado" style={{ marginTop: 22 }}>
              Use <Tex size={26} tex="MS_E" /> del modelo completo (18 gl) bajo homocedasticidad. Hacer Tukey sólo con los datos de 60 °C
              estima el error con 6 gl y pierde potencia.
            </Callout>
          </Appear>
        </div>
      </div>
      <Appear at={7.2}>
        <Callout tipo="quimica" style={{ marginTop: 22 }}>
          Conclusión operativa: el catalizador importa a 50 y 60 °C (CH₃ONa {">"} KOH {">"} NaOH a 60 °C), pero a 70 °C no se detectan
          diferencias. La elección óptima depende de la ventana de temperatura del proceso.
        </Callout>
      </Appear>
    </Scene>
  );
};
