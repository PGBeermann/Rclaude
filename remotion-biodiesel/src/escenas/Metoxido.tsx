import React from 'react';
import {useCurrentFrame} from 'remotion';
import {BiodieselProps} from '../schema';
import {calcularReceta} from '../quimica/estequiometria';
import {tema} from '../tema';
import {useProgreso} from '../ui/Escena';
import {Formula} from '../ui/Formula';
import {Paso} from '../ui/Paso';
import {Erlenmeyer} from '../lab/Erlenmeyer';

export const Metoxido: React.FC<BiodieselProps> = ({receta}) => {
	const frame = useCurrentFrame();
	const r = calcularReceta(receta);
	const adicion = useProgreso(0.8, 3);
	const tapa = useProgreso(3.2, 3.8);
	const disolucion = useProgreso(3.8, 8);

	return (
		<Paso
			numero={2}
			titulo="Preparación del metóxido de sodio"
			visual={<Erlenmeyer frame={frame} colorLiquido={tema.metanol} adicion={adicion} disolucion={disolucion} tapa={tapa} />}
			puntos={[
				<>
					En la campana, mida <b>{r.volumenMetanol.toFixed(1)} mL de metanol</b> en un Erlenmeyer de 50 mL con barra magnética.
				</>,
				<>
					Agregue <b>{r.NaOHtotal.toFixed(2)} g de NaOH</b>, pesado con rapidez, y tape con un vidrio de reloj.
				</>,
				<>Agite sin calentar hasta que el NaOH se disuelva por completo (≈ 5–10 min). La disolución es exotérmica.</>,
				<>
					<Formula texto="NaOH + CH3OH ⇌ CH3O^-Na^+ + H2O" />
				</>,
			]}
			nota={{tipo: 'precaucion', texto: 'El metóxido es corrosivo y absorbe humedad. Prepárelo justo antes de usarlo.'}}
		/>
	);
};
