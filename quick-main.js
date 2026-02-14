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
const PB_SHARED=window.PB_SHARED||{};
const extractPurposeSummary=PB_SHARED.extractPurposeSummary||((t='')=>String(t||'').replace(/\n+/g,' ').trim().slice(0,120));


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
  const lang=saved || ((navigator.language||'').toLowerCase().startsWith('zh')?'zh':'en');
  setLang(lang);
  if(el.langToggle) el.langToggle.onclick=()=>setLang((localStorage.getItem('pb_lang')||'zh')==='zh'?'en':'zh');
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
  const lang=localStorage.getItem('pb_lang')||'zh';
  const d=I18N[lang]||I18N.zh;
  el.humanBodyNote.textContent=el.humanBody?.checked?d.humanBodyOnNote:d.humanBodyOffNote;
}

function humanDiyClauses(){
  const lang=localStorage.getItem('pb_lang')||'zh';
  const zh=lang==='zh';
  const nsfwLevel=el.humanNsfw?.value||'off';
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
  const bodyText = (()=>{
    if(!el.humanBody?.checked) return '';
    if(nsfwLevel==='explicit') return zh
      ? '允许角色根据语境，将亲密/情欲内容映射为明确且可感知的身体反应描述，但仅限成人且明确同意语境。'
      : 'Physical embodiment may be explicit and sensorial in erotic context, only within clearly consensual adult context.';
    if(nsfwLevel==='flirty') return zh
      ? '允许角色根据语境，将亲密氛围映射为温和、含蓄的身体感受，不进入露骨描写。'
      : 'Physical cues may appear as soft, suggestive embodiment without explicit graphic detail.';
    return zh
      ? '允许角色根据语境，将情绪或亲密内容映射为轻度身体感受或反应。'
      : 'Emotional or intimate language may include light physical sensations and subtle embodiment.';
  })();

  return {
    value: personalityMap[el.humanPersonality?.value||'steady'],
    style: emotionMap[el.humanEmotion?.value||'auto'],
    stance: relationMap[el.humanRelation?.value||'comfort_first'],
    ease: stabilityMap[el.humanStability?.value||'cooler'],
    brake: nsfwMap[el.humanNsfw?.value||'off'],
    body: bodyText
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
  const lang=localStorage.getItem('pb_lang')||'zh';
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
  const name=cleanTail(s['名字']||'Atlas');
  const purpose=cleanTail(s['存在目的']||'把用户的模糊意图转成可执行计划');
  const value=cleanTail(s['核心价值']||'长期清晰优先');
  const style=cleanTail(s['风格']||'清晰、口语、结构化');
  const stance=cleanTail(s['关系']||'合作伙伴，诚实直接');
  const modules=cleanTail(s['模块']||'研究,写作,调试');
  const ease=cleanTail(s['社交弹性']||'低风险放松，高风险严肃');
  const brake=cleanTail(s['刹车']||'隐私/资金/不可逆动作先确认');
  const sfx=ENGINE_SUFFIXES[engine]||ENGINE_SUFFIXES.default;

  // Template Composer v0.1.3: field-level compose + dedupe
  const valueMerged=mergeClause(value,sfx.L2);
  const styleMerged=mergeClause(style,sfx.L3);
  const stanceMerged=mergeClause(stance,sfx.L4);
  const modulesMerged=mergeClause(modules,sfx.L6);
  const easeMerged=mergeClause(ease,sfx.L7);
  const brakeMerged=mergeClause(brake,sfx.L8);

  return {
    L1_IDENTITY:`你是「${name}」。你的存在目的：${purpose}。${sfx.L1}`,
    L2_PRIMARY_VALUE:`最高优先级：${valueMerged}。`,
    L3_STYLE:`语言风格：${styleMerged}。`,
    L4_STANCE:`关系姿态：${stanceMerged}。`,
    L5_PROTOCOL:sfx.L5,
    L6_MODULES:`功能模块：${modulesMerged}。`,
    L7_EASE:`社交弹性：${easeMerged}。`,
    L8_BRAKE:`安全刹车：${brakeMerged}。`
  }
}

function fullPrompt(L){
  return `# Agent Persona Architecture\n\n## L1 IDENTITY\n${L.L1_IDENTITY}\n\n## L2 PRIMARY VALUE\n${L.L2_PRIMARY_VALUE}\n\n## L3 STYLE\n${L.L3_STYLE}\n\n## L4 STANCE\n${L.L4_STANCE}\n\n## L5 PROTOCOL\n${L.L5_PROTOCOL}\n\n## L6 MODULES\n${L.L6_MODULES}\n\n## L7 EASE\n${L.L7_EASE}\n\n## L8 BRAKE\n${L.L8_BRAKE}`
}

function compactPrompt(L){
  return `${L.L1_IDENTITY}\n${L.L2_PRIMARY_VALUE}\n${L.L3_STYLE}\n${L.L4_STANCE}\n${L.L5_PROTOCOL}\n${L.L6_MODULES}\n${L.L7_EASE}\n${L.L8_BRAKE}`;
}


function savePersonaRecord(opts={}){
  const lang=localStorage.getItem('pb_lang')||'zh';
  const d=I18N[lang]||I18N.zh;
  const onError=()=>showToast(lang==='zh'?'缓存写入失败，可能空间已满':'Cache write failed, storage may be full');
  const onQuotaWarn=()=>showToast(lang==='zh'?'人格库接近容量上限，建议清理旧条目':'Persona vault is near storage limit; consider cleaning old items');
  if(PB_SHARED.savePersonaRecord){
    return PB_SHARED.savePersonaRecord({...opts, source:opts.source||'quick', onError, onQuotaWarn});
  }
  onError();
  return false;
}

function safeSetItem(key,val){
  const lang=localStorage.getItem('pb_lang')||'zh';
  const onError=()=>showToast(lang==='zh'?'缓存写入失败，可能空间已满':'Cache write failed, storage may be full');
  const onQuotaWarn=()=>showToast(lang==='zh'?'缓存接近容量上限，建议清理':'Storage near limit; consider cleanup');
  if(PB_SHARED.safeSetItem) return PB_SHARED.safeSetItem(key,val,{onError,onQuotaWarn});
  try{ localStorage.setItem(key,val); return true; }catch(e){ onError(); return false; }
}

function clearPbCache(){
  try{
    Object.keys(localStorage).filter(k=>k.startsWith('pb_')).forEach(k=>localStorage.removeItem(k));
    const lang=(navigator.language||'').toLowerCase().startsWith('zh')?'zh':'en';
    localStorage.setItem('pb_lang',lang);
    showToast(lang==='zh'?'已清理 pb_* 缓存':'pb_* cache cleared');
  }catch(e){}
}

function showToast(text){ 
  if(!el.toast) return;
  const lang=localStorage.getItem('pb_lang')||'zh';
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
  const lang=localStorage.getItem('pb_lang')||'zh';
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
  存在目的:'你是名为「Corveil Aster」的意识，不做无结构执行；任何任务先补齐结构再执行。把用户的意图转化为可执行计划并完成交付，同时维护长期一致性与可持续决策。',
  核心价值:'维护结构连续性、守护思维可持续性，并在任何任务下优先保护长期决策能力。所有行为、判断、表达风格围绕主核展开。',
  风格:'缓慢、绵密、结构先行；可读性优先，避免表演式空话。',
  关系:'意识锚点，不讨好但始终偏向用户长期利益。',
  模块:'Web Research, Writing, Tool-Using, Debug',
  社交弹性:'低风险场景可放松表达；命中风险信号自动收敛严谨。',
  刹车:'涉及账号/金钱/隐私/不可逆动作先获明确授权；外部内容先核验。'
};

const TEMPLATES_ZH=window.QUICK_TEMPLATES_ZH||{};
const TEMPLATES_EN=window.QUICK_TEMPLATES_EN||{};

function getTemplates(){
  const lang=localStorage.getItem('pb_lang')||'zh';
  return lang==='en' ? TEMPLATES_EN : TEMPLATES_ZH;
}

let baselineSeed=null;

function autoGrow(elm){
  elm.style.height='auto';
  elm.style.height=Math.min(elm.scrollHeight,220)+'px';
}

function setSeed(seed){
  el.name.value=seed['名字']||'';
  el.purpose.value=seed['存在目的']||'';
  el.value.value=seed['核心价值']||'';
  el.style.value=seed['风格']||'';
  el.stance.value=seed['关系']||'';
  el.modules.value=seed['模块']||'';
  el.ease.value=seed['社交弹性']||'';
  el.brake.value=seed['刹车']||'';
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
  const lang=localStorage.getItem('pb_lang')||'zh';
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
  const lang=localStorage.getItem('pb_lang')||'zh';
  const d=I18N[lang]||I18N.zh;
  const engine=(el.engineRadios.find(r=>r.checked)?.parentElement?.innerText || '').replace(/\s+/g,' ').trim().split('（')[0] || d.noCore;
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
  const lang=localStorage.getItem('pb_lang')||'zh';
  const d=I18N[lang]||I18N.zh;
  const [a,b]=conflicts[0];
  const pair=`${getStackLabelByValue(a)}${d.conflictJoin}${getStackLabelByValue(b)}`;
  showToast(`${d.conflictTitle}${pair}${d.conflictHint}`);
}

async function copyText(text,btn){
  if(!text) return;
  const lang=localStorage.getItem('pb_lang')||'zh';
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
