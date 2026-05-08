// ═══════════════════════════════════════════════════════════
// ODARA PQCDSM v12 — Shared Module
// ═══════════════════════════════════════════════════════════
const SB_URL='https://khqbimmcibutfrfmkoxr.supabase.co';
const SB_KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtocWJpbW1jaWJ1dGZyZm1rb3hyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzNTY1NjUsImV4cCI6MjA4OTkzMjU2NX0.w3vRAPhiU7Zavgkiv-ldjbHc_UJeGH9ck2tq_YN6MBo';
const SB_H={'apikey':SB_KEY,'Authorization':'Bearer '+SB_KEY,'Content-Type':'application/json'};

// ═══ AUTH (gate simples — não é segurança forte) ═══
// PARA TROCAR: edite as duas linhas abaixo e suba o arquivo no GitHub
const APP_USER='odara';
const APP_PASS='odara2026';
const AUTH_DAYS=30; // dias até precisar logar de novo

function checkAuth(){
  const a=localStorage.getItem('odara_auth');
  if(!a){window.location.href='login.html';return false;}
  try{const o=JSON.parse(a);if(o.exp&&Date.now()>o.exp){localStorage.removeItem('odara_auth');window.location.href='login.html';return false;}return true;}
  catch(e){localStorage.removeItem('odara_auth');window.location.href='login.html';return false;}
}
function doLogin(u,p){
  if(u===APP_USER&&p===APP_PASS){
    localStorage.setItem('odara_auth',JSON.stringify({u,exp:Date.now()+AUTH_DAYS*86400000}));
    return true;
  }return false;
}
function doLogout(){localStorage.removeItem('odara_auth');window.location.href='login.html';}

// ── SKUs ──
const SKUS={
  L1:[{cod:'PP01001',desc:'ALFAJOR CLASSICO TRADICIONAL 65G CX72',gram:65},{cod:'PP02001',desc:'ALFAJOR CLASSICO BRANCO 65G CX72',gram:65},{cod:'PP05001',desc:'ALFAJOR CLASSICO DARK 65G CX72',gram:65},{cod:'PP08006',desc:'ALFAJOR CLASSICO MIX 65G KIT6',gram:65},{cod:'PP08042',desc:'ODARA MIX BOAS ENERGIAS 670G KIT5',gram:65},{cod:'PP08043',desc:'ODARA MIX BOAS ENERGIAS CX25',gram:65},{cod:'PP09001',desc:'MERCATTO MEIO AMARGO 65G CX72',gram:65},{cod:'PP10001',desc:'MERCATTO BRANCO 65G CX72',gram:65},{cod:'PP11001',desc:'MERCATTO 70% CACAU 65G CX72',gram:65}],
  L2:[{cod:'PP03001',desc:'MINI ALFAJOR TRADICIONAL 25G CX108',gram:25},{cod:'PP03008',desc:'DUPLO MINI TRADICIONAL 25G CX72',gram:25},{cod:'PP08009',desc:'CLASSICO MIX PASCOA 65G KIT6',gram:65},{cod:'PP08040',desc:'CLASSICO MIX 65G KIT6 CX48',gram:65},{cod:'PP08044',desc:'MINI CLASSICO MIX 25G KIT8 CX128',gram:25},{cod:'PP29001',desc:'ZERO TRADICIONAL 45G CX72',gram:45},{cod:'PP30001',desc:'ZERO BRANCO 45G CX72',gram:45}],
  L3:[{cod:'PP12001',desc:'DR PEANUT LEITE EM PO 35G CX48',gram:35},{cod:'PP13001',desc:'DR PEANUT BRIGADEIRO 55G CX48',gram:55},{cod:'PP14001',desc:'DR PEANUT CHOC BRANCO 55G CX48',gram:55},{cod:'PP15001',desc:'DR PEANUT AVELA 35G CX48',gram:35},{cod:'PP18001',desc:'CROCANTE ODARA AVELA 40G CX72',gram:40},{cod:'PP18003',desc:'CROCANTE ODARA AVELA 40G 3UN CX24',gram:40},{cod:'PP19001',desc:'CROCANTE ODARA PACOCA 40G CX72',gram:40},{cod:'PP19003',desc:'CROCANTE ODARA PACOCA 40G CX24',gram:40},{cod:'PP20001',desc:'CROCANTE ODARA MILK 40G CX72',gram:40},{cod:'PP20003',desc:'CROCANTE ODARA MILK 40G CX24',gram:40},{cod:'PP21001',desc:'DR PEANUT COOKIES CREAM 35G CX48',gram:35},{cod:'PP22001',desc:'DR PEANUT DDL CHOC LEITE 35G CX48',gram:35},{cod:'PP23001',desc:'DR PEANUT DDL CHOC BRANCO 55G CX48',gram:55},{cod:'PP24001',desc:'CROCANTE DR PEANUT PISTACHE 35G CX48',gram:35},{cod:'PP26001',desc:'CROCANTE ODARA PRESTIGIO 40G CX72',gram:40},{cod:'PP27001',desc:'CROCANTE ODARA GALAK NEGRESCO 40G CX72',gram:40},{cod:'NOVO-1',desc:'ALFAJOR CHAVES CLARO 55G',gram:55},{cod:'NOVO-2',desc:'ALFAJOR CHAVES ESCURO 55G',gram:55}]
};
const ALL_SKUS=Object.values(SKUS).flat();

