import React from 'react';
import {Indicador, PuntoCurva} from '../chem/titulacion';
import {tema} from '../theme';

type Props = {
	puntos: PuntoCurva[];
	vMax: number;
	/** Volumen hasta el que se dibuja la curva */
	vActual: number;
	phActual: number;
	veq: number;
	phEq: number;
	indicador: Indicador;
	/** 0–1: aparición de las anotaciones del punto de equivalencia */
	anotaciones: number;
	ancho: number;
	alto: number;
};

const M = {izq: 90, der: 30, arr: 30, aba: 80};

export const CurvaPH: React.FC<Props> = ({
	puntos,
	vMax,
	vActual,
	phActual,
	veq,
	phEq,
	indicador,
	anotaciones,
	ancho,
	alto,
}) => {
	const w = ancho - M.izq - M.der;
	const h = alto - M.arr - M.aba;
	const x = (v: number) => M.izq + (v / vMax) * w;
	const y = (ph: number) => M.arr + (1 - ph / 14) * h;

	const visibles = puntos.filter((p) => p.v <= vActual);
	const d = visibles.map((p, i) => `${i === 0 ? 'M' : 'L'} ${x(p.v).toFixed(2)} ${y(p.ph).toFixed(2)}`).join(' ');

	const ticksV = Array.from({length: 6}, (_, i) => (vMax * i) / 5);
	const ticksPH = [0, 2, 4, 6, 8, 10, 12, 14];
	const etiqueta = {fill: tema.textoSuave, fontSize: 22, fontFamily: tema.fuente};

	return (
		<svg width={ancho} height={alto}>
			{/* Banda del intervalo de viraje del indicador */}
			<rect
				x={M.izq}
				y={y(indicador.intervalo[1])}
				width={w}
				height={y(indicador.intervalo[0]) - y(indicador.intervalo[1])}
				fill={indicador.colorBasico}
				opacity={0.18}
			/>
			<text x={M.izq + w - 10} y={y(indicador.intervalo[1]) - 8} textAnchor="end" {...etiqueta} fontSize={20}>
				Viraje: {indicador.nombre} (pH {indicador.intervalo[0]}–{indicador.intervalo[1]})
			</text>

			{/* Rejilla y ejes */}
			{ticksPH.map((t) => (
				<g key={`ph${t}`}>
					<line x1={M.izq} x2={M.izq + w} y1={y(t)} y2={y(t)} stroke={tema.borde} />
					<text x={M.izq - 14} y={y(t) + 7} textAnchor="end" {...etiqueta}>
						{t}
					</text>
				</g>
			))}
			{ticksV.map((t) => (
				<g key={`v${t}`}>
					<line x1={x(t)} x2={x(t)} y1={M.arr} y2={M.arr + h} stroke={tema.borde} />
					<text x={x(t)} y={M.arr + h + 32} textAnchor="middle" {...etiqueta}>
						{Number(t.toFixed(1))}
					</text>
				</g>
			))}
			<text x={M.izq + w / 2} y={alto - 12} textAnchor="middle" {...etiqueta} fill={tema.texto}>
				Volumen de base añadido (mL)
			</text>
			<text
				transform={`translate(26 ${M.arr + h / 2}) rotate(-90)`}
				textAnchor="middle"
				{...etiqueta}
				fill={tema.texto}
			>
				pH
			</text>

			{/* Punto de equivalencia */}
			<g opacity={anotaciones}>
				<line x1={x(veq)} x2={x(veq)} y1={M.arr} y2={M.arr + h} stroke={tema.acento} strokeDasharray="10 8" strokeWidth={2} />
				<line x1={M.izq} x2={x(veq)} y1={y(phEq)} y2={y(phEq)} stroke={tema.acento} strokeDasharray="10 8" strokeWidth={2} />
				<circle cx={x(veq)} cy={y(phEq)} r={10} fill={tema.acento} />
				<text x={x(veq) + 18} y={y(phEq) + 40} fill={tema.acento} fontSize={24} fontFamily={tema.fuente} fontWeight={700}>
					Equivalencia: {veq.toFixed(2)} mL · pH {phEq.toFixed(2)}
				</text>
			</g>

			{/* Curva */}
			<path d={d} fill="none" stroke={tema.acento2} strokeWidth={5} strokeLinejoin="round" strokeLinecap="round" />
			{visibles.length > 0 ? (
				<circle cx={x(Math.min(vActual, vMax))} cy={y(phActual)} r={11} fill="#fff" stroke={tema.acento2} strokeWidth={5} />
			) : null}
		</svg>
	);
};
