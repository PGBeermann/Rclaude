import React from "react";
import { Appear, useProgress } from "../components/Appear";
import { Bullet, Panel, Scene } from "../components/Scene";
import { Tex } from "../components/Tex";
import { R } from "../data";
import { num } from "../fmt";
import { C, MONO } from "../theme";

const PW = 520, PH = 360, m = { l: 64, r: 16, t: 16, b: 52 };

const Ejes: React.FC<{ xl: string; yl: string; xt: number[]; yt: number[]; sx: (v: number) => number; sy: (v: number) => number }> = ({
  xl, yl, xt, yt, sx, sy,
}) => (
  <g>
    {yt.map((v) => (
      <g key={v}>
        <line x1={m.l} x2={PW - m.r} y1={sy(v)} y2={sy(v)} stroke={C.border} strokeDasharray={v === 0 ? undefined : "3 6"} />
        <text x={m.l - 10} y={sy(v) + 7} fill={C.muted} fontSize={18} textAnchor="end" fontFamily={MONO}>{v}</text>
      </g>
    ))}
    {xt.map((v) => (
      <text key={v} x={sx(v)} y={PH - m.b + 26} fill={C.muted} fontSize={18} textAnchor="middle" fontFamily={MONO}>{v}</text>
    ))}
    <text x={(PW + m.l) / 2} y={PH - 4} fill={C.muted} fontSize={19} textAnchor="middle">{xl}</text>
    <text x={14} y={(PH - m.b) / 2} fill={C.muted} fontSize={19} textAnchor="middle" transform={`rotate(-90 14 ${(PH - m.b) / 2})`}>{yl}</text>
  </g>
);

const ResVsAjust: React.FC = () => {
  const p = useProgress(0.8, 2.6);
  const sx = (v: number) => m.l + ((v - 84) / (99 - 84)) * (PW - m.l - m.r);
  const sy = (v: number) => m.t + (1 - (v + 2) / 4) * (PH - m.t - m.b);
  const pts = R.supuestos.resid_vs_ajust;
  return (
    <svg width={PW} height={PH}>
      <Ejes xl="Valor ajustado (%)" yl="Residual" xt={[85, 90, 95]} yt={[-2, -1, 0, 1, 2]} sx={sx} sy={sy} />
      {pts.map((q, i) => (
        <circle key={i} cx={sx(q.ajustado)} cy={sy(q.residual)} r={7} fill={C.accent} opacity={p * pts.length > i ? 0.85 : 0} />
      ))}
    </svg>
  );
};

const QQ: React.FC = () => {
  const p = useProgress(2.2, 4.0);
  const sx = (v: number) => m.l + ((v + 2.5) / 5) * (PW - m.l - m.r);
  const sy = (v: number) => m.t + (1 - (v + 2.5) / 5) * (PH - m.t - m.b);
  const pts = R.supuestos.qq;
  return (
    <svg width={PW} height={PH}>
      <Ejes xl="Cuantil teórico N(0,1)" yl="Residual estandarizado" xt={[-2, -1, 0, 1, 2]} yt={[-2, -1, 0, 1, 2]} sx={sx} sy={sy} />
      <line x1={sx(-2.4)} y1={sy(-2.4)} x2={sx(2.4)} y2={sy(2.4)} stroke={C.amber} strokeWidth={2.5} opacity={p} />
      {pts.map((q, i) => (
        <circle key={i} cx={sx(q.teorico)} cy={sy(q.observado)} r={7} fill={C.violet} opacity={p * pts.length > i ? 0.9 : 0} />
      ))}
    </svg>
  );
};

export const S10Supuestos: React.FC = () => {
  const s = R.supuestos;
  return (
    <Scene n={10} kicker="Validación del modelo" title="Diagnóstico sobre los residuales, no sobre los datos crudos">
      <div style={{ display: "flex", gap: 28 }}>
        <Appear at={0.4}>
          <Panel style={{ padding: 16 }}>
            <ResVsAjust />
            <div style={{ fontSize: 22, textAlign: "center", color: C.muted }}>
              Brown–Forsythe: F(8, 18) = {num(s.brown_forsythe_F, 2)}, p = {num(s.brown_forsythe_p, 3)}
            </div>
          </Panel>
        </Appear>
        <Appear at={1.8}>
          <Panel style={{ padding: 16 }}>
            <QQ />
            <div style={{ fontSize: 22, textAlign: "center", color: C.muted }}>
              Shapiro–Wilk: W = {num(s.shapiro_W, 3)}, p = {num(s.shapiro_p, 3)}
            </div>
          </Panel>
        </Appear>
        <div style={{ flex: 1, fontSize: 26 }}>
          <Appear at={4.2}><Bullet>Con <Tex size={28} tex="n=3" /> por celda, las pruebas formales tienen baja potencia: «no rechazar» ≠ «se cumple». Priorice los gráficos.</Bullet></Appear>
          <Appear at={5.4}><Bullet color={C.amber}>Independencia: la garantiza la <b>aleatorización</b>; revise residuales vs. orden de corrida (deriva del GC, envejecimiento del catalizador).</Bullet></Appear>
          <Appear at={6.6}><Bullet color={C.violet}>Varianza ∝ media o rendimientos cerca de 100 %: considere Box–Cox, logit o un MLG; F es robusta a no normalidad leve, menos a heterocedasticidad con <Tex size={28} tex="n_{ij}" /> desiguales.</Bullet></Appear>
        </div>
      </div>
    </Scene>
  );
};
