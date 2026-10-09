import React from "react";
import { Appear, useProgress } from "../components/Appear";
import { Bullet, Callout, Panel, Scene } from "../components/Scene";
import { Tex } from "../components/Tex";
import { R, fila, media } from "../data";
import { num } from "../fmt";
import { C, CAT_COLOR, CAT_LABEL, MONO } from "../theme";

const W = 920, H = 600, M = { l: 90, r: 40, t: 30, b: 80 };
const Y0 = 84, Y1 = 99;
const x = (j: number) => M.l + (j + 0.5) * ((W - M.l - M.r) / 3);
const y = (v: number) => M.t + (1 - (v - Y0) / (Y1 - Y0)) * (H - M.t - M.b);

export const Grafico: React.FC<{ start?: number }> = ({ start = 0.6 }) => {
  const se = Math.sqrt(fila("E").ms! / R.factores.n);
  return (
    <svg width={W} height={H} style={{ overflow: "visible" }}>
      {[84, 87, 90, 93, 96, 99].map((v) => (
        <g key={v}>
          <line x1={M.l} x2={W - M.r} y1={y(v)} y2={y(v)} stroke={C.border} strokeDasharray="4 6" />
          <text x={M.l - 16} y={y(v) + 8} fill={C.muted} fontSize={22} textAnchor="end" fontFamily={MONO}>{v}</text>
        </g>
      ))}
      {R.factores.B.map((t, j) => (
        <text key={t} x={x(j)} y={H - M.b + 40} fill={C.muted} fontSize={24} textAnchor="middle">{t} °C</text>
      ))}
      <text x={20} y={(H - M.b) / 2} fill={C.muted} fontSize={22} transform={`rotate(-90 20 ${(H - M.b) / 2})`} textAnchor="middle">
        Rendimiento FAME (%)
      </text>
      {R.factores.A.map((cat, i) => (
        <Linea key={cat} cat={cat} se={se} from={start + i * 0.9} />
      ))}
    </svg>
  );
};

const Linea: React.FC<{ cat: string; se: number; from: number }> = ({ cat, se, from }) => {
  const p = useProgress(from, from + 1.2);
  const pts = R.factores.B.map((t, j) => [x(j), y(media(cat, t))] as const);
  let len = 0;
  for (let k = 1; k < pts.length; k++) len += Math.hypot(pts[k][0] - pts[k - 1][0], pts[k][1] - pts[k - 1][1]);
  const col = CAT_COLOR[cat];
  return (
    <g opacity={p > 0 ? 1 : 0}>
      <polyline
        points={pts.map((q) => q.join(",")).join(" ")}
        fill="none" stroke={col} strokeWidth={5} strokeLinejoin="round"
        strokeDasharray={len} strokeDashoffset={len * (1 - p)}
      />
      {pts.map(([px, py], j) => (
        <g key={j} opacity={Math.min(1, Math.max(0, p * 3 - j))}>
          <line x1={px} x2={px} y1={py - (se / (Y1 - Y0)) * (H - M.t - M.b)} y2={py + (se / (Y1 - Y0)) * (H - M.t - M.b)} stroke={col} strokeWidth={2.5} />
          <circle cx={px} cy={py} r={10} fill={C.bg} stroke={col} strokeWidth={4} />
        </g>
      ))}
      <text x={pts[2][0] + 22} y={pts[2][1] + (cat === "CH3ONa" ? 20 : cat === "KOH" ? -14 : 34)} fill={col} fontSize={26} fontWeight={700} opacity={p}>
        {CAT_LABEL[cat]}
      </text>
    </g>
  );
};

export const S08Interaccion: React.FC = () => {
  return (
    <Scene n={8} kicker="Interpretación" title="Gráfico de interacción: perfiles no paralelos">
      <div style={{ display: "flex", gap: 40 }}>
        <Panel style={{ padding: "18px 10px 0 10px" }}>
          <Grafico />
          <div style={{ fontSize: 19, color: C.muted, padding: "0 20px 14px" }}>
            Barras: ± EE agrupado <Tex size={19} tex="\sqrt{MS_E/n}" /> = {num(Math.sqrt(fila("E").ms! / R.factores.n), 2)} %
          </div>
        </Panel>
        <div style={{ flex: 1 }}>
          <Appear at={3.6}><Bullet>Paralelismo ⇔ aditividad. Aquí CH₃ONa alcanza su máximo a 60 °C y cae a 70 °C, mientras KOH y NaOH siguen aumentando.</Bullet></Appear>
          <Appear at={4.8}><Bullet>Interacción <b>ordinal</b> en 50–60 °C; tendencia a <b>desordinal</b> (cruce KOH–CH₃ONa) a 70 °C: el ranking de catalizadores cambia con la temperatura.</Bullet></Appear>
          <Appear at={6.0}>
            <Callout tipo="quimica" style={{ marginTop: 12 }}>
              Hipótesis química a contrastar, no conclusión estadística: a 70 °C (por encima del p. eb. del metanol, 64.7 °C)
              la pérdida de MeOH o reacciones secundarias pueden afectar más al sistema más rápido.
            </Callout>
          </Appear>
          <Appear at={7.2}>
            <Callout tipo="error" style={{ marginTop: 18 }}>
              Interpretar <Tex size={26} tex={`F_A=${num(fila("A").F!, 1)}`} /> como «CH₃ONa siempre es mejor» ignora la interacción.
            </Callout>
          </Appear>
        </div>
      </div>
    </Scene>
  );
};
