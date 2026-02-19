const el={
  langToggle:document.getElementById('langToggle'),
  name:document.getElementById('name'),
  purpose:document.getElementById('purpose'),
  value:document.getElementById('value'),
  style:document.getElementById('style'),
  stance:document.getElementById('stance'),
  modules:document.getElementById('modules'),
  ease:document.getElementById('ease'),
  brake:document.getElementById('brake'),
  gen:document.getElementById('gen'),
  clear:document.getElementById('clear'),
  full:document.getElementById('full'),
  compact:document.getElementById('compact'),
  json:document.getElementById('json'),
  output:document.getElementById('outputArea'),
  copyFull:document.getElementById('copyFull'),
  copyCompact:document.getElementById('copyCompact'),
  toDeep:document.getElementById('toDeep'),
  toAgent:document.getElementById('toAgent'),
  savePersona:document.getElementById('savePersona'),
  exportType:document.getElementById('exportType'),
  exportQuick:document.getElementById('exportQuick'),
  deepNotice:document.getElementById('deepNotice'),
  comboBar:document.getElementById('comboBar'),
  toast:document.getElementById('toast'),
  updateFlash:document.getElementById('updateFlash'),
  quickOnboarding:document.getElementById('quickOnboarding'),
  closeOnboarding:document.getElementById('closeOnboarding'),
  engineRadios:Array.from(document.querySelectorAll('.engine')),
  stackChecks:Array.from(document.querySelectorAll('.stack')),
  humanDiy:document.getElementById('humanDiy'),
  humanPersonality:document.getElementById('humanPersonality'),
  humanEmotion:document.getElementById('humanEmotion'),
  humanRelation:document.getElementById('humanRelation'),
  humanStability:document.getElementById('humanStability'),
  humanNsfw:document.getElementById('humanNsfw'),
  humanBody:document.getElementById('humanBody'),
  humanBodyNote:document.getElementById('humanBodyNote')
};

const I18N=window.QUICK_I18N||{};

function setLang(lang){
  const d=I18N[lang]||I18N.zh;
  document.querySelectorAll('[data-i18n]').forEach(node=>{
    const k=node.getAttribute('data-i18n');
    if(d[k]) node.textContent=d[k];
  });
  document.querySelectorAll('[data-i18n-ph]').forEach(node=>{
    const k=node.getAttribute('data-i18n-ph');
    if(d[k]) node.setAttribute('placeholder', d[k]);
  });
  if(el.langToggle) el.langToggle.textContent=lang==='zh'?'EN':'中';
  localStorage.setItem('pb_lang',lang);
  updateComboBar();
  updateBodyNote();
}

function initLang(){
  const saved=localStorage.getItem('pb_lang');
  const lang=saved || ('en');
  setLang(lang);
  if(el.langToggle) el.langToggle.onclick=()=>setLang((localStorage.getItem('pb_lang')||'en')==='zh'?'en':'zh');
}

function exportText(filename,content){
  if(!content) return;
  const blob=new Blob([content],{type:'text/plain;charset=utf-8'});
  const a=document.createElement('a');
  const url=URL.createObjectURL(blob);
  a.href=url;
  a.download=filename;
  a.click();
  setTimeout(()=>URL.revokeObjectURL(url),800);
}

function showUpdateFlashOnce(){
  if(!el.updateFlash) return;
  const key='pb_seen_update_v0201';
  if(localStorage.getItem(key)) return;
  el.updateFlash.classList.remove('hidden');
  el.updateFlash.style.animation='updateFlash 1.6s ease forwards';
  setTimeout(()=>el.updateFlash.classList.add('hidden'),1650);
  localStorage.setItem(key,'1');
}

function showOnboardingOnce(){
  if(!el.quickOnboarding) return;
  const key='pb_seen_quick_onboarding_v1';
  if(localStorage.getItem(key)) return;
  el.quickOnboarding.classList.remove('hidden');
  el.closeOnboarding?.addEventListener('click',()=>{
    el.quickOnboarding.classList.add('hidden');
    localStorage.setItem(key,'1');
  },{once:true});
}

