// ═══════════════════════════════════════════════════════════
// ODARA PQCDSM v9 — Shared Module
// ═══════════════════════════════════════════════════════════
const SB_URL='https://khqbimmcibutfrfmkoxr.supabase.co';
const SB_KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtocWJpbW1jaWJ1dGZyZm1rb3hyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzNTY1NjUsImV4cCI6MjA4OTkzMjU2NX0.w3vRAPhiU7Zavgkiv-ldjbHc_UJeGH9ck2tq_YN6MBo';
const SB_H={'apikey':SB_KEY,'Authorization':'Bearer '+SB_KEY,'Content-Type':'application/json'};

// ── SKUs ──
const SKUS={L1:[{cod:'PP01001',desc:'ALFAJOR CLASSICO TRADICIONAL 65G CX72',gram:65},{cod:'PP02001',desc:'ALFAJOR CLASSICO BRANCO 65G CX72',gram:65},{cod:'PP05001',desc:'ALFAJOR CLASSICO DARK 65G CX72',gram:65},{cod:'PP08006',desc:'ALFAJOR CLASSICO MIX 65G KIT6',gram:65},{cod:'PP08042',desc:'ODARA MIX BOAS ENERGIAS 670G KIT5',gram:65},{cod:'PP08043',desc:'ODARA MIX BOAS ENERGIAS CX25',gram:65},{cod:'PP09001',desc:'MERCATTO MEIO AMARGO 65G CX72',gram:65},{cod:'PP10001',desc:'MERCATTO BRANCO 65G CX72',gram:65},{cod:'PP11001',desc:'MERCATTO 70% CACAU 65G CX72',gram:65}],L2:[{cod:'PP03001',desc:'MINI ALFAJOR TRADICIONAL 25G CX108',gram:25},{cod:'PP03008',desc:'DUPLO MINI TRADICIONAL 25G CX72',gram:25},{cod:'PP08009',desc:'CLASSICO MIX PASCOA 65G KIT6',gram:65},{cod:'PP08040',desc:'CLASSICO MIX 65G KIT6 CX48',gram:65},{cod:'PP08044',desc:'MINI CLASSICO MIX 25G KIT8 CX128',gram:25},{cod:'PP29001',desc:'ZERO TRADICIONAL 45G CX72',gram:45},{cod:'PP30001',desc:'ZERO BRANCO 45G CX72',gram:45}],L3:[{cod:'PP12001',desc:'DR PEANUT LEITE EM PO 35G CX48',gram:35},{cod:'PP13001',desc:'DR PEANUT BRIGADEIRO 55G CX48',gram:55},{cod:'PP14001',desc:'DR PEANUT CHOC BRANCO 55G CX48',gram:55},{cod:'PP15001',desc:'DR PEANUT AVELA 35G CX48',gram:35},{cod:'PP18001',desc:'CROCANTE ODARA AVELA 40G CX72',gram:40},{cod:'PP18003',desc:'CROCANTE ODARA AVELA 40G 3UN CX24',gram:40},{cod:'PP19001',desc:'CROCANTE ODARA PACOCA 40G CX72',gram:40},{cod:'PP19003',desc:'CROCANTE ODARA PACOCA 40G CX24',gram:40},{cod:'PP20001',desc:'CROCANTE ODARA MILK 40G CX72',gram:40},{cod:'PP20003',desc:'CROCANTE ODARA MILK 40G CX24',gram:40},{cod:'PP21001',desc:'DR PEANUT COOKIES CREAM 35G CX48',gram:40},{cod:'PP22001',desc:'DR PEANUT DDL CHOC LEITE 35G CX48',gram:40},{cod:'PP23001',desc:'DR PEANUT DDL CHOC BRANCO 55G CX48',gram:55},{cod:'PP26001',desc:'CROCANTE ODARA PRESTIGIO 40G CX72',gram:40},{cod:'PP27001',desc:'CROCANTE ODARA GALAK NEGRESCO 40G CX72',gram:40},{cod:'NOVO-1',desc:'ALFAJOR CHAVES CLARO 55G',gram:55},{cod:'NOVO-2',desc:'ALFAJOR CHAVES ESCURO 55G',gram:55}]};
const ALL_SKUS=Object.values(SKUS).flat();

