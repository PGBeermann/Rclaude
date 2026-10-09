import React from 'react';
import {tema} from '../tema';
import {Escena, useAparicion} from '../ui/Escena';
import {Formula} from '../ui/Formula';

const Bloque: React.FC<{lineas: string[]; pie: string; color: string}> = ({lineas, pie, color}) => (
	<div style={{textAlign: 'center'}}>
		<div style={{fontFamily: tema.mono, fontSize: 34, lineHeight: 1.5, padding: '14px 22px', border: `2px solid ${color}`, borderRadius: 16}}>
			{lineas.map((l) => (
				<div key={l}>
					<Formula texto={l} />
				</div>
			))}
		</div>
		<div style={{fontSize: 24, color: tema.suave, marginTop: 10}}>{pie}</div>
	</div>
);

export const Fundamento: React.FC = () => {
	const ecuacion = useAparicion(5);
	const flecha = useAparicion(30);
	const productos = useAparicion(50);
	const p1 = useAparicion(110);
	const p2 = useAparicion(150);
	const p3 = useAparicion(190);
	const p4 = useAparicion(230);

	return (
		<Escena style={{justifyContent: 'center', padding: '50px 80px'}}>
			<div style={{fontSize: 54, fontWeight: 800, borderLeft: `10px solid ${tema.acento}`, paddingLeft: 22, marginBottom: 34}}>
				Fundamento: transesterificación catalizada por base
			</div>
			<div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 26}}>
				<div style={ecuacion}>
					<Bloque color={tema.aceite} pie="Triglicérido (aceite)" lineas={['CH2–O–CO–R1', 'CH–O–CO–R2', 'CH2–O–CO–R3']} />
				</div>
				<div style={{...ecuacion, fontSize: 44}}>
					+ 3 <Formula texto="CH3OH" />
				</div>
				<div style={{...flecha, textAlign: 'center', fontSize: 24, color: tema.acento}}>
					<div>
						NaOH (<Formula texto="CH3O^-" />)
					</div>
					<div style={{fontSize: 64, lineHeight: 1}}>⇌</div>
					<div>60 °C, 1 h</div>
				</div>
				<div style={{...productos, fontSize: 44}}>3</div>
				<div style={productos}>
					<Bloque color={tema.biodiesel} pie="Ésteres metílicos (biodiésel)" lineas={['Ri–CO–O–CH3']} />
				</div>
				<div style={{...productos, fontSize: 44}}>+</div>
				<div style={productos}>
					<Bloque color={tema.glicerol} pie="Glicerol" lineas={['CH2–OH', 'CH–OH', 'CH2–OH']} />
				</div>
			</div>
			<ul style={{fontSize: 31, marginTop: 44, lineHeight: 1.4}}>
				<li style={p1}>
					El ion metóxido ataca el carbonilo del éster. Se dan tres etapas consecutivas: triglicérido → diglicérido → monoglicérido → glicerol.
				</li>
				<li style={p2}>
					Todas las etapas son <b>reversibles</b>. Por eso se usa metanol en exceso (6:1 en vez de 3:1), que desplaza el equilibrio (Le Châtelier).
				</li>
				<li style={p3}>
					Reacciones indeseadas: los <b>ácidos grasos libres</b> consumen el catalizador y forman <b>jabón</b>; el <b>agua</b> hidroliza los ésteres.
				</li>
				<li style={{...p4, color: tema.acento}}>
					Por eso el aceite usado debe estar filtrado y seco, y con acidez baja (AGL ≲ 0.5–1 %).
				</li>
			</ul>
		</Escena>
	);
};