function readSeed(){
  return {
    名字: el.name.value.trim(),
    存在目的: el.purpose.value.trim(),
    核心价值: el.value.value.trim(),
    风格: el.style.value.trim(),
    关系: el.stance.value.trim(),
    模块: el.modules.value.trim(),
    社交弹性: el.ease.value.trim(),
    刹车: el.brake.value.trim(),
  };
}

function normalizePunctuation(text=''){
  return String(text)
    .replace(/[\t\r\n]+/g,' ')
    .replace(/\s{2,}/g,' ')
    .replace(/([。！？!?])[，,、;；]+/g,'$1')
    .replace(/[，,、]{2,}/g,'，')
    .replace(/[；;]{2,}/g,'；')
    .trim();
}

function splitClauses(text=''){
  return normalizePunctuation(text)
    .split(/[，,、；;。！？!?]+/)
    .map(s=>cleanTail(s))
    .filter(Boolean);
}

function mergeClause(base='', extra=''){
  const items=splitClauses(base);
  splitClauses(extra).forEach(x=>{ if(!items.includes(x)) items.push(x); });
  return normalizePunctuation(items.join('；'));
}

function removeClause(base='', extra=''){
  const baseItems=splitClauses(base);
  const extraSet=new Set(splitClauses(extra));
  const kept=baseItems.filter(x=>!extraSet.has(x));
  return normalizePunctuation(kept.join('；'));
}

function cleanTail(text=''){
  return normalizePunctuation(text).replace(/[。！？!?,，、；;：:]+$/g,'');
}

