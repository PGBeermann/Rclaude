# Guion de narración — ANOVA de dos vías en investigación química

Duración: ≈ 4 min 56 s (1920×1080, 30 fps). Cada bloque corresponde a una escena de `src/Video.tsx`; si la locución
se alarga, ajuste la duración `s` de esa escena en el arreglo `ESCENAS`. La versión normalizada para síntesis
de voz (ElevenLabs) está en `narracion/escena-XX.txt`; con narración, cada escena se alarga sola para que quepa.

---

### Portada (7 s)
En este tutorial analizaremos un diseño factorial de dos factores con réplicas, el modelo que lo sustenta y las
decisiones que suelen pasarse por alto al aplicarlo a datos experimentales de química.

### 1. Caso de investigación (20 s)
Se estudia la transesterificación de un aceite vegetal. La respuesta es el rendimiento de ésteres metílicos,
cuantificado por GC-FID. El factor A es el catalizador (KOH, NaOH o metóxido de sodio) y el factor B, la temperatura
(50, 60 y 70 °C). Hay tres réplicas por combinación, es decir, 27 reacciones ejecutadas en orden completamente
aleatorizado. Cada réplica es una reacción independiente: reinyectar la misma muestra en el cromatógrafo sería
pseudorreplicación, porque solo mide la variabilidad instrumental (Hurlbert, 1984).

### 2. Justificación (18 s)
El diseño factorial aprovecha la replicación oculta: cada nivel de catalizador se estima con nueve observaciones.
Además, permite estimar la interacción, algo imposible con el enfoque de un factor a la vez, y aporta un único
término de error con 18 grados de libertad. Si se analizan dos ANOVA de una vía por separado, la variación del otro
factor y la de la interacción se suman al error y la prueba pierde potencia.

### 3. Modelo estadístico (22 s)
El modelo de efectos fijos expresa cada observación como la media global más el efecto del catalizador, el de la
temperatura, el de la interacción y un error normal, independiente y homocedástico. Las restricciones de suma cero
hacen el modelo identificable. Las tres hipótesis nulas se refieren a efectos del catalizador, de la temperatura y
de la interacción nulos. De forma equivalente, el modelo de medias de celda define la interacción como un contraste
entre medias de celda.

### 4. Datos (20 s)
La tabla muestra las medias de celda y las medias marginales. El metóxido alcanza 97.5 % a 60 °C, pero a 70 °C
ya no supera a KOH. Cuando hay interacción, las medias marginales promedian patrones distintos y no describen el
comportamiento de ningún catalizador concreto.

### 5. Partición de la variabilidad (22 s)
Con un diseño balanceado, la suma de cuadrados total se descompone de forma ortogonal en las contribuciones de A,
B, la interacción y el error, y los grados de libertad se reparten igual. Aquí la temperatura explica el 49 % de la
variabilidad total, el catalizador el 34 %, la interacción el 13 % y el error menos del 5 %.

### 6. Esperanza de los cuadrados medios (24 s)
Este es el punto que más se suele omitir. El denominador de F se obtiene de las esperanzas de los cuadrados medios.
Si los dos factores son fijos, todas las pruebas usan MS_E. Si la temperatura fuera aleatoria, como ocurre con lotes de
materia prima o laboratorios en un estudio interlaboratorio, el efecto del catalizador se contrasta contra MS_AB, que
solo tiene 4 grados de libertad. Además, el modelo mixto restringido y el no restringido difieren en la prueba del
factor aleatorio, así que el reporte debe indicar cuál se utilizó (Montgomery, 2017, cap. 13).

### 7. Tabla ANOVA (20 s)
Los tres efectos son significativos. En particular, la interacción da F(4, 18) = 12.09, con p < 0.001. Como la
interacción es significativa, los efectos principales no se interpretan de forma aislada. Por tratarse de un
diseño balanceado, las sumas de cuadrados de tipo I, II y III coinciden.

### 8. Gráfico de interacción (22 s)
Los perfiles no son paralelos: KOH y NaOH aumentan con la temperatura, mientras que el metóxido llega al máximo a
60 °C y luego desciende. A 70 °C, KOH y metóxido prácticamente se cruzan, por lo que el ordenamiento de los
catalizadores depende de la temperatura. Las explicaciones químicas, como la pérdida de metanol por encima de su punto
de ebullición, son hipótesis que deben verificarse con otros experimentos, no conclusiones del ANOVA.

### 9. Efectos simples (24 s)
El análisis de seguimiento consiste en evaluar el efecto del catalizador dentro de cada temperatura usando el MS_E
agrupado del modelo completo. La suma de las sumas de cuadrados de los efectos simples es igual a SS_A más SS_AB.
Con la corrección de Bonferroni, el catalizador es significativo a 50 y 60 °C, pero no a 70 °C. La prueba de Tukey
a 60 °C separa los tres catalizadores.

### 10. Supuestos (22 s)
Los supuestos se evalúan sobre los residuales del modelo y no sobre los datos crudos. El gráfico de residuales frente
a valores ajustados no muestra un patrón de embudo, y el gráfico Q-Q es aproximadamente lineal. Con tres réplicas, las
pruebas formales tienen poca potencia, por lo que no rechazar la hipótesis nula no prueba que el supuesto se cumpla.
La independencia depende de la aleatorización. Con rendimientos cercanos al 100 % puede ser conveniente aplicar una
transformación o usar un modelo lineal generalizado.

### 11. Tamaño del efecto y potencia (22 s)
Omega cuadrado parcial corrige el sesgo positivo de eta cuadrado parcial. Para comparar entre diseños conviene usar
eta cuadrado generalizado. Con tres réplicas, la potencia para detectar una interacción grande es apenas del 27 %, y
harían falta nueve réplicas por celda para alcanzar 0.80. No se debe reportar la llamada «potencia observada».

### 12. Casos especiales (22 s)
Si una reacción falla y las celdas quedan desbalanceadas, el tipo de suma de cuadrados importa. Las de tipo I dependen
del orden de los factores, las de tipo II respetan el principio de marginalidad y las de tipo III exigen contrastes
de suma cero. Sin réplicas, la interacción queda confundida con el error y solo puede evaluarse mediante la prueba de
no aditividad de Tukey, con un grado de libertad.

### 13. Reporte (22 s)
Un reporte completo especifica el tipo de modelo, el denominador de cada F, el tamaño del efecto, el método de
comparaciones múltiples, el diagnóstico de residuales y el software utilizado.

### 14. Referencias (16 s)
Las referencias y los scripts en Python y R permiten reproducir todos los valores que aparecen en el video.
