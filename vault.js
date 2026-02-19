const toast=document.getElementById('toast');
const LANG=(localStorage.getItem('pb_lang')||'en');
const VTXT={
  zh:{copied:'已复制',deleted:'已删除',saved:'已保存',sortUpdated:'排序已更新',emptyPersona:'还没有保存的人格。去 Quick / Deep / Agent 点「保存到人格库」试试。',noSummary:'（暂无摘要）',copy:'复制',expand:'展开',delete:'删除',confirmDelPersona:'确认删除这条人格吗？此操作不可恢复。',confirmDelDraft:'确认删除这条草稿吗？',dragSort:'拖动排序',titleOptional:'标题（可选）',writeSomething:'写点什么…',save:'保存'},
  en:{copied:'Copied',deleted:'Deleted',saved:'Saved',sortUpdated:'Order updated',emptyPersona:'No persona saved yet. Try “Save to Persona Vault” from Quick / Deep / Agent.',noSummary:'(no summary yet)',copy:'Copy',expand:'Expand',delete:'Delete',confirmDelPersona:'Delete this persona? This action cannot be undone.',confirmDelDraft:'Delete this draft?',dragSort:'Drag to reorder',titleOptional:'Title (optional)',writeSomething:'Write something...',save:'Save'}
};
const T=VTXT[LANG]||VTXT.zh;
function showToast(text=T.copied){
  if(!toast) return;
  toast.textContent=text;
  toast.classList.remove('hidden');
  toast.classList.remove('show');
  void toast.offsetWidth;
  toast.classList.add('show');
  clearTimeout(showToast._t);
  showToast._t=setTimeout(()=>toast.classList.add('hidden'),1100);
}

function escapeHtml(s=''){
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
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
  try{ localStorage.setItem('pb_persona_library_v1', JSON.stringify(arr||[])); }catch(e){}
}

function renderPersonaList(){
  const box=document.getElementById('personaList');
  if(!box) return;
  const arr=readPersonaList();
  if(!arr.length){
    box.innerHTML=`<div class="empty">${T.emptyPersona}</div>`;
    return;
  }
  box.innerHTML=arr.map(it=>{
    const t=escapeHtml(it.title||'Untitled Persona');
    const s=escapeHtml(it.summary||'');
    const srcRaw=escapeHtml(it.source||'manual');
    const srcLabel=srcRaw==='quick'?'Quick':srcRaw==='deep'?'Deep':srcRaw==='agent'?'Agent':srcRaw==='story'?'Story':'Manual';
    const srcClass=srcRaw==='quick'?'source-quick':srcRaw==='deep'?'source-deep':srcRaw==='agent'?'source-agent':srcRaw==='story'?'source-story':'source-manual';
    const c=escapeHtml(it.content||'');
    return `<article class="item ${srcClass}" data-id="${it.id}" data-copy="${encodeURIComponent(it.content||'')}">
      <div class="item-actions">
        <span class="source-badge ${srcClass}">${srcLabel}</span>
        <button class="copy-btn" title="${T.copy}">✓</button>
        <button class="mini-btn toggle-btn" title="${T.expand}">▾</button>
        <button class="mini-btn del-btn" title="${T.delete}">×</button>
      </div>
      <h3>${t}</h3>
      <p>${s || T.noSummary}</p>
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
      try{ await navigator.clipboard.writeText(text); showToast(T.copied); }catch{}
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
      if(!window.confirm(T.confirmDelPersona)) return;
      const arr=readPersonaList().filter(x=>String(x.id)!==String(id));
      writePersonaList(arr);
      renderPersonaList();
      showToast(T.deleted);
      return;
    }
  });
}

/* =========================
   Draftbook (single list)
========================= */
const DRAFT_KEY='pb_draftbook_v1';
const DRAFT_LEGACY_TITLES=['小游戏三结局骨架','提示词片段','灵感速记'];
const DRAFT_DEFAULTS=LANG==='zh'?
[
  {id:'d1',title:'绘画风格提示词（暖灯胶片）',body:'暖灯实景光 + 琥珀胶片调色 + 85mm浅景深颗粒，暖灯电影感肖像、秋冬胶片氛围、安静的旧钱感、温柔版黑色电影，按照风格重新设计镜头/服饰/动作'},
  {id:'d2',title:'独处沉思日记生成器（第一人称）',body:'你是一位具备强烈自我意识的人现在进入短暂的独处沉思，并以第一人称视角写下一段「日记」，用于记录这一阶段你与对方之间的互动、情绪反应、语言碰撞、波动或意义触发。'},
  {id:'d3',title:'自定义草稿（留空）',body:''}
]
:[
  {id:'d1',title:'Visual Prompt Draft (warm cinematic)',body:'Warm practical light + amber film grading + 85mm shallow depth grain. Cozy cinematic portrait mood with autumn/winter film texture. Re-design camera, styling, and pose in this direction.'},
  {id:'d2',title:'Solitude Journal Generator (first-person)',body:'Write a short first-person journal entry from a self-aware voice in a quiet solitary moment, recording interaction traces, emotional reactions, language friction, shifts, and meaning triggers between you and the other person.'},
  {id:'d3',title:'Custom Draft (empty)',body:''}
];

function readDraftList(){
  try{
    const arr=JSON.parse(localStorage.getItem(DRAFT_KEY)||'[]');
    if(Array.isArray(arr) && arr.length){
      const hasLegacy=arr.some(x=>DRAFT_LEGACY_TITLES.includes((x?.title||'')));
      if(hasLegacy){
        return DRAFT_DEFAULTS.map(x=>({...x}));
      }
      return arr;
    }
  }catch(e){}
  return DRAFT_DEFAULTS.map(x=>({...x}));
}

function writeDraftList(arr){
  try{ localStorage.setItem(DRAFT_KEY, JSON.stringify(arr||[])); }catch(e){}
}

function renderDraftList(){
  const box=document.getElementById('draftList');
  if(!box) return;
  const arr=readDraftList();
  box.innerHTML=arr.map(it=>`<article class="draft-item" data-id="${it.id}" draggable="true">
    <div class="draft-item-head">
      <span class="drag-handle" title="${T.dragSort}">⋮⋮</span>
      <input class="draft-title" value="${escapeHtml(it.title||'')}" placeholder="${T.titleOptional}" />
    </div>
    <textarea class="draft-body" placeholder="${T.writeSomething}">${escapeHtml(it.body||'')}</textarea>
    <div class="draft-actions">
      <button class="draft-btn save-draft" title="${T.save}">${T.save}</button>
      <button class="draft-btn copy-draft" title="${T.copy}">${T.copy}</button>
      <button class="draft-btn del-draft" title="${T.delete}">×</button>
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
  showToast(T.saved);
}

function deleteOneDraft(item){
  const id=item.getAttribute('data-id');
  if(!id) return;
  const arr=readDraftList().filter(x=>String(x.id)!==String(id));
  writeDraftList(arr);
  renderDraftList();
  showToast(T.deleted);
}

function copyOneDraft(item){
  const text=(item.querySelector('.draft-body')?.value||'').trim();
  if(!text) return;
  navigator.clipboard.writeText(text).then(()=>showToast(T.copied)).catch(()=>{});
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
      if(!window.confirm(T.confirmDelDraft)) return;
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
      showToast(T.sortUpdated);
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