// ── Checklist reduzido (4 itens) ──
const PADROES_ITEMS=[
  {item:"O trabalho iniciou com a área organizada, cada coisa em seu lugar?",obj:"Partida em condição padrão",crit:"alta"},
  {item:"Existe alguma gambiarra no processo?",obj:"Identificar desvios sem solução estruturada",crit:"alta"},
  {item:"Todos postos tinham pessoas devidamente capacitadas trabalhando?",obj:"Evitar variação por falta de treinamento",crit:"alta"},
  {item:"Existe algum problema em andamento sem solução devidamente encaminhada?",obj:"Fechar ciclo de ação de desvios em aberto",crit:"alta"}
];

// ── Diário da Qualidade — 11 questões (monitora de qualidade) ──
const QUALIDADE_QUESTOES=[
  {grupo:'Início do turno',q:'A área foi liberada limpa, organizada e com identificação correta?'},
  {grupo:'Início do turno',q:'A equipe iniciou utilizando EPIs e uniforme conforme padrão?'},
  {grupo:'Início do turno',q:'Os materiais/insumos abertos estão devidamente identificados e rastreáveis?'},
  {grupo:'Processo e controle',q:'O controle de peso foi feito conforme o plano de amostragem?'},
  {grupo:'Processo e controle',q:'A primeira amostra de cada lote foi validada antes da liberação?'},
  {grupo:'Processo e controle',q:'A higienização durante o turno foi feita conforme cronograma?'},
  {grupo:'Padrões e disciplina',q:'A equipe está seguindo os procedimentos operacionais (POPs)?'},
  {grupo:'Padrões e disciplina',q:'A organização dos postos foi mantida ao longo do turno?'},
  {grupo:'Padrões e disciplina',q:'A separação de produto retido/suspeito foi feita conforme padrão?'},
  {grupo:'Encerramento',q:'Os registros obrigatórios do turno foram completados?'},
  {grupo:'Encerramento',q:'Pendências e desvios foram comunicados ao próximo turno com responsável e prazo?'}
];

// ── Bird levels ──
const BYRD_LEVELS=["Quase-acidente","Dano material","Lesão leve","Acidente grave"];
const BYRD_COLORS={"Quase-acidente":"#3B82F6","Dano material":"#F59E0B","Lesão leve":"#F97316","Acidente grave":"#DC2626"};

// ── Defaults (sobrescritos por config) ──
let CUSTOS={biscoito_kg:15,dl_kg:15,chocolate_kg:25,embalagem_un:0.5};
let METAS={P:95,Q:3,S:0,M:95,PAD:90};

// OEE teórico — T1=T2=T3=6.8h líquidas
const OEE_TEORICO={
  L1:{velNominal:7500,outputDia:25920,horasLiqT1:6.8,horasLiqT2:6.8,horasLiqT3:6.8},
  L2:{velNominal:3420,outputDia:8640,horasLiqT1:6.8,horasLiqT2:6.8,horasLiqT3:6.8},
  L3:{velNominal:6240,outputDia:20000,horasLiqT1:6.8,horasLiqT2:6.8,horasLiqT3:6.8}
};
let TARGETS_OEE={L1:60,L2:60,L3:60,fabrica:60};
let TARGETS_PROD={L1:{alfPH:200,kgPH:10},L2:{alfPH:100,kgPH:5},L3:{alfPH:150,kgPH:7}};
let FLOWPACK_PESO={classico:0.8,mini:0.4,zero:0.6,crocante:0.5};
// L2 produto é coberto e embalado pela equipe da flowpack L1 (5 pessoas extras)
let PESSOAS_ADIC={L1:0,L2:5,L3:0};
// Proporção do sobrepeso atribuída a cada componente (sem dado real, é estimativa)
// Default: 60% recheio (DL/pasta), 40% cobertura (chocolate)
let SOBREPESO_PROP={recheio:0.6,cobertura:0.4};

