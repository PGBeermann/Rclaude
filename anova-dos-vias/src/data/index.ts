import raw from "./resultados.json";

export type FilaAnova = {
  fuente: "A" | "B" | "AB" | "E" | "T";
  ss: number;
  gl: number;
  ms?: number;
  F?: number;
  p?: number;
  eta2p?: number;
  omega2p?: number;
  eta2?: number;
};

export const R = raw as typeof raw & { anova: FilaAnova[] };

export const fila = (f: FilaAnova["fuente"]) => R.anova.find((r) => r.fuente === f)!;

export const media = (cat: string, temp: number) =>
  R.celdas.find((c) => c.cat === cat && c.temp === temp)!.media;
