import {getAudioDurationInSeconds} from '@remotion/media-utils';
import {staticFile} from 'remotion';
import {ENTRADA_VOZ, MARGEN_FINAL, NARRACION} from './narracion';
import {BiodieselProps} from './schema';
import {FPS, GUION} from './tema';

/**
 * Ajusta la duración de cada escena a su narración: la escena dura lo que diga el guion
 * o lo que tarde la voz (más entrada y margen), lo que sea mayor. Si falta una pista,
 * esa escena conserva su duración y queda sin audio.
 */
export const calcularTiempos = async (props: BiodieselProps) => {
	const resultados = await Promise.all(
		NARRACION.map(async ({clave, archivo}) => {
			const base = GUION[clave];
			if (!props.narracion) return {duracion: base, audio: false};
			try {
				const voz = await getAudioDurationInSeconds(staticFile(`narracion/${archivo}`));
				return {duracion: Math.max(base, ENTRADA_VOZ + voz + MARGEN_FINAL), audio: true};
			} catch {
				console.warn(`Narración no encontrada: public/narracion/${archivo}. La escena queda sin voz.`);
				return {duracion: base, audio: false};
			}
		}),
	);
	const duraciones = resultados.map((r) => Math.ceil(r.duracion * FPS) / FPS);
	return {
		durationInFrames: Math.round(duraciones.reduce((a, b) => a + b, 0) * FPS),
		props: {...props, tiempos: {duraciones, audio: resultados.map((r) => r.audio)}},
	};
};