// ── Checklist (22 items) ──
const PADROES_ITEMS=[{"item":"Metas do turno estão visíveis e atualizadas","obj":"Garantir direcionamento claro da equipe","crit":"media"},{"item":"Indicadores do dia anterior comentados com a equipe","obj":"Fechar o PDCA diário","crit":"media"},{"item":"Prioridades do dia definidas para a equipe","obj":"Evitar ambiguidade na execução","crit":"alta"},{"item":"Equipe uniformizada, roupa limpa e com EPI correto","obj":"Cumprir padrão visual e de segurança","crit":"alta"},{"item":"Equipe iniciou no horário previsto","obj":"Reforçar disciplina e estabilidade de rotina","crit":"media"},{"item":"Operadores alocados habilitados para o posto","obj":"Evitar variação por falta de treinamento","crit":"alta"},{"item":"Linha liberada limpa e organizada antes do início","obj":"Começar o turno em condição padrão","crit":"alta"},{"item":"Dispositivos, sensores e proteções em condição","obj":"Assegurar operação padrão e segura","crit":"alta"},{"item":"Troca de produto/formato seguiu procedimento padrão","obj":"Reduzir erro de setup","crit":"alta"},{"item":"Primeiro produto do lote validado antes de seguir","obj":"Evitar desvio em massa","crit":"alta"},{"item":"Parâmetros de processo padrão respeitados","obj":"Reduzir variação de processo","crit":"alta"},{"item":"Todos os materiais abertos identificados","obj":"Garantir rastreabilidade e controle","crit":"alta"},{"item":"Sequência FIFO/FEFO respeitada","obj":"Evitar vencimento e desvios","crit":"media"},{"item":"PCCs ou PPROs verificados no prazo","obj":"Atender plano de controle","crit":"alta"},{"item":"Ações para desvio PCC/PPRO executadas conforme padrão","obj":"Garantir resposta padronizada","crit":"alta"},{"item":"Postos organizados sem excesso de itens","obj":"Evitar desordem e variação","crit":"media"},{"item":"Pisos, bancadas e equipamentos limpos durante o turno","obj":"Manter condição básica","crit":"alta"},{"item":"Resíduos em recipientes corretos sem acúmulo","obj":"Preservar higiene e disciplina","crit":"media"},{"item":"Registros obrigatórios do turno completos","obj":"Manter disciplina documental","crit":"alta"},{"item":"Desvios do turno com responsável e prazo definidos","obj":"Fechar ciclo de ação","crit":"alta"},{"item":"Pendências comunicadas ao próximo turno","obj":"Evitar ruptura de informação","crit":"alta"},{"item":"Área entregue limpa e organizada","obj":"Garantir partida padrão do turno seguinte","crit":"alta"}];

// ── Bird levels ──
const BYRD_LEVELS=["Quase-acidente","Dano material","Lesão leve","Acidente grave"];
const BYRD_COLORS={"Quase-acidente":"#3B82F6","Dano material":"#F59E0B","Lesão leve":"#F97316","Acidente grave":"#DC2626"};

// ── Costs (defaults, overridden by config) ──
let CUSTOS={biscoito_kg:15,dl_kg:15,chocolate_kg:25,embalagem_un:0.5};
let METAS={P:95,Q:3,S:0,M:95,PAD:90};

// ── OEE Theoretical Production (from Arquivo de planejamento de OEE.xlsx) ──
// T1: 8.8h brutas, 2h PP, 6.8h líquidas
// T2 (meio segundo turno, a partir de 13/abr/2026): +8.8h brutas, +6.6h líquidas na linha escalada
const OEE_TEORICO={
  L1:{velNominal:7500,outputH:2945,outputDia:25920,horasOcupadas:8.8,ppH:2,horasLiqT1:6.8,horasLiqT2:6.6},
  L2:{velNominal:3420,outputH:982,outputDia:8640,horasOcupadas:8.8,ppH:2,horasLiqT1:6.8,horasLiqT2:6.6},
  L3:{velNominal:6240,outputH:2273,outputDia:20000,horasOcupadas:8.8,ppH:2,horasLiqT1:6.8,horasLiqT2:6.6}
};

// ═══ SUPABASE HELPERS ═══
async function sbQuery(table,params=''){
  const r=await fetch(SB_URL+'/rest/v1/'+table+'?'+params,{headers:SB_H});
  if(!r.ok)throw new Error('HTTP '+r.status);return await r.json();
}
async function sbInsert(table,data){
  const r=await fetch(SB_URL+'/rest/v1/'+table,{method:'POST',headers:{...SB_H,'Prefer':'return=minimal'},body:JSON.stringify(data)});
  if(!r.ok)throw new Error('HTTP '+r.status+': '+(await r.text()));return true;
}
async function sbUpdate(table,id,data){
  const r=await fetch(SB_URL+'/rest/v1/'+table+'?id=eq.'+id,{method:'PATCH',headers:{...SB_H,'Prefer':'return=minimal'},body:JSON.stringify(data)});
  if(!r.ok)throw new Error('HTTP '+r.status);return true;
}
async function sbGetConfig(){
  try{
    const rows=await sbQuery('config','select=*');
    rows.forEach(r=>{
      if(r.chave==='custos'&&r.valor)Object.assign(CUSTOS,r.valor);
      if(r.chave==='metas'&&r.valor)Object.assign(METAS,r.valor);
    });
    return rows;
  }catch(e){console.warn('Config load failed:',e);return[];}
}

