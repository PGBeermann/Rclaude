import React from 'react';
import {interpolate} from 'remotion';
import {tema} from '../tema';

/**
 * Montaje de reflujo con material de vidrio de un kit de química orgánica
 * (juntas esmeriladas estándar): balón de fondo redondo + condensador de bolas (Allihn),
 * pinzas de tres dedos, soporte universal, baño de agua sobre placa calefactora con agitación.
 *
 * Todas las cantidades animables entran como props 0–1 para que cada escena controle el ritmo.
 */
type Props = {
	frame: number;
	/** 0–1: progreso del armado (soporte → placa → baño → balón → pinza → condensador → mangueras) */
	montaje: number;
	/** 0–1: el agua llena la camisa del condensador (entra por abajo) */
	agua: number;
	/** 0–1: potencia de calentamiento */
	calor: number;
	/** Temperatura mostrada en el termómetro del baño (°C) */
	temperatura: number;
	/** Color de la mezcla en el balón */
	colorMezcla: string;
	/** Fotograma a partir del cual aparecen los rótulos (null = sin rótulos) */
	rotulosDesde: number | null;
	/** 0–1: intensidad del reflujo (vapor que sube y gotas que regresan) */
	reflujo: number;
};

const etapa = (p: number, a: number, b: number) =>
	interpolate(p, [a, b], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

// Geometría (viewBox 0 0 1000 1000)
const ROD_X = 170;
const BALON = {cx: 420, cy: 735, r: 74};
const CUELLO = {x: 402, y: 600, w: 36, h: 70};
const COND = {x: 395, top: 120, bottom: 612, jacketTop: 190, jacketBottom: 560, jx: 375, jw: 90};

const Pinza: React.FC<{y: number; xFin: number; o: number}> = ({y, xFin, o}) => (
	<g opacity={o}>
		<rect x={ROD_X - 8} y={y - 14} width={28} height={28} rx={4} fill="#64748b" />
		<rect x={ROD_X + 10} y={y - 6} width={xFin - ROD_X - 20} height={12} fill="#94a3b8" />
		<path d={`M ${xFin - 14} ${y - 22} Q ${xFin + 46} ${y} ${xFin - 14} ${y + 22}`} fill="none" stroke="#cbd5e1" strokeWidth={8} strokeLinecap="round" />
	</g>
);

export const Reflujo: React.FC<Props> = ({frame, montaje, agua, calor, temperatura, colorMezcla, rotulosDesde, reflujo}) => {
	const pSoporte = etapa(montaje, 0, 0.12);
	const pPlaca = etapa(montaje, 0.1, 0.25);
	const pBalon = etapa(montaje, 0.25, 0.45);
	const pPinza = etapa(montaje, 0.42, 0.52);
	const pCond = etapa(montaje, 0.52, 0.78);
	const pMang = etapa(montaje, 0.78, 0.95);

	const balonDy = (1 - pBalon) * -260;
	const condDy = (1 - pCond) * -620;

	// Agitador magnético: ancho aparente oscila para simular el giro.
	const giro = Math.abs(Math.cos(frame * 0.6));
	const nivelMezcla = BALON.cy - 5;

	// Burbujas de ebullición y vapor (deterministas a partir del fotograma)
	const burbujas = Array.from({length: 14}, (_, i) => {
		const periodo = 22 + (i % 5) * 4;
		const t = ((frame + i * 13) % periodo) / periodo;
		const x = BALON.cx - 50 + ((i * 37) % 100);
		return {x, y: BALON.cy + 55 - t * 55, r: 3 + (i % 3), o: (1 - t) * reflujo};
	});
	const ALTURA_ANILLO = 485; // donde condensa el vapor (anillo de reflujo)
	const vapor = Array.from({length: 10}, (_, i) => {
		const t = ((frame + i * 9) % 45) / 45;
		return {x: COND.x + 15 + Math.sin(i * 2.1 + frame / 6) * 6, y: CUELLO.y + 10 - t * (CUELLO.y + 10 - ALTURA_ANILLO), o: (1 - t) * reflujo * 0.8};
	});
	const gotas = Array.from({length: 6}, (_, i) => {
		const t = ((frame + i * 11) % 40) / 40;
		return {x: COND.x + (i % 2 === 0 ? 3 : 27), y: ALTURA_ANILLO + t * (CUELLO.y + 40 - ALTURA_ANILLO), o: reflujo};
	});

	const flujo = -frame * 4; // desplazamiento del patrón de las mangueras
	const tempAltura = interpolate(temperatura, [20, 100], [0, 150], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const rotulo = (x: number, y: number, x2: number, y2: number, texto: string, retraso: number) => {
		const o = rotulosDesde === null ? 0 : Math.min(Math.max((frame - rotulosDesde - retraso) / 15, 0), 1);
		return (
			<g opacity={o}>
				<line x1={x} y1={y} x2={x2} y2={y2} stroke={tema.acento} strokeWidth={2.5} />
				<circle cx={x} cy={y} r={6} fill={tema.acento} />
				<text x={x2 + 8} y={y2 + 8} fill={tema.texto} fontSize={25} fontFamily={tema.fuente} fontWeight={600}>
					{texto}
				</text>
			</g>
		);
	};

	return (
		<svg viewBox="0 0 1000 1000" width={860} height={860}>
			<defs>
				<clipPath id="interior-balon">
					<circle cx={BALON.cx} cy={BALON.cy} r={BALON.r - 4} />
				</clipPath>
				<clipPath id="interior-camisa">
					<rect x={COND.jx + 4} y={COND.jacketTop + 4} width={COND.jw - 8} height={COND.jacketBottom - COND.jacketTop - 8} rx={30} />
				</clipPath>
				<radialGradient id="brillo-vidrio" cx="0.35" cy="0.3" r="0.7">
					<stop offset="0" stopColor="rgba(255,255,255,0.35)" />
					<stop offset="0.5" stopColor="rgba(255,255,255,0.03)" />
				</radialGradient>
				<linearGradient id="placa-caliente" x1="0" x2="0" y1="0" y2="1">
					<stop offset="0" stopColor={`rgba(248, 113, 113, ${0.9 * calor})`} />
					<stop offset="1" stopColor="rgba(71,85,105,1)" />
				</linearGradient>
			</defs>

			{/* Soporte universal */}
			<g opacity={pSoporte}>
				<rect x={90} y={940} width={330} height={26} rx={6} fill="#475569" />
				<rect x={ROD_X - 6} y={70} width={12} height={875} rx={6} fill="#94a3b8" />
			</g>

			{/* Placa calefactora con agitación + baño de agua */}
			<g opacity={pPlaca} transform={`translate(0 ${(1 - pPlaca) * 40})`}>
				<rect x={270} y={850} width={300} height={90} rx={14} fill="#e2e8f0" />
				<rect x={285} y={838} width={270} height={16} rx={5} fill="url(#placa-caliente)" />
				<circle cx={330} cy={898} r={18} fill="#334155" />
				<circle cx={510} cy={898} r={18} fill="#334155" />
				<line x1={330} y1={898} x2={330 + 14 * Math.cos(-2.4 + calor * 2.6)} y2={898 + 14 * Math.sin(-2.4 + calor * 2.6)} stroke="#f8fafc" strokeWidth={4} />
				<line x1={510} y1={898} x2={524} y2={890} stroke="#f8fafc" strokeWidth={4} />
				<circle cx={420} cy={862} r={6} fill={calor > 0 ? '#ef4444' : '#64748b'} />
				{/* Cristalizador (baño de agua) */}
				<rect x={300} y={748} width={240} height={88} fill={tema.agua} />
				<path d="M 296 700 L 296 836 L 544 836 L 544 700" fill="none" stroke={tema.vidrio} strokeWidth={5} strokeLinejoin="round" />
				{calor > 0.3
					? [0, 1, 2].map((i) => {
							const t = ((frame + i * 20) % 60) / 60;
							return (
								<path
									key={i}
									d={`M ${320 + i * 90} ${745 - t * 60} q 10 -15 0 -30`}
									stroke="rgba(255,255,255,0.5)"
									strokeWidth={3}
									fill="none"
									opacity={(1 - t) * calor}
								/>
							);
						})
					: null}
			</g>

			{/* Termómetro en el baño */}
			<g opacity={pPlaca}>
				<rect x={510} y={600} width={14} height={210} rx={7} fill="rgba(255,255,255,0.25)" stroke={tema.vidrio} strokeWidth={2} />
				<circle cx={517} cy={814} r={13} fill="#ef4444" />
				<rect x={513} y={806 - tempAltura} width={8} height={tempAltura + 4} fill="#ef4444" />
				<rect x={365} y={872} width={110} height={46} rx={10} fill="rgba(0,0,0,0.75)" stroke={tema.borde} />
				<text x={420} y={904} textAnchor="middle" fill="#fca5a5" fontSize={28} fontFamily={tema.mono} fontWeight={700}>
					{temperatura.toFixed(0)} °C
				</text>
			</g>

			{/* Balón de fondo redondo */}
			<g opacity={pBalon} transform={`translate(0 ${balonDy})`}>
				<g clipPath="url(#interior-balon)">
					<rect x={BALON.cx - BALON.r} y={nivelMezcla} width={BALON.r * 2} height={BALON.r * 2} fill={colorMezcla} />
					{burbujas.map((b, i) => (
						<circle key={i} cx={b.x} cy={b.y} r={b.r} fill="rgba(255,255,255,0.7)" opacity={b.o} />
					))}
				</g>
				<rect x={BALON.cx - 26 * giro} y={BALON.cy + 54} width={52 * giro + 4} height={11} rx={5} fill="#f8fafc" />
				<circle cx={BALON.cx} cy={BALON.cy} r={BALON.r} fill="url(#brillo-vidrio)" stroke={tema.vidrio} strokeWidth={5} />
				<rect x={CUELLO.x} y={CUELLO.y} width={CUELLO.w} height={CUELLO.h} fill="rgba(255,255,255,0.08)" stroke={tema.vidrio} strokeWidth={4} />
				{/* Junta esmerilada (aspecto esmerilado) */}
				<rect x={CUELLO.x - 3} y={CUELLO.y - 4} width={CUELLO.w + 6} height={28} rx={3} fill="rgba(255,255,255,0.45)" />
			</g>

			<Pinza y={CUELLO.y + 40} xFin={CUELLO.x} o={pPinza} />

			{/* Condensador de bolas (Allihn) */}
			<g opacity={pCond > 0 ? 1 : 0} transform={`translate(0 ${condDy})`}>
				{/* Camisa exterior */}
				<rect x={COND.jx} y={COND.jacketTop} width={COND.jw} height={COND.jacketBottom - COND.jacketTop} rx={34} fill="rgba(255,255,255,0.05)" stroke={tema.vidrio} strokeWidth={4} />
				{/* Agua de refrigeración: llena desde abajo */}
				<g clipPath="url(#interior-camisa)">
					<rect
						x={COND.jx}
						y={COND.jacketBottom - agua * (COND.jacketBottom - COND.jacketTop)}
						width={COND.jw}
						height={COND.jacketBottom - COND.jacketTop}
						fill={tema.agua}
					/>
				</g>
				{/* Tubo interior con bolas */}
				<rect x={COND.x} y={COND.top} width={30} height={COND.bottom - COND.top} fill="rgba(255,255,255,0.05)" stroke={tema.vidrio} strokeWidth={3} />
				{[250, 320, 390, 460, 530].map((y) => (
					<ellipse key={y} cx={COND.x + 15} cy={y} rx={24} ry={26} fill="rgba(255,255,255,0.08)" stroke={tema.vidrio} strokeWidth={3} />
				))}
				{/* Junta macho que entra en el cuello */}
				<rect x={COND.x - 2} y={COND.bottom - 36} width={34} height={30} fill="rgba(255,255,255,0.45)" />
				{/* Boca abierta a la atmósfera */}
				<rect x={COND.x - 6} y={COND.top - 6} width={42} height={16} rx={4} fill="none" stroke={tema.vidrio} strokeWidth={3} />
				{/* Olivas de entrada (abajo) y salida (arriba) */}
				<rect x={COND.jx + COND.jw - 2} y={COND.jacketBottom - 46} width={54} height={16} rx={6} fill="rgba(255,255,255,0.15)" stroke={tema.vidrio} strokeWidth={3} />
				<rect x={COND.jx + COND.jw - 2} y={COND.jacketTop + 30} width={54} height={16} rx={6} fill="rgba(255,255,255,0.15)" stroke={tema.vidrio} strokeWidth={3} />

				{/* Vapor ascendente y condensado que regresa */}
				{vapor.map((v, i) => (
					<circle key={`v${i}`} cx={v.x} cy={v.y - condDy} r={5} fill="rgba(255,255,255,0.85)" opacity={v.o} />
				))}
				{gotas.map((g, i) => (
					<ellipse key={`g${i}`} cx={g.x} cy={g.y - condDy} rx={4} ry={6} fill={tema.aguaFuerte} opacity={g.o} />
				))}
				{reflujo > 0.2 ? (
					<ellipse cx={COND.x + 15} cy={ALTURA_ANILLO - condDy} rx={20} ry={5} fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth={3} strokeDasharray="4 5" opacity={reflujo} />
				) : null}
			</g>

			<Pinza y={360} xFin={COND.jx} o={pCond >= 1 ? 1 : 0} />

			{/* Mangueras: entrada por abajo (grifo), salida por arriba (desagüe) */}
			<g opacity={pMang}>
				<path id="m-entrada" d={`M ${COND.jx + COND.jw + 50} ${COND.jacketBottom - 38} C 560 560 640 600 640 700 L 640 990`} fill="none" stroke="#334155" strokeWidth={16} strokeLinecap="round" />
				<path id="m-salida" d={`M ${COND.jx + COND.jw + 50} ${COND.jacketTop + 38} C 600 230 700 260 700 360 L 700 990`} fill="none" stroke="#334155" strokeWidth={16} strokeLinecap="round" />
				{agua > 0 ? (
					<>
						<path d={`M 640 990 L 640 700 C 640 600 560 560 ${COND.jx + COND.jw + 50} ${COND.jacketBottom - 38}`} fill="none" stroke={tema.aguaFuerte} strokeWidth={6} strokeDasharray="14 18" strokeDashoffset={flujo} opacity={agua} />
						<path d={`M ${COND.jx + COND.jw + 50} ${COND.jacketTop + 38} C 600 230 700 260 700 360 L 700 990`} fill="none" stroke={tema.aguaFuerte} strokeWidth={6} strokeDasharray="14 18" strokeDashoffset={flujo} opacity={agua > 0.95 ? 1 : 0} />
					</>
				) : null}
				<text x={630} y={975} textAnchor="end" fill={tema.suave} fontSize={22} fontFamily={tema.fuente}>
					grifo ↑
				</text>
				<text x={712} y={975} fill={tema.suave} fontSize={22} fontFamily={tema.fuente}>
					↓ desagüe
				</text>
			</g>

			{/* Rótulos */}
			{rotulo(COND.x + 15, COND.top, 740, 100, 'Abierto: nunca tapar', 0)}
			{rotulo(COND.jx + COND.jw, 300, 740, 300, 'Condensador Allihn', 8)}
			{rotulo(COND.jx + COND.jw + 50, COND.jacketBottom - 38, 740, 470, 'Agua entra por abajo', 16)}
			{rotulo(CUELLO.x + CUELLO.w, CUELLO.y + 10, 740, 560, 'Junta esmerilada', 24)}
			{rotulo(BALON.cx + BALON.r - 10, BALON.cy - 30, 740, 680, 'Balón fondo redondo', 32)}
			{rotulo(BALON.cx + 20, BALON.cy + 60, 740, 780, 'Barra magnética', 40)}
			{rotulo(555, 870, 740, 880, 'Placa calefactora', 48)}
		</svg>
	);
};
