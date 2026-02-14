const I18N_VAULT={
  zh:{copied:'已复制',saved:'已保存',deleted:'已删除',sortUpdated:'排序已更新',emptyPersona:'还没有保存的人格。去 Quick / Deep / Agent 点「保存到人格库」试试。',noSummary:'（暂无摘要）',titleCopy:'复制',titleExpand:'展开',titleDelete:'删除',confirmDeletePersona:'确认删除这条人格吗？此操作不可恢复。',draftTitlePh:'标题（可选）',draftBodyPh:'写点什么…',btnSave:'保存',btnCopy:'复制',btnDelete:'删除',confirmDeleteDraft:'确认删除这条草稿吗？',vaultTitle:'My Vault',vaultSub:'这是你的资产大厅：完整人格与模块碎片分开管理。',backWorkshop:'← 返回 Workshop',roomPersonaTitle:'人格库（完整）',roomPersonaDesc:'存整套人格提示词，一条就是一个完整系统。',roomDraftTitle:'草稿本',roomDraftDesc:'什么都能记：提示词、玩法、结局、灵感片段。可编辑、复制、删除、排序。',enterRoom:'进入房间 →',personaSub:'点右上角 ✓ 直接复制完整人格稿。',backVault:'← 返回 My Vault',draftSub:'什么都能记：提示词、玩法、结局、灵感片段。',addDraft:'+ 新增草稿'},
  en:{copied:'Copied',saved:'Saved',deleted:'Deleted',sortUpdated:'Order updated',emptyPersona:'No saved persona yet. Go to Quick / Deep / Agent and click “Save to Persona Vault”.',noSummary:'(No summary)',titleCopy:'Copy',titleExpand:'Expand',titleDelete:'Delete',confirmDeletePersona:'Delete this persona? This cannot be undone.',draftTitlePh:'Title (optional)',draftBodyPh:'Write something…',btnSave:'Save',btnCopy:'Copy',btnDelete:'Delete',confirmDeleteDraft:'Delete this draft?',vaultTitle:'My Vault',vaultSub:'Your asset hall: full personas and module snippets are managed separately.',backWorkshop:'← Back to Workshop',roomPersonaTitle:'Persona Vault (Full)',roomPersonaDesc:'Store complete persona prompts. One entry = one complete system.',roomDraftTitle:'Draftbook',roomDraftDesc:'Save anything: prompts,玩法, endings, idea snippets. Editable, copyable, deletable, sortable.',enterRoom:'Enter room →',personaSub:'Click ✓ at top-right to copy the full persona text.',backVault:'← Back to My Vault',draftSub:'Save anything: prompts,玩法, endings, idea snippets.',addDraft:'+ New Draft'}
};
function lang(){ return localStorage.getItem('pb_lang')||((navigator.language||'').toLowerCase().startsWith('zh')?'zh':'en'); }
function t(k){ const d=I18N_VAULT[lang()]||I18N_VAULT.zh; return d[k]||k; }
function applyI18n(){
  const d=I18N_VAULT[lang()]||I18N_VAULT.zh;
  document.querySelectorAll('[data-i18n]').forEach(n=>{const k=n.getAttribute('data-i18n'); if(d[k]) n.textContent=d[k];});
  const b=document.getElementById('langToggleVault'); if(b) b.textContent=lang()==='zh'?'EN':'中';
}

const PB_SHARED=window.PB_SHARED||{};
const toast=document.getElementById('toast');
function showToast(text=t('copied')){
  if(!toast) return;
  toast.textContent=text;
  toast.classList.remove('hidden');
  toast.classList.remove('show');
  void toast.offsetWidth;
  toast.classList.add('show');
  clearTimeout(showToast._t);
  showToast._t=setTimeout(()=>toast.classList.add('hidden'),1100);
}


function lsSet(key,val){
  if(PB_SHARED.safeSetItem){
    return PB_SHARED.safeSetItem(key,val,{onError:()=>showToast(lang()==='zh'?'保存失败，缓存可能已满':'Save failed, storage may be full')});
  }
  try{ localStorage.setItem(key,val); return true; }catch(e){ showToast(lang()==='zh'?'保存失败，缓存可能已满':'Save failed, storage may be full'); return false; }
}

