import React from 'react';
import {tema} from '../tema';

type Props = {
	frame: number;
	colorLiquido: string;
	/** 0–1: lentejas de NaOH ya añadidas */
	adicion: number;
	/** 0–1: disolución de las lentejas */
	disolucion: number;
	/** 0–1: tapa de vidrio de reloj colocada */
	tapa: number;
};

/** Erlenmeyer sobre placa de agitación: preparación del metóxido de sodio. */
export const Erlenmeyer: React.FC<Props> = ({frame, colorLiquido, adicion, disolucion, tapa}) => {
	const contorno = 'M 265 160 L 265 300 L 160 560 Q 150 590 180 590 L 420 590 Q 450 590 440 560 L 335 300 L 335 160 Z';
	const giro = Math.abs(Math.cos(frame * 0.6));
	const lentejas = Array.from({length: 8}, (_, i) => {
		const inicio = i / 8;
		const t = Math.min(Math.max((adicion - inicio) * 8, 0), 1);
		const x = 270 + ((i * 29) % 60);
		const yFinal = 560 - (i % 3) * 8;
		return {x, y: 40 + t * (yFinal - 40), r: 9 * (1 - disolucion), o: t > 0 ? 1 - disolucion : 0};
	});
	const remolino = Math.sin(frame / 4) * 10;

	return (
		<svg viewBox="0 0 600 760" width={720} height={912}>
			<defs>
				<clipPath id="interior-erlen">
					<path d={contorno} />
				</clipPath>
			</defs>
			<rect x={120} y={600} width={360} height={90} rx={14} fill="#e2e8f0" />
			<rect x={140} y={590} width={320} height={14} rx={5} fill="#475569" />
			<circle cx={300} cy={648} r={9} fill="#22c55e" />
			<g clipPath="url(#interior-erlen)">
				<path d={`M 100 ${430 + remolino} Q 300 ${430 - remolino} 500 ${430 + remolino} L 500 600 L 100 600 Z`} fill={colorLiquido} />
			</g>
			{lentejas.map((l, i) => (
				<ellipse key={i} cx={l.x} cy={l.y} rx={l.r} ry={l.r * 0.7} fill="#f8fafc" opacity={l.o} />
			))}
			<rect x={300 - 30 * giro} y={570} width={60 * giro + 4} height={11} rx={5} fill="#f8fafc" />
			<path d={contorno} fill="rgba(255,255,255,0.05)" stroke={tema.vidrio} strokeWidth={5} strokeLinejoin="round" />
			<ellipse cx={300} cy={150 - (1 - tapa) * 120} rx={60} ry={8} fill="rgba(226,240,255,0.6)" opacity={tapa} />
			<text x={300} y={730} textAnchor="middle" fill={tema.suave} fontSize={26} fontFamily={tema.fuente}>
				Agitación magnética · sin calentar
			</text>
		</svg>
	);
};
