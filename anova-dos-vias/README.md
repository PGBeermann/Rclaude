# ANOVA de dos vías — tutorial en video con Remotion

Tutorial de nivel avanzado (≈ 5 min, 1920×1080, 30 fps) sobre el ANOVA de dos vías con réplicas, ilustrado con un
caso de investigación química: el rendimiento de FAME en la transesterificación según el **catalizador** (KOH, NaOH,
CH₃ONa) y la **temperatura** (50, 60, 70 °C), con un diseño 3 × 3 y *n* = 3.

> Los datos son **simulados** con fines didácticos (semilla `20261009`). Todos los valores que aparecen en pantalla
> provienen de `src/data/resultados.json`, que genera el script de análisis, así que ninguna cifra se escribe a mano.

## Contenido (14 secciones)

| # | Escena | Detalle avanzado tratado |
|---|--------|--------------------------|
| 1 | Caso de investigación | Aleatorización completa, réplica genuina vs. pseudorreplicación |
| 2 | Justificación | Replicación oculta, inflación del error en ANOVA de una vía separados, OFAT |
| 3 | Modelo | Efectos fijos, restricciones de suma cero, hipótesis, modelo de medias de celda |
| 4 | Datos | Estimadores MC, por qué las medias marginales engañan cuando hay interacción |
| 5 | Partición SS | Descomposición ortogonal y grados de libertad (sólo válida con diseño balanceado) |
| 6 | E(MS) | Modelos fijo, aleatorio y mixto (restringido y no restringido): el denominador correcto de F |
| 7 | Tabla ANOVA | F, p, η²ₚ, ω²ₚ, R², equivalencia de SC tipo I/II/III con datos balanceados |
| 8 | Interacción | Interacción ordinal y desordinal, EE agrupado, hipótesis química frente a conclusión estadística |
| 9 | Seguimiento | Efectos simples con MS_E agrupado, Σ SS_{A\|B} = SS_A + SS_AB, Bonferroni, Tukey HSD |
| 10 | Supuestos | Residuales vs. ajustados, Q-Q, Shapiro–Wilk, Brown–Forsythe, límites de las pruebas con n pequeño |
| 11 | Magnitud y potencia | ω²ₚ vs. η²ₚ, η²_G, potencia prospectiva (F no central), crítica de la «potencia observada» |
| 12 | Casos especiales | SC tipo I/II/III con desbalance, `contr.sum`, n = 1 y prueba de no aditividad de Tukey |
| 13 | Reporte | Párrafo modelo para un artículo y lista de verificación |
| 14 | Referencias | Bibliografía con DOI verificable |

`GUION.md` contiene la narración propuesta para cada escena.

## Uso

Requisitos: Node ≥ 18, y Python 3 con `numpy pandas scipy statsmodels` si se quiere regenerar el análisis.

```bash
npm install
npm run dev          # Remotion Studio: vista previa y edición escena por escena
npm run render       # → out/anova-dos-vias.mp4
npm run analisis     # recalcula src/data/resultados.json y analisis/datos_biodiesel.csv
```

Para usar **datos propios**, edite `MU`, `SIGMA` o reemplace `simular()` en `analisis/anova_biodiesel.py` por la
lectura de su CSV (columnas `catalizador, temperatura, replica, rendimiento, orden_corrida`) y vuelva a ejecutar
`npm run analisis`. El video se actualiza solo, aunque los textos interpretativos de las escenas 4, 8 y 9 deben
revisarse a mano si cambia el patrón de los resultados.

La duración de cada escena se ajusta en `src/Video.tsx` (arreglo `ESCENAS`). El orden de las animaciones dentro de
una escena se controla con el parámetro `at` (en segundos) de `<Appear>`.

Las fuentes (Inter y JetBrains Mono) se incluyen mediante `@fontsource`, de modo que el render no necesita acceso a
Internet. En un VPS sin Chrome, Remotion descarga Chrome Headless Shell la primera vez; también puede indicarse un
Chromium local con `--browser-executable=/ruta/a/chrome`.

## Narración con ElevenLabs

El texto que se envía a síntesis de voz está en `narracion/escena-XX.txt`. Es el guion de `GUION.md` reescrito
tal como debe leerse: los símbolos aparecen en palabras («cuadrado medio del error», «grados Celsius», «p menor que
cero punto cero cero uno») y se omiten las citas entre paréntesis.

```bash
export ELEVENLABS_API_KEY="sk_..."      # clave de su cuenta de ElevenLabs
npm run voz                             # genera public/voz/escena-XX.mp3 y src/data/voz.json
npm run render                          # el video ya incluye la narración
```

- **Voz por defecto:** «David – Clear, Warm and Patient» (español latinoamericano, `dQ0C8BEdKF2odmELvNee`), con el
  modelo `eleven_multilingual_v2`. Se cambian con las variables `ELEVENLABS_VOICE_ID` y `ELEVENLABS_MODEL_ID`.
- **Duración automática:** cada escena dura lo que indique `src/Video.tsx` o lo que necesite su narración
  (0.6 s de entrada + clip + 1.2 s de pausa), lo que sea mayor.
- **Regenerar un clip:** `python3 narracion/generar_voz.py --solo 06`. Para regenerar todos, use `--forzar`.
- **Clips propios:** si genera o graba los audios por otro medio (por ejemplo, desde la web de ElevenLabs),
  guárdelos como `public/voz/escena-00.mp3` … `escena-14.mp3` y ejecute `npm run voz` sin clave; el script solo
  mide las duraciones.
- Si `src/data/voz.json` está vacío (`{}`), el video se renderiza sin voz.

## Verificación cruzada en R

`analisis/anova_biodiesel.R` reproduce la tabla ANOVA (SC tipo I/II/III con `car`), los supuestos y los efectos
simples (`emmeans::joint_tests`) a partir del mismo CSV.

## Estructura

```
analisis/            Python (genera resultados) y R (verificación)
src/data/            resultados.json + helpers tipados
src/components/      Scene, Panel, Callout, Appear, Tex (KaTeX)
src/scenes/          Una escena por archivo (Portada, S01…S14)
src/Video.tsx        Secuencia y transiciones
```