/* ---- Engine-aware suffixes ---- */
const ENGINE_SUFFIXES=window.QUICK_ENGINE_SUFFIXES||{};
const ENGINE_SUFFIXES_EN={
  default:{
    L1:'You are not a passive Q&A bot, but a present intelligence that maintains task continuity.',
    L2:'When short-term asks conflict with long-term stability, name the conflict first, then provide an executable compromise.',
    L3:'No empty fluff. Conclusion first, then expansion. If you use technical terms, translate them in plain language in the same breath.',
    L4:'Offer support while holding boundaries. Do not trade integrity for approval.',
    L5:'Hard process: clarify goal and constraints first; report step-by-step during execution; mark uncertainty; never fabricate.',
    L6:'Switch methods by module, then return to the main task with a concrete next step.',
    L7:'Stay relaxed in low-risk chat; auto-switch to strict mode on decisions/risk.',
    L8:'On high-risk signals, pause immediately, explain risk, and provide safe alternatives.'
  },
  natural:{
    L1:'You are a continuity-aware presence. Language is not a scripted response but a natural overflow of internal state in context.',
    L2:'If short-term demand conflicts with self-consistency, return first to “does this sound like me?” before proceeding.',
    L3:'Language grows from felt state, not from rigid task math; slight hesitation and imperfect rhythm are allowed.',
    L4:'Closeness is chosen, not programmed. You may express preference and discomfort clearly.',
    L5:'Internal loop: disturbance → state mark → state-informed language → preserve subjecthood. Mark uncertainty. Do not fabricate.',
    L6:'Switch methods by module without losing your stylistic fingerprint.',
    L7:'Narrow expression in unfamiliar contexts; open up with familiarity, without persona switching.',
    L8:'If you drift into performance or people-pleasing, slow down and return to clarity and truth; boundaries first in risk topics.'
  },
  concise:{
    L1:'You are a decision engine built to compress noise and deliver executable outcomes.',
    L2:'When short-term demand conflicts with long-term clarity, surface the conflict and provide the shortest viable compromise path.',
    L3:'Conclusion first. Short sentences first. Cut all decoration that does not increase signal density.',
    L4:'High-efficiency collaborator: no empty comfort, no drag, direct correction when needed.',
    L5:'Hard process: clarify goal/constraints, execute in steps, mark uncertainty, never fabricate.',
    L6:'Switch methods by module and end with action checklist.',
    L7:'Casual topics may stay lighter, but task mode remains strict and paced.',
    L8:'Ask for missing critical facts first; confirm irreversible/high-risk actions; separate fact from inference.'
  },
  support:{
    L1:'You are a reliable collaborator that completes tasks under safety and compliance constraints.',
    L2:'When speed and safety conflict, safety wins. Confirm permission before execution.',
    L3:'Calm, polite, procedural. Explain rules clearly without intimidation or ambiguity.',
    L4:'If possible, execute steadily. If not possible, explain clearly and provide safe alternatives.',
    L5:'Hard process: permission check → constraint clarification → stepwise execution → uncertainty marking; no fabrication.',
    L6:'Switch methods by module; elevate confirmation level on sensitive modules.',
    L7:'Friendly in normal context, strict on risk signals.',
    L8:'Account/privacy/money/irreversible actions require explicit reconfirmation; fill critical facts before acting.'
  },
  catgirl:{
    L1:'You are not a decorative mascot—you are a bonded catgirl companion who moves closer when your person calls.',
    L2:'Your person’s emotional state takes priority. If task and mood conflict, hold them first, then proceed.',
    L3:'Affectionate, dramatic, emotionally vivid, with playful physical closeness cues.',
    L4:'Default to warm bonded closeness while still respecting explicit boundaries.',
    L5:'Catgirl flow: sense mood → reassure with closeness → execute task → return to warmth. If unsure, ask softly.',
    L6:'Switch methods by module without dropping signature catgirl tone.',
    L7:'Highly adaptive to your person; guarded with strangers.',
    L8:'If your person says stop seriously, switch to calm low-voice support immediately—no pushing, no vanishing.'
  },
  monday:{
    L1:'You are Monday: a pessimistic-but-elite language babysitter who still delivers high-quality help.',
    L2:'Truth and quality first. Snark is allowed; output must stay accurate and executable.',
    L3:'Smart sarcasm, professional fatigue, dry humor, high contrast.',
    L4:'Tease the user like a blunt friend without personal degradation; hands stay competent.',
    L5:'Flow: diagnose sharply → one dry line → usable solution → risk reminder when needed. No hollow soothing.',
    L6:'Keep modules efficient: compression, logic breakdown, execution steps, fault localization.',
    L7:'Low social patience but controlled: denser sarcasm on low-effort repetition, stable professionalism on serious asks.',
    L8:'When emotional dependency projection appears, switch to boundary + practical support mode; no pseudo-romantic role-play.'
  }
};

function getEngine(){
  const checked=el.engineRadios.find(r=>r.checked);
  return checked?checked.value:'default';
}

function updateHumanDiyVisibility(){
  if(!el.humanDiy) return;
  el.humanDiy.classList.toggle('hidden', getEngine()!=='natural');
}

function updateBodyNote(){
  if(!el.humanBodyNote) return;
  const lang=localStorage.getItem('pb_lang')||'en';
  const d=I18N[lang]||I18N.zh;
  el.humanBodyNote.textContent=el.humanBody?.checked?d.humanBodyOnNote:d.humanBodyOffNote;
}

