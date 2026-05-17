// ═══════════════════════════════════════════════════════════
// ODARA PQCDSM v13 — Shared Module
// Mudanças v13:
// - Mapping SKU → produto intermediário (PR01001/02/037)
// - Helpers de agrupamento de dosados por intermediário
// - Helpers de rateio perda compartilhada × específica do SKU
// - Helpers de sobrepeso isolado (dosagem D-n × cobertura D)
// - Helpers de BOPP teórico × real × diff OMIE
// - Formatador fmt2 (2 casas decimais, pt-BR)
// ═══════════════════════════════════════════════════════════
const SB_URL='https://khqbimmcibutfrfmkoxr.supabase.co';
const SB_KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtocWJpbW1jaWJ1dGZyZm1rb3hyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzNTY1NjUsImV4cCI6MjA4OTkzMjU2NX0.w3vRAPhiU7Zavgkiv-ldjbHc_UJeGH9ck2tq_YN6MBo';
const SB_H={'apikey':SB_KEY,'Authorization':'Bearer '+SB_KEY,'Content-Type':'application/json'};

// ═══ AUTH ═══
const APP_USER='odara';
const APP_PASS='odara2026';
const AUTH_DAYS=30;

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

// ── SKUs (produtos finais) ──
const SKUS={
  L1:[{cod:'PP01001',desc:'ALFAJOR CLASSICO TRADICIONAL 65G CX72',gram:65},{cod:'PP02001',desc:'ALFAJOR CLASSICO BRANCO 65G CX72',gram:65},{cod:'PP05001',desc:'ALFAJOR CLASSICO DARK 65G CX72',gram:65},{cod:'PP08006',desc:'ALFAJOR CLASSICO MIX 65G KIT6',gram:65},{cod:'PP08042',desc:'ODARA MIX BOAS ENERGIAS 670G KIT5',gram:65},{cod:'PP08043',desc:'ODARA MIX BOAS ENERGIAS CX25',gram:65},{cod:'PP09001',desc:'MERCATTO MEIO AMARGO 65G CX72',gram:65},{cod:'PP10001',desc:'MERCATTO BRANCO 65G CX72',gram:65},{cod:'PP11001',desc:'MERCATTO 70% CACAU 65G CX72',gram:65}],
  L2:[{cod:'PP03001',desc:'MINI ALFAJOR TRADICIONAL 25G CX108',gram:25},{cod:'PP03008',desc:'DUPLO MINI TRADICIONAL 25G CX72',gram:25},{cod:'PP08009',desc:'CLASSICO MIX PASCOA 65G KIT6',gram:65},{cod:'PP08040',desc:'CLASSICO MIX 65G KIT6 CX48',gram:65},{cod:'PP08044',desc:'MINI CLASSICO MIX 25G KIT8 CX128',gram:25},{cod:'PP29001',desc:'ZERO TRADICIONAL 45G CX72',gram:45},{cod:'PP30001',desc:'ZERO BRANCO 45G CX72',gram:45}],
  L3:[{cod:'PP12001',desc:'DR PEANUT LEITE EM PO 35G CX48',gram:35},{cod:'PP13001',desc:'DR PEANUT BRIGADEIRO 55G CX48',gram:55},{cod:'PP14001',desc:'DR PEANUT CHOC BRANCO 55G CX48',gram:55},{cod:'PP15001',desc:'DR PEANUT AVELA 35G CX48',gram:35},{cod:'PP18001',desc:'CROCANTE ODARA AVELA 40G CX72',gram:40},{cod:'PP18003',desc:'CROCANTE ODARA AVELA 40G 3UN CX24',gram:40},{cod:'PP19001',desc:'CROCANTE ODARA PACOCA 40G CX72',gram:40},{cod:'PP19003',desc:'CROCANTE ODARA PACOCA 40G CX24',gram:40},{cod:'PP20001',desc:'CROCANTE ODARA MILK 40G CX72',gram:40},{cod:'PP20003',desc:'CROCANTE ODARA MILK 40G CX24',gram:40},{cod:'PP21001',desc:'DR PEANUT COOKIES CREAM 35G CX48',gram:35},{cod:'PP22001',desc:'DR PEANUT DDL CHOC LEITE 35G CX48',gram:35},{cod:'PP23001',desc:'DR PEANUT DDL CHOC BRANCO 55G CX48',gram:55},{cod:'PP24001',desc:'CROCANTE DR PEANUT PISTACHE 35G CX48',gram:35},{cod:'PP26001',desc:'CROCANTE ODARA PRESTIGIO 40G CX72',gram:40},{cod:'PP27001',desc:'CROCANTE ODARA GALAK NEGRESCO 40G CX72',gram:40},{cod:'NOVO-1',desc:'ALFAJOR CHAVES CLARO 55G',gram:55},{cod:'NOVO-2',desc:'ALFAJOR CHAVES ESCURO 55G',gram:55}]
};
const ALL_SKUS=Object.values(SKUS).flat();

