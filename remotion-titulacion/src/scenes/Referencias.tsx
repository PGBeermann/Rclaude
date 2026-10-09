import React from 'react';
import {Escena, useAparicion} from '../components/Escena';
import {tema} from '../theme';

const REFERENCIAS = [
	'Harris, D. C. (2015). Quantitative Chemical Analysis (9.ª ed.). W. H. Freeman. — Titulaciones ácido-base; tratamiento sistemático del equilibrio; indicadores.',
	'Skoog, D. A., West, D. M., Holler, F. J. y Crouch, S. R. (2015). Fundamentos de Química Analítica (9.ª ed.). Cengage Learning.',
	'IUPAC. Compendium of Chemical Terminology (Gold Book): "titration", "equivalence point", "end point". https://goldbook.iupac.org',
	'Remotion — documentación oficial. https://www.remotion.dev/docs',
];

const Item: React.FC<{texto: string; i: number}> = ({texto, i}) => {
	const estilo = useAparicion(10 + i * 12);
	return (
		<li style={{...estilo, marginBottom: 26, lineHeight: 1.35}}>
			{texto}
		</li>
	);
};

export const Referencias: React.FC = () => (
	<Escena titulo="Referencias">
		<ol style={{fontSize: 32, paddingLeft: 40, maxWidth: 1650}}>
			{REFERENCIAS.map((r, i) => (
				<Item key={r} texto={r} i={i} />
			))}
		</ol>
		<div style={{position: 'absolute', bottom: 60, right: 90, fontSize: 24, color: tema.textoSuave}}>
			Curva de pH calculada por balance de carga exacto · Kw = 1,0 × 10⁻¹⁴ (25 °C)
		</div>
	</Escena>
);
