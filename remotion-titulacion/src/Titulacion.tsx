import React from 'react';
import {AbsoluteFill, Series} from 'remotion';
import {Experimento} from './scenes/Experimento';
import {Intro} from './scenes/Intro';
import {Reaccion} from './scenes/Reaccion';
import {Referencias} from './scenes/Referencias';
import {Resultados} from './scenes/Resultados';
import {TitulacionProps} from './schema';
import {ESCENAS, FPS, tema} from './theme';

export const duracionTotal = (props: TitulacionProps) =>
	Math.round(
		(ESCENAS.intro + ESCENAS.reaccion + props.duracionTitulacionSeg + ESCENAS.resultados + ESCENAS.referencias) * FPS,
	);

/** Composición principal: cinco escenas encadenadas con <Series>. */
export const Titulacion: React.FC<TitulacionProps> = (props) => (
	<AbsoluteFill style={{backgroundColor: tema.fondo}}>
		<Series>
			<Series.Sequence durationInFrames={ESCENAS.intro * FPS} name="Introducción">
				<Intro {...props} />
			</Series.Sequence>
			<Series.Sequence durationInFrames={ESCENAS.reaccion * FPS} name="Reacción">
				<Reaccion {...props} />
			</Series.Sequence>
			<Series.Sequence durationInFrames={Math.round(props.duracionTitulacionSeg * FPS)} name="Titulación">
				<Experimento {...props} />
			</Series.Sequence>
			<Series.Sequence durationInFrames={ESCENAS.resultados * FPS} name="Resultados">
				<Resultados {...props} />
			</Series.Sequence>
			<Series.Sequence durationInFrames={ESCENAS.referencias * FPS} name="Referencias">
				<Referencias />
			</Series.Sequence>
		</Series>
	</AbsoluteFill>
);
