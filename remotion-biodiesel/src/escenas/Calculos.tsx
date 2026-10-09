import React from 'react';
import {BiodieselProps} from '../schema';
import {M, calcularReceta} from '../quimica/estequiometria';
import {tema} from '../tema';
import {Escena, useAparicion} from '../ui/Escena';
import {Formula} from '../ui/Formula';

const Fila: React.FC<{c: React.ReactNode; calculo: string; valor: string; retraso: number; destacado?: boolean}> = ({c, calculo, valor, retraso, destacado}) => {
	const e = useAparicion(retraso, 12);
	return (
		<tr style={{...e, borderBottom: `1px solid ${tema.borde}`}}>
			<td style={{padding: '12px 10px'}}>{c}</td>
			<td style={{padding: '12px 10px', fontFamily: tema.mono, color: tema.suave, fontSize: 23}}>{calculo}</td>
			<td style={{padding: '12px 10px', fontFamily: tema.mono, fontWeight: 800, textAlign: 'right', whiteSpace: 'nowrap', color: destacado ? tema.acento : tema.texto}}>{valor}</td>
		</tr>
	);
};

export const Calculos: React.FC<BiodieselProps> = ({receta}) => {
	const r = calcularReceta(receta);
	const t = useAparicion(0);
	const nota = useAparicion(230);
	const f = (x: number, d = 2) => x.toFixed(d);

	return (
		<Escena style={{justifyContent: 'center', padding: '50px 70px'}}>
			<div style={{...t}}>
				<div style={{fontSize: 26, color: tema.acento2, fontWeight: 700, letterSpacing: 3}}>PASO 1 DE 6</div>
				<div style={{fontSize: 54, fontWeight: 800, borderLeft: `10px solid ${tema.acento}`, paddingLeft: 22, margin: '8px 0 26px'}}>
					Pretratamiento del aceite y cálculos estequiométricos
				</div>
			</div>
			<div style={{display: 'flex', gap: 40}}>
				<table style={{flex: 1.6, fontSize: 29, borderCollapse: 'collapse'}}>
					<tbody>
						<Fila retraso={15} c="Aceite usado (filtrado, seco)" calculo={`ρ = ${receta.densidadAceite} g/mL`} valor={`${receta.masaAceite} g · ${f(r.volumenAceite, 1)} mL`} />
						<Fila retraso={35} c="Moles de triglicérido" calculo={`${receta.masaAceite} g / ${receta.masaMolarAceite} g/mol`} valor={`${f(r.molAceite, 4)} mol`} />
						<Fila retraso={55} c={<>Metanol ({receta.relacionMolar}:1)</>} calculo={`${f(r.molMetanol, 4)} mol × ${M.metanol} g/mol`} valor={`${f(r.masaMetanol)} g · ${f(r.volumenMetanol, 1)} mL`} destacado />
						<Fila retraso={75} c={`NaOH catalizador (${receta.catalizadorPct} %)`} calculo={`${receta.masaAceite} g × ${receta.catalizadorPct / 100}`} valor={`${f(r.NaOHcatalizador)} g`} />
						<Fila retraso={95} c={`NaOH para AGL (${receta.aglPct} %)`} calculo={`m·AGL·${M.NaOH}/${M.acidoOleico}`} valor={`${f(r.NaOHneutralizacion, 3)} g`} />
						<Fila retraso={115} c="NaOH total" calculo="" valor={`${f(r.NaOHtotal)} g`} destacado />
						<Fila retraso={135} c="Biodiésel teórico (FAME)" calculo={`3 × n × ${f(r.masaMolarFAME, 1)} g/mol`} valor={`${f(r.masaTeoricaFAME)} g`} destacado />
						<Fila retraso={155} c="Glicerol teórico" calculo={`n × ${M.glicerol} g/mol`} valor={`${f(r.masaTeoricaGlicerol)} g · ${f(r.volumenTeoricoGlicerol, 1)} mL`} />
					</tbody>
				</table>
				<div style={{flex: 1, fontSize: 27, lineHeight: 1.4, display: 'flex', flexDirection: 'column', gap: 20}}>
					<div style={{background: tema.panel, border: `1px solid ${tema.borde}`, borderRadius: 18, padding: 22}}>
						<b style={{color: tema.acento2}}>Pretratamiento:</b> filtre el aceite para retirar sólidos. Luego caliéntelo a ≈ 100–110 °C unos minutos para eliminar el agua y déjelo enfriar.
					</div>
					<div style={{background: tema.panel, border: `1px solid ${tema.borde}`, borderRadius: 18, padding: 22}}>
						<b style={{color: tema.acento2}}>Acidez (AGL):</b> disuelva 10 g de aceite en 50 mL de isopropanol neutralizado y titule con NaOH 0.1 M usando fenolftaleína.
						<div style={{fontFamily: tema.mono, marginTop: 8, color: tema.acento}}>% AGL = V·C·282.46 / (10·m)</div>
					</div>
					<div style={{...nota, borderRadius: 18, padding: 22, border: `2px solid ${r.requierePretratamientoAcido ? tema.peligro : tema.acento2}`}}>
						{r.requierePretratamientoAcido ? (
							<>⚠ AGL &gt; 1 %: haga primero una esterificación ácida (<Formula texto="H2SO4" />/metanol).</>
						) : (
							<>✔ AGL = {receta.aglPct} %: se puede usar directamente la catálisis básica.</>
						)}
					</div>
				</div>
			</div>
		</Escena>
	);
};
