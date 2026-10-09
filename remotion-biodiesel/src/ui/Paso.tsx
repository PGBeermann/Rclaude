import React from 'react';
import {useVideoConfig} from 'remotion';
import {tema} from '../tema';
import {Escena, useAparicion} from './Escena';

const Item: React.FC<{children: React.ReactNode; retraso: number}> = ({children, retraso}) => {
	const estilo = useAparicion(retraso);
	return (
		<li style={{...estilo, marginBottom: 18, lineHeight: 1.35}}>
			{children}
		</li>
	);
};

type Props = {
	numero?: number;
	total?: number;
	titulo: string;
	/** Visualización (SVG) a la izquierda */
	visual: React.ReactNode;
	/** Viñetas que aparecen escalonadas */
	puntos: React.ReactNode[];
	/** Recuadro inferior opcional (dato clave o precaución) */
	nota?: {tipo: 'dato' | 'precaucion'; texto: React.ReactNode};
	anchoVisual?: number;
};

/** Plantilla de un paso del procedimiento: visual a la izquierda, explicación a la derecha. */
export const Paso: React.FC<Props> = ({numero, total = 6, titulo, visual, puntos, nota, anchoVisual = 860}) => {
	const {fps} = useVideoConfig();
	const cabecera = useAparicion(0);
	const notaEstilo = useAparicion(fps * 1.2 + puntos.length * fps * 0.9);
	const color = nota?.tipo === 'precaucion' ? tema.peligro : tema.acento;

	return (
		<Escena>
			<div style={{display: 'flex', height: '100%', padding: '50px 70px', gap: 50}}>
				<div style={{width: anchoVisual, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{visual}</div>
				<div style={{flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
					<div style={cabecera}>
						{numero ? (
							<div style={{fontSize: 26, color: tema.acento2, fontWeight: 700, letterSpacing: 3}}>
								PASO {numero} DE {total}
							</div>
						) : null}
						<div style={{fontSize: 56, fontWeight: 800, lineHeight: 1.1, margin: '10px 0 34px', borderLeft: `10px solid ${tema.acento}`, paddingLeft: 22}}>
							{titulo}
						</div>
					</div>
					<ul style={{fontSize: 31, paddingLeft: 30, margin: 0}}>
						{puntos.map((p, i) => (
							<Item key={i} retraso={fps * 0.8 + i * fps * 0.9}>
								{p}
							</Item>
						))}
					</ul>
					{nota ? (
						<div
							style={{
								...notaEstilo,
								marginTop: 24,
								fontSize: 28,
								padding: '18px 24px',
								borderRadius: 16,
								border: `2px solid ${color}`,
								background: nota.tipo === 'precaucion' ? 'rgba(248,113,113,0.12)' : 'rgba(250,204,21,0.10)',
							}}
						>
							<b style={{color}}>{nota.tipo === 'precaucion' ? '⚠ Precaución: ' : '● Dato clave: '}</b>
							{nota.texto}
						</div>
					) : null}
				</div>
			</div>
		</Escena>
	);
};