// ── PRODUTOS INTERMEDIÁRIOS (DOSADOS) ──
// Crocantes e Peanut NÃO têm intermediário (dosam e cobrem no mesmo dia).
const INTERMEDIARIOS={
  'PR01001':{cod:'PR01001',desc:'DOSADO ALFAJOR',gramRef:65,categoria:'tradicional'},
  'PR01002':{cod:'PR01002',desc:'DOSADO BOCADITO',gramRef:25,categoria:'mini'},
  'PR01037':{cod:'PR01037',desc:'DOSADO ALFAJOR ZERO ODARA',gramRef:45,categoria:'zero'}
};
const ALL_INTERMEDIARIOS=Object.values(INTERMEDIARIOS);

// Mapping SKU final → produto intermediário (null = sem intermediário, dose+cobre mesmo dia)
const INTERMEDIARIO_POR_SKU={
  // PR01001 — DOSADO ALFAJOR (tradicionais 65g)
  'PP01001':'PR01001','PP02001':'PR01001','PP05001':'PR01001',
  'PP08006':'PR01001','PP08042':'PR01001','PP08043':'PR01001',
  'PP09001':'PR01001','PP10001':'PR01001','PP11001':'PR01001',
  'PP08009':'PR01001','PP08040':'PR01001',
  'NOVO-1':'PR01001','NOVO-2':'PR01001',
  // PR01002 — DOSADO BOCADITO (mini 25g)
  'PP03001':'PR01002','PP03008':'PR01002','PP08044':'PR01002',
  // PR01037 — DOSADO ZERO (zero 45g)
  'PP29001':'PR01037','PP30001':'PR01037'
  // Crocantes (PP18, PP19, PP20, PP24, PP26, PP27) → sem intermediário
  // Peanut (PP12, PP13, PP14, PP15, PP21, PP22, PP23) → sem intermediário
};

function getIntermediario(sku){return INTERMEDIARIO_POR_SKU[sku]||null;}
function hasIntermediario(sku){return !!INTERMEDIARIO_POR_SKU[sku];}

// Lista de opções para o select de DOSAGEM:
// - Inclui os 3 intermediários
// - Inclui todos os crocantes e peanut (que dosam como SKU final)
function getDosagemOptions(){
  const opts=[];
  ALL_INTERMEDIARIOS.forEach(i=>opts.push({cod:i.cod,desc:i.desc,gram:i.gramRef,isIntermediario:true,categoria:i.categoria}));
  ALL_SKUS.forEach(s=>{if(!hasIntermediario(s.cod))opts.push({cod:s.cod,desc:s.desc,gram:s.gram,isIntermediario:false,categoria:'final'});});
  return opts;
}

// ── Checklist reduzido ──
const PADROES_ITEMS=[
  {item:"O trabalho iniciou com a área organizada, cada coisa em seu lugar?",obj:"Partida em condição padrão",crit:"alta"},
  {item:"Existe alguma gambiarra no processo?",obj:"Identificar desvios sem solução estruturada",crit:"alta"},
  {item:"Todos postos tinham pessoas devidamente capacitadas trabalhando?",obj:"Evitar variação por falta de treinamento",crit:"alta"},
  {item:"Existe algum problema em andamento sem solução devidamente encaminhada?",obj:"Fechar ciclo de ação de desvios em aberto",crit:"alta"}
];

// ── Diário da Qualidade ──
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

// ── Bird ──
const BYRD_LEVELS=["Quase-acidente","Dano material","Lesão leve","Acidente grave"];
const BYRD_COLORS={"Quase-acidente":"#3B82F6","Dano material":"#F59E0B","Lesão leve":"#F97316","Acidente grave":"#DC2626"};

