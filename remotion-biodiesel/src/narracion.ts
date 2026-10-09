import {GUION} from './tema';

/**
 * Guion de la narración (voz «David», ElevenLabs, modelo eleven_v4, español latinoamericano).
 * Cada pista se coloca en public/narracion/<archivo> y suena al inicio de su escena.
 * Los números se escriben con palabras para que la síntesis de voz los lea bien.
 *
 * Si cambia la receta (props), revise los textos con cifras (escena "calculos")
 * y vuelva a generar esa pista: el audio no se recalcula solo.
 */
export const NARRACION: {clave: keyof typeof GUION; archivo: string; texto: string}[] = [
	{clave: 'portada', archivo: '01-portada.mp3', texto: 'Biodiésel a partir de aceite de cocina usado. Una práctica de química orgánica con sistema de reflujo.'},
	{
		clave: 'fundamento',
		archivo: '02-fundamento.mp3',
		texto:
			'El biodiésel se obtiene por transesterificación. Un triglicérido reacciona con tres moléculas de metanol, en presencia de hidróxido de sodio como catalizador, y produce tres ésteres metílicos y glicerol. La reacción es reversible; por eso usamos metanol en exceso, en relación seis a uno. El agua y los ácidos grasos libres forman jabón, así que el aceite debe estar filtrado y seco.',
	},
	{
		clave: 'materiales',
		archivo: '03-materiales.mp3',
		texto:
			'Usaremos el kit de química orgánica Corning: un balón de fondo redondo de cien mililitros, un condensador de bolas y un embudo de separación. Además, una placa calefactora con agitación, un soporte universal y pinzas. Los reactivos son aceite de cocina usado, metanol anhidro e hidróxido de sodio.',
	},
	{
		clave: 'seguridad',
		archivo: '04-seguridad.mp3',
		texto:
			'Antes de empezar: el metanol es tóxico y muy inflamable, y el hidróxido de sodio es corrosivo. Trabaje en la campana, con gafas, guantes y bata. Caliente solo con placa calefactora, nunca con mechero, y nunca en un sistema cerrado.',
	},
	{
		clave: 'calculos',
		archivo: '05-calculos.mp3',
		texto:
			'Paso uno. Filtre y seque el aceite, y determine su acidez por titulación. Para cuarenta gramos de aceite necesitamos once punto un mililitros de metanol y cero punto cuarenta y tres gramos de hidróxido de sodio. El rendimiento teórico es de unos cuarenta gramos de biodiésel.',
	},
	{
		clave: 'metoxido',
		archivo: '06-metoxido.mp3',
		texto:
			'Paso dos. En la campana, disuelva el hidróxido de sodio en el metanol, con agitación y sin calentar. Se forma metóxido de sodio, el catalizador de la reacción. Mantenga el matraz tapado: el metóxido absorbe humedad.',
	},
	{
		clave: 'montaje',
		archivo: '07-montaje.mp3',
		texto:
			'Paso tres. Coloque el aceite, la barra magnética y el metóxido en el balón. Sujételo por el cuello, monte el condensador en posición vertical y conecte el agua: entra por abajo y sale por arriba. La boca del condensador siempre queda abierta.',
	},
	{
		clave: 'reflujo',
		archivo: '08-reflujo.mp3',
		texto:
			'Paso cuatro. Encienda la agitación y caliente el baño a sesenta y dos grados. El metanol se evapora, se condensa en el tercio inferior del condensador y gotea de vuelta al balón. Así, la reacción continúa durante sesenta minutos sin perder reactivo.',
	},
	{
		clave: 'separacion',
		archivo: '09-separacion.mp3',
		texto:
			'Paso cinco. Pase la mezcla fría al embudo de separación y deje reposar al menos una hora. El glicerol, más denso, se va al fondo. Abra la llave y recójalo, cerrando justo en la interfase.',
	},
	{
		clave: 'lavado',
		archivo: '10-lavado.mp3',
		texto:
			'Paso seis. Lave el biodiésel con agua destilada tibia, invirtiendo el embudo suavemente para no formar emulsiones. Repita hasta que el agua salga clara, y seque con sulfato de sodio anhidro.',
	},
	{
		clave: 'resultados',
		archivo: '11-resultados.mp3',
		texto:
			'Finalmente, pese el producto y calcule el rendimiento. Luego compare su densidad y su viscosidad con los límites de las normas E N catorce mil doscientos catorce y A S T M D seis mil setecientos cincuenta y uno.',
	},
	{clave: 'referencias', archivo: '12-referencias.mp3', texto: 'Estas son las referencias de la práctica. Gracias por su atención.'},
];

/** Retraso de la voz respecto al inicio de cada escena, y margen de silencio al final (s). */
export const ENTRADA_VOZ = 0.6;
export const MARGEN_FINAL = 1.0;
