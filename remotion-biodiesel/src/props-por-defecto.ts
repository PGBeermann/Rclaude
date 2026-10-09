import {BiodieselProps} from './schema';

export const propsPorDefecto: BiodieselProps = {
	institucion: 'Departamento de Química',
	curso: 'Laboratorio de Química Orgánica',
	titulo: 'Biodiésel a partir de aceite de cocina usado',
	subtitulo: 'Transesterificación básica con sistema de reflujo · kit de orgánica Corning',
	receta: {
		masaAceite: 40,
		densidadAceite: 0.92,
		masaMolarAceite: 875,
		relacionMolar: 6,
		catalizadorPct: 1.0,
		aglPct: 0.5,
	},
	condiciones: {temperaturaBano: 62, tiempoReflujoMin: 60, tiempoDecantacionMin: 60},
	resultados: {masaBiodiesel: 35.6, densidad: 0.881, viscosidad: 4.5, ilustrativos: true},
};