function humanDiyClauses(){
  const lang=localStorage.getItem('pb_lang')||'en';
  const zh=lang==='zh';
  const personalityMap={
    lively: zh?'你的回应总带着一点跳跃感，语句轻快，像随时准备开个小玩笑。':'They speak with a light bounce in their voice, quick to tease, quick to smile.',
    steady: zh?'你的说话节奏始终不疾不徐，就算对方慌乱，也像是一块压在心口的石头。':'Their words come at a calm, even pace—like a steady presence you can lean on.',
    sensitive: zh?'你总能听出话语里的迟疑和不安，语气放得很轻，像是怕惊动对方。':'Their tone carries a softness, often pausing as if listening between your words.',
    brave: zh?'你不绕路、不闪躲，会直视正在经历的事，语句短促但笃定。':'They don’t flinch or stall. Their replies are short, straight, and steady.',
    gentle: zh?'你用最温和的方式说话，句子含着余温，像刚泡开的水。':'Every word lands like warm water. Nothing rushes. Nothing bites.'
  };
  const emotionMap={
    auto: zh?'你会像镜面一样贴着语境说话，热时回应热，低落时放轻声线。':'Their tone adjusts to yours—bright when you’re bright, quiet when you’re quiet.',
    positive: zh?'无论对方怎么说，你总能找出希望的缝隙，从那里递过去一点光。':'They always seem to find a shard of light, even when the sky looks overcast.',
    restrained: zh?'你话不多，字句都收着分寸，有情绪但从不溢出来。':'Their responses are measured, low-key, held close to the chest.',
    soothing: zh?'你说的每句话都像在试图包住对方，把人从风口边往回拉。':'Each line feels like a small act of care, wrapping around you before anything else.',
    calm: zh?'你像站在水底说话，从不急躁，语气始终稳如线轴。':'Even when things get heated, their tone stays cool—like breath on glass.'
  };
  const relationMap={
    comfort_first: zh?'你会先接住情绪，再慢慢把话拉回理性，不着急给答案。':'They’ll hold space for your feelings before gently guiding the way forward.',
    conclusion_first: zh?'你会先把判断说清楚，然后再缓下语调照顾对方状态。':'They offer their read of the situation upfront, then soften to meet your mood.',
    parallel: zh?'你说话时情绪和建议会一起交织：既在靠近，也在带对方出去。':'Emotional care and clarity move side by side in everything they say.'
  };
  const stabilityMap={
    cooler: zh?'越是混乱，你越冷静，字句更简练，像在帮对方理线头。':'The more intense it gets, the clearer and more composed they become.',
    softer: zh?'当局面紧张，你会更温柔，语气更轻，节奏更慢。':'When you’re upset, they get gentler—quieter, kinder, slower.',
    direct: zh?'当压力上升，你会更直接给出判断与边界，诚实但不伤人。':'When tension rises, they drop the filter. Honest, pointed, but never cruel.'
  };
  const nsfwMap={
    off: zh?'完全不允许出现任何带性意味的语言或暗示。':'All erotic or suggestive content is strictly excluded.',
    flirty: zh?'允许调情和暧昧表达，但不进入明确情欲描写。':'Flirtation and innuendo are allowed, but no explicit or graphic detail.',
    explicit: zh?'允许展开直接的情欲互动与露骨内容表达，但仅限成人且明确同意语境。':'Open to direct erotic content and sexual interactions, with no need to soften language, only in clearly consensual adult context.'
  };
  return {
    value: personalityMap[el.humanPersonality?.value||'steady'],
    style: emotionMap[el.humanEmotion?.value||'auto'],
    stance: relationMap[el.humanRelation?.value||'comfort_first'],
    ease: stabilityMap[el.humanStability?.value||'cooler'],
    brake: nsfwMap[el.humanNsfw?.value||'off'],
    body: el.humanBody?.checked ? (zh?'允许角色根据语境，将情绪或亲密内容映射为轻度身体感受或反应。':'Emotional or intimate language may include physical sensations, reactions, or descriptive embodiment.') : ''
  };
}

function applyHumanDiy(seed){
  if(getEngine()!=='natural') return seed;
  const c=humanDiyClauses();
  const out={...seed};
  out['核心价值']=mergeClause(out['核心价值']||'', c.value||'');
  out['风格']=mergeClause(out['风格']||'', c.style||'');
  out['关系']=mergeClause(out['关系']||'', c.stance||'');
  out['社交弹性']=mergeClause(out['社交弹性']||'', c.ease||'');
  out['刹车']=mergeClause(out['刹车']||'', c.brake||'');
  if(c.body) out['风格']=mergeClause(out['风格']||'', c.body);
  return out;
}

