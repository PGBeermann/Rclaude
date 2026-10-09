// Configuración de la CLI de Remotion.
// https://www.remotion.dev/docs/config
import {Config} from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
Config.setOverwriteOutput(true);
Config.setCodec('h264');
// Calidad visual constante (menor = mejor calidad; 18 es casi sin pérdidas).
Config.setCrf(18);
