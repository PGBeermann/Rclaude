/**
 * Modelo químico de una titulación ácido monoprótico + base fuerte (25 °C).
 *
 * Se resuelve el balance de carga EXACTO (sin aproximaciones de Henderson-Hasselbalch):
 *
 *   [H+] + [Na+] = [OH-] + [A-]
 *
 * con  [Na+] = Cb·Vb / (Va + Vb)
 *      [A-]  = C_HA · Ka / (Ka + [H+]),   C_HA = Ca·Va / (Va + Vb)
 *      [OH-] = Kw / [H+]
 *
 * f([H+]) es estrictamente creciente en [H+], por lo que se resuelve por bisección
 * sobre log10[H+]. Un ácido fuerte se modela con Ka muy grande (disociación completa).
 *
 * Referencias:
 *  - Harris, D. C. Quantitative Chemical Analysis, 9.ª ed. W. H. Freeman, 2015
 *    (capítulo de titulaciones ácido-base: tratamiento sistemático con balance de carga).
 *  - Skoog, West, Holler y Crouch. Fundamentos de Química Analítica, 9.ª ed. Cengage, 2015.
 */

export const KW = 1.0e-14; // Producto iónico del agua a 25 °C
const KA_ACIDO_FUERTE = 1e10;

export type Indicador = {
	nombre: string;
	/** Intervalo de viraje [pH inferior, pH superior] */
	intervalo: [number, number];
	colorAcido: string;
	colorBasico: string;
};

/**
 * Intervalos de viraje según Harris (tabla de indicadores ácido-base comunes).
 * Los colores son aproximaciones RGB para la animación.
 */
export const INDICADORES = {
	fenolftaleina: {
		nombre: 'Fenolftaleína',
		intervalo: [8.0, 9.6],
		colorAcido: 'rgba(235, 240, 255, 0.55)', // incoloro
		colorBasico: 'rgba(214, 37, 152, 0.85)', // rosa-fucsia
	},
	rojoDeMetilo: {
		nombre: 'Rojo de metilo',
		intervalo: [4.8, 6.0],
		colorAcido: 'rgba(220, 38, 38, 0.85)',
		colorBasico: 'rgba(250, 204, 21, 0.85)',
	},
	azulDeBromotimol: {
		nombre: 'Azul de bromotimol',
		intervalo: [6.0, 7.6],
		colorAcido: 'rgba(234, 179, 8, 0.85)',
		colorBasico: 'rgba(37, 99, 235, 0.85)',
	},
} satisfies Record<string, Indicador>;

export type ClaveIndicador = keyof typeof INDICADORES;

export type Sistema = {
	/** Concentración del ácido (mol/L) */
	ca: number;
	/** Volumen de la alícuota de ácido (mL) */
	va: number;
	/** Ka del ácido; null => ácido fuerte */
	ka: number | null;
	/** Concentración de la base fuerte titulante (mol/L) */
	cb: number;
};

/** pH de la mezcla tras añadir vb mL de base. */
export const calcularPH = (s: Sistema, vb: number): number => {
	const ka = s.ka ?? KA_ACIDO_FUERTE;
	const vt = s.va + vb;
	const cHA = (s.ca * s.va) / vt;
	const cNa = (s.cb * vb) / vt;

	const f = (logH: number) => {
		const h = 10 ** logH;
		return h + cNa - KW / h - (cHA * ka) / (ka + h);
	};

	let lo = -15;
	let hi = 1;
	for (let i = 0; i < 100; i++) {
		const mid = (lo + hi) / 2;
		if (f(mid) > 0) {
			hi = mid;
		} else {
			lo = mid;
		}
	}
	return -(lo + hi) / 2;
};

/** Volumen de equivalencia (mL): Ca·Va = Cb·Veq */
export const volumenEquivalencia = (s: Sistema): number => (s.ca * s.va) / s.cb;

/** Volumen (mL) al que la mezcla alcanza un pH dado (el pH crece monótonamente con Vb). */
export const volumenParaPH = (s: Sistema, phObjetivo: number, vMax: number): number => {
	let lo = 0;
	let hi = vMax;
	if (calcularPH(s, lo) >= phObjetivo) return 0;
	if (calcularPH(s, hi) <= phObjetivo) return vMax;
	for (let i = 0; i < 80; i++) {
		const mid = (lo + hi) / 2;
		if (calcularPH(s, mid) < phObjetivo) {
			lo = mid;
		} else {
			hi = mid;
		}
	}
	return (lo + hi) / 2;
};

export type PuntoCurva = {v: number; ph: number};

/** Muestrea la curva de titulación entre 0 y vMax mL. */
export const curvaTitulacion = (s: Sistema, vMax: number, n = 240): PuntoCurva[] =>
	Array.from({length: n + 1}, (_, i) => {
		const v = (vMax * i) / n;
		return {v, ph: calcularPH(s, v)};
	});

/** Fracción de la forma básica del indicador (0 = color ácido, 1 = color básico). */
export const fraccionBasica = (ind: Indicador, ph: number): number => {
	const pKin = (ind.intervalo[0] + ind.intervalo[1]) / 2;
	// El ancho del intervalo (~2 unidades de pH) corresponde a razones 1:10 y 10:1.
	const pendiente = 2 / (ind.intervalo[1] - ind.intervalo[0]);
	return 1 / (1 + 10 ** (pendiente * (pKin - ph)));
};

const parseRgba = (c: string): number[] => {
	const m = c.match(/[\d.]+/g);
	if (!m) throw new Error(`Color inválido: ${c}`);
	return m.map(Number);
};

/** Interpola el color de la disolución según el pH. */
export const colorDisolucion = (ind: Indicador, ph: number): string => {
	const t = fraccionBasica(ind, ph);
	const a = parseRgba(ind.colorAcido);
	const b = parseRgba(ind.colorBasico);
	const mix = a.map((x, i) => x + (b[i] - x) * t);
	return `rgba(${Math.round(mix[0])}, ${Math.round(mix[1])}, ${Math.round(mix[2])}, ${mix[3].toFixed(3)})`;
};

export type Resumen = {
	veq: number;
	phInicial: number;
	phEquivalencia: number;
	/** Volumen al que el indicador alcanza el punto medio de su viraje (punto final observado) */
	vPuntoFinal: number;
	/** Error de titulación relativo (%) */
	errorRelativo: number;
	/** pH en la semiequivalencia (= pKa para un ácido débil) */
	phSemiequivalencia: number;
};

export const resumirTitulacion = (s: Sistema, ind: Indicador, vMax: number): Resumen => {
	const veq = volumenEquivalencia(s);
	const pKin = (ind.intervalo[0] + ind.intervalo[1]) / 2;
	const vPuntoFinal = volumenParaPH(s, pKin, vMax);
	return {
		veq,
		phInicial: calcularPH(s, 0),
		phEquivalencia: calcularPH(s, veq),
		vPuntoFinal,
		errorRelativo: ((vPuntoFinal - veq) / veq) * 100,
		phSemiequivalencia: calcularPH(s, veq / 2),
	};
};
