import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {BiodieselProps} from '../schema';
import {DENSIDAD} from '../quimica/estequiometria';
import {Embudo} from '../lab/Embudo';
import {tema} from '../tema';
import {useProgreso} from '../ui/Escena';
import {Paso} from '../ui/Paso';

export const Separacion: React.FC<BiodieselProps> = ({condiciones}) => {
	const frame = useCurrentFrame();
	const separacion = useProgreso(0.5, 6);
	const drenado = useProgreso(7, 10.5);
	const abierta = drenado > 0 && drenado < 1;
	const fGlicerol = 0.14 * (1 - drenado);

	return (
		<Paso
			numero={5}
			titulo="Separación de fases"
			anchoVisual={760}
			visual={
				<Embudo
					frame={frame}
					capas={[
						{color: tema.glicerol, fraccion: fGlicerol, rotulo: 'Glicerol (fase inferior)'},
						{color: tema.biodiesel, fraccion: 0.72, rotulo: 'Biodiésel crudo'},
					]}
					separacion={separacion}
					colorMezcla="rgba(200, 140, 50, 0.9)"
					abierta={abierta}
					colorChorro={tema.glicerol}
					nivelVaso={interpolate(drenado, [0, 1], [0, 0.45])}
					colorVaso={tema.glicerol}
					rotulos
				/>
			}
			puntos={[
				<>Deje enfriar y pase la mezcla al embudo de separación de 125 mL, sobre el aro.</>,
				<>
					Deje reposar al menos <b>{condiciones.tiempoDecantacionMin} min</b> (mejor toda la noche).
				</>,
				<>
					El glicerol (ρ ≈ {DENSIDAD.glicerol.toFixed(2)} g/mL) se va al fondo. El biodiésel (ρ ≈ 0.88 g/mL) queda arriba.
				</>,
				<>Quite el tapón, abra la llave y recoja la fase inferior oscura en un vaso. Cierre justo en la interfase.</>,
			]}
			nota={{tipo: 'dato', texto: 'La fase de glicerol también contiene metanol en exceso, catalizador y jabones.'}}
		/>
	);
};
