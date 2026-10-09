import React from 'react';
import {Composition} from 'remotion';
import {BiodieselVideo} from './Video';
import {propsPorDefecto} from './props-por-defecto';
import {biodieselSchema} from './schema';
import {FPS, duracionTotal} from './tema';
import {ReflujoEscena} from './escenas/Reflujo';
import {calcularTiempos} from './tiempos';
import {GUION} from './tema';

export const RemotionRoot: React.FC = () => (
	<>
		<Composition
			id="Biodiesel"
			component={BiodieselVideo}
			fps={FPS}
			width={1920}
			height={1080}
			durationInFrames={duracionTotal()}
			schema={biodieselSchema}
			defaultProps={propsPorDefecto}
			calculateMetadata={({props}) => calcularTiempos(props)}
		/>
		{/* Clip corto solo del reflujo: útil para proyectar en bucle en clase. */}
		<Composition
			id="ClipReflujo"
			component={ReflujoEscena}
			fps={FPS}
			width={1920}
			height={1080}
			durationInFrames={GUION.reflujo * FPS}
			schema={biodieselSchema}
			defaultProps={propsPorDefecto}
		/>
	</>
);
