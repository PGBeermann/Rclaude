import React from 'react';

/**
 * Renderiza notación química con subíndices y superíndices:
 *   "CH3COOH"   -> CH₃COOH
 *   "OH^-"      -> OH⁻
 *   "SO4^2-"    -> SO₄²⁻
 * Los coeficientes estequiométricos al inicio de un término (p. ej. "2H2O") no se subindizan.
 */
export const Formula: React.FC<{texto: string; style?: React.CSSProperties}> = ({texto, style}) => {
	const partes: React.ReactNode[] = [];
	const re = /\^([0-9]*[+-])|(?<=[A-Za-z)\]])(\d+)|([^^\d]+|\d+)/g;
	let m: RegExpExecArray | null;
	let k = 0;
	while ((m = re.exec(texto)) !== null) {
		if (m[1]) {
			partes.push(<sup key={k++}>{m[1].replace('-', '−')}</sup>);
		} else if (m[2]) {
			partes.push(<sub key={k++}>{m[2]}</sub>);
		} else {
			partes.push(<React.Fragment key={k++}>{m[3].replace('->', '→')}</React.Fragment>);
		}
	}
	return <span style={style}>{partes}</span>;
};