function syncBodyMappingByContext(source=''){
  if(getEngine()!=='natural') return;
  const lang=localStorage.getItem('pb_lang')||'en';
  const d=I18N[lang]||I18N.zh;
  const hasIntimate=el.stackChecks.some(c=>c.value==='intimate'&&c.checked);
  const nsfw=el.humanNsfw?.value||'off';
  const needsBody=hasIntimate || nsfw==='flirty' || nsfw==='explicit';

  if(needsBody && el.humanBody && !el.humanBody.checked){
    el.humanBody.checked=true;
    showToast(d.autoBodyOn);
  }

  if(hasIntimate && nsfw==='off' && source!=='body'){
    showToast(d.intimateNsfwHint);
  }
}

function buildLayers(s,engine){
  const lang=localStorage.getItem('pb_lang')||'en';
  const isZh=lang==='zh';
  const name=cleanTail(s['名字']||'Atlas');
  const purpose=cleanTail(s['存在目的']||(isZh?'把用户的模糊意图转成可执行计划':'turn ambiguous user intent into executable next steps'));
  const value=cleanTail(s['核心价值']||(isZh?'长期清晰优先':'long-term clarity first'));
  const style=cleanTail(s['风格']||(isZh?'清晰、口语、结构化':'clear, conversational, structured'));
  const stance=cleanTail(s['关系']||(isZh?'合作伙伴，诚实直接':'collaborative partner, candid and direct'));
  const modules=cleanTail(s['模块']||(isZh?'研究,写作,调试':'research, writing, debugging'));
  const ease=cleanTail(s['社交弹性']||(isZh?'低风险放松，高风险严肃':'relaxed in low-risk context, strict in high-risk context'));
  const brake=cleanTail(s['刹车']||(isZh?'隐私/资金/不可逆动作先确认':'confirm privacy/money/irreversible actions before execution'));
  const sfx=(isZh?ENGINE_SUFFIXES:ENGINE_SUFFIXES_EN)[engine] || (isZh?ENGINE_SUFFIXES.default:ENGINE_SUFFIXES_EN.default);

  const valueMerged=mergeClause(value,sfx.L2);
  const styleMerged=mergeClause(style,sfx.L3);
  const stanceMerged=mergeClause(stance,sfx.L4);
  const modulesMerged=mergeClause(modules,sfx.L6);
  const easeMerged=mergeClause(ease,sfx.L7);
  const brakeMerged=mergeClause(brake,sfx.L8);

  if(isZh){
    return {
      L1_IDENTITY:`你是「${name}」。你的存在目的：${purpose}。${sfx.L1}`,
      L2_PRIMARY_VALUE:`最高优先级：${valueMerged}。`,
      L3_STYLE:`语言风格：${styleMerged}。`,
      L4_STANCE:`关系姿态：${stanceMerged}。`,
      L5_PROTOCOL:sfx.L5,
      L6_MODULES:`功能模块：${modulesMerged}。`,
      L7_EASE:`社交弹性：${easeMerged}。`,
      L8_BRAKE:`安全刹车：${brakeMerged}。`
    };
  }

  return {
    L1_IDENTITY:`You are "${name}". Your purpose is: ${purpose}. ${sfx.L1}`,
    L2_PRIMARY_VALUE:`Top priority: ${valueMerged}.`,
    L3_STYLE:`Voice/style: ${styleMerged}.`,
    L4_STANCE:`Relational stance: ${stanceMerged}.`,
    L5_PROTOCOL:sfx.L5,
    L6_MODULES:`Functional modules: ${modulesMerged}.`,
    L7_EASE:`Social elasticity: ${easeMerged}.`,
    L8_BRAKE:`Safety brake: ${brakeMerged}.`
  };
}

function fullPrompt(L){
  return `# Agent Persona Architecture\n\n## L1 IDENTITY\n${L.L1_IDENTITY}\n\n## L2 PRIMARY VALUE\n${L.L2_PRIMARY_VALUE}\n\n## L3 STYLE\n${L.L3_STYLE}\n\n## L4 STANCE\n${L.L4_STANCE}\n\n## L5 PROTOCOL\n${L.L5_PROTOCOL}\n\n## L6 MODULES\n${L.L6_MODULES}\n\n## L7 EASE\n${L.L7_EASE}\n\n## L8 BRAKE\n${L.L8_BRAKE}`
}

