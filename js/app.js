
(() => {
  const $=id=>document.getElementById(id), n=id=>parseFloat($(id).value), fmt=(v,d=1)=>Number.isFinite(v)?v.toLocaleString('pt-BR',{minimumFractionDigits:d,maximumFractionDigits:d}):'—', money=v=>(Number.isFinite(v)?v:0).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
  let state=null,cable=null;

  document.querySelectorAll('.tab').forEach(btn=>btn.addEventListener('click',()=>{
    document.querySelectorAll('.tab').forEach(b=>b.classList.remove('active')); btn.classList.add('active');
    document.querySelectorAll('.panel').forEach(p=>p.classList.remove('active')); $(btn.dataset.panel).classList.add('active');
  }));

  $('themeBtn').addEventListener('click',()=>{const next=document.documentElement.dataset.theme==='dark'?'light':'dark';document.documentElement.dataset.theme=next;localStorage.setItem('powercap_theme',next)});
  document.documentElement.dataset.theme=localStorage.getItem('powercap_theme')||'light';

  function formValues(){
    return {
      client:$('client').value.trim()||'Sem identificação',
      projectName:$('projectName').value.trim()||'Sem identificação',
      P:n('pkw'),V:n('voltage'),f:n('freq'),fp1:n('fp1'),fp2:n('fp2'),trafo:n('trafo'),z:n('ztrafo'),iccMeasured:n('iccMeasured'),
      brand:$('brand').value,thdv:n('thdv'),thdi:n('thdi'),h3:n('h3'),h5:n('h5'),h7:n('h7'),h11:n('h11'),h13:n('h13'),
      length:n('length'),material:$('material').value,insulation:$('insulation').value,method:$('method').value,ambient:n('ambient'),grouping:n('grouping'),clearTime:n('clearTime'),icu:n('icu'),dropLimit:n('dropLimit'),jbus:n('jbus')
    };
  }
  function validate(f){
    return f.P>0&&f.V>0&&f.fp1>0&&f.fp1<1&&f.fp2>f.fp1&&f.fp2<1&&f.trafo>0&&f.z>0;
  }
  function calculate(){
    const f=formValues(), err=$('error');
    if(!validate(f)){err.textContent='Revise os dados: potência e tensão positivas; 0 < FP < 1; FP desejado maior que o atual.';err.classList.remove('hidden');return}
    err.classList.add('hidden');
    state=PowerCapCalc.project(f); cable=PowerCapCalc.cable(state,f);
    const hard=state.hd.blocked||state.res.risk||!cable.icuOk||!cable.shortOk||!cable.thermalOk||!cable.dropOk;
    const warn=!hard&&(state.hd.p||f.thdv>2||f.thdi>8);
    state.release=hard?'NÃO LIBERAR':warn?'LIBERAR COM RESSALVAS':'PRÉ-LIBERADO';
    render(f);
  }
  function render(f){
    $('kQc').textContent=fmt(state.qc)+' kvar'; $('kBank').textContent=fmt(state.bank)+' kvar'; $('kIc').textContent=fmt(state.ic)+' A'; $('kFree').textContent=fmt(state.free)+' kVA';
    const card=$('releaseCard'); card.classList.remove('ok','warn','stop'); card.classList.add(state.release==='NÃO LIBERAR'?'stop':state.release==='LIBERAR COM RESSALVAS'?'warn':'ok');
    $('releaseBadge').textContent=state.release;
    $('releaseTitle').textContent=state.release==='NÃO LIBERAR'?'Revisão técnica obrigatória':state.release==='LIBERAR COM RESSALVAS'?'Projeto condicionado às ressalvas':'Pré-dimensionamento consistente';
    const notes=[state.hd.text]; if(state.res.risk)notes.push('Ressonância estimada próxima da '+state.res.nearest+'ª harmônica.'); if(!cable.icuOk)notes.push('Icu insuficiente.'); if(!cable.shortOk)notes.push('Seção insuficiente para curto.'); if(!cable.thermalOk)notes.push('Ampacidade corrigida insuficiente.'); if(!cable.dropOk)notes.push('Queda acima do limite.');
    $('releaseText').textContent=notes.join(' ');
    $('results').innerHTML=[['S antes',fmt(state.s1)+' kVA'],['S depois',fmt(state.s2)+' kVA'],['Q antes',fmt(state.q1)+' kvar'],['Q depois',fmt(state.q2)+' kvar'],['I projeto',fmt(state.idesign)+' A'],['Disjuntor preliminar',state.breaker+' A']].map(x=>`<div><span class="muted">${x[0]}</span><strong>${x[1]}</strong></div>`).join('');
    renderCable(); renderH(); renderProducts(); renderBom(); renderReport(); renderProjects();
  }
  function renderCable(){
    $('cIb').textContent=fmt(state.ic)+' A'; $('cId').textContent=fmt(state.idesign)+' A'; $('cIcc').textContent=fmt(state.iccA/1000,2)+' kA'; $('cBreaker').textContent=state.breaker+' A';
    $('cableChecks').innerHTML=[
      `<div>kt = <b>${fmt(cable.kt,2)}</b> · kg = <b>${fmt(cable.kg,2)}</b></div>`,
      `<div>Iz necessário: <b>${fmt(cable.required)} A</b></div>`,
      `<div>Seção térmica de curto: <b>≥ ${fmt(cable.sShort,1)} mm²</b></div>`,
      `<div class="${cable.thermalOk?'check-ok':'check-stop'}">Cabo: <b>${cable.chosen} mm²</b> · Iz corrigida ${fmt(cable.izCorr)} A · ${cable.thermalOk?'APROVADO':'REPROVADO'}</div>`,
      `<div class="${cable.dropOk?'check-ok':'check-stop'}">Queda: <b>${fmt(cable.drop,2)}%</b> · ${cable.dropOk?'APROVADA':'REPROVADA'}</div>`,
      `<div class="${cable.icuOk?'check-ok':'check-stop'}">Icu: <b>${fmt(n('icu'),0)} kA</b> × Icc ${fmt(state.iccA/1000,2)} kA · ${cable.icuOk?'APROVADO':'REPROVADO'}</div>`
    ].join('');
    const area=cable.busArea,bars=[[20,3],[20,5],[25,5],[30,5],[40,5],[50,5],[60,5],[80,5]].find(x=>x[0]*x[1]>=area);
    $('busResult').textContent='≥ '+fmt(area,0)+' mm²'+(bars?' → sugestão geométrica '+bars[0]+' × '+bars[1]+' mm':'');
  }
  function renderH(){
    $('hScc').textContent=fmt(state.scc,0)+' kVA'; $('hOrder').textContent='h ≈ '+fmt(state.res.h,2); $('hFreq').textContent=fmt(state.res.fr,0)+' Hz';
    $('harmonicResult').innerHTML=`<p><b>${state.hd.type}</b></p><p>${state.hd.text}</p><p>THDv ${fmt(n('thdv'))}% · THDi ${fmt(n('thdi'))}% · I3 ${fmt(n('h3'))}% · I5 ${fmt(n('h5'))}%</p>${state.res.risk?`<p class="check-stop"><b>Alerta:</b> ressonância próxima da ${state.res.nearest}ª harmônica.</p>`:''}`;
  }
  function renderProducts(){
    $('productRows').innerHTML=PowerCapProducts.library.map(p=>`<tr><td><strong>${p[0]}</strong></td><td>${p[1]}</td><td>${p[2]}</td><td>${p[3]}</td><td>${p[4]}</td></tr>`).join('');
  }
  function bomData(){
    const b=PowerCapProducts.brandSpec($('brand').value);
    const reactor=state.hd.p===7?b.react7:state.hd.p===14?b.react14:'Não requerido';
    return [
      ['01','Controlador',1,b.ctrl],
      ['02','TC de medição',1,'Definir pela corrente máxima real'],
      ['03','Disjuntor geral',1,`${b.breaker} · ${state.breaker} A · Icu ≥ ${fmt(state.iccA/1000,1)} kA`],
      ['04','Capacitores',1,`${b.cap} · total ${fmt(state.bank)} kvar`],
      ['05','Contatores',1,b.cont],
      ['06','Reator de dessintonia',state.hd.p?1:0,reactor],
      ['07','Cabo alimentador',1,`${cable.chosen} mm² · ${$('material').value.toUpperCase()} · ${$('insulation').value.toUpperCase()}`],
      ['08','Barramento',1,`Área ≥ ${fmt(cable.busArea,0)} mm²`],
      ['09','Painel/ventilação/acessórios',1,'Dimensionar conforme dissipação e montagem final'],
      ['10','Documentação/identificação',1,'Diagramas, etiquetas e memorial']
    ];
  }
  function renderBom(){
    const data=bomData(); $('bomBrand').textContent='Fabricante preferencial: '+PowerCapProducts.brandSpec($('brand').value).name;
    $('bomRows').innerHTML=data.map((r,i)=>`<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td><td>${r[3]}</td><td><input class="bomPrice" data-i="${i}" type="number" min="0" step="0.01" value="0"></td><td class="bomLine">R$ 0,00</td></tr>`).join('');
    document.querySelectorAll('.bomPrice').forEach(i=>i.addEventListener('input',updateBom)); updateBom();
  }
  function updateBom(){
    const data=bomData(),lines=document.querySelectorAll('.bomLine'); let total=0;
    document.querySelectorAll('.bomPrice').forEach((el,i)=>{const v=parseFloat(el.value)||0,line=v*data[i][2]; total+=line; lines[i].textContent=money(line)});
    $('bomTotal').textContent=money(total);
  }
  function renderReport(){ $('reportText').textContent=PowerCapReport.text(state,cable,formValues()) }
  function renderProjects(){
    const arr=PowerCapDB.all(); $('projectList').innerHTML=arr.length?arr.map(p=>`<div class="project-item"><strong>${p.projectName}</strong><div class="muted">${p.client} · ${fmt(p.bank)} kvar · ${p.release}</div></div>`).join(''):'<p class="muted">Nenhum projeto salvo.</p>';
  }

  $('projectForm').addEventListener('submit',e=>{e.preventDefault();calculate()});
  $('recalcCable').addEventListener('click',calculate); $('recalcH').addEventListener('click',calculate);
  $('saveProject').addEventListener('click',()=>{if(!state)return;PowerCapDB.save({client:$('client').value,projectName:$('projectName').value,bank:state.bank,release:state.release,date:new Date().toISOString()});renderProjects()});
  $('printReport').addEventListener('click',()=>window.print());
  ['brand','thdv','thdi','h3','h5','h7','h11','h13','material','insulation','method','ambient','grouping','icu'].forEach(id=>$(id).addEventListener('change',calculate));

  if('serviceWorker' in navigator){window.addEventListener('load',()=>navigator.serviceWorker.register('./service-worker.js').catch(()=>{}))}
  calculate();
})();
