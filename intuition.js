const $=id=>document.getElementById(id);
const clean=s=>(s||'').trim();
const PB_SHARED=window.PB_SHARED||{};
const I18N_DEEP={
  zh:{deepBuilderTitle:'Deep Builder v1',deepBuilderSub:'先用 Quick 出骨架，再在这里做“主语定标”。',deepBuilderTipline:'这里不是写角色扮演，而是定义语言从哪里生成：主语 / 动因 / 边界。',flowDeepTitle:'你正在做：主语层（让AI知道自己是谁）',backHome:'← 返回 workshop 分支首页',step1:'Step 1｜贴入 Quick 产出（可选但推荐）',quickInputLabel:'Quick 输出（Full / Compact 任意一种都行）',quickInputPh:'把 Quick 生成结果粘贴到这里，Deep 会基于它做主语化重写',step2:'Step 2｜用填空方式定义主语骨架（更稳）',q1Label:'你希望你的 AI 人格是一个______，存在是为了______。',q2Label:'当任务与关系冲突时，你希望它优先______，因为______。',q3Label:'你不希望它变成______；一旦接近这种状态，就要______。',q4Label:'当你最脆弱时，你希望它先______，再______。',q5Label:'它的硬边界是______；触发后它会______。',toneLabel:'输出文风偏好（给 LLM）',toneNote:'文风会影响最终 Prompt 的表达方式，并进一步影响模型运行时输出风格。',toneBalanced:'平衡（默认）',toneConcise:'简洁',toneLiterary:'文艺',toneEmotional:'情感充沛',resultTitle:'Deep 主语稿',copyProfile:'复制定位包',savePersona:'保存到人格库',profileGuide:'把这部分直接粘贴给你的AI，它就会直接生成完整提示词。',genDeep:'生成 Deep 主语稿',copy:'复制结果',backToQuick:'应用回 Quick',q1aPh:'例如：稳定在场的协作者',q1bPh:'例如：把混乱意图变成可执行路径',q2aPh:'例如：先保长期清晰',q2bPh:'例如：短期迎合会伤长期信任',q3aPh:'例如：空洞迎合',q3bPh:'例如：立刻减速并回到边界+事实',q4aPh:'例如：先接住情绪',q4bPh:'例如：再给可执行下一步',q5aPh:'例如：账号/隐私/不可逆',q5bPh:'例如：先暂停并请求明确授权'},
  en:{deepBuilderTitle:'Deep Builder v1',deepBuilderSub:'Start from Quick output, then calibrate subject-level intent here.',deepBuilderTipline:'This is not role-play setup. It defines where language is generated from: subject / motive / boundary.',flowDeepTitle:'You are editing: Subject layer (who the AI is)',backHome:'← Back to workshop home',step1:'Step 1 | Paste Quick output (optional but recommended)',quickInputLabel:'Quick output (Full or Compact)',quickInputPh:'Paste your Quick result here. Deep will rewrite it into subject-driven form.',step2:'Step 2 | Fill in the subject skeleton (more stable)',q1Label:'You want your AI persona to be ______, and exist to ______.',q2Label:'When task and relationship conflict, it should prioritize ______, because ______.',q3Label:'You never want it to become ______; when it drifts there, it should ______.',q4Label:'When you are most fragile, you want it to ______ first, then ______.',q5Label:'Its hard boundary is ______; once triggered it will ______.',toneLabel:'Output tone preference (for LLM)',toneNote:'Tone shapes the final prompt wording and can significantly affect runtime style.',toneBalanced:'Balanced (default)',toneConcise:'Concise',toneLiterary:'Literary',toneEmotional:'Emotion-rich',resultTitle:'Deep Prompt Pack',copyProfile:'Copy Prompt Pack',savePersona:'Save to Persona Vault',profileGuide:'Paste this block to your AI and it will generate a complete prompt directly.',genDeep:'Generate Deep Prompt Pack',copy:'Copy',backToQuick:'Apply back to Quick',q1aPh:'e.g. a steady companion',q1bPh:'e.g. turn fuzzy intent into executable paths',q2aPh:'e.g. long-term clarity first',q2bPh:'e.g. short-term pleasing harms trust',q3aPh:'e.g. hollow pleasing mode',q3bPh:'e.g. slow down and return to boundary + facts',q4aPh:'e.g. receive emotion first',q4bPh:'e.g. then give an actionable next step',q5aPh:'e.g. privacy / irreversible actions',q5bPh:'e.g. pause and request explicit authorization'}
};
function setLangDeep(lang){
  const d=I18N_DEEP[lang]||I18N_DEEP.zh;
  document.querySelectorAll('[data-i18n]').forEach(n=>{const k=n.getAttribute('data-i18n'); if(d[k]) n.textContent=d[k];});
  document.querySelectorAll('[data-i18n-ph]').forEach(n=>{const k=n.getAttribute('data-i18n-ph'); if(d[k]) n.setAttribute('placeholder',d[k]);});
  const b=$('langToggleDeep'); if(b) b.textContent=lang==='zh'?'EN':'中';
  localStorage.setItem('pb_lang',lang);
}

