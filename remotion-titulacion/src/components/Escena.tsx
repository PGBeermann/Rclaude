import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {tema} from '../theme';

/** Contenedor común: fondo, márgenes y fundido de entrada/salida de 0,5 s. */
export const Escena: React.FC<{children: React.ReactNode; titulo?: string}> = ({children, titulo}) => {
	const frame = useCurrentFrame();
	const {durationInFrames, fps} = useVideoConfig();
	const f = fps / 2;
	// En una imagen fija (<Still>, 1 fotograma) no hay fundido.
	const opacidad = durationInFrames <= 2 * f ? 1 : interpolate(frame, [0, f, durationInFrames - f, durationInFrames], [0, 1, 1, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	return (
		<AbsoluteFill
			style={{
				background: `radial-gradient(circle at 20% 10%, #13345f 0%, ${tema.fondo} 60%)`,
				color: tema.texto,
				fontFamily: tema.fuente,
				padding: '60px 90px',
				opacity: opacidad,
			}}
		>
			{titulo ? (
				<div style={{fontSize: 52, fontWeight: 800, marginBottom: 30, borderLeft: `10px solid ${tema.acento}`, paddingLeft: 24}}>
					{titulo}
				</div>
			) : null}
			{children}
		</AbsoluteFill>
	);
};

/** Aparición escalonada con resorte: útil para listas y tarjetas. */
export const useAparicion = (retrasoFotogramas: number) => {
	const frame = useCurrentFrame();
	const {fps, durationInFrames} = useVideoConfig();
	// En una imagen fija (<Still>) se muestra el estado final.
	if (durationInFrames <= 2) return {opacity: 1, transform: 'none'};
	const t = Math.min(Math.max((frame - retrasoFotogramas) / (fps * 0.6), 0), 1);
	const suave = 1 - (1 - t) ** 3;
	return {opacity: suave, transform: `translateY(${(1 - suave) * 40}px)`};
};
