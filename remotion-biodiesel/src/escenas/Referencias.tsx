import React from 'react';
import {tema} from '../tema';
import {Escena, useAparicion} from '../ui/Escena';

const REFS = [
	'Freedman, B., Pryde, E. H. y Mounts, T. L. (1984). Variables affecting the yields of fatty esters from transesterified vegetable oils. J. Am. Oil Chem. Soc., 61(10), 1638–1643.',
	'Ma, F. y Hanna, M. A. (1999). Biodiesel production: a review. Bioresource Technology, 70(1), 1–15.',
	'Canakci, M. y Van Gerpen, J. (2001). Biodiesel production from oils and fats with high free fatty acids. Transactions of the ASAE, 44(6), 1429–1436.',
	'Meher, L. C., Vidya Sagar, D. y Naik, S. N. (2006). Technical aspects of biodiesel production by transesterification—a review. Renew. Sustain. Energy Rev., 10(3), 248–268.',
	'Knothe, G., Krahl, J. y Van Gerpen, J. (eds.) (2010). The Biodiesel Handbook (2.ª ed.). AOCS Press.',
	'ASTM D6751 — Standard Specification for Biodiesel Fuel Blend Stock (B100). EN 14214 — FAME for diesel engines.',
	'AOCS Official Method Ca 5a-40: Free Fatty Acids. PubChem: Methanol (CID 887), Sodium hydroxide (CID 14798).',
];

const Item: React.FC<{texto: string; i: number}> = ({texto, i}) => {
	const e = useAparicion(8 + i * 10);
	return <li style={{...e, marginBottom: 16, lineHeight: 1.3}}>{texto}</li>;
};

export const Referencias: React.FC = () => {
	const t = useAparicion(0);
	return (
		<Escena style={{justifyContent: 'center', padding: '50px 80px'}}>
			<div style={{...t, fontSize: 54, fontWeight: 800, borderLeft: `10px solid ${tema.acento}`, paddingLeft: 22, marginBottom: 30}}>Referencias</div>
			<ol style={{fontSize: 27, paddingLeft: 36}}>
				{REFS.map((r, i) => (
					<Item key={r} texto={r} i={i} />
				))}
			</ol>
			<div style={{position: 'absolute', bottom: 40, right: 80, fontSize: 22, color: tema.suave}}>Video generado con Remotion (React) · remotion.dev</div>
		</Escena>
	);
};