// ═══ HELPERS ═══
const pct=(a,b)=>b>0?+((a/b)*100).toFixed(1):null;
const avg=(arr,fn)=>{const v=arr.map(fn).filter(x=>x!==null&&!isNaN(x));return v.length?+(v.reduce((a,b)=>a+b,0)/v.length).toFixed(2):null;};
const sum=(arr,fn)=>{const v=arr.map(fn).filter(x=>x!==null);return v.length?+v.reduce((a,b)=>a+b,0).toFixed(1):null;};
function kpiColor(p,val,metas){if(val===null)return'#9CA3AF';const v=+val,m=metas||METAS;return({P:v>=m.P?'#15803D':v>=m.P*0.85?'#C2410C':'#CC2929',Q:v<=m.Q?'#15803D':v<=m.Q*2?'#C2410C':'#CC2929',S:v<=m.S?'#15803D':'#CC2929',M:v>=m.M?'#15803D':v>=m.M*0.93?'#C2410C':'#CC2929',PAD:v>=m.PAD?'#15803D':v>=m.PAD*0.8?'#C2410C':'#CC2929'})[p]||'#9CA3AF';}

function norm(r){return{id:r.id,data:r.data,linha:r.linha||'',turno:r.turno||'',supervisor:r.supervisor||'',sku:r.sku||'',skuDesc:r.sku_desc||'',skuGram:+r.sku_gram||0,metaCarr:+r.meta_carr||0,realCarr:+r.real_carr||0,metaUnid:+r.meta_unid||0,realUnid:+r.real_unid||0,retrabalho:+r.retrabalho||0,perdas:+r.perdas||0,perdaBisc:+r.perda_biscoito||0,perdaDos:+r.perda_dosado||0,perdaCob:+r.perda_coberto||0,perdaDlKg:+r.perda_dl_kg||0,perdaBiscoitoKg:+r.perda_biscoito_kg||0,perdaRejeitoDosKg:+r.perda_rejeito_dosado_kg||0,perdaQuebraKg:+r.perda_quebra_bolacha_kg||0,perdaDosadoUn:+r.perda_dosado_un||0,perdaCobertoUn:+r.perda_coberto_un||0,perdaChocolateUn:+r.perda_chocolate_un||0,perdaVarreduraKg:+r.perda_varredura_kg||0,perdaBoppKg:+r.perda_bopp_kg||0,comentarioPerdas:r.comentario_perdas||'',paradaManut:r.parada_manut||false,paradaManutMin:+r.parada_manut_min||0,tipoInput:r.tipo_input||'embalagem',tipoProduto:r.tipo_produto||'',totalColab:+r.total_colab||0,presentes:+r.presentes||0,biscPad:+r.bisc_pad||0,biscMedia:+r.bisc_media||0,biscN:+r.bisc_n||0,biscDp:+r.bisc_dp||0,dlPad:+r.dl_pad||0,dlMedia:+r.dl_media||0,dlN:+r.dl_n||0,dlDp:+r.dl_dp||0,cobPad:+r.cob_pad||0,cobReal:+r.cob_real||0,ncs:Array.isArray(r.ncs)?r.ncs:[],incidentes:Array.isArray(r.incidentes)?r.incidentes:[],padroes:(r.padroes&&typeof r.padroes==='object'&&!Array.isArray(r.padroes))?r.padroes:{},padroesComentarios:(r.padroes_comentarios&&typeof r.padroes_comentarios==='object')?r.padroes_comentarios:{},comentarioP:r.comentario_p||'',comentarioQ:r.comentario_q||'',deletedAt:r.deleted_at||null,deletedBy:r.deleted_by||null,editLog:Array.isArray(r.edit_log)?r.edit_log:[],skusProd:Array.isArray(r.skus_produzidos)?r.skus_produzidos:[]};}
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
function normalPDF(x,mu,sd){return(1/(sd*Math.sqrt(2*Math.PI)))*Math.exp(-0.5*Math.pow((x-mu)/sd,2));}

// ═══ UI HELPERS ═══
function showToast(msg,type='ok'){const t=document.getElementById('toast');if(!t)return;t.textContent=msg;t.className='toast '+type+' show';setTimeout(()=>t.classList.remove('show'),3000);}
function today(){return new Date().toISOString().slice(0,10);}

// ═══ NAV ═══
function renderNav(active){
  const pages=[
    {id:'dia',icon:'📊',label:'Dia',href:'index.html'},
    {id:'tendencias',icon:'📈',label:'Tendências',href:'tendencias.html'},
    {id:'entrada',icon:'📋',label:'Entrada',href:'entrada.html'},
    {id:'pesagens',icon:'⚖️',label:'Pesagens',href:'pesagens.html'},
    {id:'analise',icon:'🔬',label:'Análise',href:'analise.html'},
    {id:'historico',icon:'📅',label:'Histórico',href:'historico.html'},
    {id:'acoes',icon:'🎯',label:'Ações',href:'acoes.html'},
    {id:'config',icon:'⚙️',label:'Config',href:'config.html'},
  ];
  const nav=document.getElementById('main-nav');
  if(!nav)return;
  nav.innerHTML=pages.map(p=>'<a href="'+p.href+'" class="nav-link'+(p.id===active?' active':'')+'">'+p.icon+' '+p.label+'</a>').join('');
}
