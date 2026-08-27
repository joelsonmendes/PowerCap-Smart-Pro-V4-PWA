
window.PowerCapProducts = {
  library: [
    ['WEG','Capacitor','UCWT5V40 L16 HD','10046012 · 5 kvar · 380 V · 60 Hz','confirmado'],
    ['WEG','Capacitor','UCWT10V40 N20 HD','11313787 · 10 kvar · 380 V · 60 Hz','confirmado'],
    ['WEG','Capacitor','UCWT20V40 Q26 HD','11916901 · 20 kvar · 380 V · 60 Hz','confirmado'],
    ['WEG','Capacitor','UCWT20V40 U26 UHD','16202794 · 20 kvar · 380 V · 60 Hz','confirmado'],
    ['WEG','Capacitor','UCWT25V40 S26 HD','11916924 · 25 kvar · 380 V · 60 Hz','confirmado'],
    ['WEG','Capacitor','UCWT25V40 U26 UHD','16202795 · 25 kvar · 380 V · 60 Hz','confirmado'],
    ['WEG','Controlador','PFW03-T12','14387080 · 12 estágios · Modbus RTU','confirmado'],
    ['WEG','Controlador','PFW03-T24','14387086 · 24 estágios · Modbus RTU','confirmado'],
    ['WEG','Contator','CWMC18-10-30X26','12387956 · 220 V/60 Hz · AC-6b','confirmado'],
    ['WEG','Reator','DRW7-2,40V40','12789187 · 12 kvar · 380 V/60 Hz · 7%','confirmado'],
    ['ABB','Capacitor','CLMD / QCap','Selecionar por kvar e tensão','família atual'],
    ['ABB','Contator','UAFC / UAFC..RA','Contatores para manobra de capacitores','família atual'],
    ['ABB','Controlador','RVC-L / RVT-L','Controlador automático de FP','família atual'],
    ['ABB','Disjuntor','SACE Tmax XT','MCCB','família atual'],
    ['ABB','Filtro ativo','PQactiF / PQF','Mitigação harmônica','família atual'],
    ['Schneider','Capacitor','EasyLogic PFC / VarPlus Can','Correção de FP','família atual'],
    ['Schneider','Controlador','VPL12N','12 estágios · Modbus RS485','confirmado'],
    ['Schneider','Contator','TeSys Deca LC1D.K','Categoria para capacitores','família atual'],
    ['Schneider','Reator','PowerLogic PFC Detuned Reactor LVR','5,7% / 7% / 14%','família atual'],
    ['Schneider','Filtro ativo','PowerLogic AccuSine PCS+','Mitigação harmônica ativa','família atual']
  ],
  brandSpec(brand){
    if(brand==='weg') return {name:'WEG',cap:'UCWT HD/UHD',cont:'CWMC AC-6b',ctrl:'PFW03-T12',react7:'DRW7',react14:'DRW14',breaker:'DWB'};
    if(brand==='abb') return {name:'ABB',cap:'CLMD / QCap',cont:'UAFC / UAFC..RA',ctrl:'RVC-L / RVT-L',react7:'Detuned Reactor LV 7%',react14:'Detuned Reactor LV 14%',breaker:'Tmax XT'};
    return {name:'Schneider Electric',cap:'EasyLogic PFC / VarPlus Can',cont:'TeSys Deca LC1D.K',ctrl:'VPL12N',react7:'PowerLogic LVR 7%',react14:'PowerLogic LVR 14%',breaker:'ComPacT NSX'};
  }
};
