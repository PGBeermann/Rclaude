import React from "react";
import { Appear } from "../components/Appear";
import { Callout, Panel, Scene } from "../components/Scene";
import { Tex } from "../components/Tex";
import { R, fila } from "../data";
import { num, pval } from "../fmt";
import { C, MONO } from "../theme";

const NOMBRE: Record<string, string> = {
  A: "Catalizador (A)", B: "Temperatura (B)", AB: "Interacción A×B", E: "Error", T: "Total",
};

export const S07Tabla: React.FC = () => {
  const filas = R.anova;
  const glE = fila("E").gl;
  const th: React.CSSProperties = { padding: "12px 18px", textAlign: "right", color: C.accent, fontSize: 24, fontWeight: 600 };
  const td: React.CSSProperties = { padding: "14px 18px", textAlign: "right", fontFamily: MONO, fontSize: 28, borderTop: `1px solid ${C.border}` };
  return (
    <Scene n={7} kicker="Resultados" title="Tabla ANOVA (efectos fijos, n balanceado)">
      <Appear at={0.3}>
        <Panel style={{ padding: "12px 20px" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ ...th, textAlign: "left" }}>Fuente</th>
                <th style={th}>SC</th>
                <th style={th}>gl</th>
                <th style={th}>CM</th>
                <th style={th}>F</th>
                <th style={th}>p</th>
                <th style={th}><Tex size={24} tex="\eta^2_p" /></th>
                <th style={th}><Tex size={24} tex="\omega^2_p" /></th>
              </tr>
            </thead>
            <tbody>
              {filas.map((f, i) => {
                const hi = f.fuente === "AB";
                return (
                  <tr key={f.fuente} style={{ background: hi ? "rgba(56,189,248,0.10)" : undefined }}>
                    <td style={{ ...td, textAlign: "left", fontFamily: "inherit", fontWeight: hi ? 700 : 500 }}>
                      <Appear at={0.6 + i * 0.25} dy={6}>{NOMBRE[f.fuente]}</Appear>
                    </td>
                    {[
                      num(f.ss, 3), String(f.gl), f.ms !== undefined ? num(f.ms, 3) : "",
                      f.F !== undefined ? num(f.F, 2) : "", f.p !== undefined ? pval(f.p) : "",
                      f.eta2p !== undefined ? num(f.eta2p, 3) : "", f.omega2p !== undefined ? num(f.omega2p, 3) : "",
                    ].map((v, j) => (
                      <td key={j} style={td}><Appear at={0.8 + i * 0.25 + j * 0.05} dy={6}>{v}</Appear></td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Panel>
      </Appear>
      <div style={{ display: "flex", gap: 28, marginTop: 26 }}>
        <Appear at={3.2} style={{ flex: 1 }}>
          <Callout tipo="clave">
            Valores críticos (α = 0.05): <Tex size={26} tex={`F_{0.95;\\,2,\\,${glE}}=3.55`} /> y <Tex size={26} tex={`F_{0.95;\\,4,\\,${glE}}=2.93`} />.
            La interacción es significativa → <b>analizar primero A×B</b>.
          </Callout>
        </Appear>
        <Appear at={4.4} style={{ flex: 1 }}>
          <Callout tipo="cuidado">
            <Tex size={26} tex={`R^2=${num(R.r2, 3)}`} />, <Tex size={26} tex={`R^2_{aj}=${num(R.r2_aj, 3)}`} />.
            Con diseño balanceado, SC tipo I = II = III ({R.tipos_ss_iguales_balanceado ? "verificado" : "no verificado"} en el script).
          </Callout>
        </Appear>
      </div>
    </Scene>
  );
};
