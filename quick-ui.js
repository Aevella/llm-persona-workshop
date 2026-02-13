// extracted UI wiring from script.js
el.gen.onclick=generate;

el.clear.onclick=clearAll;
el.copyFull.onclick=()=>copyText(el.full.textContent,el.copyFull);
el.copyCompact.onclick=()=>copyText(el.compact.textContent,el.copyCompact);
el.toDeep && (el.toDeep.onclick=()=>{
  const payload={
    full:el.full.textContent||'',
    compact:el.compact.textContent||'',
    json:el.json.textContent||''
  };
  safeSetItem('pb_quick_handoff', JSON.stringify(payload));
  window.location.href='./intuition.html';
});

el.exportQuick && (el.exportQuick.onclick=()=>{
  const type=el.exportType?.value||'full';
  if(type==='compact') return exportText('persona-compact.md',el.compact.textContent||'');
  if(type==='json') return exportText('persona.json',el.json.textContent||'');
  return exportText('persona-full.md',el.full.textContent||'');
});


el.savePersona && (el.savePersona.onclick=()=>{
  const seed=readSeed();
  const title=(seed['名字']||'Quick Persona').trim();
  const content=(el.full.textContent||'').trim() || (el.compact.textContent||'').trim();
  const summary=(seed['存在目的']||'').trim();
  const ok=savePersonaRecord({title,content,source:'quick',summary});
  if(ok){
    const lang=localStorage.getItem('pb_lang')||'zh';
    showToast(lang==='zh'?'已保存到人格库':'Saved to Persona Vault');
  }
});

el.toAgent && (el.toAgent.onclick=()=>{
  const seed=readSeed();
  const payload={
    seed,
    purpose:seed['存在目的']||'',
    value:seed['核心价值']||'',
    brake:seed['刹车']||'',
    full:el.full.textContent||'',
    compact:el.compact.textContent||'',
    json:el.json.textContent||''
  };
  safeSetItem('pb_agent_handoff', JSON.stringify(payload));
  window.location.href='./agent.html';
});
el.engineRadios.forEach(r=>r.addEventListener('change',()=>{ if(r.checked) applyTemplate(r.value); updateComboBar(); updateHumanDiyVisibility(); }));

const fieldInputs=[el.name,el.purpose,el.value,el.style,el.stance,el.modules,el.ease,el.brake];
fieldInputs.forEach(inp=>{
  autoGrow(inp);
  inp.addEventListener('input',()=>{ baselineSeed={...readSeed()}; autoGrow(inp); });
});
el.stackChecks.forEach(chk=>chk.addEventListener('change',()=>{
  if(chk.value==='intimate' && chk.checked){
    syncBodyMappingByContext('intimate-on');
  }
  renderFromBaseline();
  updateComboBar();
  notifyStackConflict();
}));
[el.humanPersonality,el.humanEmotion,el.humanRelation,el.humanStability].forEach(n=>{ if(n) n.addEventListener('change',()=>renderFromBaseline()); });
el.humanNsfw?.addEventListener('change',()=>{syncBodyMappingByContext('nsfw'); renderFromBaseline();});
el.humanBody?.addEventListener('change',()=>{updateBodyNote(); renderFromBaseline();});
updateComboBar();
updateHumanDiyVisibility();
initLang();
updateBodyNote();
showUpdateFlashOnce();
showOnboardingOnce();
el.clearCache?.addEventListener('click',clearPbCache);

(function applyDeepHandoff(){
  try{
    const raw=localStorage.getItem('pb_deep_handoff');
    if(!raw) return;
    const data=JSON.parse(raw);
    const p=data.patches||{};
    if(p.value) el.value.value=mergeClause(el.value.value,p.value);
    if(p.brake) el.brake.value=mergeClause(el.brake.value,p.brake);
    if(p.style) el.style.value=mergeClause(el.style.value,p.style);
    [el.value,el.brake,el.style].forEach(autoGrow);
    baselineSeed={...readSeed()};
    if(el.deepNotice){
      const lang=localStorage.getItem('pb_lang')||'zh';
      const d=I18N[lang]||I18N.zh;
      el.deepNotice.classList.remove('hidden');
      el.deepNotice.textContent=d.deepApplied.replace('{summary}', data.summary||d.deepFallback);
    }
    localStorage.removeItem('pb_deep_handoff');
  }catch(e){}
})();