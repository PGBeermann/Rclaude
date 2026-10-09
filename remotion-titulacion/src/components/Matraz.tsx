import React from 'react';

type Props = {
	color: string;
	/** Nivel de llenado relativo 0–1 */
	nivel: number;
	/** 0–1: intensidad del remolino (agitación) */
	agitacion: number;
	frame: number;
};

/** Matraz Erlenmeyer en SVG con el líquido recortado por la forma del vidrio. */
export const Matraz: React.FC<Props> = ({color, nivel, agitacion, frame}) => {
	const contorno = 'M 95 10 L 95 95 L 20 250 Q 12 270 34 270 L 226 270 Q 248 270 240 250 L 165 95 L 165 10 Z';
	const yLiquido = 268 - 150 * Math.min(Math.max(nivel, 0.2), 1);
	const ola = Math.sin(frame / 4) * 6 * agitacion;

	return (
		<svg width={260} height={290} viewBox="0 0 260 290">
			<defs>
				<clipPath id="interior-matraz">
					<path d={contorno} />
				</clipPath>
				<linearGradient id="brillo" x1="0" x2="1">
					<stop offset="0" stopColor="rgba(255,255,255,0.25)" />
					<stop offset="0.4" stopColor="rgba(255,255,255,0)" />
				</linearGradient>
			</defs>
			<g clipPath="url(#interior-matraz)">
				<path
					d={`M 0 ${yLiquido + ola} Q 65 ${yLiquido - ola} 130 ${yLiquido + ola} T 260 ${yLiquido} L 260 290 L 0 290 Z`}
					fill={color}
				/>
				<rect x={0} y={0} width={260} height={290} fill="url(#brillo)" />
			</g>
			<path d={contorno} fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth={4} strokeLinejoin="round" />
			<rect x={88} y={4} width={84} height={10} rx={4} fill="rgba(255,255,255,0.8)" />
		</svg>
	);
};