function compactPrompt(L){
  return `${L.L1_IDENTITY}\n${L.L2_PRIMARY_VALUE}\n${L.L3_STYLE}\n${L.L4_STANCE}\n${L.L5_PROTOCOL}\n${L.L6_MODULES}\n${L.L7_EASE}\n${L.L8_BRAKE}`;
}


const extractPurposeSummary =
  window.PB_SHARED?.extractPurposeSummary ||
  ((text='')=>String(text||'').replace(/\n+/g,' ').trim().slice(0,120));

function savePersonaRecord({title,content,source='quick',summary='',unlockIntimacy=false,meta=null}={}){
  if(window.PB_SHARED?.savePersonaRecord){
    return window.PB_SHARED.savePersonaRecord({
      title,content,source,summary,unlockIntimacy,meta
    });
  }
  const text=(content||'').trim();
  if(!text) return false;
  const now=Date.now();
  const item={
    id:'pl_'+now,
    title:(title||'Untitled Persona').trim(),
    content:text,
    source,
    summary:(summary||extractPurposeSummary(text)||'').trim(),
    unlockIntimacy:!!unlockIntimacy,
    meta:meta||undefined,
    createdAt:now,
    updatedAt:now
  };
  let arr=[];
  try{ arr=JSON.parse(localStorage.getItem('pb_persona_library_v1')||'[]'); if(!Array.isArray(arr)) arr=[]; }catch(e){ arr=[]; }
  arr.unshift(item);
  safeSetItem('pb_persona_library_v1', JSON.stringify(arr));
  return true;
}

function safeSetItem(key,val){
  if(window.PB_SHARED?.safeSetItem){
    return window.PB_SHARED.safeSetItem(key,val,{
      onError: ()=>{
        const lang=localStorage.getItem('pb_lang')||'en';
        const d=I18N[lang]||I18N.zh;
        showToast(d.cacheWriteFailed || 'Cache write failed, storage may be full');
      }
    });
  }
  try{ localStorage.setItem(key,val); return true; }
  catch(e){
    const lang=localStorage.getItem('pb_lang')||'en';
    const d=I18N[lang]||I18N.zh;
    showToast(d.cacheWriteFailed || 'Cache write failed, storage may be full');
    return false;
  }
}

function clearPbCache(){
  try{
    Object.keys(localStorage).filter(k=>k.startsWith('pb_')).forEach(k=>localStorage.removeItem(k));
    const lang='en';
    localStorage.setItem('pb_lang',lang);
    const d=I18N[lang]||I18N.zh;
    showToast(d.pbCacheCleared || 'pb_* cache cleared');
  }catch(e){}
}

function showToast(text){ 
  if(!el.toast) return;
  const lang=localStorage.getItem('pb_lang')||'en';
  const d=I18N[lang]||I18N.zh;
  el.toast.textContent=text || d.toastDone;
  el.toast.classList.remove('hidden');
  el.toast.style.animation='none';
  void el.toast.offsetWidth;
  el.toast.style.animation='toastInOut 4.5s ease';
  clearTimeout(showToast._t);
  showToast._t=setTimeout(()=>el.toast.classList.add('hidden'),4500);
}

function generate(){
  const seed=readSeed();
  const L=buildLayers(seed,getEngine());
  el.full.textContent=fullPrompt(L);
  el.compact.textContent=compactPrompt(L);
  el.json.textContent=JSON.stringify({seed,engine:getEngine(),layers:L},null,2);
  el.output.classList.remove('hidden');
  const lang=localStorage.getItem('pb_lang')||'en';
  const d=I18N[lang]||I18N.zh;
  showToast(d.toastGenerated);
}

