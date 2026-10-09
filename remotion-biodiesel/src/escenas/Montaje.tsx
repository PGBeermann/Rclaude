import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {BiodieselProps} from '../schema';
import {Reflujo} from '../lab/Reflujo';
import {tema} from '../tema';
import {useProgreso} from '../ui/Escena';
import {Paso} from '../ui/Paso';

export const Montaje: React.FC<BiodieselProps> = ({receta, condiciones}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const montaje = useProgreso(0.3, 7);
	const agua = useProgreso(7.3, 9);

	return (
		<Paso
			numero={3}
			titulo="Montaje del sistema de reflujo"
			anchoVisual={900}
			visual={
				<Reflujo
					frame={frame}
					montaje={montaje}
					agua={agua}
					calor={0}
					temperatura={25}
					colorMezcla={tema.aceite}
					rotulosDesde={Math.round(fps * 8.5)}
					reflujo={0}
				/>
			}
			puntos={[
				<>
					Coloque <b>{receta.masaAceite} g de aceite</b> y la barra magnética en el balón de 100 mL. Añada el metóxido.
				</>,
				<>Engrase ligeramente las juntas esmeriladas y sujete el balón por el cuello con pinzas de 3 dedos.</>,
				<>Monte el condensador en posición vertical y sujételo con una segunda pinza.</>,
				<>
					Conecte el agua: <b>entra por la oliva inferior y sale por la superior</b>. Así la camisa queda llena.
				</>,
				<>
					Baño de agua a <b>{condiciones.temperaturaBano} °C</b>, cerca del punto de ebullición del metanol (64.7 °C). El condensador devuelve al balón el metanol que se evapora.
				</>,
			]}
			nota={{tipo: 'precaucion', texto: 'Abra el agua del condensador ANTES de empezar a calentar.'}}
		/>
	);
};