// ── Defaults ──
let CUSTOS={biscoito_kg:15,dl_kg:15,chocolate_kg:25,embalagem_un:0.5};
let METAS={P:95,Q:3,S:0,M:95,PAD:90};

const OEE_TEORICO={
  L1:{velNominal:7500,outputDia:25920,horasLiqT1:6.8,horasLiqT2:6.8,horasLiqT3:6.8},
  L2:{velNominal:3420,outputDia:8640,horasLiqT1:6.8,horasLiqT2:6.8,horasLiqT3:6.8},
  L3:{velNominal:6240,outputDia:20000,horasLiqT1:6.8,horasLiqT2:6.8,horasLiqT3:6.8}
};
let TARGETS_OEE={L1:60,L2:60,L3:60,fabrica:60};
let TARGETS_PROD={L1:{alfPH:200,kgPH:10},L2:{alfPH:100,kgPH:5},L3:{alfPH:150,kgPH:7}};
// FLOWPACK_PESO: gramatura do BOPP em gramas por unidade embalada — usado p/ BOPP teórico
let FLOWPACK_PESO={classico:0.8,mini:0.4,zero:0.6,crocante:0.5};
let PESSOAS_ADIC={L1:0,L2:5,L3:0};
let SOBREPESO_PROP={recheio:0.6,cobertura:0.4};

// ═══ SUPABASE ═══
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

// ═══ HELPERS BÁSICOS ═══
const pct=(a,b)=>b>0?+((a/b)*100).toFixed(1):null;
const avg=(arr,fn)=>{const v=arr.map(fn).filter(x=>x!==null&&!isNaN(x));return v.length?+(v.reduce((a,b)=>a+b,0)/v.length).toFixed(2):null;};
const sum=(arr,fn)=>{const v=arr.map(fn).filter(x=>x!==null);return v.length?+v.reduce((a,b)=>a+b,0).toFixed(2):null;};

// Formatadores — 2 casas decimais
const fmt2=(n)=>(n==null||isNaN(n))?'0,00':(+n).toFixed(2).replace('.',',');     // pt-BR
const fmt2en=(n)=>(n==null||isNaN(n))?'0.00':(+n).toFixed(2);                    // inglês
const r2=(n)=>(n==null||isNaN(n))?0:+(+n).toFixed(2);                            // número arredondado

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
  // OMIE — diferenças de inventário (físico − sistema)
  omieBiscoitoKg:+r.omie_dif_biscoito_kg||0,
  omieRecheiosKg:+r.omie_dif_recheios_kg||0,
  omieCoberturasKg:+r.omie_dif_coberturas_kg||0,
  omieBoppKg:+r.omie_dif_bopp_kg||0,
  omieComentario:r.omie_comentario||'',
  // BOPP teórico (calculado/persistido)
  boppTeoricoKg:+r.bopp_teorico_kg||0,
  // Perdas específicas por SKU [{sku,tipo,kg,linha}]
  perdasEspecificas:Array.isArray(r.perdas_especificas)?r.perdas_especificas:[],
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

// ═══ INMETRO ═══
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

// ═══════════════════════════════════════════════════════════
// ════════  NOVOS HELPERS v13  ══════════════════════════════
// ═══════════════════════════════════════════════════════════

// ── 1) AGRUPAMENTO DE DOSADOS POR INTERMEDIÁRIO ──
// Consolida os dosados de um conjunto de entries por código intermediário.
// Crocantes/Peanut (sem intermediário) entram com prefixo SKU_ e flag isFinal=true.
// Retorna: {codGrupo:{cod,desc,kgTotal,alfTotal,skus:[],linhas:[],isFinal}}
function agruparDosadosDoDia(entries){
  const grupos={};
  entries.forEach(e=>{
    (e.dosagens||[]).forEach(d=>{
      const real=+d.real||0;
      const gram=+d.gram||0;
      const kg=(real*gram)/1000;
      const inter=getIntermediario(d.sku);
      let chave,info;
      if(inter){
        chave=inter;
        info=INTERMEDIARIOS[inter];
        if(!grupos[chave])grupos[chave]={cod:inter,desc:info.desc,kgTotal:0,alfTotal:0,skus:[],linhas:new Set(),isFinal:false,categoria:info.categoria};
      }else{
        // Crocante/Peanut — dosa e cobre no mesmo dia, fica como SKU final
        chave='SKU_'+d.sku;
        if(!grupos[chave])grupos[chave]={cod:d.sku,desc:d.desc||d.sku,kgTotal:0,alfTotal:0,skus:[{sku:d.sku,desc:d.desc}],linhas:new Set(),isFinal:true,categoria:'final'};
      }
      grupos[chave].kgTotal+=kg;
      grupos[chave].alfTotal+=real;
      grupos[chave].linhas.add(e.linha);
      if(!grupos[chave].skus.find(s=>s.sku===d.sku))grupos[chave].skus.push({sku:d.sku,desc:d.desc||''});
    });
  });
  Object.values(grupos).forEach(g=>{g.linhas=[...g.linhas].sort();g.kgTotal=r2(g.kgTotal);g.alfTotal=Math.round(g.alfTotal);});
  return grupos;
}