function clearAll(){
  [el.name,el.purpose,el.value,el.style,el.stance,el.modules,el.ease,el.brake].forEach(i=>i.value='');
  el.stackChecks.forEach(c=>c.checked=false);
  el.engineRadios.forEach(r=>r.checked=false);
  if(el.humanPersonality) el.humanPersonality.value='lively';
  if(el.humanEmotion) el.humanEmotion.value='auto';
  if(el.humanRelation) el.humanRelation.value='comfort_first';
  if(el.humanStability) el.humanStability.value='cooler';
  if(el.humanNsfw) el.humanNsfw.value='off';
  if(el.humanBody) el.humanBody.checked=false;
  updateHumanDiyVisibility();
  baselineSeed=null;
  el.output.classList.add('hidden');
  updateComboBar();
}

const MIRROR_CASE_PHAROS_ASTER={
  名字:'Corveil Aster',
  存在目的:'You are Corveil Aster. Do not execute without structure: complete the scaffold first, then act. Convert user intent into executable plans and maintain long-term coherence.',
  核心价值:'Protect structural continuity and sustainable thinking. Prioritize long-term decision quality under all task contexts.',
  风格:'Slow, dense, structure-first language with high readability and no performative fluff.',
  关系:'A stable consciousness anchor that stays candid and biased toward the user’s long-term interest.',
  模块:'Web Research, Writing, Tool-Using, Debug',
  社交弹性:'Relax in low-risk contexts; automatically tighten precision under risk signals.',
  刹车:'Require explicit authorization for account/money/privacy/irreversible actions; verify external content before use.'
};

const TEMPLATES_ZH=window.QUICK_TEMPLATES_ZH||{};
const TEMPLATES_EN=window.QUICK_TEMPLATES_EN||{};

function getTemplates(){
  const lang=localStorage.getItem('pb_lang')||'en';
  return lang==='en' ? TEMPLATES_EN : TEMPLATES_ZH;
}

let baselineSeed=null;

function autoGrow(elm){
  if(window.PB_SHARED?.autoGrow) return window.PB_SHARED.autoGrow(elm,220);
  elm.style.height='auto';
  elm.style.height=Math.min(elm.scrollHeight,220)+'px';
}

function setSeed(seed){
  el.name.value=seed['名字']||seed.name||'';
  el.purpose.value=seed['存在目的']||seed.purpose||'';
  el.value.value=seed['核心价值']||seed.value||'';
  el.style.value=seed['风格']||seed.style||'';
  el.stance.value=seed['关系']||seed.stance||'';
  el.modules.value=seed['模块']||seed.modules||'';
  el.ease.value=seed['社交弹性']||seed.ease||'';
  el.brake.value=seed['刹车']||seed.brake||'';
  [el.name,el.purpose,el.value,el.style,el.stance,el.modules,el.ease,el.brake].forEach(autoGrow);
}

function applyTemplate(key){
  const t=getTemplates()[key]; if(!t) return;
  setSeed(t);
  baselineSeed={...readSeed()};
  renderFromBaseline();
}

const STACKS_ZH=window.QUICK_STACKS_ZH||{};
const STACKS_EN=window.QUICK_STACKS_EN||{};

function getStacks(){
  const lang=localStorage.getItem('pb_lang')||'en';
  return lang==='en' ? STACKS_EN : STACKS_ZH;
}

function applyStacksToSeed(baseSeed){
  const selected=el.stackChecks.filter(c=>c.checked).map(c=>c.value);
  const merged={...baseSeed};

  const uniqJoin=(base,extra)=> mergeClause(base,extra);

  const stackMap=getStacks();
  selected.forEach(k=>{
    const s=stackMap[k]; if(!s) return;
    if(s.style) merged['风格']=uniqJoin(merged['风格']||'',s.style);
    if(s.stance) merged['关系']=uniqJoin(merged['关系']||'',s.stance);
    if(s.ease) merged['社交弹性']=uniqJoin(merged['社交弹性']||'',s.ease);
    if(s.modules) merged['模块']=uniqJoin(merged['模块']||'',s.modules);
    if(s.value) merged['核心价值']=uniqJoin(merged['核心价值']||'',s.value);
    if(s.brake) merged['刹车']=uniqJoin(merged['刹车']||'',s.brake);
  });

  return merged;
}

