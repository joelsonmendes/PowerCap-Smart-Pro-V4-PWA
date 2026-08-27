
window.PowerCapDB = (() => {
  const KEY='powercap_v4_projects';
  function all(){ try{return JSON.parse(localStorage.getItem(KEY)||'[]')}catch(e){return[]} }
  function save(project){const arr=all();arr.unshift({...project,id:Date.now()});localStorage.setItem(KEY,JSON.stringify(arr.slice(0,50)));return arr}
  function clear(){localStorage.removeItem(KEY)}
  return {all,save,clear};
})();
