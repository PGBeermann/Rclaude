import {z} from 'zod';

/**
 * Esquema de las "props" del video. Remotion Studio genera un formulario editable
 * a partir de él, y la CLI/renderizador valida cualquier JSON pasado con --props.
 */
export const titulacionSchema = z.object({
	institucion: z.string(),
	curso: z.string(),
	titulo: z.string(),
	autor: z.string(),
	acido: z.object({
		nombre: z.string(),
		formula: z.string(),
		concentracion: z.number().positive().describe('mol/L'),
		volumen: z.number().positive().describe('mL de alícuota'),
		ka: z.number().positive().nullable().describe('null = ácido fuerte'),
	}),
	base: z.object({
		nombre: z.string(),
		formula: z.string(),
		concentracion: z.number().positive().describe('mol/L'),
	}),
	/** Ecuación iónica neta. Dígitos tras letra/paréntesis => subíndice; ^+ / ^- => superíndice. */
	ecuacionNeta: z.string(),
	indicador: z.enum(['fenolftaleina', 'rojoDeMetilo', 'azulDeBromotimol']),
	/** Duración de la escena de titulación animada, en segundos. */
	duracionTitulacionSeg: z.number().min(4).max(60),
});

export type TitulacionProps = z.infer<typeof titulacionSchema>;
