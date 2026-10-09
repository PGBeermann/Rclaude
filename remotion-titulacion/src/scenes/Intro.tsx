import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Escena} from '../components/Escena';
import {TitulacionProps} from '../schema';
import {tema} from '../theme';

export const Intro: React.FC<TitulacionProps> = ({institucion, curso, titulo, autor}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const escala = spring({frame, fps, config: {damping: 14}});
	const linea = interpolate(frame, [10, 40], [0, 900], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const sub = interpolate(frame, [25, 45], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

	return (
		<Escena>
			<AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center'}}>
				<div style={{fontSize: 34, color: tema.textoSuave, letterSpacing: 4, textTransform: 'uppercase', opacity: sub}}>
					{institucion}
				</div>
				<div style={{fontSize: 96, fontWeight: 800, transform: `scale(${escala})`, margin: '24px 0', maxWidth: 1600}}>
					{titulo}
				</div>
				<div style={{height: 8, width: linea, background: tema.acento, borderRadius: 4}} />
				<div style={{fontSize: 40, marginTop: 30, opacity: sub}}>{curso}</div>
				<div style={{fontSize: 30, marginTop: 12, color: tema.textoSuave, opacity: sub}}>{autor}</div>
			</AbsoluteFill>
		</Escena>
	);
};
