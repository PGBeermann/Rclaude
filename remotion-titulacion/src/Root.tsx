import React from 'react';
import {Composition, Still} from 'remotion';
import {Titulacion, duracionTotal} from './Titulacion';
import {TitulacionProps, titulacionSchema} from './schema';
import {FPS} from './theme';
import {Resultados} from './scenes/Resultados';
import experimentos from '../data/experimentos.json';

const porDefecto = experimentos[0].props as TitulacionProps;

export const RemotionRoot: React.FC = () => (
	<>
		{/* Video completo en Full HD. La duración depende de las props (calculateMetadata). */}
		<Composition
			id="Titulacion"
			component={Titulacion}
			fps={FPS}
			width={1920}
			height={1080}
			durationInFrames={duracionTotal(porDefecto)}
			schema={titulacionSchema}
			defaultProps={porDefecto}
			calculateMetadata={({props}) => ({durationInFrames: duracionTotal(props)})}
		/>
		{/* Versión vertical 1080×1920 no incluida: basta con cambiar width/height y el diseño de las escenas. */}

		{/* Imagen fija (PNG) con la tabla de resultados, útil como miniatura o diapositiva. */}
		<Still id="Miniatura" component={Resultados} width={1920} height={1080} schema={titulacionSchema} defaultProps={porDefecto} />
	</>
);