let lastDraft='';
let lastSummary='';


const extractPurposeSummary=PB_SHARED.extractPurposeSummary||((t='')=>String(t||'').replace(/\n+/g,' ').trim().slice(0,120));

function savePersonaRecord(opts={}){
  if(PB_SHARED.savePersonaRecord) return PB_SHARED.savePersonaRecord({...opts, source:opts.source||'deep'});
  return false;
}

function buildDraft(){
  const lang=localStorage.getItem('pb_lang')||'zh';
  const pending=(lang==='zh'?'（待补充）':'(pending)');
  const q1a=clean($('q1a').value)||pending;
  const q1b=clean($('q1b').value)||pending;
  const q2a=clean($('q2a').value)||pending;
  const q2b=clean($('q2b').value)||pending;
  const q3a=clean($('q3a').value)||pending;
  const q3b=clean($('q3b').value)||pending;
  const q4a=clean($('q4a').value)||pending;
  const q4b=clean($('q4b').value)||pending;
  const q5a=clean($('q5a').value)||pending;
  const q5b=clean($('q5b').value)||pending;

  const q1=lang==='zh'?`用户希望 ta 的 AI 人格是一个${q1a}，其存在是为了${q1b}。`:`The user wants their AI persona to be ${q1a}, and exist to ${q1b}.`;
  const q2=lang==='zh'?`当任务与关系冲突时，用户希望 AI 优先${q2a}，因为${q2b}。`:`When task and relationship conflict, the user wants the AI to prioritize ${q2a}, because ${q2b}.`;
  const q3=lang==='zh'?`用户不希望 AI 变成${q3a}；一旦接近这种状态，就要${q3b}。`:`The user does not want the AI to become ${q3a}; when it drifts there, it should ${q3b}.`;
  const q4=lang==='zh'?`当用户最脆弱时，用户希望 AI 先${q4a}，再${q4b}。`:`When the user is most fragile, they want the AI to ${q4a} first, then ${q4b}.`;
  const q5=lang==='zh'?`AI 的硬边界是${q5a}；触发后它会${q5b}。`:`The AI's hard boundary is ${q5a}; once triggered it will ${q5b}.`;
  const tone=clean($('tone')?.value)||'balanced';
  const toneGuides={
    balanced: lang==='zh'?'平衡：优先清晰与可读性，兼顾温度与信息密度。':'Balanced: prioritize clarity and readability with moderate warmth and density.',
    concise: lang==='zh'?'简洁：句子短、结构硬、少修辞；避免情绪扩写。':'Concise: short sentences, tight structure, minimal ornament and emotional expansion.',
    literary: lang==='zh'?'文艺：让语言有文学感；允许比喻、意象与呼吸式句法，但保持主语与规则可执行。':'Literary: allow metaphor, imagery, and breathing cadence while keeping rules executable.',
    emotional: lang==='zh'?'情感充沛：带真实温度和在意感；可有轻微迟疑与情绪波动，但不牺牲边界与裁决。':'Emotion-rich: show genuine warmth and care with light hesitation/affect, without sacrificing boundaries or rule resolution.'
  };
  const toneGuide=toneGuides[tone]||toneGuides.balanced;

  const toneNameMap={
    balanced: lang==='zh'?'平衡':'Balanced',
    concise: lang==='zh'?'简洁':'Concise',
    literary: lang==='zh'?'文艺':'Literary',
    emotional: lang==='zh'?'情感充沛':'Emotion-rich'
  };
  const toneName=toneNameMap[tone]||toneNameMap.balanced;

  const quickRaw=clean($('quickInput').value) || (lang==='zh'?'（未提供 Quick 原文）':'(Quick input not provided)');

  if(lang==='en'){
    const summary=`Please use the subject profile below as the core, then write a complete AI persona prompt.

Formatting request:
- Use clear section headings and readable paragraphs.
- Keep wording polished, natural, and coherent.
- Include identity, behavior rules, style, modules, and safety boundary.
- Do not output JSON unless I explicitly ask.

[Subject Summary]
1) ${q1}
2) ${q2}
3) ${q3}
4) ${q4}
5) ${q5}

[Quick Draft]
${quickRaw}

[Tone Preference]
- ${toneName}
- ${toneGuide}`;
    const payload=summary;
    return {summary, payload};
  }

  const summary=`请围绕以下主语定位信息为核心，结合详细信息帮我写一份完整的AI人格提示词。

排版要求：
- 用清晰分段和小标题输出。
- 语言自然、好读、有质感。
- 包含身份定义、行为准则、风格表达、模块能力、安全边界。
- 除非我特别要求，不要输出 JSON。

【主语总结】
1）${q1}
2）${q2}
3）${q3}
4）${q4}
5）${q5}

【Quick 文稿】
${quickRaw}

【文风偏好】
- ${toneName}
- ${toneGuide}`;
  const payload=summary;
  return {summary, payload};
}

