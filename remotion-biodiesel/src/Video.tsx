import React from 'react';
import {AbsoluteFill, Html5Audio, Sequence, Series, staticFile} from 'remotion';
import {ENTRADA_VOZ, NARRACION} from './narracion';
import {BiodieselProps} from './schema';
import {FPS, GUION, tema} from './tema';
import {Calculos} from './escenas/Calculos';
import {Fundamento} from './escenas/Fundamento';
import {Lavado} from './escenas/Lavado';
import {Materiales} from './escenas/Materiales';
import {Metoxido} from './escenas/Metoxido';
import {Montaje} from './escenas/Montaje';
import {Portada} from './escenas/Portada';
import {Referencias} from './escenas/Referencias';
import {ReflujoEscena} from './escenas/Reflujo';
import {Resultados} from './escenas/Resultados';
import {Separacion} from './escenas/Separacion';
import {Seguridad} from './escenas/Seguridad';

/** Orden del guion. Cada escena recibe todas las props del video. */
const ESCENAS: {clave: keyof typeof GUION; nombre: string; C: React.FC<BiodieselProps>}[] = [
	{clave: 'portada', nombre: 'Portada', C: Portada},
	{clave: 'fundamento', nombre: 'Fundamento', C: Fundamento},
	{clave: 'materiales', nombre: 'Materiales', C: Materiales},
	{clave: 'seguridad', nombre: 'Seguridad', C: Seguridad},
	{clave: 'calculos', nombre: '1 · Cálculos', C: Calculos},
	{clave: 'metoxido', nombre: '2 · Metóxido', C: Metoxido},
	{clave: 'montaje', nombre: '3 · Montaje', C: Montaje},
	{clave: 'reflujo', nombre: '4 · Reflujo', C: ReflujoEscena},
	{clave: 'separacion', nombre: '5 · Separación', C: Separacion},
	{clave: 'lavado', nombre: '6 · Lavado', C: Lavado},
	{clave: 'resultados', nombre: 'Resultados', C: Resultados},
	{clave: 'referencias', nombre: 'Referencias', C: Referencias},
];

export const BiodieselVideo: React.FC<BiodieselProps> = (props) => (
	<AbsoluteFill style={{backgroundColor: tema.fondo}}>
		<Series>
			{ESCENAS.map(({clave, nombre, C}, i) => {
				const seg = props.tiempos?.duraciones[i] ?? GUION[clave];
				const pista = NARRACION.find((n) => n.clave === clave);
				return (
					<Series.Sequence key={clave} name={nombre} durationInFrames={Math.round(seg * FPS)}>
						<C {...props} />
						{props.tiempos?.audio[i] && pista ? (
							<Sequence from={Math.round(ENTRADA_VOZ * FPS)} name={`Voz: ${pista.archivo}`}>
								<Html5Audio src={staticFile(`narracion/${pista.archivo}`)} />
							</Sequence>
						) : null}
					</Series.Sequence>
				);
			})}
		</Series>
	</AbsoluteFill>
);
