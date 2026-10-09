import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

/** Entrada suave (opacidad + desplazamiento) a partir de `at` segundos */
export const Appear: React.FC<{
  at?: number;
  dy?: number;
  dx?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ at = 0, dy = 24, dx = 0, children, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - at * fps, fps, config: { damping: 200 }, durationInFrames: 18 });
  return (
    <div
      style={{
        opacity: s,
        transform: `translate(${interpolate(s, [0, 1], [dx, 0])}px, ${interpolate(s, [0, 1], [dy, 0])}px)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** Progreso 0→1 entre dos instantes (s), con suavizado */
export const useProgress = (from: number, to: number) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return interpolate(frame, [from * fps, to * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: (t) => 1 - Math.pow(1 - t, 3),
  });
};
