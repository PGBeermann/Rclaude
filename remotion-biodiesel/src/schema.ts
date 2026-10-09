import {z} from 'zod';

export const biodieselSchema = z.object({
	institucion: z.string(),
	curso: z.string(),
	titulo: z.string(),
	subtitulo: z.string(),
	receta: z.object({
		masaAceite: z.number().positive().describe('g de aceite usado filtrado'),
		densidadAceite: z.number().positive().describe('g/mL'),
		masaMolarAceite: z.number().positive().describe('g/mol, triglicérido medio'),
		relacionMolar: z.number().min(3).describe('mol MeOH / mol aceite'),
		catalizadorPct: z.number().positive().describe('% m/m NaOH'),
		aglPct: z.number().min(0).describe('% ácidos grasos libres (como oleico)'),
	}),
	condiciones: z.object({
		temperaturaBano: z.number().describe('°C'),
		tiempoReflujoMin: z.number().positive(),
		tiempoDecantacionMin: z.number().positive(),
	}),
	/** Incluir la narración (pistas en public/narracion/). */
	narracion: z.boolean(),
	/** Calculado por calculateMetadata: duración (s) de cada escena y si su pista de audio existe. No editar. */
	tiempos: z
		.object({duraciones: z.array(z.number()), audio: z.array(z.boolean())})
		.optional(),
	/** Mediciones del grupo. Los valores por defecto son ILUSTRATIVOS. */
	resultados: z.object({
		masaBiodiesel: z.number().positive().describe('g obtenidos tras lavado y secado'),
		densidad: z.number().positive().describe('g/cm³ a 15 °C'),
		viscosidad: z.number().positive().describe('mm²/s a 40 °C'),
		ilustrativos: z.boolean(),
	}),
});

export type BiodieselProps = z.infer<typeof biodieselSchema>;
