/**
 * Renderizado por lotes con la API de Node de Remotion.
 * Empaqueta el proyecto una sola vez y genera un MP4 por cada experimento de data/experimentos.json.
 *
 *   node scripts/render-lote.mjs                 # todos
 *   node scripts/render-lote.mjs acido-acetico   # solo los id que contengan el texto
 *
 * Variables opcionales: BROWSER_EXECUTABLE (ruta a Chrome/Chromium), CONCURRENCY (núm. de pestañas).
 * Docs: https://www.remotion.dev/docs/ssr-node
 */
import {bundle} from '@remotion/bundler';
import {renderMedia, selectComposition} from '@remotion/renderer';
import {mkdir, readFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const filtro = process.argv[2] ?? '';
const experimentos = JSON.parse(await readFile(path.join(raiz, 'data/experimentos.json'), 'utf8')).filter((e) =>
	e.id.includes(filtro),
);

if (experimentos.length === 0) {
	console.error(`Ningún experimento coincide con "${filtro}"`);
	process.exit(1);
}

const browserExecutable = process.env.BROWSER_EXECUTABLE ?? null;
const concurrency = process.env.CONCURRENCY ? Number(process.env.CONCURRENCY) : null;

console.log('Empaquetando proyecto…');
const serveUrl = await bundle({entryPoint: path.join(raiz, 'src/index.ts')});
await mkdir(path.join(raiz, 'out'), {recursive: true});

for (const {id, props} of experimentos) {
	const composition = await selectComposition({serveUrl, id: 'Titulacion', inputProps: props, browserExecutable});
	const salida = path.join(raiz, 'out', `${id}.mp4`);
	console.log(`\n▶ ${id}: ${composition.durationInFrames} fotogramas (${composition.durationInFrames / composition.fps} s)`);
	await renderMedia({
		composition,
		serveUrl,
		codec: 'h264',
		crf: 18,
		outputLocation: salida,
		inputProps: props,
		browserExecutable,
		concurrency,
		onProgress: ({progress}) => process.stdout.write(`\r  ${(progress * 100).toFixed(0)} %`),
	});
	console.log(`\n  ✔ ${path.relative(raiz, salida)}`);
}