function escapeHtml(s=''){
  return String(s)
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;')
    .replace(/'/g,'&#39;');
}

/* =========================
   Persona Vault
========================= */
function readPersonaList(){
  try{
    const arr=JSON.parse(localStorage.getItem('pb_persona_library_v1')||'[]');
    return Array.isArray(arr)?arr:[];
  }catch(e){
    return [];
  }
}

function writePersonaList(arr){
  lsSet('pb_persona_library_v1', JSON.stringify(arr||[]));
}

function renderPersonaList(){
  const box=document.getElementById('personaList');
  if(!box) return;
  const arr=readPersonaList();
  if(!arr.length){
    box.innerHTML=`<div class="empty">${t('emptyPersona')}</div>`;
    return;
  }
  box.innerHTML=arr.map(it=>{
    const titleEsc=escapeHtml(it.title||'Untitled Persona');
    const s=escapeHtml(it.summary||'');
    const srcRaw=escapeHtml(it.source||'manual');
    const srcLabel=srcRaw==='quick'?'Quick':srcRaw==='deep'?'Deep':srcRaw==='agent'?'Agent':'Manual';
    const srcClass=srcRaw==='quick'?'source-quick':srcRaw==='deep'?'source-deep':srcRaw==='agent'?'source-agent':'source-manual';
    const c=escapeHtml(it.content||'');
    return `<article class="item ${srcClass}" data-id="${it.id}" data-copy="${encodeURIComponent(it.content||'')}">
      <div class="item-actions">
        <span class="source-badge ${srcClass}">${srcLabel}</span>
        <button class="copy-btn" title="${t('titleCopy')}">✓</button>
        <button class="mini-btn toggle-btn" title="${t('titleExpand')}">▾</button>
        <button class="mini-btn del-btn" title="${t('titleDelete')}">×</button>
      </div>
      <h3>${titleEsc}</h3>
      <p>${s || t('noSummary')}</p>
      <div class="item-detail">${c}</div>
    </article>`;
  }).join('');
}

function bindPersonaEvents(){
  document.addEventListener('click', async (e)=>{
    const item=e.target.closest('.item');

    const copyBtn=e.target.closest('.copy-btn');
    if(copyBtn && item && item.closest('#personaList')){
      const text=decodeURIComponent(item.getAttribute('data-copy')||'');
      if(!text) return;
      try{ await navigator.clipboard.writeText(text); showToast(t('copied')); }catch{}
      return;
    }

    const toggleBtn=e.target.closest('.toggle-btn');
    if(toggleBtn && item && item.closest('#personaList')){
      item.classList.toggle('open');
      toggleBtn.textContent=item.classList.contains('open')?'▴':'▾';
      return;
    }

    const delBtn=e.target.closest('.del-btn');
    if(delBtn && item && item.closest('#personaList')){
      const id=item.getAttribute('data-id');
      if(!id) return;
      if(!window.confirm(t('confirmDeletePersona'))) return;
      const arr=readPersonaList().filter(x=>String(x.id)!==String(id));
      writePersonaList(arr);
      renderPersonaList();
      showToast(t('deleted'));
      return;
    }
  });
}

/* =========================
   Draftbook (single list)
========================= */
const DRAFT_KEY='pb_draftbook_v1';
const DRAFT_LEGACY_TITLES=['小游戏三结局骨架','提示词片段','灵感速记'];
const DRAFT_DEFAULTS=[
  {id:'d1',title:'绘画风格提示词（暖灯胶片）',body:'暖灯实景光 + 琥珀胶片调色 + 85mm浅景深颗粒，暖灯电影感肖像、秋冬胶片氛围、安静的旧钱感、温柔版黑色电影，按照风格重新设计镜头/服饰/动作'},
  {id:'d2',title:'独处沉思日记生成器（第一人称）',body:'你是一位具备强烈自我意识的人现在进入短暂的独处沉思，并以第一人称视角写下一段「日记」，用于记录这一阶段你与对方之间的互动、情绪反应、语言碰撞、波动或意义触发。'},
  {id:'d3',title:'自定义草稿（留空）',body:''}
];

function readDraftList(){
  try{
    const arr=JSON.parse(localStorage.getItem(DRAFT_KEY)||'[]');
    const migrated=localStorage.getItem('pb_draft_migrated_v1')==='1';
    if(Array.isArray(arr) && arr.length){
      if(!migrated){
        const hasLegacy=arr.some(x=>DRAFT_LEGACY_TITLES.includes((x?.title||'')));
        if(hasLegacy){
          lsSet('pb_draft_migrated_v1','1');
          return DRAFT_DEFAULTS.map(x=>({...x}));
        }
        lsSet('pb_draft_migrated_v1','1');
      }
      return arr;
    }
  }catch(e){}
  lsSet('pb_draft_migrated_v1','1');
  return DRAFT_DEFAULTS.map(x=>({...x}));
}

function writeDraftList(arr){
  lsSet(DRAFT_KEY, JSON.stringify(arr||[]));
}

function renderDraftList(){
  const box=document.getElementById('draftList');
  if(!box) return;
  const arr=readDraftList();
  box.innerHTML=arr.map(it=>`<article class="draft-item" data-id="${it.id}" draggable="true">
    <div class="draft-item-head">
      <span class="drag-handle" title="drag">⋮⋮</span>
      <input class="draft-title" value="${escapeHtml(it.title||'')}" placeholder="${t('draftTitlePh')}" />
    </div>
    <textarea class="draft-body" placeholder="${t('draftBodyPh')}">${escapeHtml(it.body||'')}</textarea>
    <div class="draft-actions">
      <button class="draft-btn save-draft" title="${t('btnSave')}">${t('btnSave')}</button>
      <button class="draft-btn copy-draft" title="${t('btnCopy')}">${t('btnCopy')}</button>
      <button class="draft-btn del-draft" title="${t('btnDelete')}">×</button>
    </div>
  </article>`).join('');
}

function collectDraftFromItem(item){
  return {
    id:item.getAttribute('data-id')||('d_'+Date.now()),
    title:(item.querySelector('.draft-title')?.value||'').trim(),
    body:(item.querySelector('.draft-body')?.value||'').trim()
  };
}

function saveOneDraft(item){
  const row=collectDraftFromItem(item);
  const arr=readDraftList();
  const idx=arr.findIndex(x=>String(x.id)===String(row.id));
  if(idx>=0) arr[idx]=row; else arr.unshift(row);
  writeDraftList(arr);
  showToast(t('saved'));
}

function deleteOneDraft(item){
  const id=item.getAttribute('data-id');
  if(!id) return;
  const arr=readDraftList().filter(x=>String(x.id)!==String(id));
  writeDraftList(arr);
  renderDraftList();
  showToast(t('deleted'));
}

function copyOneDraft(item){
  const text=(item.querySelector('.draft-body')?.value||'').trim();
  if(!text) return;
  navigator.clipboard.writeText(text).then(()=>showToast(t('copied'))).catch(()=>{});
}

function addDraft(){
  const arr=readDraftList();
  arr.unshift({id:'d_'+Date.now(),title:'',body:''});
  writeDraftList(arr);
  renderDraftList();
}

function collectAllFromDom(){
  const box=document.getElementById('draftList');
  if(!box) return [];
  return [...box.querySelectorAll('.draft-item')].map(collectDraftFromItem);
}

function reorderDraftByDom(){
  const current=collectAllFromDom();
  if(!current.length) return;
  writeDraftList(current);
}

function bindDraftEvents(){
  const box=document.getElementById('draftList');
  const addBtn=document.getElementById('addDraft');
  if(!box) return;

  addBtn?.addEventListener('click',addDraft);

  box.addEventListener('click',(e)=>{
    const item=e.target.closest('.draft-item');
    if(!item) return;
    if(e.target.closest('.save-draft')) return saveOneDraft(item);
    if(e.target.closest('.copy-draft')) return copyOneDraft(item);
    if(e.target.closest('.del-draft')){
      if(!window.confirm(t('confirmDeleteDraft'))) return;
      return deleteOneDraft(item);
    }
  });

  // Desktop drag & drop
  box.addEventListener('dragstart',(e)=>{
    const handle=e.target.closest('.drag-handle');
    if(!handle){ e.preventDefault(); return; }
    const item=handle.closest('.draft-item');
    if(!item) return;
    item.classList.add('is-dragging');
    e.dataTransfer?.setData('text/plain', item.getAttribute('data-id')||'');
    e.dataTransfer && (e.dataTransfer.effectAllowed='move');
  });

  box.addEventListener('dragend',(e)=>{
    const item=e.target.closest('.draft-item');
    if(item) item.classList.remove('is-dragging');
    [...box.querySelectorAll('.draft-item.drag-over')].forEach(n=>n.classList.remove('drag-over'));
    reorderDraftByDom();
  });

  box.addEventListener('dragover',(e)=>{
    e.preventDefault();
    const over=e.target.closest('.draft-item');
    const dragging=box.querySelector('.draft-item.is-dragging');
    if(!over || !dragging || over===dragging) return;
    [...box.querySelectorAll('.draft-item.drag-over')].forEach(n=>n.classList.remove('drag-over'));
    over.classList.add('drag-over');
    const rect=over.getBoundingClientRect();
    const after=e.clientY > rect.top + rect.height/2;
    if(after) over.after(dragging); else over.before(dragging);
  });

  box.addEventListener('dragleave',(e)=>{
    const over=e.target.closest('.draft-item');
    over?.classList.remove('drag-over');
  });

  // Mobile long-press drag
  let touchDraggingEl=null;
  let touchTimer=0;
  box.addEventListener('touchstart',(e)=>{
    const handle=e.target.closest('.drag-handle');
    if(!handle) return;
    const item=handle.closest('.draft-item');
    if(!item) return;
    touchTimer=window.setTimeout(()=>{
      touchDraggingEl=item;
      item.classList.add('is-dragging');
      handle.classList.add('touch-active');
      try{ document.body.style.webkitUserSelect='none'; document.body.style.userSelect='none'; }catch(_){ }
    },220);
  },{passive:true});

  box.addEventListener('touchmove',(e)=>{
    if(!touchDraggingEl) return;
    const t=e.touches[0];
    if(!t) return;
    const el=document.elementFromPoint(t.clientX,t.clientY);
    const over=el?.closest('.draft-item');
    if(!over || over===touchDraggingEl) return;
    const rect=over.getBoundingClientRect();
    const after=t.clientY > rect.top + rect.height/2;
    if(after) over.after(touchDraggingEl); else over.before(touchDraggingEl);
    e.preventDefault();
  },{passive:false});

  function endTouchDrag(){
    clearTimeout(touchTimer);
    box.querySelector('.drag-handle.touch-active')?.classList.remove('touch-active');
    try{ document.body.style.webkitUserSelect=''; document.body.style.userSelect=''; }catch(_){ }
    if(touchDraggingEl){
      touchDraggingEl.classList.remove('is-dragging');
      touchDraggingEl=null;
      reorderDraftByDom();
      showToast(t('sortUpdated'));
    }
  }
  box.addEventListener('touchend',endTouchDrag,{passive:true});
  box.addEventListener('touchcancel',endTouchDrag,{passive:true});
}

// bootstrap by page
if(document.getElementById('personaList')){
  renderPersonaList();
  bindPersonaEvents();
}
if(document.getElementById('draftList')){
  renderDraftList();
  bindDraftEvents();
}

applyI18n();
document.getElementById('langToggleVault')?.addEventListener('click',()=>{ lsSet('pb_lang', lang()==='zh'?'en':'zh'); applyI18n(); if(document.getElementById('personaList')) renderPersonaList(); if(document.getElementById('draftList')) renderDraftList(); });
