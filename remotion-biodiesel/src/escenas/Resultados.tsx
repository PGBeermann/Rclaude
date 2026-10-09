import React from 'react';
import {BiodieselProps} from '../schema';
import {NORMAS, calcularReceta} from '../quimica/estequiometria';
import {tema} from '../tema';
import {Escena, useAparicion, useProgreso} from '../ui/Escena';

/** Barra horizontal con el intervalo normativo y el valor medido. */
const Rango: React.FC<{
	titulo: string;
	valor: number;
	min: number;
	max: number;
	escala: [number, number];
	unidad: string;
	norma: string;
	retraso: number;
}> = ({titulo, valor, min, max, escala, unidad, norma, retraso}) => {
	const e = useAparicion(retraso);
	const p = useProgreso(retraso / 30 + 0.4, retraso / 30 + 1.6);
	const x = (v: number) => ((v - escala[0]) / (escala[1] - escala[0])) * 100;
	const cumple = valor >= min && valor <= max;
	const xValor = x(escala[0] + (valor - escala[0]) * p);
	return (
		<div style={{...e, background: tema.panel, border: `1px solid ${tema.borde}`, borderRadius: 20, padding: '22px 30px'}}>
			<div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline'}}>
				<div style={{fontSize: 30, fontWeight: 700}}>{titulo}</div>
				<div style={{fontSize: 44, fontFamily: tema.mono, fontWeight: 800, color: cumple ? tema.acento2 : tema.peligro}}>
					{valor} {unidad}
				</div>
			</div>
			<div style={{position: 'relative', height: 34, background: 'rgba(255,255,255,0.08)', borderRadius: 17, margin: '18px 0 10px'}}>
				<div style={{position: 'absolute', left: `${x(min)}%`, width: `${x(max) - x(min)}%`, top: 0, bottom: 0, background: 'rgba(74,222,128,0.35)', borderRadius: 17}} />
				<div style={{position: 'absolute', left: `calc(${xValor}% - 4px)`, top: -8, width: 8, height: 50, background: tema.acento, borderRadius: 4}} />
			</div>
			<div style={{fontSize: 22, color: tema.suave}}>
				Intervalo {norma}: {min}–{max} {unidad} {cumple ? '✔ cumple' : '✘ fuera de norma'}
			</div>
		</div>
	);
};

export const Resultados: React.FC<BiodieselProps> = ({receta, resultados}) => {
	const r = calcularReceta(receta);
	const rendimiento = (resultados.masaBiodiesel / r.masaTeoricaFAME) * 100;
	const t = useAparicion(0);
	const c1 = useAparicion(10);
	const aviso = useAparicion(150);

	return (
		<Escena style={{justifyContent: 'center', padding: '50px 70px'}}>
			<div style={{...t, fontSize: 54, fontWeight: 800, borderLeft: `10px solid ${tema.acento}`, paddingLeft: 22, marginBottom: 30}}>
				Resultados y control de calidad
			</div>
			<div style={{display: 'flex', gap: 34}}>
				<div style={{...c1, flex: 1, background: tema.panel, border: `1px solid ${tema.borde}`, borderRadius: 24, padding: 34}}>
					<div style={{fontSize: 28, color: tema.suave}}>Rendimiento</div>
					<div style={{fontSize: 120, fontWeight: 800, fontFamily: tema.mono, color: tema.acento, lineHeight: 1.1}}>{rendimiento.toFixed(1)} %</div>
					<div style={{fontSize: 28, lineHeight: 1.6, marginTop: 10}}>
						<div>
							Masa obtenida: <b>{resultados.masaBiodiesel.toFixed(1)} g</b>
						</div>
						<div>
							Masa teórica: <b>{r.masaTeoricaFAME.toFixed(2)} g</b>
						</div>
						<div style={{fontFamily: tema.mono, color: tema.suave, fontSize: 24, marginTop: 8}}>
							η = m(obtenida) / m(teórica) × 100
						</div>
					</div>
				</div>
				<div style={{flex: 1.3, display: 'flex', flexDirection: 'column', gap: 24}}>
					<Rango
						retraso={40}
						titulo="Densidad a 15 °C"
						valor={resultados.densidad}
						min={NORMAS.densidad15C.min}
						max={NORMAS.densidad15C.max}
						escala={[0.8, 0.96]}
						unidad={NORMAS.densidad15C.unidad}
						norma={NORMAS.densidad15C.norma}
					/>
					<Rango
						retraso={80}
						titulo="Viscosidad cinemática a 40 °C"
						valor={resultados.viscosidad}
						min={NORMAS.viscosidad40C.min}
						max={NORMAS.viscosidad40C.max}
						escala={[0, 10]}
						unidad={NORMAS.viscosidad40C.unidad}
						norma={NORMAS.viscosidad40C.norma}
					/>
				</div>
			</div>
			<div style={{...aviso, marginTop: 30, fontSize: 26, color: tema.suave, lineHeight: 1.4}}>
				Para comparar con un aceite vegetal sin transformar: su viscosidad a 40 °C es de ≈ 30–35 mm²/s, unas 10 veces mayor. Esa reducción es el objetivo de la transesterificación.
				{resultados.ilustrativos ? (
					<div style={{color: tema.acento, marginTop: 10}}>* Valores ilustrativos: sustitúyalos por las mediciones de su grupo.</div>
				) : null}
			</div>
		</Escena>
	);
};
