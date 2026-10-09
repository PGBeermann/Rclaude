/** Formato numérico con punto decimal (convención usada en Panamá) */
export const num = (x: number, d = 2) => x.toFixed(d);

export const pval = (p: number) => (p < 0.001 ? "< 0.001" : num(p, 3));