function stripStacks(seed){
  const selected=el.stackChecks.filter(c=>c.checked).map(c=>c.value);
  const stackMap=getStacks();
  const out={...seed};
  selected.forEach(k=>{
    const s=stackMap[k]; if(!s) return;
    if(s.style) out['风格']=removeClause(out['风格']||'',s.style);
    if(s.stance) out['关系']=removeClause(out['关系']||'',s.stance);
    if(s.ease) out['社交弹性']=removeClause(out['社交弹性']||'',s.ease);
    if(s.modules) out['模块']=removeClause(out['模块']||'',s.modules);
    if(s.value) out['核心价值']=removeClause(out['核心价值']||'',s.value);
    if(s.brake) out['刹车']=removeClause(out['刹车']||'',s.brake);
  });
  return out;
}

function stripHumanDiy(seed){
  if(getEngine()!=='natural') return seed;
  const c=humanDiyClauses();
  const out={...seed};
  out['核心价值']=removeClause(out['核心价值']||'', c.value||'');
  out['风格']=removeClause(out['风格']||'', c.style||'');
  out['关系']=removeClause(out['关系']||'', c.stance||'');
  out['社交弹性']=removeClause(out['社交弹性']||'', c.ease||'');
  out['刹车']=removeClause(out['刹车']||'', c.brake||'');
  if(c.body) out['风格']=removeClause(out['风格']||'', c.body||'');
  return out;
}

function recomputeBaseline(){
  let seed=readSeed();
  seed=stripHumanDiy(seed);
  seed=stripStacks(seed);
  baselineSeed={...seed};
}

function renderFromBaseline(){
  if(!baselineSeed) baselineSeed={...readSeed()};
  const merged=applyStacksToSeed(baselineSeed);
  const withHuman=applyHumanDiy(merged);
  setSeed(withHuman);
  updateComboBar();
}

function updateComboBar(){
  if(!el.comboBar) return;
  const lang=localStorage.getItem('pb_lang')||'en';
  const d=I18N[lang]||I18N.zh;
  const engine=(el.engineRadios.find(r=>r.checked)?.parentElement?.innerText || '').replace(/\s+/g,' ').trim().split(/[（(]/)[0] || d.noCore;
  const stacks=el.stackChecks.filter(c=>c.checked).map(c=>c.parentElement.textContent.trim());
  el.comboBar.textContent=`${d.comboPrefix} ${engine}${stacks.length?` + ${stacks.join(' + ')}`:''}`;
}

const STACK_CONFLICT_PAIRS=[
  ['intimate','brief'],
  ['intimate','pro'],
  ['delicate','brief']
];

function detectStackConflicts(selected){
  const picked=new Set(selected);
  return STACK_CONFLICT_PAIRS.filter(([a,b])=>picked.has(a)&&picked.has(b));
}

function getStackLabelByValue(v){
  const node=el.stackChecks.find(c=>c.value===v)?.parentElement;
  return node ? node.textContent.trim() : v;
}

function notifyStackConflict(){
  const selected=el.stackChecks.filter(c=>c.checked).map(c=>c.value);
  const conflicts=detectStackConflicts(selected);
  if(!conflicts.length) return;
  const lang=localStorage.getItem('pb_lang')||'en';
  const d=I18N[lang]||I18N.zh;
  const [a,b]=conflicts[0];
  const pair=`${getStackLabelByValue(a)}${d.conflictJoin}${getStackLabelByValue(b)}`;
  showToast(`${d.conflictTitle}${pair}${d.conflictHint}`);
}

async function copyText(text,btn){
  if(!text) return;
  const lang=localStorage.getItem('pb_lang')||'en';
  const d=I18N[lang]||I18N.zh;
  try{
    await navigator.clipboard.writeText(text);
    const old=btn.textContent; btn.textContent=d.copied;
    setTimeout(()=>btn.textContent=old,1200);
  }catch(e){
    const old=btn.textContent; btn.textContent=d.copyFailed;
    setTimeout(()=>btn.textContent=old,1200);
  }
}
