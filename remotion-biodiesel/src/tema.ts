export const tema = {
	fondo: '#0f1f17',
	fondo2: '#163626',
	panel: 'rgba(255,255,255,0.06)',
	borde: 'rgba(255,255,255,0.16)',
	texto: '#f8fafc',
	suave: '#a3b8ad',
	acento: '#facc15', // amarillo biodiésel
	acento2: '#4ade80', // verde
	agua: 'rgba(56, 189, 248, 0.45)',
	aguaFuerte: '#38bdf8',
	peligro: '#f87171',
	vidrio: 'rgba(226, 240, 255, 0.85)',
	aceite: 'rgba(214, 160, 40, 0.88)',
	biodiesel: 'rgba(250, 214, 80, 0.85)',
	glicerol: 'rgba(120, 62, 22, 0.92)',
	metanol: 'rgba(220, 235, 255, 0.35)',
	fuente: '"Inter", "Segoe UI", "Helvetica Neue", Arial, sans-serif',
	mono: '"JetBrains Mono", "DejaVu Sans Mono", Consolas, monospace',
};

export const FPS = 30;

/** Guion: duración de cada escena en segundos. */
export const GUION = {
	portada: 5,
	fundamento: 11,
	materiales: 10,
	seguridad: 8,
	calculos: 11,
	metoxido: 9,
	montaje: 12,
	reflujo: 14,
	separacion: 12,
	lavado: 10,
	resultados: 11,
	referencias: 9,
} as const;

export const duracionTotal = () => Object.values(GUION).reduce((a, b) => a + b, 0) * FPS;
