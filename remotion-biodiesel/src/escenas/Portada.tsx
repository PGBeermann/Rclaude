import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {BiodieselProps} from '../schema';
import {tema} from '../tema';
import {Escena} from '../ui/Escena';

export const Portada: React.FC<BiodieselProps> = ({institucion, curso, titulo, subtitulo}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const s = spring({frame, fps, config: {damping: 14}});
	const o = interpolate(frame, [20, 40], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	// La gota cambia de aceite usado (ámbar oscuro) a biodiésel (amarillo claro).
	const t = interpolate(frame, [30, 110], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const color = `rgb(${Math.round(150 + 100 * t)}, ${Math.round(95 + 119 * t)}, ${Math.round(20 + 60 * t)})`;

	return (
		<Escena>
			<AbsoluteFill style={{flexDirection: 'row', alignItems: 'center', padding: '0 130px', gap: 90}}>
				<svg width={320} height={420} viewBox="0 0 100 130" style={{transform: `scale(${s})`}}>
					<path d="M 50 5 C 50 5 10 60 10 85 A 40 40 0 0 0 90 85 C 90 60 50 5 50 5 Z" fill={color} />
					<ellipse cx={35} cy={80} rx={8} ry={14} fill="rgba(255,255,255,0.35)" />
				</svg>
				<div>
					<div style={{fontSize: 32, color: tema.suave, letterSpacing: 4, textTransform: 'uppercase', opacity: o}}>
						{institucion} · {curso}
					</div>
					<div style={{fontSize: 92, fontWeight: 800, lineHeight: 1.05, margin: '22px 0', transform: `translateX(${(1 - s) * -60}px)`, opacity: s}}>
						{titulo}
					</div>
					<div style={{height: 8, width: 700 * s, background: tema.acento, borderRadius: 4}} />
					<div style={{fontSize: 38, marginTop: 28, color: tema.acento2, opacity: o}}>{subtitulo}</div>
				</div>
			</AbsoluteFill>
		</Escena>
	);
};