// ═══ SUPABASE HELPERS ═══
async function sbQuery(table,params=''){const r=await fetch(SB_URL+'/rest/v1/'+table+'?'+params,{headers:SB_H});if(!r.ok)throw new Error('HTTP '+r.status);return await r.json();}
async function sbInsert(table,data){const r=await fetch(SB_URL+'/rest/v1/'+table,{method:'POST',headers:{...SB_H,'Prefer':'return=minimal'},body:JSON.stringify(data)});if(!r.ok)throw new Error('HTTP '+r.status+': '+(await r.text()));return true;}
async function sbUpdate(table,id,data){const r=await fetch(SB_URL+'/rest/v1/'+table+'?id=eq.'+id,{method:'PATCH',headers:{...SB_H,'Prefer':'return=minimal'},body:JSON.stringify(data)});if(!r.ok)throw new Error('HTTP '+r.status);return true;}
async function sbGetConfig(){
  try{
    const rows=await sbQuery('config','select=*');
    rows.forEach(r=>{
      if(r.chave==='custos'&&r.valor)Object.assign(CUSTOS,r.valor);
      if(r.chave==='metas'&&r.valor)Object.assign(METAS,r.valor);
      if(r.chave==='targets_oee'&&r.valor)Object.assign(TARGETS_OEE,r.valor);
      if(r.chave==='targets_prod'&&r.valor)Object.assign(TARGETS_PROD,r.valor);
      if(r.chave==='flowpack_peso'&&r.valor)Object.assign(FLOWPACK_PESO,r.valor);
      if(r.chave==='pessoas_adic'&&r.valor)Object.assign(PESSOAS_ADIC,r.valor);
      if(r.chave==='sobrepeso_prop'&&r.valor)Object.assign(SOBREPESO_PROP,r.valor);
    });
    return rows;
  }catch(e){console.warn('Config load failed:',e);return[];}
}

// ═══ HELPERS ═══
const pct=(a,b)=>b>0?+((a/b)*100).toFixed(1):null;
const avg=(arr,fn)=>{const v=arr.map(fn).filter(x=>x!==null&&!isNaN(x));return v.length?+(v.reduce((a,b)=>a+b,0)/v.length).toFixed(2):null;};
const sum=(arr,fn)=>{const v=arr.map(fn).filter(x=>x!==null);return v.length?+v.reduce((a,b)=>a+b,0).toFixed(1):null;};
function kpiColor(p,val,metas){if(val===null)return'#9CA3AF';const v=+val,m=metas||METAS;return({P:v>=m.P?'#15803D':v>=m.P*0.85?'#C2410C':'#CC2929',Q:v<=m.Q?'#15803D':v<=m.Q*2?'#C2410C':'#CC2929',S:v<=m.S?'#15803D':'#CC2929',M:v>=m.M?'#15803D':v>=m.M*0.93?'#C2410C':'#CC2929',PAD:v>=m.PAD?'#15803D':v>=m.PAD*0.8?'#C2410C':'#CC2929'})[p]||'#9CA3AF';}

