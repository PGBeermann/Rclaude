import React from 'react';
import {useCurrentFrame} from 'remotion';
import {tema} from '../theme';

type Props = {
	/** Volumen ya dispensado (mL) */
	dispensado: number;
	/** Capacidad nominal de la bureta (mL) */
	capacidad: number;
	/** Si está goteando (para animar las gotas) */
	goteando: boolean;
	colorTitulante: string;
};

const ALTO_TUBO = 430;
const ANCHO_TUBO = 44;

export const Bureta: React.FC<Props> = ({dispensado, capacidad, goteando, colorTitulante}) => {
	const frame = useCurrentFrame();
	const fraccion = Math.min(dispensado / capacidad, 1);
	const altoLiquido = ALTO_TUBO * (1 - fraccion);

	// Una gota cada 8 fotogramas que cae 70 px.
	const ciclo = 8;
	const fase = (frame % ciclo) / ciclo;

	const marcas = Array.from({length: capacidad / 5 + 1}, (_, i) => i * 5);

	return (
		<svg width={220} height={ALTO_TUBO + 190} viewBox={`0 0 220 ${ALTO_TUBO + 190}`}>
			{/* Soporte */}
			<rect x={0} y={20} width={10} height={ALTO_TUBO + 160} fill="#475569" rx={3} />
			<rect x={0} y={80} width={88} height={12} fill="#64748b" rx={3} />
			{/* Líquido */}
			<rect
				x={88}
				y={10 + (ALTO_TUBO - altoLiquido)}
				width={ANCHO_TUBO}
				height={altoLiquido}
				fill={colorTitulante}
			/>
			{/* Tubo de vidrio */}
			<rect
				x={88}
				y={10}
				width={ANCHO_TUBO}
				height={ALTO_TUBO}
				fill="rgba(255,255,255,0.06)"
				stroke="rgba(255,255,255,0.7)"
				strokeWidth={3}
				rx={4}
			/>
			{/* Graduación: 0 mL arriba */}
			{marcas.map((m) => {
				const y = 10 + (m / capacidad) * ALTO_TUBO;
				return (
					<g key={m}>
						<line x1={132} x2={146} y1={y} y2={y} stroke={tema.textoSuave} strokeWidth={2} />
						<text x={152} y={y + 6} fill={tema.textoSuave} fontSize={17} fontFamily={tema.fuente}>
							{m}
						</text>
					</g>
				);
			})}
			{/* Llave y punta */}
			<rect x={94} y={ALTO_TUBO + 10} width={32} height={40} fill="rgba(255,255,255,0.25)" />
			<rect x={70} y={ALTO_TUBO + 24} width={80} height={12} rx={6} fill={goteando ? tema.acento : '#94a3b8'} />
			<path
				d={`M 100 ${ALTO_TUBO + 50} L 120 ${ALTO_TUBO + 50} L 113 ${ALTO_TUBO + 95} L 107 ${ALTO_TUBO + 95} Z`}
				fill="rgba(255,255,255,0.35)"
			/>
			{goteando ? (
				<ellipse
					cx={110}
					cy={ALTO_TUBO + 100 + fase * 70}
					rx={5}
					ry={7}
					fill={colorTitulante}
					opacity={1 - fase * 0.6}
				/>
			) : null}
		</svg>
	);
};
