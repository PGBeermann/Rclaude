import React from 'react';
import {INDICADORES, resumirTitulacion} from '../chem/titulacion';
import {Escena, useAparicion} from '../components/Escena';
import {TitulacionProps} from '../schema';
import {tema} from '../theme';

/** Error de titulación aceptable para un análisis volumétrico de rutina (%). */
const ERROR_ACEPTABLE = 0.5;

const Tarjeta: React.FC<{titulo: string; valor: string; nota?: string; retraso: number; color?: string}> = ({
	titulo,
	valor,
	nota,
	retraso,
	color = tema.texto,
}) => {
	const estilo = useAparicion(retraso);
	return (
		<div style={{...estilo, flex: 1, background: tema.fondoPanel, border: `1px solid ${tema.borde}`, borderRadius: 24, padding: 30}}>
			<div style={{fontSize: 26, color: tema.textoSuave}}>{titulo}</div>
			<div style={{fontSize: 64, fontWeight: 800, fontFamily: tema.fuenteMono, color, margin: '10px 0'}}>{valor}</div>
			{nota ? <div style={{fontSize: 24, color: tema.textoSuave}}>{nota}</div> : null}
		</div>
	);
};

export const Resultados: React.FC<TitulacionProps> = (props) => {
	const {acido, base} = props;
	const indicador = INDICADORES[props.indicador];
	const sistema = {ca: acido.concentracion, va: acido.volumen, ka: acido.ka, cb: base.concentracion};
	const veqBase = (sistema.ca * sistema.va) / sistema.cb;
	const r = resumirTitulacion(sistema, indicador, veqBase * 2);
	const adecuado = Math.abs(r.errorRelativo) <= ERROR_ACEPTABLE;
	const veredicto = useAparicion(110);

	return (
		<Escena titulo="Resultados y elección del indicador">
			<div style={{display: 'flex', gap: 30}}>
				<Tarjeta retraso={5} titulo="pH inicial" valor={r.phInicial.toFixed(2)} />
				<Tarjeta retraso={15} titulo="Volumen de equivalencia" valor={`${r.veq.toFixed(2)} mL`} color={tema.acento} />
				<Tarjeta
					retraso={25}
					titulo="pH en la equivalencia"
					valor={r.phEquivalencia.toFixed(2)}
					nota={acido.ka === null ? 'Sal neutra: pH = 7' : 'La base conjugada A⁻ hidroliza: pH > 7'}
					color={tema.acento2}
				/>
			</div>
			<div style={{display: 'flex', gap: 30, marginTop: 30}}>
				{acido.ka !== null ? (
					<Tarjeta
						retraso={45}
						titulo="pH en la semiequivalencia"
						valor={r.phSemiequivalencia.toFixed(2)}
						nota={`≈ pKa = ${(-Math.log10(acido.ka)).toFixed(2)}  ([HA] = [A⁻])`}
					/>
				) : null}
				<Tarjeta
					retraso={55}
					titulo={`Punto final con ${indicador.nombre.toLowerCase()}`}
					valor={`${r.vPuntoFinal.toFixed(2)} mL`}
					nota={`pH de viraje ≈ ${((indicador.intervalo[0] + indicador.intervalo[1]) / 2).toFixed(1)}`}
				/>
				<Tarjeta
					retraso={65}
					titulo="Error de titulación"
					valor={`${r.errorRelativo >= 0 ? '+' : ''}${r.errorRelativo.toFixed(2)} %`}
					nota="(V punto final − V eq) / V eq"
					color={adecuado ? tema.ok : tema.error}
				/>
			</div>
			<div
				style={{
					...veredicto,
					marginTop: 40,
					fontSize: 38,
					fontWeight: 700,
					padding: '24px 34px',
					borderRadius: 20,
					background: adecuado ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)',
					border: `2px solid ${adecuado ? tema.ok : tema.error}`,
				}}
			>
				{adecuado
					? `✔ ${indicador.nombre} es adecuado: su viraje coincide con el salto de pH en la equivalencia.`
					: `✘ ${indicador.nombre} NO es adecuado: vira lejos del pH de equivalencia (${r.phEquivalencia.toFixed(2)}).`}
			</div>
		</Escena>
	);
};
