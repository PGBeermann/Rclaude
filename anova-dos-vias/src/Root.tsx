import React from "react";
import { Composition } from "remotion";
import { AnovaDosVias, DURACION_TOTAL, ESCENAS } from "./Video";
import { FPS } from "./theme";

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="AnovaDosVias" component={AnovaDosVias} durationInFrames={DURACION_TOTAL} fps={FPS} width={1920} height={1080} />
    {/* Composiciones individuales para revisar/editar cada escena en Remotion Studio */}
    {ESCENAS.map(({ C, s }, i) => (
      <Composition key={i} id={`Escena-${String(i).padStart(2, "0")}`} component={C} durationInFrames={s * FPS} fps={FPS} width={1920} height={1080} />
    ))}
  </>
);
