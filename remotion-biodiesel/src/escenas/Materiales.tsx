import React from 'react';
import {useVideoConfig} from 'remotion';
import {BiodieselProps} from '../schema';
import {calcularReceta} from '../quimica/estequiometria';
import {tema} from '../tema';
import {Escena, useAparicion} from '../ui/Escena';
import {Formula} from '../ui/Formula';

const Columna: React.FC<{titulo: string; color: string; items: React.ReactNode[]; retraso: number}> = ({titulo, color, items, retraso}) => {
	const {fps} = useVideoConfig();
	const cab = useAparicion(retraso);
	return (
		<div style={{flex: 1, background: tema.panel, border: `1px solid ${tema.borde}`, borderTop: `8px solid ${color}`, borderRadius: 20, padding: '24px 30px'}}>
			<div style={{...cab, fontSize: 38, fontWeight: 800, color, marginBottom: 14}}>{titulo}</div>
			{items.map((it, i) => (
				<Fila key={i} retraso={retraso + 8 + i * Math.round(fps * 0.22)}>
					{it}
				</Fila>
			))}
		</div>
	);
};

const Fila: React.FC<{children: React.ReactNode; retraso: number}> = ({children, retraso}) => {
	const e = useAparicion(retraso, 12);
	return <div style={{...e, fontSize: 31, padding: '12px 0', borderBottom: `1px solid ${tema.borde}`, lineHeight: 1.3}}>{children}</div>;
};

export const Materiales: React.FC<BiodieselProps> = ({receta}) => {
	const r = calcularReceta(receta);
	const titulo = useAparicion(0);
	return (
		<Escena style={{justifyContent: 'center', padding: '50px 70px'}}>
			<div style={{...titulo, fontSize: 54, fontWeight: 800, borderLeft: `10px solid ${tema.acento}`, paddingLeft: 22, marginBottom: 30}}>
				Materiales, equipos y reactivos
			</div>
			<div style={{display: 'flex', gap: 30}}>
				<Columna
					titulo="Kit de orgánica Corning (Pyrex®)"
					color={tema.aguaFuerte}
					retraso={10}
					items={[
						'Balón de fondo redondo, 100 mL',
						'Condensador de bolas (Allihn)',
						'Embudo de separación, 125 mL',
						'Erlenmeyer de 50 mL',
						'Probetas de 25 mL y 100 mL',
						'Juntas esmeriladas estándar (ST 19/22 o 14/20, según el modelo del kit)',
					]}
				/>
				<Columna
					titulo="Equipos"
					color={tema.acento2}
					retraso={60}
					items={[
						'Placa calefactora con agitación y barra magnética',
						'Soporte universal, pinzas de 3 dedos, aro metálico',
						'Cristalizador para baño de agua y termómetro',
						'Balanza (±0.01 g) y mangueras de látex',
						'Campana de extracción',
					]}
				/>
				<Columna
					titulo="Reactivos"
					color={tema.acento}
					retraso={110}
					items={[
						<>Aceite de cocina usado, filtrado y seco: <b>{receta.masaAceite} g</b></>,
						<>Metanol anhidro: <b>{r.volumenMetanol.toFixed(1)} mL</b></>,
						<>NaOH en lentejas: <b>{r.NaOHtotal.toFixed(2)} g</b></>,
						'Agua destilada tibia para el lavado',
						<>
							<Formula texto="Na2SO4" /> anhidro (secante)
						</>,
						'Isopropanol, NaOH 0.1 M y fenolftaleína (para la acidez)',
					]}
				/>
			</div>
		</Escena>
	);
};
