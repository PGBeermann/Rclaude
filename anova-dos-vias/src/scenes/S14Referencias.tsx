import React from "react";
import { Appear } from "../components/Appear";
import { Scene } from "../components/Scene";
import { C } from "../theme";

const REFS = [
  "Box, G. E. P., & Cox, D. R. (1964). An analysis of transformations. J. R. Stat. Soc. B, 26(2), 211–252. doi:10.1111/j.2517-6161.1964.tb00553.x",
  "Brown, M. B., & Forsythe, A. B. (1974). Robust tests for the equality of variances. JASA, 69(346), 364–367. doi:10.1080/01621459.1974.10482955",
  "Cohen, J. (1988). Statistical power analysis for the behavioral sciences (2.ª ed.). Lawrence Erlbaum.",
  "Hoenig, J. M., & Heisey, D. M. (2001). The abuse of power. The American Statistician, 55(1), 19–24. doi:10.1198/000313001300339897",
  "Hurlbert, S. H. (1984). Pseudoreplication and the design of ecological field experiments. Ecol. Monogr., 54(2), 187–211. doi:10.2307/1942661",
  "ISO 5725-2:2019. Accuracy (trueness and precision) of measurement methods and results — Part 2. ISO.",
  "Kutner, M. H., Nachtsheim, C. J., Neter, J., & Li, W. (2005). Applied linear statistical models (5.ª ed.). McGraw-Hill/Irwin.",
  "Langsrud, Ø. (2003). ANOVA for unbalanced data: Use Type II instead of Type III sums of squares. Stat. Comput., 13, 163–167. doi:10.1023/A:1023260610025",
  "Lenth, R. V. (2016). Least-squares means: The R package lsmeans. J. Stat. Softw., 69(1), 1–33. doi:10.18637/jss.v069.i01",
  "Maxwell, S. E., Delaney, H. D., & Kelley, K. (2018). Designing experiments and analyzing data (3.ª ed.). Routledge.",
  "Miller, J. N., & Miller, J. C. (2018). Statistics and chemometrics for analytical chemistry (7.ª ed.). Pearson.",
  "Montgomery, D. C. (2017). Design and analysis of experiments (9.ª ed.). Wiley. Caps. 5 y 13.",
  "Olejnik, S., & Algina, J. (2003). Generalized eta and omega squared statistics. Psychol. Methods, 8(4), 434–447. doi:10.1037/1082-989X.8.4.434",
  "Shapiro, S. S., & Wilk, M. B. (1965). An analysis of variance test for normality. Biometrika, 52(3–4), 591–611. doi:10.1093/biomet/52.3-4.591",
  "Tukey, J. W. (1949). One degree of freedom for non-additivity. Biometrics, 5(3), 232–242. doi:10.2307/3001938",
];

export const S14Referencias: React.FC = () => (
  <Scene n={14} kicker="Fuentes" title="Referencias">
    <div style={{ columnCount: 2, columnGap: 56, fontSize: 21, lineHeight: 1.42, color: C.muted }}>
      {REFS.map((r, i) => (
        <Appear key={r} at={0.3 + i * 0.12} dy={8}>
          <div style={{ breakInside: "avoid", marginBottom: 14, paddingLeft: 28, textIndent: -28 }}>{r}</div>
        </Appear>
      ))}
    </div>
    <Appear at={2.6}>
      <div style={{ fontSize: 22, color: C.faint, marginTop: 12 }}>
        Datos simulados (semilla 20261009). Análisis reproducible: <span style={{ color: C.accent }}>analisis/anova_biodiesel.py</span> y{" "}
        <span style={{ color: C.accent }}>analisis/anova_biodiesel.R</span>.
      </div>
    </Appear>
  </Scene>
);