// Helper espelho: agrupa EMBALAGENS por SKU final do dia (para análise de cobertura)
function agruparEmbalagensDoDia(entries){
  const grupos={};
  entries.forEach(e=>{
    const embs=e.embalagens||[];
    embs.forEach(em=>{
      const real=+em.real||0;
      const gram=+em.gram||0;
      const kg=(real*gram)/1000;
      const k=em.sku;
      if(!grupos[k])grupos[k]={cod:em.sku,desc:em.desc||'',gram,kgTotal:0,alfTotal:0,linhas:new Set(),dataDosagem:em.dataDosagem||null};
      grupos[k].kgTotal+=kg;
      grupos[k].alfTotal+=real;
      grupos[k].linhas.add(e.linha);
    });
  });
  Object.values(grupos).forEach(g=>{g.linhas=[...g.linhas].sort();g.kgTotal=r2(g.kgTotal);g.alfTotal=Math.round(g.alfTotal);});
  return grupos;
}

// ── 2) RATEIO DE PERDA COMPARTILHADA ──
// pool: kg total da perda inventariada como compartilhada do dia/grupo
// entries: registros do mesmo dia (mais de uma linha)
// grupoFn(entry) → kg consumido daquele grupo de MP na linha (ex: kg de cobertura escura na L3)
// Retorna: {linha: kgPerdaRateada}
function ratearPerdaCompartilhada(pool,entries,grupoFn){
  if(!pool||pool<=0)return{};
  const consumoPorLinha={};let totalConsumo=0;
  entries.forEach(e=>{
    const kg=+(grupoFn(e)||0);
    if(kg<=0)return;
    if(!consumoPorLinha[e.linha])consumoPorLinha[e.linha]=0;
    consumoPorLinha[e.linha]+=kg;
    totalConsumo+=kg;
  });
  const rateio={};
  if(totalConsumo<=0)return rateio;
  Object.entries(consumoPorLinha).forEach(([ln,kg])=>{
    rateio[ln]=r2((kg/totalConsumo)*pool);
  });
  return rateio;
}

// Versão genérica: rateia uma perda compartilhada entre linhas usando peso=kg produzido pela linha no dia
// entries: registros de UM dia (pode incluir várias linhas)
function ratearPerdaPorProducao(pool,entries){
  return ratearPerdaCompartilhada(pool,entries,e=>{
    // kg embalado pela linha; se não houver embalagem, usa dosagem
    let kg=0;
    const embs=e.embalagens||[];
    if(embs.length){embs.forEach(em=>{kg+=((+em.real||0)*(+em.gram||0))/1000;});}
    else{(e.dosagens||[]).forEach(d=>{kg+=((+d.real||0)*(+d.gram||0))/1000;});}
    return kg;
  });
}

// ── 3) SEPARAÇÃO PERDA ESPECÍFICA × COMPARTILHADA ──
// Recebe a lista de perdasEspecificas de TODAS as entries de UM dia
// Retorna: {especificaPorSku:{sku:{tipo:kg,...}}, totalEspecificaPorTipo:{tipo:kg}}
function consolidarPerdasEspecificas(entries){
  const porSku={};const totalPorTipo={};
  entries.forEach(e=>{
    (e.perdasEspecificas||[]).forEach(pe=>{
      const sku=pe.sku||'';const tipo=pe.tipo||'';const kg=+pe.kg||0;
      if(!sku||!tipo||kg<=0)return;
      if(!porSku[sku])porSku[sku]={};
      porSku[sku][tipo]=(porSku[sku][tipo]||0)+kg;
      totalPorTipo[tipo]=(totalPorTipo[tipo]||0)+kg;
    });
  });
  // Arredonda
  Object.values(porSku).forEach(o=>Object.keys(o).forEach(k=>{o[k]=r2(o[k]);}));
  Object.keys(totalPorTipo).forEach(k=>{totalPorTipo[k]=r2(totalPorTipo[k]);});
  return{porSku,totalPorTipo};
}

