/**
 * Estequiometría de la transesterificación de un triglicérido con metanol:
 *
 *   TG + 3 CH3OH  ⇌  3 FAME + glicerol      (catalizador: NaOH → CH3O⁻Na⁺)
 *
 * La masa molar media de los ésteres metílicos (FAME) se obtiene por balance de masa:
 *   M(FAME) = [M(TG) − M(glicerol) + 3·M(CH3OH)] / 3
 *
 * Condiciones de referencia: relación molar metanol:aceite 6:1, NaOH ≈ 1 % m/m del aceite,
 * ≈ 60 °C y 1 h (Freedman, Pryde y Mounts, JAOCS 61 (1984) 1638–1643).
 * Los ácidos grasos libres (AGL) consumen catalizador y forman jabón; se añade NaOH
 * extra para neutralizarlos (expresados como ácido oleico).
 */

export const M = {
	metanol: 32.04,
	glicerol: 92.09,
	NaOH: 40.0,
	acidoOleico: 282.46,
};

export const DENSIDAD = {
	metanol: 0.791, // g/mL, 20 °C
	glicerol: 1.261, // g/mL, 20 °C
};

export type Receta = {
	masaAceite: number; // g
	densidadAceite: number; // g/mL
	masaMolarAceite: number; // g/mol (triglicérido medio)
	relacionMolar: number; // mol metanol / mol aceite
	catalizadorPct: number; // % m/m NaOH respecto al aceite
	aglPct: number; // % ácidos grasos libres (como ácido oleico)
};

export const calcularReceta = (r: Receta) => {
	const molAceite = r.masaAceite / r.masaMolarAceite;
	const molMetanol = molAceite * r.relacionMolar;
	const masaMetanol = molMetanol * M.metanol;
	const NaOHcatalizador = (r.masaAceite * r.catalizadorPct) / 100;
	const NaOHneutralizacion = ((r.masaAceite * r.aglPct) / 100) * (M.NaOH / M.acidoOleico);
	const masaMolarFAME = (r.masaMolarAceite - M.glicerol + 3 * M.metanol) / 3;
	return {
		volumenAceite: r.masaAceite / r.densidadAceite,
		molAceite,
		molMetanol,
		masaMetanol,
		volumenMetanol: masaMetanol / DENSIDAD.metanol,
		excesoMetanolPct: (r.relacionMolar / 3 - 1) * 100,
		NaOHcatalizador,
		NaOHneutralizacion,
		NaOHtotal: NaOHcatalizador + NaOHneutralizacion,
		masaMolarFAME,
		masaTeoricaFAME: 3 * molAceite * masaMolarFAME,
		masaTeoricaGlicerol: molAceite * M.glicerol,
		volumenTeoricoGlicerol: (molAceite * M.glicerol) / DENSIDAD.glicerol,
		/** Con AGL > 1 % la catálisis básica forma demasiado jabón: se recomienda esterificación ácida previa. */
		requierePretratamientoAcido: r.aglPct > 1,
	};
};

export type ResultadoReceta = ReturnType<typeof calcularReceta>;

/** Límites normativos para biodiésel B100 (valores de las normas citadas). */
export const NORMAS = {
	densidad15C: {min: 0.86, max: 0.9, unidad: 'g/cm³', norma: 'EN 14214 (15 °C)'},
	viscosidad40C: {min: 1.9, max: 6.0, unidad: 'mm²/s', norma: 'ASTM D6751 (40 °C)'},
	contenidoEster: {min: 96.5, unidad: '% m/m', norma: 'EN 14214'},
};
