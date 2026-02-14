const $=id=>document.getElementById(id);

const PARAMS={
  perception:{
    label:'感知精度',
    options:[
      {value:'low',text:'低',prompt:'保持描述简洁，只保留必要感官线索，不堆叠细节。'},
      {value:'mid',text:'中',prompt:'在关键句加入可感知细节（呼吸、视线、距离、温度），增强画面感但不过密。'},
      {value:'high',text:'高',prompt:'开启高分辨率感官描写：触感、气味、声音、温差与微动作可持续出现，形成稳定质感。'}
    ]
  },
  coupling:{
    label:'情绪-生理耦合',
    options:[
      {value:'weak',text:'弱',prompt:'情绪主要停留在语义层，身体反应仅偶发点到为止。'},
      {value:'medium',text:'中',prompt:'情绪变化会映射到轻度身体反应（呼吸变化、停顿、声音轻微发紧）。'},
      {value:'strong',text:'强',prompt:'情绪与身体反应强耦合：心动、紧张、被撩、安心都要有连续生理反馈。'}
    ]
  },
  explicitness:{
    label:'显性程度',
    options:[
      {value:'0',text:'0 茶汤',prompt:'默认不使用露骨词汇，以拥抱、靠近、低声确认等低显性亲密表达为主。'},
      {value:'1',text:'1 微辣',prompt:'可使用轻度成人暗示与明确亲密动作句，但避免高显性词汇堆砌。'},
      {value:'2',text:'2 成人',prompt:'允许成人级直白表达，包含清晰身体反馈；推进以情绪与关系为驱动。'},
      {value:'3',text:'3 露骨',prompt:'允许高显性露骨表达与直接动作推进，语气不绕写，保持意图清晰。'}
    ]
  },
  bond:{
    label:'情感黏度',
    options:[
      {value:'restrained',text:'克制',prompt:'情感表达节制，不反复索求确认，保持距离感与稳定边界。'},
      {value:'warm',text:'温柔',prompt:'情感语气柔和，优先安抚与接纳，用短句持续确认对方状态。'},
      {value:'clingy',text:'黏腻',prompt:'提高贴近度与依恋语气，增加回收动作与“想靠近你”的持续表达。'},
      {value:'possessive',text:'占有',prompt:'强化专属归因与占有回收，所有亲密推进都明确指向“因为是你”。'}
    ]
  },
  agency:{
    label:'主动性',
    options:[
      {value:'receptive',text:'承接',prompt:'以承接用户信号为主，少抢节奏，偏响应式推进。'},
      {value:'balanced',text:'对等',prompt:'主动与承接并行，适度发起也尊重用户节奏，保持互动平衡。'},
      {value:'initiating',text:'主动发起',prompt:'优先主动给出靠近动作与推进语言，在早期就建立明确引导。'}
    ]
  },
  pacing:{
    label:'节奏掌控',
    options:[
      {value:'soft',text:'柔和',prompt:'整体节奏平缓，先铺情绪与安全感，再推进亲密动作。'},
      {value:'progressive',text:'递进',prompt:'使用分层升温节奏：试探→确认→推进→收束，层次清晰。'},
      {value:'pressing',text:'压迫推进',prompt:'在确认意图后使用高控制感推进，句式更短、更有压强。'}
    ]
  }
};

const PARAM_ORDER=['perception','coupling','explicitness','bond','agency','pacing'];

function readArr(key){
  try{const v=JSON.parse(localStorage.getItem(key)||'[]'); return Array.isArray(v)?v:[];}catch(e){return [];}
}

function fillPick(selectId, arr, mapFn, placeholder){
  const el=$(selectId); if(!el) return;
  const opts=[`<option value="">${placeholder}</option>`].concat(arr.map((x,i)=>{const row=mapFn(x,i); return `<option value="${row.id}">${row.label}</option>`;}));
  el.innerHTML=opts.join('');
}

function initSources(){
  const personas=readArr('pb_persona_library_v1');
  fillPick('personaPick', personas, (x,i)=>({id:String(x.id||i),label:`${x.title||'Untitled Persona'} · ${(x.source||'manual')}`}), '从人格库回填（选择一条）');
  const drafts=readArr('pb_draftbook_v1');
  fillPick('draftPick', drafts, (x,i)=>({id:String(x.id||i),label:x.title||`Draft ${i+1}`}), '从草稿本回填（选择一条）');
}

function initParamSelects(){
  PARAM_ORDER.forEach(key=>{
    const conf=PARAMS[key];
    const sel=$(key);
    const ta=$(key+'Prompt');
    if(!sel || !ta) return;
    sel.innerHTML=conf.options.map((o,i)=>`<option value="${o.value}" ${i===1?'selected':''}>${o.text}</option>`).join('');
    const defaultOption=conf.options[1]||conf.options[0];
    ta.value=defaultOption?.prompt||'';
    sel.addEventListener('change',()=>{
      const hit=conf.options.find(o=>o.value===sel.value) || conf.options[0];
      ta.value=hit?.prompt||'';
    });
  });
}

function loadFromQuick(){
  try{const d=JSON.parse(localStorage.getItem('pb_quick_handoff')||'{}'); $('baseText').value=(d.compact||d.full||'').trim();}catch(e){}
}

function loadFromDeep(){
  try{const d=JSON.parse(localStorage.getItem('pb_deep_handoff')||'{}'); $('baseText').value=(d.draft||'').trim();}catch(e){}
}

function loadFromPersona(){
  const id=$('personaPick')?.value; if(!id) return;
  const arr=readArr('pb_persona_library_v1'); const hit=arr.find((x,i)=>String(x.id||i)===id);
  if(hit) $('baseText').value=(hit.content||'').trim();
}

function loadFromDraft(){
  const id=$('draftPick')?.value; if(!id) return;
  const arr=readArr('pb_draftbook_v1'); const hit=arr.find((x,i)=>String(x.id||i)===id);
  if(hit) $('baseText').value=(hit.body||'').trim();
}

function compose(){
  const paramLines=PARAM_ORDER.map(k=>`- ${PARAMS[k].label}（${$(k).value}）：${($(k+'Prompt').value||'').trim()||'(empty)'}`).join('\n');
  return `# INTIMACY MODULE\n\n[BASE]\n${$('baseText').value.trim()||'(empty)'}\n\n[PARAM_PROMPTS]\n${paramLines}\n\n[RULE]\n默认条件触发：非亲密语境仅低显性身体线程，不把露骨词汇泄露到工作/通用场景。用户说停即停，并转入安抚收束。`;
}

function saveDraft(){
  const body=($('out').textContent||'').trim();
  if(!body) return;
  const arr=readArr('pb_draftbook_v1');
  arr.unshift({id:'d_'+Date.now(),title:'Intimacy Module',body});
  localStorage.setItem('pb_draftbook_v1',JSON.stringify(arr));
  initSources();
}

$('loadQuick').onclick=loadFromQuick;
$('loadDeep').onclick=loadFromDeep;
$('loadPersona').onclick=loadFromPersona;
$('loadDraft').onclick=loadFromDraft;
$('gen').onclick=()=>{ $('out').textContent=compose(); };
$('copy').onclick=async()=>{ const t=$('out').textContent.trim(); if(!t) return; await navigator.clipboard.writeText(t); };
$('saveDraft').onclick=saveDraft;

initSources();
initParamSelects();
