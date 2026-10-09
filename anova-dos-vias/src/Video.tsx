import { fade } from "@remotion/transitions/fade";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import React from "react";
import { FPS } from "./theme";
import { Portada } from "./scenes/Portada";
import { S01Caso } from "./scenes/S01Caso";
import { S02Porque } from "./scenes/S02Porque";
import { S03Modelo } from "./scenes/S03Modelo";
import { S04Datos } from "./scenes/S04Datos";
import { S05Particion } from "./scenes/S05Particion";
import { S06EMS } from "./scenes/S06EMS";
import { S07Tabla } from "./scenes/S07Tabla";
import { S08Interaccion } from "./scenes/S08Interaccion";
import { S09Simples } from "./scenes/S09Simples";
import { S10Supuestos } from "./scenes/S10Supuestos";
import { S11Efecto } from "./scenes/S11Efecto";
import { S12NoBalanceado } from "./scenes/S12NoBalanceado";
import { S13Reporte } from "./scenes/S13Reporte";
import { S14Referencias } from "./scenes/S14Referencias";

/** Duración de cada escena en segundos: ajústela al ritmo de la narración */
export const ESCENAS: { C: React.FC; s: number }[] = [
  { C: Portada, s: 7 },
  { C: S01Caso, s: 20 },
  { C: S02Porque, s: 18 },
  { C: S03Modelo, s: 22 },
  { C: S04Datos, s: 20 },
  { C: S05Particion, s: 22 },
  { C: S06EMS, s: 24 },
  { C: S07Tabla, s: 20 },
  { C: S08Interaccion, s: 22 },
  { C: S09Simples, s: 24 },
  { C: S10Supuestos, s: 22 },
  { C: S11Efecto, s: 22 },
  { C: S12NoBalanceado, s: 22 },
  { C: S13Reporte, s: 22 },
  { C: S14Referencias, s: 16 },
];

export const TRANSICION = 15; // fotogramas

export const DURACION_TOTAL =
  ESCENAS.reduce((acc, e) => acc + e.s * FPS, 0) - TRANSICION * (ESCENAS.length - 1);

export const AnovaDosVias: React.FC = () => (
  <TransitionSeries>
    {ESCENAS.map(({ C, s }, i) => (
      <React.Fragment key={i}>
        <TransitionSeries.Sequence durationInFrames={s * FPS}>
          <C />
        </TransitionSeries.Sequence>
        {i < ESCENAS.length - 1 ? (
          <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: TRANSICION })} />
        ) : null}
      </React.Fragment>
    ))}
  </TransitionSeries>
);
