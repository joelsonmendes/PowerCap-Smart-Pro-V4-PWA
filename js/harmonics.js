
window.PowerCapHarmonics = {
  decision(thdv,thdi,i3,i5){
    if(thdv<=3 && thdi<=10) return {type:'Banco convencional',p:0,blocked:false,text:'THDi ≤ 10% e THDv ≤ 3%: triagem preliminar permite correção tradicional.'};
    if(i5>0 && i3>0.2*i5) return {type:'Banco dessintonizado 14%',p:14,blocked:false,text:'I3 > 0,2 × I5: triagem orienta avaliar dessintonia de 14%.'};
    if(thdv>7) return {type:'Estudo específico / filtro ativo',p:null,blocked:true,text:'THDv > 7%: bloquear liberação automática e exigir estudo de qualidade de energia.'};
    return {type:'Banco dessintonizado 7%',p:7,blocked:false,text:'Distorção relevante com predominância compatível com pré-seleção de 7%.'};
  },
  resonance(sccKva,bankKvar,freq){
    const h=Math.sqrt(sccKva/bankKvar);
    const fr=h*freq;
    const orders=[3,5,7,11,13];
    const nearest=orders.reduce((a,b)=>Math.abs(b-h)<Math.abs(a-h)?b:a,3);
    return {h,fr,nearest,risk:Math.abs(h-nearest)<0.45};
  }
};
