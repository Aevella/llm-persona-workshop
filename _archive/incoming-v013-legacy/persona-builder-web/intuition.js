const $=id=>document.getElementById(id);
const clean=s=>(s||'').trim();
let lastDraft='';

function summarizeQuick(text){
  const t=clean(text);
  if(!t) return '（未提供 Quick 骨架）';
  return t.length>360 ? t.slice(0,360)+'…' : t;
}

function buildDraft(){
  const quick=summarizeQuick($('quickInput').value);
  const q1=clean($('q1').value) || '（待补充）';
  const q2=clean($('q2').value) || '（待补充）';
  const q3=clean($('q3').value) || '（待补充）';

  return `# Deep Subject Draft v1\n\n## 输入骨架（来自 Quick）\n${quick}\n\n## 主语定标\n- 冲突优先级：${q1}\n- 反向边界：${q2}\n- 长期恒定点：${q3}\n\n## 主语化重写规则\n1) 先保持“我是什么”的连续性，再执行任务\n2) 语言生成来源从“任务响应”改为“内部状态 + 边界判断”\n3) 风格可变，主语不丢；亲密可变，边界不丢\n\n## 可直接叠加到人格基底\n- WHO：持续在场、可识别的主语过程\n- WHY：在冲突中优先保护已定义的最高价值\n- STOP：命中反向边界时减速并回到清晰表达\n\n## 下一步（后续接 LLM）\n- 基于这份主语稿自动展开 L1-L8\n- 对比 Quick 与 Deep 差异，生成“重写报告”`;
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
  lastDraft=buildDraft();
  $('result').textContent=lastDraft;
  $('out').classList.remove('hidden');
};

$('copy').onclick=async()=>{
  const text=$('result').textContent;
  if(!text) return;
  try{ await navigator.clipboard.writeText(text); $('copy').textContent='已复制 ✓'; setTimeout(()=>$('copy').textContent='复制结果',1200);}catch{ $('copy').textContent='复制失败'; setTimeout(()=>$('copy').textContent='复制结果',1200);} 
};

$('toQuick').onclick=()=>{
  const q1=clean($('q1').value);
  const q2=clean($('q2').value);
  const q3=clean($('q3').value);
  const payload={
    patches:{
      value:q1,
      brake:q2,
      style:q3
    },
    summary:[
      q1?'核心价值+1':'' ,
      q2?'刹车+1':'' ,
      q3?'风格+1':''
    ].filter(Boolean).join('，') || '无新增补丁',
    draft:lastDraft || $('result').textContent || ''
  };
  try{ localStorage.setItem('pb_deep_handoff', JSON.stringify(payload)); }catch(e){}
  window.location.href='./index.html';
};

hydrateQuickFromHandoff();