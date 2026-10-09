"""
ANOVA de dos vías (diseño factorial 3x3 con n = 3 réplicas, efectos fijos)
Caso: rendimiento de ésteres metílicos (FAME, %) en la transesterificación
de aceite vegetal según catalizador (A) y temperatura (B).

Genera ../src/data/resultados.json, que alimenta el video de Remotion.
Requiere: numpy, pandas, scipy, statsmodels
Uso:  python anova_biodiesel.py
"""
import json
from pathlib import Path

import numpy as np
import pandas as pd
from scipy import stats
import statsmodels.api as sm
import statsmodels.formula.api as smf
from statsmodels.stats.multicomp import pairwise_tukeyhsd

AQUI = Path(__file__).resolve().parent
SALIDA = AQUI.parent / "src" / "data" / "resultados.json"
CSV = AQUI / "datos_biodiesel.csv"

CATALIZADORES = ["KOH", "NaOH", "CH3ONa"]
TEMPERATURAS = [50, 60, 70]
N_REP = 3

# Medias "verdaderas" de cada celda (escenario simulado con interacción A×B)
MU = {
    ("KOH", 50): 88.6, ("KOH", 60): 92.9, ("KOH", 70): 94.1,
    ("NaOH", 50): 85.3, ("NaOH", 60): 90.2, ("NaOH", 70): 91.4,
    ("CH3ONa", 50): 91.2, ("CH3ONa", 60): 96.4, ("CH3ONa", 70): 93.1,
}
SIGMA = 0.8


def simular() -> pd.DataFrame:
    rng = np.random.default_rng(20261009)
    filas = []
    for cat in CATALIZADORES:
        for t in TEMPERATURAS:
            for r in range(1, N_REP + 1):
                y = round(MU[(cat, t)] + rng.normal(0, SIGMA), 1)
                filas.append({"catalizador": cat, "temperatura": t, "replica": r, "rendimiento": y})
    df = pd.DataFrame(filas)
    # Orden de corrida completamente aleatorizado (documentado en el CSV)
    df["orden_corrida"] = rng.permutation(len(df)) + 1
    return df


