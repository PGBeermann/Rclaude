import React from 'react';
import {tema} from '../tema';

/**
 * Embudo de separación sobre aro metálico, con un vaso receptor.
 * Las capas se definen de abajo hacia arriba como fracciones de la altura útil.
 */
export type Capa = {color: string; fraccion: number; rotulo?: string};

type Props = {
	frame: number;
	/** Capas de abajo hacia arriba */
	capas: Capa[];
	/** 0–1: grado de separación (0 = emulsión homogénea, 1 = interfase nítida) */
	separacion: number;
	/** Color de la mezcla sin separar */
	colorMezcla: string;
	/** Llave abierta */
	abierta: boolean;
	colorChorro: string;
	/** 0–1: nivel en el vaso receptor */
	nivelVaso: number;
	colorVaso: string;
	rotulos: boolean;
};

// Interior del embudo (pera): de y=150 (arriba) a y=560 (vértice)
const CUERPO = 'M 230 120 L 230 150 C 140 210 120 330 175 430 L 236 560 L 264 560 L 325 430 C 380 330 360 210 270 150 L 270 120 Z';
const Y_TOP = 175;
const Y_BOT = 560;

export const Embudo: React.FC<Props> = ({frame, capas, separacion, colorMezcla, abierta, colorChorro, nivelVaso, colorVaso, rotulos}) => {
	const altoUtil = Y_BOT - Y_TOP;
	let yAcum = Y_BOT;
	const rects = capas.map((c, i) => {
		const h = c.fraccion * altoUtil;
		yAcum -= h;
		return {...c, y: yAcum, h, i};
	});
	const ySuperior = yAcum;

	return (
		<svg viewBox="0 0 760 1000" width={665} height={875}>
			<defs>
				<clipPath id="interior-embudo">
					<path d={CUERPO} />
				</clipPath>
			</defs>
			{/* Soporte y aro */}
			<rect x={40} y={940} width={300} height={24} rx={6} fill="#475569" />
			<rect x={54} y={80} width={12} height={865} rx={6} fill="#94a3b8" />
			<rect x={60} y={424} width={110} height={10} fill="#94a3b8" />
			<ellipse cx={250} cy={430} rx={82} ry={14} fill="none" stroke="#cbd5e1" strokeWidth={8} />

			{/* Contenido */}
			<g clipPath="url(#interior-embudo)">
				{/* Mezcla turbia que se desvanece a medida que se separan las fases */}
				<rect x={100} y={ySuperior} width={300} height={Y_BOT - ySuperior + 5} fill={colorMezcla} opacity={1 - separacion} />
				{rects.map((r) => (
					<rect key={r.i} x={100} y={r.y} width={300} height={r.h + (r.i === 0 ? 5 : 0)} fill={r.color} opacity={separacion} />
				))}
				{/* Gotitas que migran durante la decantación */}
				{separacion < 1
					? Array.from({length: 18}, (_, i) => {
							const t = ((frame + i * 7) % 50) / 50;
							const baja = i % 2 === 0;
							const y = baja ? ySuperior + 20 + t * (Y_BOT - ySuperior - 40) : Y_BOT - 20 - t * (Y_BOT - ySuperior - 40);
							return <circle key={i} cx={200 + ((i * 23) % 100)} cy={y} r={4} fill={baja ? tema.glicerol : tema.biodiesel} opacity={(1 - separacion) * 0.9} />;
						})
					: null}
			</g>
			<path d={CUERPO} fill="rgba(255,255,255,0.06)" stroke={tema.vidrio} strokeWidth={5} strokeLinejoin="round" />
			{/* Tapón */}
			<rect x={226} y={92} width={48} height={34} rx={8} fill="#cbd5e1" />
			{/* Vástago y llave */}
			<rect x={243} y={558} width={14} height={150} fill="rgba(255,255,255,0.12)" stroke={tema.vidrio} strokeWidth={3} />
			<rect x={212} y={590} width={76} height={24} rx={8} fill={abierta ? tema.acento2 : '#94a3b8'} />
			<rect x={244} y={590} width={12} height={24} fill="#1e293b" transform={abierta ? 'rotate(90 250 602)' : undefined} />
			{abierta ? (
				<rect x={246} y={708} width={8} height={170} fill={colorChorro} strokeDasharray="10 6" />
			) : null}

			{/* Vaso receptor */}
			<rect x={176} y={930 - 120 * nivelVaso} width={148} height={120 * nivelVaso} fill={colorVaso} />
			<path d="M 170 790 L 170 935 L 330 935 L 330 790" fill="none" stroke={tema.vidrio} strokeWidth={5} />

			{/* Rótulos de fases */}
			{rotulos
				? rects
						.filter((r) => r.rotulo && r.h > 20)
						.map((r) => (
							<g key={r.i} opacity={separacion}>
								<line x1={330} y1={r.y + r.h / 2} x2={420} y2={r.y + r.h / 2} stroke={tema.acento} strokeWidth={2.5} />
								<text x={428} y={r.y + r.h / 2 + 8} fill={tema.texto} fontSize={26} fontWeight={600} fontFamily={tema.fuente}>
									{r.rotulo}
								</text>
							</g>
						))
				: null}
		</svg>
	);
};
