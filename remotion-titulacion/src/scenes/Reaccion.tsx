import React from 'react';
import {INDICADORES, volumenEquivalencia} from '../chem/titulacion';
import {Escena, useAparicion} from '../components/Escena';
import {Formula} from '../components/Formula';
import {TitulacionProps} from '../schema';
import {tema} from '../theme';

const Fila: React.FC<{etiqueta: string; valor: React.ReactNode; retraso: number}> = ({etiqueta, valor, retraso}) => {
	const estilo = useAparicion(retraso);
	return (
		<div style={{...estilo, display: 'flex', justifyContent: 'space-between', padding: '14px 0', borderBottom: `1px solid ${tema.borde}`}}>
			<span style={{color: tema.textoSuave}}>{etiqueta}</span>
			<span style={{fontWeight: 700}}>{valor}</span>
		</div>
	);
};

export const Reaccion: React.FC<TitulacionProps> = (props) => {
	const {acido, base, ecuacionNeta, indicador} = props;
	const veq = volumenEquivalencia({ca: acido.concentracion, va: acido.volumen, ka: acido.ka, cb: base.concentracion});
	const ecuacion = useAparicion(5);
	const estequiometria = useAparicion(75);

	return (
		<Escena titulo="Reacción y datos experimentales">
			<div style={{...ecuacion, fontSize: 64, textAlign: 'center', padding: '30px 0', background: tema.fondoPanel, borderRadius: 24}}>
				<Formula texto={ecuacionNeta} />
			</div>
			<div style={{display: 'flex', gap: 60, marginTop: 40, fontSize: 34}}>
				<div style={{flex: 1}}>
					<Fila retraso={20} etiqueta="Analito" valor={<>{acido.nombre} (<Formula texto={acido.formula} />)</>} />
					<Fila retraso={28} etiqueta="Concentración del ácido" valor={`${acido.concentracion.toFixed(4)} mol/L`} />
					<Fila retraso={36} etiqueta="Alícuota" valor={`${acido.volumen.toFixed(2)} mL`} />
					<Fila
						retraso={44}
						etiqueta="Fuerza del ácido"
						valor={acido.ka === null ? 'Fuerte (disociación completa)' : `Ka = ${acido.ka.toExponential(2)}  (pKa = ${(-Math.log10(acido.ka)).toFixed(2)})`}
					/>
				</div>
				<div style={{flex: 1}}>
					<Fila retraso={52} etiqueta="Titulante" valor={<>{base.nombre} (<Formula texto={base.formula} />)</>} />
					<Fila retraso={60} etiqueta="Concentración de la base" valor={`${base.concentracion.toFixed(4)} mol/L`} />
					<Fila retraso={68} etiqueta="Indicador" valor={INDICADORES[indicador].nombre} />
				</div>
			</div>
			<div style={{...estequiometria, marginTop: 50, fontSize: 40, textAlign: 'center', fontFamily: tema.fuenteMono}}>
				C<sub>a</sub>·V<sub>a</sub> = C<sub>b</sub>·V<sub>eq</sub>
				<span style={{color: tema.textoSuave}}>  ⇒  </span>
				V<sub>eq</sub> = ({acido.concentracion} × {acido.volumen}) / {base.concentracion} ={' '}
				<span style={{color: tema.acento, fontWeight: 800}}>{veq.toFixed(2)} mL</span>
			</div>
		</Escena>
	);
};
