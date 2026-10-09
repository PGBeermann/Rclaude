import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {BiodieselProps} from '../schema';
import {Reflujo as Aparato} from '../lab/Reflujo';
import {tema} from '../tema';
import {useProgreso} from '../ui/Escena';
import {Paso} from '../ui/Paso';

/** Interpola entre dos colores rgba. */
const mezclar = (a: string, b: string, t: number) => {
	const pa = a.match(/[\d.]+/g)!.map(Number);
	const pb = b.match(/[\d.]+/g)!.map(Number);
	const m = pa.map((x, i) => x + (pb[i] - x) * t);
	return `rgba(${m[0].toFixed(0)}, ${m[1].toFixed(0)}, ${m[2].toFixed(0)}, ${m[3].toFixed(2)})`;
};

export const ReflujoEscena: React.FC<BiodieselProps> = ({condiciones}) => {
	const frame = useCurrentFrame();
	const calor = useProgreso(0.3, 2.5);
	const avance = useProgreso(2.5, 12.5); // fracción del tiempo de reacción
	const reflujo = interpolate(calor, [0.6, 1], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const temperatura = 25 + (condiciones.temperaturaBano - 25) * calor;
	const minutos = avance * condiciones.tiempoReflujoMin;
	// Turbio al inicio (metanol poco soluble en el aceite); más oscuro y homogéneo al avanzar.
	const color = mezclar('rgba(225, 190, 110, 0.9)', 'rgba(190, 120, 30, 0.92)', avance);

	return (
		<Paso
			numero={4}
			titulo="Reacción bajo reflujo"
			anchoVisual={900}
			visual={
				<div style={{position: 'relative'}}>
					<Aparato frame={frame} montaje={1} agua={1} calor={calor} temperatura={temperatura} colorMezcla={color} rotulosDesde={null} reflujo={reflujo} />
					<div
						style={{
							position: 'absolute',
							top: 20,
							right: 10,
							background: 'rgba(0,0,0,0.55)',
							border: `1px solid ${tema.borde}`,
							borderRadius: 16,
							padding: '12px 22px',
							textAlign: 'right',
						}}
					>
						<div style={{fontSize: 22, color: tema.suave}}>Tiempo de reacción</div>
						<div style={{fontSize: 52, fontFamily: tema.mono, fontWeight: 800, color: tema.acento}}>
							{String(Math.floor(minutos)).padStart(2, '0')}:{String(Math.floor((minutos % 1) * 60)).padStart(2, '0')}
						</div>
						<div style={{fontSize: 20, color: tema.suave}}>de {condiciones.tiempoReflujoMin} min (acelerado)</div>
					</div>
				</div>
			}
			puntos={[
				<>Encienda la agitación (vigorosa: al inicio hay dos fases inmiscibles) y luego el calentamiento.</>,
				<>
					Mantenga el baño a <b>{condiciones.temperaturaBano} °C</b> y un reflujo suave durante <b>{condiciones.tiempoReflujoMin} min</b>.
				</>,
				<>Los vapores de metanol condensan en las bolas del condensador y gotean de vuelta: no se pierde reactivo.</>,
				<>La mezcla pasa de turbia a más oscura. Al reposar se empieza a separar el glicerol.</>,
			]}
			nota={{tipo: 'dato', texto: 'El anillo de condensación debe quedar en el tercio inferior del condensador. Si sube más, reduzca el calor.'}}
		/>
	);
};
