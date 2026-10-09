import React from 'react';
import {tema} from '../tema';
import {Escena, useAparicion} from '../ui/Escena';

const Tarjeta: React.FC<{icono: string; titulo: string; texto: string; retraso: number}> = ({icono, titulo, texto, retraso}) => {
	const e = useAparicion(retraso);
	return (
		<div style={{...e, background: 'rgba(248,113,113,0.08)', border: `2px solid rgba(248,113,113,0.5)`, borderRadius: 20, padding: 40, display: 'flex', gap: 24}}>
			<div style={{fontSize: 76, lineHeight: 1}}>{icono}</div>
			<div>
				<div style={{fontSize: 40, fontWeight: 800, color: tema.peligro, marginBottom: 8}}>{titulo}</div>
				<div style={{fontSize: 32, lineHeight: 1.4}}>{texto}</div>
			</div>
		</div>
	);
};

export const Seguridad: React.FC = () => {
	const t = useAparicion(0);
	return (
		<Escena style={{justifyContent: 'center', padding: '50px 70px'}}>
			<div style={{...t, fontSize: 54, fontWeight: 800, borderLeft: `10px solid ${tema.peligro}`, paddingLeft: 22, marginBottom: 34}}>
				Seguridad antes de empezar
			</div>
			<div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28}}>
				<Tarjeta retraso={10} icono="☠" titulo="Metanol" texto="Tóxico por ingestión, inhalación y contacto con la piel. Muy inflamable (punto de inflamación ≈ 11 °C). Manipúlelo siempre en la campana." />
				<Tarjeta retraso={35} icono="⚗" titulo="NaOH y metóxido de sodio" texto="Corrosivos: causan quemaduras graves en la piel y los ojos. El NaOH absorbe humedad: péselo rápido y guarde el frasco cerrado." />
				<Tarjeta retraso={60} icono="♨" titulo="Calentamiento" texto="Use solo placa calefactora, nunca mechero. Nunca caliente un sistema cerrado: la boca del condensador queda abierta." />
				<Tarjeta retraso={85} icono="⛑" titulo="EPP y residuos" texto="Gafas de seguridad, guantes de nitrilo y bata. El glicerol crudo y las aguas de lavado contienen metanol y álcali: deséchelos en recipientes rotulados." />
			</div>
		</Escena>
	);
};
