
window.PowerCapCalc = (() => {
  const ratings=[6,10,16,20,25,32,40,50,63,80,100,125,160,200,250,315,400,500,630,800,1000];
  const sizes=[1.5,2.5,4,6,10,16,25,35,50,70,95,120,150,185,240,300];
  const baseCuPVC={
    b1:[15.5,21,28,36,50,68,89,110,134,171,207,239,272,310,364,419],
    b2:[14.5,20,26,34,46,62,80,99,118,149,179,206,236,268,315,363],
    c:[17.5,24,32,41,57,76,101,125,151,192,232,269,309,353,415,477],
    e:[18.5,25,34,43,60,80,106,131,158,200,241,278,318,362,424,486]
  };
  const nextRating=x=>ratings.find(r=>r>=x)||Math.ceil(x/100)*100;
  function project({P,V,f,fp1,fp2,trafo,z,iccMeasured,thdv,thdi,i3,i5}){
    const phi1=Math.acos(fp1),phi2=Math.acos(fp2);
    const q1=P*Math.tan(phi1),q2=P*Math.tan(phi2),qc=Math.max(0,q1-q2);
    const bank=Math.ceil(qc/5)*5,ic=bank*1000/(Math.sqrt(3)*V),idesign=1.43*ic;
    const s1=P/fp1,s2=P/fp2,free=s1-s2;
    const inTrafo=trafo*1000/(Math.sqrt(3)*V);
    const iccEstimated=inTrafo*100/z;
    const iccA=iccMeasured>0?iccMeasured*1000:iccEstimated;
    const scc=iccA*Math.sqrt(3)*V/1000;
    const hd=PowerCapHarmonics.decision(thdv,thdi,i3,i5);
    const res=PowerCapHarmonics.resonance(scc,bank,f);
    return {P,V,f,fp1,fp2,trafo,z,phi1,phi2,q1,q2,qc,bank,ic,idesign,s1,s2,free,inTrafo,iccA,scc,hd,res,breaker:nextRating(idesign)};
  }
  function tempFactor(ins,t){const pvc={30:1,35:.94,40:.87,45:.79,50:.71,55:.61,60:.5},xlpe={30:1,35:.96,40:.91,45:.87,50:.82,55:.76,60:.71};return (ins==='pvc'?pvc:xlpe)[t]||.7}
  function groupFactor(g){return({1:1,2:.8,3:.7,4:.65,5:.6,6:.57})[g]||.57}
  function ampacity(s,method,mat,ins){const idx=sizes.indexOf(s);let a=baseCuPVC[method][idx];if(ins==='xlpe')a*=1.15;if(mat==='al')a*=.78;return a}
  function kShort(mat,ins){if(mat==='cu')return ins==='xlpe'?143:115;return ins==='xlpe'?94:76}
  function cable(p,{length,material,insulation,method,ambient,grouping,clearTime,icu,dropLimit,jbus}){
    const kt=tempFactor(insulation,ambient),kg=groupFactor(grouping),required=p.idesign/(kt*kg),sShort=p.iccA*Math.sqrt(clearTime)/kShort(material,insulation);
    let chosen=sizes[sizes.length-1];
    for(const s of sizes){if(s>=sShort&&ampacity(s,method,material,insulation)>=required){chosen=s;break}}
    const izBase=ampacity(chosen,method,material,insulation),izCorr=izBase*kt*kg;
    const rho=material==='cu'?.0175:.0282,R=rho*1000/chosen*1.2,X=.08,L=length/1000,Z=Math.sqrt(R*R+X*X);
    const drop=Math.sqrt(3)*p.ic*Z*L/p.V*100;
    return {kt,kg,required,sShort,chosen,izBase,izCorr,drop,dropOk:drop<=dropLimit,thermalOk:izCorr>=p.idesign,shortOk:chosen>=sShort,icuOk:icu*1000>=p.iccA,busArea:p.idesign/jbus};
  }
  return {project,cable,nextRating};
})();