// Atribui a perda total de um tipo a SKUs: específicas primeiro, compartilhada rateada depois
// total: perda total do tipo no dia/linha
// especificas: {sku:kg} (somente desse tipo)
// rateioFn(sku) → kg do SKU produzido (para rateio)
function atribuirPerdaPorSku(total,especificas,skusDoTipo,rateioFn){
  const out={};let somaEsp=0;
  Object.entries(especificas||{}).forEach(([sku,kg])=>{out[sku]=r2(kg);somaEsp+=kg;});
  const sobra=Math.max(0,total-somaEsp);
  // Resta rateia entre SKUs do tipo (excluindo os já com específica? — não, soma)
  if(sobra>0&&skusDoTipo.length){
    let totalProd=0;const prods={};
    skusDoTipo.forEach(sku=>{const k=+(rateioFn(sku)||0);prods[sku]=k;totalProd+=k;});
    if(totalProd>0){
      Object.entries(prods).forEach(([sku,kg])=>{
        const rat=(kg/totalProd)*sobra;
        out[sku]=r2((out[sku]||0)+rat);
      });
    }
  }
  return out;
}

// ── 4) SOBREPESO ISOLADO (cobertura × dosagem) ──
// Para um SKU embalado no dia D que foi dosado no dia D-n:
// - sobrepesoFinalKg: medido em pesagens FINAL no dia D
// - sobrepesoDosagemKg: medido em pesagens COMBINAÇÃO no dia D-n
// - sobrepesoCoberturaKg: diferença (cobertura adicionou esse excedente)
// 
// pesagensFinal: array de pesagens com ponto='final' e sku do SKU em questão no dia D
// pesagensDose: array de pesagens com ponto='combinacao' e linha_dosagem da mesma linha no dia D-n
// gramFinal: gramatura nominal do SKU final
// gramDose: gramatura nominal da combinação (opcional; se ausente, usa proporção 0.78 do gramFinal)
// alfEmbalados: unidades embaladas do SKU no dia D
function sobrepesoIsolado(pesagensFinal,pesagensDose,gramFinal,gramDose,alfEmbalados){
  // Sobrepeso final (cobertura D)
  const wF=[];pesagensFinal.forEach(p=>[p.p1,p.p2,p.p3,p.p4,p.p5].filter(v=>v!=null).forEach(v=>wF.push(+v)));
  let meanF=null,sobrFinalPerUnit=0;
  if(wF.length){meanF=wF.reduce((a,b)=>a+b,0)/wF.length;sobrFinalPerUnit=Math.max(0,meanF-gramFinal);}
  const sobrFinalKg=r2(sobrFinalPerUnit*alfEmbalados/1000);

  // Sobrepeso dosagem (D-n) — peso da combinação biscoito+recheio
  const wD=[];pesagensDose.forEach(p=>[p.p1,p.p2,p.p3,p.p4,p.p5].filter(v=>v!=null).forEach(v=>wD.push(+v)));
  let meanD=null,sobrDosePerUnit=0;
  const gramDoseRef=gramDose||(gramFinal*0.78); // fallback 78% do peso final
  if(wD.length){meanD=wD.reduce((a,b)=>a+b,0)/wD.length;sobrDosePerUnit=Math.max(0,meanD-gramDoseRef);}
  const sobrDoseKg=r2(sobrDosePerUnit*alfEmbalados/1000);

  // Sobrepeso da cobertura = final - dosagem
  const sobrCobPerUnit=Math.max(0,sobrFinalPerUnit-sobrDosePerUnit);
  const sobrCobKg=r2(sobrCobPerUnit*alfEmbalados/1000);

  return{
    sobrFinalKg,sobrFinalPerUnit:r2(sobrFinalPerUnit),meanF:meanF?r2(meanF):null,nFinal:wF.length,
    sobrDoseKg,sobrDosePerUnit:r2(sobrDosePerUnit),meanD:meanD?r2(meanD):null,nDose:wD.length,gramDoseRef:r2(gramDoseRef),
    sobrCoberturaKg:sobrCobKg,sobrCoberturaPerUnit:r2(sobrCobPerUnit),
    completo:wF.length>0&&wD.length>0  // só é confiável se ambas amostras existem
  };
}