function norm(r){return{
  id:r.id,data:r.data,linha:r.linha||'',turno:r.turno||'',supervisor:r.supervisor||'',
  sku:r.sku||'',skuDesc:r.sku_desc||'',skuGram:+r.sku_gram||0,
  metaCarr:+r.meta_carr||0,realCarr:+r.real_carr||0,metaUnid:+r.meta_unid||0,realUnid:+r.real_unid||0,
  retrabalho:+r.retrabalho||0,perdas:+r.perdas||0,
  perdaBisc:+r.perda_biscoito||0,perdaDos:+r.perda_dosado||0,perdaCob:+r.perda_coberto||0,
  perdaDlKg:+r.perda_dl_kg||0,perdaBiscoitoKg:+r.perda_biscoito_kg||0,
  perdaRejeitoDosKg:+r.perda_rejeito_dosado_kg||0,perdaQuebraKg:+r.perda_quebra_bolacha_kg||0,
  perdaDosadoUn:+r.perda_dosado_un||0,perdaCobertoUn:+r.perda_coberto_un||0,perdaChocolateUn:+r.perda_chocolate_un||0,
  perdaVarreduraKg:+r.perda_varredura_kg||0,
  perdaVarrDosKg:+r.perda_varr_dos_kg||0,perdaVarrCobKg:+r.perda_varr_cob_kg||0,perdaVarrBiscKg:+r.perda_varr_bisc_kg||0,
  perdaQuebraFornecKg:+r.perda_quebra_fornec_kg||0,
  perdaBoppKg:+r.perda_bopp_kg||0,
  comentarioPerdas:r.comentario_perdas||'',
  paradaManut:r.parada_manut||false,paradaManutMin:+r.parada_manut_min||0,
  paradasManut:Array.isArray(r.paradas_manut)?r.paradas_manut:[],
  dosagens:Array.isArray(r.dosagens)?r.dosagens:[],
  embalagens:Array.isArray(r.embalagens)?r.embalagens:[],
  // OMIE — diferenças de inventário (calculadas pelos supervisores)
  omieBiscoitoKg:+r.omie_dif_biscoito_kg||0,
  omieRecheiosKg:+r.omie_dif_recheios_kg||0,
  omieCoberturasKg:+r.omie_dif_coberturas_kg||0,
  omieComentario:r.omie_comentario||'',
  tipoInput:r.tipo_input||'embalagem',tipoProduto:r.tipo_produto||'',
  totalColab:+r.total_colab||0,presentes:+r.presentes||0,
  biscPad:+r.bisc_pad||0,biscMedia:+r.bisc_media||0,biscN:+r.bisc_n||0,biscDp:+r.bisc_dp||0,
  dlPad:+r.dl_pad||0,dlMedia:+r.dl_media||0,dlN:+r.dl_n||0,dlDp:+r.dl_dp||0,
  cobPad:+r.cob_pad||0,cobReal:+r.cob_real||0,
  ncs:Array.isArray(r.ncs)?r.ncs:[],
  incidentes:Array.isArray(r.incidentes)?r.incidentes:[],
  padroes:(r.padroes&&typeof r.padroes==='object'&&!Array.isArray(r.padroes))?r.padroes:{},
  padroesComentarios:(r.padroes_comentarios&&typeof r.padroes_comentarios==='object')?r.padroes_comentarios:{},
  comentarioP:r.comentario_p||'',comentarioQ:r.comentario_q||'',
  deletedAt:r.deleted_at||null,deletedBy:r.deleted_by||null,
  editLog:Array.isArray(r.edit_log)?r.edit_log:[],
  skusProd:Array.isArray(r.skus_produzidos)?r.skus_produzidos:[]
};}
function totalNCs(e){return(e.ncs||[]).reduce((s,n)=>s+(n.qty||0),0);}
function totalIncs(e){return(e.incidentes||[]).filter(i=>i.camada!=='nenhum').length;}
function totalPerdasDosKg(e){return(e.perdaDlKg||0)+(e.perdaBiscoitoKg||0)+(e.perdaRejeitoDosKg||0)+(e.perdaQuebraKg||0)+(e.perdaBisc||0);}
function totalPerdasEmbUn(e){return(e.perdaDosadoUn||0)+(e.perdaCobertoUn||0)+(e.perdaChocolateUn||0)+(e.perdaCob||0);}
function totalPerdasKg(e){return totalPerdasDosKg(e)+(e.perdaDos||0)+(e.perdas||0);}
function perdasRS(e,c){c=c||CUSTOS;return(e.perdaDlKg||0)*c.dl_kg+(e.perdaBiscoitoKg||0)*c.biscoito_kg+(e.perdaRejeitoDosKg||0)*c.dl_kg+(e.perdaQuebraKg||0)*c.biscoito_kg+(e.perdaDosadoUn||0)*c.embalagem_un+(e.perdaCobertoUn||0)*c.embalagem_un+(e.perdaChocolateUn||0)*(c.chocolate_kg/40)+(e.perdaBisc||0)*c.biscoito_kg+(e.perdaDos||0)*c.dl_kg+(e.perdaCob||0)*c.chocolate_kg+(e.perdas||0)*15;}
function ncPareto(es){const m={};es.forEach(e=>(e.ncs||[]).forEach(n=>{const k=n.mode||n.cat||'Outros';m[k]=(m[k]||0)+(n.qty||0);}));return Object.entries(m).sort((a,b)=>b[1]-a[1]);}
function incByrd(es){const m={};BYRD_LEVELS.forEach(l=>m[l]=0);es.forEach(e=>(e.incidentes||[]).forEach(i=>{if(i.camada&&i.camada!=='nenhum')m[i.camada]=(m[i.camada]||0)+1;}));return m;}
function activeEntries(d){return d.filter(e=>!e.deletedAt);}
function padDeviations(es){const devs=[];es.forEach(e=>{const p=e.padroes||{},pc=e.padroesComentarios||{};Object.keys(p).forEach(k=>{const v=p[k];if(v==='dl'||v==='dg'){const item=PADROES_ITEMS[+k];if(item)devs.push({item:item.item,cat:item.cat||'',status:v,crit:item.crit,comment:pc[k]||''});}});});return devs;}

