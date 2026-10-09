import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {tema} from '../tema';

/** Fondo común con fundido de entrada/salida (0,5 s). */
export const Escena: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => {
	const frame = useCurrentFrame();
	const {durationInFrames, fps} = useVideoConfig();
	const f = fps / 2;
	const opacity =
		durationInFrames <= 2 * f
			? 1
			: interpolate(frame, [0, f, durationInFrames - f, durationInFrames], [0, 1, 1, 0], {
					extrapolateLeft: 'clamp',
					extrapolateRight: 'clamp',
				});
	return (
		<AbsoluteFill
			style={{
				background: `radial-gradient(circle at 15% 0%, ${tema.fondo2} 0%, ${tema.fondo} 65%)`,
				color: tema.texto,
				fontFamily: tema.fuente,
				opacity,
				...style,
			}}
		>
			{children}
		</AbsoluteFill>
	);
};

/** Aparición con desplazamiento vertical a partir de un retraso en fotogramas. */
export const useAparicion = (retraso: number, duracion = 18) => {
	const frame = useCurrentFrame();
	const {durationInFrames} = useVideoConfig();
	if (durationInFrames <= 2) return {opacity: 1, transform: 'none'};
	const t = Math.min(Math.max((frame - retraso) / duracion, 0), 1);
	const s = 1 - (1 - t) ** 3;
	return {opacity: s, transform: `translateY(${(1 - s) * 30}px)`};
};

/** Progreso 0–1 entre dos instantes (en segundos) de la escena. */
export const useProgreso = (desdeSeg: number, hastaSeg: number) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	return interpolate(frame, [desdeSeg * fps, hastaSeg * fps], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
};
