import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {Embudo} from '../lab/Embudo';
import {tema} from '../tema';
import {useProgreso} from '../ui/Escena';
import {Formula} from '../ui/Formula';
import {Paso} from '../ui/Paso';

export const Lavado: React.FC = () => {
	const frame = useCurrentFrame();
	const separacion = useProgreso(0.8, 4.5);
	const drenado = useProgreso(5, 8.5);
	const aguaLavado = 'rgba(235, 235, 225, 0.85)'; // blanquecina: arrastra jabones y metanol

	return (
		<Paso
			numero={6}
			titulo="Lavado y secado"
			anchoVisual={760}
			visual={
				<Embudo
					frame={frame}
					capas={[
						{color: aguaLavado, fraccion: 0.3 * (1 - drenado), rotulo: 'Agua de lavado'},
						{color: tema.biodiesel, fraccion: 0.6, rotulo: 'Biodiésel'},
					]}
					separacion={separacion}
					colorMezcla="rgba(240, 220, 150, 0.9)"
					abierta={drenado > 0 && drenado < 1}
					colorChorro={aguaLavado}
					nivelVaso={interpolate(drenado, [0, 1], [0, 0.7])}
					colorVaso={aguaLavado}
					rotulos
				/>
			}
			puntos={[
				<>Agregue agua destilada tibia (≈ ½ del volumen de biodiésel).</>,
				<>
					Invierta el embudo <b>suavemente</b>, sin agitar con fuerza, para no formar una emulsión. Ventile por la llave.
				</>,
				<>Deje separar y descarte la fase acuosa inferior. Repita 2–3 veces, hasta que el agua salga clara y con pH neutro.</>,
				<>
					Seque con <Formula texto="Na2SO4" /> anhidro y filtre. Pese el producto en un frasco tarado.
				</>,
			]}
			nota={{tipo: 'dato', texto: 'Un biodiésel bien lavado y seco es translúcido. La turbidez indica agua o jabones.'}}
		/>
	);
};
