
window.PowerCapReport = {
  text(state, cable, form){
    const b=PowerCapProducts.brandSpec(form.brand);
    const f=n=>Number(n).toLocaleString('pt-BR',{maximumFractionDigits:2});
    return `POWERCAP SMART PRO — MEMORIAL DE CÁLCULO V4

CLIENTE: ${form.client}
PROJETO: ${form.projectName}

1. DADOS ELÉTRICOS
Potência ativa: ${f(state.P)} kW
Tensão: ${state.V} V
Frequência: ${state.f} Hz
FP atual: ${state.fp1}
FP desejado: ${state.fp2}
Transformador: ${f(state.trafo)} kVA
Impedância: ${f(state.z)} %
Icc utilizada: ${f(state.iccA/1000)} kA

2. CORREÇÃO DO FATOR DE POTÊNCIA
Q1 = ${f(state.q1)} kvar
Q2 = ${f(state.q2)} kvar
Qc = ${f(state.qc)} kvar
Banco comercial = ${f(state.bank)} kvar
Corrente nominal = ${f(state.ic)} A
Corrente de projeto = 1,43 × Ic = ${f(state.idesign)} A

3. PROTEÇÃO
Disjuntor preliminar = ${state.breaker} A
Icu selecionado = ${f(form.icu)} kA
Icc = ${f(state.iccA/1000)} kA
Status Icu = ${cable.icuOk?'APROVADO':'REPROVADO'}

4. CABOS
Material = ${form.material.toUpperCase()}
Isolação = ${form.insulation.toUpperCase()}
Método = ${form.method.toUpperCase()}
Temperatura = ${form.ambient} °C
Agrupamento = ${form.grouping} circuito(s)
kt = ${f(cable.kt)}
kg = ${f(cable.kg)}
Seção por curto ≥ ${f(cable.sShort)} mm²
Seção selecionada = ${cable.chosen} mm²
Iz corrigida ≈ ${f(cable.izCorr)} A
Queda estimada = ${f(cable.drop)} %

5. HARMÔNICAS
THDv = ${f(form.thdv)} %
THDi = ${f(form.thdi)} %
I3 = ${f(form.h3)} %
I5 = ${f(form.h5)} %
Solução = ${state.hd.type}
Ordem natural ≈ ${f(state.res.h)}
Frequência de ressonância ≈ ${f(state.res.fr)} Hz

6. FABRICANTE
${b.name}
Capacitores: ${b.cap}
Contatores: ${b.cont}
Controlador: ${b.ctrl}
Reator: ${state.hd.p===7?b.react7:state.hd.p===14?b.react14:'não requerido na triagem atual'}
Proteção: ${b.breaker}

7. STATUS
${state.release}

8. REFERÊNCIAS DE PROJETO
IEC 60831-1 — capacitores de potência autorregenerativos até 1.000 V.
IEC 61921 — bancos de capacitores de baixa tensão para correção do fator de potência.
IEC 61439-1/-2 — conjuntos de baixa tensão, quando aplicável.
Critérios e catálogos oficiais dos fabricantes cadastrados.

9. OBSERVAÇÃO
Pré-dimensionamento profissional assistido. Antes da fabricação, confirmar dados reais de curto-circuito, Icu/Ics, seletividade, coordenação, tabelas normativas aplicáveis, temperatura, agrupamento, ventilação, elevação térmica, parametrização do controlador e estudo de qualidade de energia quando necessário.`;
  }
};