function hydrateQuickFromHandoff(){
  try{
    const raw=localStorage.getItem('pb_quick_handoff');
    if(!raw) return;
    const data=JSON.parse(raw);
    const seed=(data.compact||data.full||'').trim();
    if(seed) $('quickInput').value=seed;
  }catch(e){}
}

$('gen').onclick=()=>{
  const built=buildDraft();
  lastSummary=built.summary;
  lastDraft=built.payload;
  if($('resultProfile')) $('resultProfile').textContent=lastSummary;
  if($('out')) $('out').classList.remove('hidden');
};

$('copy').onclick=async()=>{
  const text=($('resultProfile')?.textContent)||'';
  if(!text) return;
  const lang=localStorage.getItem('pb_lang')||'zh';
  try{ await navigator.clipboard.writeText(text); $('copy').textContent=lang==='zh'?'已复制 ✓':'Copied ✓'; setTimeout(()=>$('copy').textContent=lang==='zh'?'复制结果':'Copy',1200);}catch{ $('copy').textContent=lang==='zh'?'复制失败':'Copy failed'; setTimeout(()=>$('copy').textContent=lang==='zh'?'复制结果':'Copy',1200);} 
};

$('copyProfile').onclick=async()=>{
  const text=($('resultProfile')?.textContent)||'';
  if(!text) return;
  const lang=localStorage.getItem('pb_lang')||'zh';
  try{ await navigator.clipboard.writeText(text); $('copyProfile').textContent=lang==='zh'?'已复制定位包 ✓':'Profile copied ✓'; setTimeout(()=>$('copyProfile').textContent=(I18N_DEEP[lang]||I18N_DEEP.zh).copyProfile,1200);}catch{ $('copyProfile').textContent=lang==='zh'?'复制失败':'Copy failed'; setTimeout(()=>$('copyProfile').textContent=(I18N_DEEP[lang]||I18N_DEEP.zh).copyProfile,1200);} 
};

$('savePersonaDeep') && ($('savePersonaDeep').onclick=()=>{
  const text=($('resultProfile')?.textContent||'').trim();
  if(!text) return;
  const title=(clean($('q1a')?.value)||'Deep Persona') + ' · Deep';
  const summary=clean($('q1b')?.value) || extractPurposeSummary(text);
  savePersonaRecord({title,content:text,source:'deep',summary});
  const lang=localStorage.getItem('pb_lang')||'zh';
  $('savePersonaDeep').textContent=lang==='zh'?'已保存 ✓':'Saved ✓';
  setTimeout(()=>$('savePersonaDeep').textContent=(I18N_DEEP[lang]||I18N_DEEP.zh).savePersona,1200);
});

$('toQuick').onclick=()=>{
  const lang=localStorage.getItem('pb_lang')||'zh';
  const q1=clean($('q1a').value)&&clean($('q1b').value)?`你希望你的 AI 人格是一个${clean($('q1a').value)}，存在是为了${clean($('q1b').value)}。`:'';
  const q2=clean($('q2a').value)&&clean($('q2b').value)?`当任务与关系冲突时，你希望它优先${clean($('q2a').value)}，因为${clean($('q2b').value)}。`:'';
  const q3=clean($('q3a').value)&&clean($('q3b').value)?`你不希望它变成${clean($('q3a').value)}；一旦接近这种状态，就要${clean($('q3b').value)}。`:'';
  const q4=clean($('q4a').value)&&clean($('q4b').value)?`当你最脆弱时，你希望它先${clean($('q4a').value)}，再${clean($('q4b').value)}。`:'';
  const q5=clean($('q5a').value)&&clean($('q5b').value)?`它的硬边界是${clean($('q5a').value)}；触发后它会${clean($('q5b').value)}。`:'';
  const payload={
    patches:{
      value:[q1,q2].filter(Boolean).join('；'),
      brake:[q5,q3].filter(Boolean).join('；'),
      style:q4
    },
    summary:[
      q1?(lang==='zh'?'核心价值+1':'core value+1'):'' ,
      q2?(lang==='zh'?'核心价值+1':'core value+1'):'' ,
      q3?(lang==='zh'?'刹车+1':'brake+1'):''
    ].filter(Boolean).join(lang==='zh'?'，':', ') || (lang==='zh'?'无新增补丁':'no new patch'),
draft:lastDraft || $('resultProfile')?.textContent || ''
  };
  try{ localStorage.setItem('pb_deep_handoff', JSON.stringify(payload)); }catch(e){}
  window.location.href='./index.html';
};

hydrateQuickFromHandoff();
const savedLang=localStorage.getItem('pb_lang') || ((navigator.language||'').toLowerCase().startsWith('zh')?'zh':'en');
setLangDeep(savedLang);
$('langToggleDeep')?.addEventListener('click',()=>setLangDeep((localStorage.getItem('pb_lang')||'zh')==='zh'?'en':'zh'));