// ── 5) BOPP TEÓRICO × REAL × OMIE ──
// Retorna a gramatura do BOPP (gramas/unidade) conforme categoria do SKU
function getFlowpackPeso(sku,desc){
  const c=(sku||'').toUpperCase(),d=(desc||'').toUpperCase();
  if(c==='PP29001'||c==='PP30001'||d.includes('ZERO'))return FLOWPACK_PESO.zero||0.6;
  if(c.startsWith('PP03')||d.includes('MINI'))return FLOWPACK_PESO.mini||0.4;
  if(c.startsWith('PP18')||c.startsWith('PP19')||c.startsWith('PP20')||c.startsWith('PP24')||c.startsWith('PP26')||c.startsWith('PP27')||d.includes('CROCANTE'))return FLOWPACK_PESO.crocante||0.5;
  return FLOWPACK_PESO.classico||0.8;
}

// BOPP teórico em kg = unidades × gramatura BOPP / 1000
function boppTeorico(unidadesEmbaladas,sku,desc){
  const pesoUnit=getFlowpackPeso(sku,desc);
  return r2((unidadesEmbaladas*pesoUnit)/1000);
}

// BOPP teórico de uma entry inteira (somando todas as embalagens)
function boppTeoricoEntry(entry){
  let total=0;
  (entry.embalagens||[]).forEach(em=>{total+=boppTeorico(+em.real||0,em.sku,em.desc);});
  return r2(total);
}

// BOPP teórico consolidado de um período (entries)
function boppTeoricoPeriodo(entries){
  let total=0;
  entries.forEach(e=>{total+=boppTeoricoEntry(e);});
  return r2(total);
}

// Diferença OMIE de embalagem: real consumido - teórico esperado
// Se positivo: consumiu mais BOPP que o esperado (perda real)
// Se negativo: consumiu menos (ganho — possível subapontamento)
function diffOmieEmbalagem(boppReal,boppTeoricoKg){
  return r2((+boppReal||0)-(+boppTeoricoKg||0));
}

// ── 6) TOTALIZADORES PARA OS CARDS NOVOS ──
// Soma das perdas REAIS (medidas no chão de fábrica)
// Categorias: A (MP) + B (Produto) + C (BOPP)
function perdaTotalReal(entries,sobrepesoKg){
  const A=entries.reduce((s,e)=>s+(e.perdaQuebraFornecKg||0)+(e.perdaVarrBiscKg||0)+(e.perdaRejeitoDosKg||0),0);
  const B=entries.reduce((s,e)=>s+(e.perdaVarrDosKg||0)+(e.perdaVarrCobKg||0),0)+(sobrepesoKg||0);
  const C=entries.reduce((s,e)=>s+(e.perdaBoppKg||0),0);
  return{A:r2(A),B:r2(B),C:r2(C),total:r2(A+B+C)};
}

// Soma dos GAPS OMIE (em valor absoluto, pois OMIE pode ser + ou -)
function perdaTotalOmie(entries){
  const bisc=entries.reduce((s,e)=>s+(e.omieBiscoitoKg||0),0);
  const rech=entries.reduce((s,e)=>s+(e.omieRecheiosKg||0),0);
  const cob=entries.reduce((s,e)=>s+(e.omieCoberturasKg||0),0);
  const bopp=entries.reduce((s,e)=>s+(e.omieBoppKg||0),0);
  return{
    biscoito:r2(bisc),recheios:r2(rech),coberturas:r2(cob),bopp:r2(bopp),
    somaAbs:r2(Math.abs(bisc)+Math.abs(rech)+Math.abs(cob)+Math.abs(bopp)),
    soma:r2(bisc+rech+cob+bopp)
  };
}

// ── 7) FORMATADORES DE EXIBIÇÃO DE PERDAS (2 casas decimais) ──
function fmtKg(n){return fmt2(n)+' kg';}
function fmtPct(n){return fmt2(n)+'%';}
