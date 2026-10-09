import React, {useMemo} from 'react';
import {Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {
	INDICADORES,
	Sistema,
	calcularPH,
	colorDisolucion,
	curvaTitulacion,
	volumenEquivalencia,
} from '../chem/titulacion';
import {Bureta} from '../components/Bureta';
import {CurvaPH} from '../components/CurvaPH';
import {Escena} from '../components/Escena';
import {Matraz} from '../components/Matraz';
import {TitulacionProps} from '../schema';
import {tema} from '../theme';

const regionQuimica = (v: number, veq: number, debil: boolean): string => {
	if (v < veq * 0.005) return debil ? 'Ácido débil inicial: equilibrio de Ka' : 'Ácido fuerte inicial: [H⁺] = Cₐ';
	if (Math.abs(v - veq) / veq < 0.02) return debil ? 'Equivalencia: hidrólisis de A⁻ (pH > 7)' : 'Equivalencia: pH = 7,00';
	if (v < veq) return debil ? 'Región tampón HA / A⁻' : 'Exceso de H⁺ sin reaccionar';
	return 'Exceso de OH⁻ del titulante';
};

export const Experimento: React.FC<TitulacionProps> = (props) => {
	const frame = useCurrentFrame();
	const {durationInFrames} = useVideoConfig();
	const {acido, base} = props;
	const indicador = INDICADORES[props.indicador];

	const sistema: Sistema = {ca: acido.concentracion, va: acido.volumen, ka: acido.ka, cb: base.concentracion};
	const veq = volumenEquivalencia(sistema);
	const vMax = veq * 2;
	const capacidad = Math.max(50, Math.ceil(vMax / 10) * 10);

	// useMemo: la curva se calcula una sola vez por instancia, no en cada fotograma.
	const puntos = useMemo(() => curvaTitulacion(sistema, vMax), [sistema.ca, sistema.va, sistema.ka, sistema.cb, vMax]);

	// Ritmo realista: la adición se hace más lenta cerca del punto de equivalencia.
	const d = durationInFrames;
	const v = interpolate(
		frame,
		[0.08 * d, 0.4 * d, 0.72 * d, 0.9 * d],
		[0, 0.85 * veq, 1.15 * veq, vMax],
		{extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.quad)},
	);
	const ph = calcularPH(sistema, v);
	const goteando = frame > 0.08 * d && frame < 0.9 * d;
	const anotaciones = interpolate(v, [veq, veq * 1.1], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

	const dato = (etiqueta: string, valor: string, color: string = tema.texto) => (
		<div style={{background: tema.fondoPanel, border: `1px solid ${tema.borde}`, borderRadius: 18, padding: '14px 26px', minWidth: 250}}>
			<div style={{fontSize: 22, color: tema.textoSuave}}>{etiqueta}</div>
			<div style={{fontSize: 46, fontWeight: 800, fontFamily: tema.fuenteMono, color}}>{valor}</div>
		</div>
	);

	return (
		<Escena titulo="Titulación en tiempo real">
			<div style={{display: 'flex', gap: 30}}>
				<div style={{width: 520, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
					<div style={{marginLeft: -40}}>
						<Bureta dispensado={v} capacidad={capacidad} goteando={goteando} colorTitulante="rgba(200, 225, 255, 0.55)" />
					</div>
					<div style={{marginTop: -60}}>
						<Matraz
							color={colorDisolucion(indicador, ph)}
							nivel={0.45 + 0.4 * (v / vMax)}
							agitacion={goteando ? 1 : 0.2}
							frame={frame}
						/>
					</div>
				</div>
				<div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: 20}}>
					<div style={{display: 'flex', gap: 20}}>
						{dato('Volumen añadido', `${v.toFixed(2)} mL`)}
						{dato('pH', ph.toFixed(2), tema.acento2)}
						<div style={{flex: 1, alignSelf: 'stretch', display: 'flex', alignItems: 'center', fontSize: 28, color: tema.acento, fontWeight: 700}}>
							{regionQuimica(v, veq, acido.ka !== null)}
						</div>
					</div>
					<CurvaPH
						puntos={puntos}
						vMax={vMax}
						vActual={v}
						phActual={ph}
						veq={veq}
						phEq={calcularPH(sistema, veq)}
						indicador={indicador}
						anotaciones={anotaciones}
						ancho={1150}
						alto={720}
					/>
				</div>
			</div>
		</Escena>
	);
};