// ═══ INMETRO (Portaria 248/2008) ═══
function getT(Qn){let T;if(Qn<=50)T=Qn*0.09;else if(Qn<=100)T=4.5;else if(Qn<=200)T=Qn*0.045;else if(Qn<=300)T=9;else if(Qn<=500)T=Qn*0.03;else if(Qn<=1000)T=15;else if(Qn<=10000)T=Qn*0.015;else if(Qn<=15000)T=150;else T=Qn*0.01;if(Qn<=1000)T=Math.ceil(T*10)/10;else T=Math.ceil(T);return T;}
function getK(n){const t=[[5,2.059,0],[13,0.847,1],[20,0.640,1],[32,0.485,2],[80,0.295,5]];for(let i=t.length-1;i>=0;i--)if(n>=t[i][0])return{k:t[i][1],c:t[i][2]};return{k:t[0][1],c:t[0][2]};}
function inmetroEval(w,Qn){const n=w.length;if(n<5)return{status:'pending',msg:'Mín 5 pesagens'};const T=getT(Qn),kc=getK(n),k=kc.k,c=kc.c,mean=w.reduce((a,b)=>a+b,0)/n,sd=Math.sqrt(w.reduce((s,x)=>s+Math.pow(x-mean,2),0)/(n-1)),median=w.slice().sort((a,b)=>a-b)[Math.floor(n/2)],limMedia=Qn-k*sd,limT=Qn-T,defBelow=w.filter(x=>x<limT).length,critA=mean>=limMedia,critB=defBelow<=c;return{status:critA&&critB?'approved':'rejected',n,mean:+mean.toFixed(2),sd:+sd.toFixed(2),median:+median.toFixed(2),Qn,T:+T.toFixed(1),k:+k.toFixed(3),c,limMedia:+limMedia.toFixed(2),limT:+limT.toFixed(1),defBelow,critA,critB,min:+Math.min(...w).toFixed(2),max:+Math.max(...w).toFixed(2),overweight:+((mean-Qn)).toFixed(2)};}

// ═══ UI ═══
function showToast(msg,type='ok'){const t=document.getElementById('toast');if(!t)return;t.textContent=msg;t.className='toast '+type+' show';setTimeout(()=>t.classList.remove('show'),3000);}
function today(){return new Date().toISOString().slice(0,10);}
function yesterday(){const d=new Date();d.setDate(d.getDate()-1);return d.toISOString().slice(0,10);}

// ═══ NAV ═══
function renderNav(active){
  const pages=[
    {id:'dia',icon:'📊',label:'Dia',href:'index.html'},
    {id:'tendencias',icon:'📈',label:'Tendências',href:'tendencias.html'},
    {id:'perdas',icon:'📉',label:'Perdas',href:'perdas.html'},
    {id:'qualidade',icon:'🧪',label:'Qualidade',href:'qualidade.html'},
    {id:'entrada',icon:'📋',label:'Entrada',href:'entrada.html'},
    {id:'pesagens',icon:'⚖️',label:'Pesagens',href:'pesagens.html'},
    {id:'analise',icon:'🔬',label:'Análise',href:'analise.html'},
    {id:'historico',icon:'📅',label:'Histórico',href:'historico.html'},
    {id:'acoes',icon:'🎯',label:'Ações',href:'acoes.html'},
    {id:'config',icon:'⚙️',label:'Config',href:'config.html'}
  ];
  const nav=document.getElementById('main-nav');
  if(!nav)return;
  let html=pages.map(p=>'<a href="'+p.href+'" class="nav-link'+(p.id===active?' active':'')+'">'+p.icon+' '+p.label+'</a>').join('');
  html+='<a href="javascript:doLogout()" class="nav-link" style="margin-left:auto;color:var(--red)">↪ sair</a>';
  nav.innerHTML=html;
}