def main() -> None:
    df = simular()
    df.to_csv(CSV, index=False)
    df["A"] = pd.Categorical(df["catalizador"], CATALIZADORES)
    df["B"] = pd.Categorical(df["temperatura"].astype(str), [str(t) for t in TEMPERATURAS])

    # Contrastes de suma cero: imprescindibles para SC tipo III interpretables
    modelo = smf.ols("rendimiento ~ C(A, Sum) * C(B, Sum)", data=df).fit()
    tabla = sm.stats.anova_lm(modelo, typ=3)
    tabla2 = sm.stats.anova_lm(modelo, typ=2)
    tabla1 = sm.stats.anova_lm(modelo, typ=1)

    nombres = {"C(A, Sum)": "A", "C(B, Sum)": "B", "C(A, Sum):C(B, Sum)": "AB", "Residual": "E"}
    t = tabla.rename(index=nombres)
    ss_e, df_e = t.loc["E", "sum_sq"], t.loc["E", "df"]
    ms_e = ss_e / df_e
    ss_tot = float(((df["rendimiento"] - df["rendimiento"].mean()) ** 2).sum())

    filas = []
    for k in ["A", "B", "AB"]:
        ss, gl, F, p = (float(t.loc[k, c]) for c in ["sum_sq", "df", "F", "PR(>F)"])
        eta_p = ss / (ss + ss_e)
        omega_p = (gl * (ss / gl - ms_e)) / (gl * (ss / gl - ms_e) + len(df) * ms_e)
        filas.append({"fuente": k, "ss": ss, "gl": gl, "ms": ss / gl, "F": F, "p": p,
                      "eta2p": eta_p, "omega2p": omega_p, "eta2": ss / ss_tot})
    filas.append({"fuente": "E", "ss": float(ss_e), "gl": float(df_e), "ms": float(ms_e)})
    filas.append({"fuente": "T", "ss": ss_tot, "gl": float(len(df) - 1)})

    # Concordancia tipo I = II = III en diseño balanceado
    tipos_iguales = bool(np.allclose(
        tabla1.loc[tabla1.index != "Residual", "sum_sq"].values,
        tabla.loc[["C(A, Sum)", "C(B, Sum)", "C(A, Sum):C(B, Sum)"], "sum_sq"].values))

    medias = (df.groupby(["catalizador", "temperatura"])["rendimiento"]
                .agg(["mean", "std"]).reset_index())
    celdas = [{"cat": r.catalizador, "temp": int(r.temperatura), "media": float(r["mean"]),
               "de": float(r["std"])} for _, r in medias.iterrows()]

    # Supuestos (sobre residuales del modelo completo)
    res = modelo.resid.values
    ajust = modelo.fittedvalues.values
    sw = stats.shapiro(res)
    grupos = [g["rendimiento"].values for _, g in df.groupby(["catalizador", "temperatura"])]
    bf = stats.levene(*grupos, center="median")  # Brown–Forsythe
    # Q-Q: cuantiles teóricos (posiciones de Blom) vs residuales estandarizados internos
    infl = modelo.get_influence()
    r_std = infl.resid_studentized_internal
    orden = np.argsort(r_std)
    n = len(r_std)
    teor = stats.norm.ppf((np.arange(1, n + 1) - 0.375) / (n + 0.25))
    qq = [{"teorico": float(teor[i]), "observado": float(r_std[orden[i]])} for i in range(n)]
    resid_vs_ajust = [{"ajustado": float(a), "residual": float(r)} for a, r in zip(ajust, res)]

    # Efectos simples de A dentro de cada nivel de B (usando MS_E agrupado del modelo completo)
    efectos_simples = []
    for temp in TEMPERATURAS:
        sub = df[df["temperatura"] == temp]
        mg = sub["rendimiento"].mean()
        ss = float(sum(N_REP * (sub[sub["catalizador"] == c]["rendimiento"].mean() - mg) ** 2
                       for c in CATALIZADORES))
        gl = len(CATALIZADORES) - 1
        F = (ss / gl) / ms_e
        p = float(stats.f.sf(F, gl, df_e))
        efectos_simples.append({"temp": temp, "ss": ss, "gl": gl, "F": float(F), "p": p})

    # Tukey HSD de catalizadores dentro de 60 °C con MS_E agrupado
    q_crit = float(stats.studentized_range.ppf(0.95, len(CATALIZADORES), df_e))
    hsd = q_crit * np.sqrt(ms_e / N_REP)
    m60 = {c["cat"]: c["media"] for c in celdas if c["temp"] == 60}
    tukey60 = []
    for i, c1 in enumerate(CATALIZADORES):
        for c2 in CATALIZADORES[i + 1:]:
            d = m60[c1] - m60[c2]
            q = abs(d) / np.sqrt(ms_e / N_REP)
            p = float(stats.studentized_range.sf(q, len(CATALIZADORES), df_e))
            tukey60.append({"par": f"{c1} – {c2}", "dif": float(d), "p": p,
                            "signif": bool(abs(d) > hsd)})

    # Potencia a posteriori NO se reporta (Hoenig & Heisey, 2001); se calcula potencia
    # prospectiva para detectar f de Cohen = 0.40 en la interacción (gl = 4, 18)
    f_cohen = 0.40
    lam = f_cohen ** 2 * len(df)
    gl_ab = (len(CATALIZADORES) - 1) * (len(TEMPERATURAS) - 1)
    f_crit = stats.f.ppf(0.95, gl_ab, df_e)
    potencia = float(stats.ncf.sf(f_crit, gl_ab, df_e, lam))
    n_req = next(m for m in range(2, 50)
                 if stats.ncf.sf(stats.f.ppf(0.95, gl_ab, 9 * (m - 1)), gl_ab, 9 * (m - 1),
                                 f_cohen ** 2 * 9 * m) >= 0.80)

    salida = {
        "factores": {"A": CATALIZADORES, "B": TEMPERATURAS, "n": N_REP, "N": len(df)},
        "datos": df[["catalizador", "temperatura", "replica", "rendimiento", "orden_corrida"]]
                  .to_dict(orient="records"),
        "media_global": float(df["rendimiento"].mean()),
        "medias_A": {c: float(df[df.catalizador == c].rendimiento.mean()) for c in CATALIZADORES},
        "medias_B": {str(tt): float(df[df.temperatura == tt].rendimiento.mean()) for tt in TEMPERATURAS},
        "celdas": celdas,
        "anova": filas,
        "tipos_ss_iguales_balanceado": tipos_iguales,
        "supuestos": {
            "shapiro_W": float(sw.statistic), "shapiro_p": float(sw.pvalue),
            "brown_forsythe_F": float(bf.statistic), "brown_forsythe_p": float(bf.pvalue),
            "qq": qq, "resid_vs_ajust": resid_vs_ajust,
        },
        "efectos_simples_A_en_B": efectos_simples,
        "tukey_60C": {"q_crit": q_crit, "hsd": float(hsd), "pares": tukey60},
        "potencia_prospectiva_AB": {"f": f_cohen, "lambda": lam, "potencia": potencia,
                                    "n_por_celda_para_080": n_req},
        "r2": float(modelo.rsquared), "r2_aj": float(modelo.rsquared_adj),
    }
    SALIDA.parent.mkdir(parents=True, exist_ok=True)
    SALIDA.write_text(json.dumps(salida, indent=2, ensure_ascii=False), encoding="utf-8")

    print(tabla.round(4))
    print("\nTipo II:\n", tabla2.round(4))
    print("\nCeldas:\n", medias.round(3))
    print(f"\nShapiro–Wilk W = {sw.statistic:.4f}, p = {sw.pvalue:.4f}")
    print(f"Brown–Forsythe F = {bf.statistic:.4f}, p = {bf.pvalue:.4f}")
    print("Efectos simples:", efectos_simples)
    print("Tukey 60 °C:", tukey60, "HSD =", hsd)
    print("Potencia prospectiva (f=0.40, AB):", potencia)
    # Comprobación cruzada de Tukey con statsmodels (usa MS_E sólo de 60 °C; puede diferir)
    print(pairwise_tukeyhsd(df[df.temperatura == 60].rendimiento,
                            df[df.temperatura == 60].catalizador))


if __name__ == "__main__":
    main()
