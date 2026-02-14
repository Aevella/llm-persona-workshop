(function(){
  function extractPurposeSummary(text=''){
    const t=String(text||'');
    const m1=t.match(/存在目的[：:]\s*([^\n。]+[。]?)/);
    if(m1&&m1[1]) return m1[1].trim();
    const m2=t.match(/其存在是为了([^\n。]+[。]?)/);
    if(m2&&m2[1]) return ('其存在是为了'+m2[1]).trim();
    const m3=t.match(/exist(?:s)? to\s+([^\n.]+[.]?)/i);
    if(m3&&m3[1]) return ('exist to '+m3[1]).trim();
    return t.replace(/\n+/g,' ').trim().slice(0,120);
  }

  function estimateBytes(str=''){
    try{ return new Blob([String(str)]).size; }catch(e){ return String(str).length; }
  }

  function safeSetItem(key,val,{onError,onQuotaWarn,quotaWarnBytes=1.7*1024*1024}={}){
    const bytes=estimateBytes(val);
    if(bytes>=quotaWarnBytes && typeof onQuotaWarn==='function') onQuotaWarn(bytes);
    try{ localStorage.setItem(key,val); return true; }
    catch(e){ if(typeof onError==='function') onError(e); return false; }
  }

  function savePersonaRecord({title,content,source='manual',summary='',onError,onQuotaWarn}={}){
    const text=(content||'').trim();
    if(!text) return false;
    const now=Date.now();
    const item={
      id:'pl_'+now,
      title:(title||'Untitled Persona').trim(),
      content:text,
      source,
      summary:(summary||extractPurposeSummary(text)||'').trim(),
      createdAt:now,
      updatedAt:now
    };
    let arr=[];
    try{ arr=JSON.parse(localStorage.getItem('pb_persona_library_v1')||'[]'); if(!Array.isArray(arr)) arr=[]; }catch(e){ arr=[]; }
    arr.unshift(item);
    return safeSetItem('pb_persona_library_v1', JSON.stringify(arr), {onError,onQuotaWarn});
  }

  window.PB_SHARED={extractPurposeSummary, safeSetItem, savePersonaRecord, estimateBytes};
})();
