# Verificación en R del ANOVA de dos vías (mismos datos que el video)
# Paquetes: car, emmeans (install.packages(c("car", "emmeans")))
datos <- read.csv("datos_biodiesel.csv")
datos$A <- factor(datos$catalizador, levels = c("KOH", "NaOH", "CH3ONa"))
datos$B <- factor(datos$temperatura, levels = c(50, 60, 70))

# Contrastes de suma cero: requisito para SC tipo III (Langsrud, 2003)
options(contrasts = c("contr.sum", "contr.poly"))
modelo <- lm(rendimiento ~ A * B, data = datos)

summary(aov(rendimiento ~ A * B, data = datos))   # SC tipo I (secuencial)
car::Anova(modelo, type = 2)                      # SC tipo II
car::Anova(modelo, type = 3)                      # SC tipo III

# Gráfico de interacción
with(datos, interaction.plot(B, A, rendimiento, type = "b", pch = 19,
                             xlab = "Temperatura (°C)", ylab = "Rendimiento FAME (%)"))

# Supuestos sobre residuales del modelo completo
shapiro.test(residuals(modelo))
car::leveneTest(rendimiento ~ A * B, data = datos, center = median)  # Brown–Forsythe
par(mfrow = c(1, 2)); plot(modelo, which = 1:2); par(mfrow = c(1, 1))

# Efectos simples de A en cada nivel de B con MS_E agrupado + Tukey
library(emmeans)
emm <- emmeans(modelo, ~ A | B)
joint_tests(modelo, by = "B")
pairs(emm, adjust = "tukey")
