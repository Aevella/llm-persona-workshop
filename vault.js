const toast=document.getElementById('toast');
function showToast(text='已复制'){
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
    box.innerHTML='<div class="empty">还没有保存的人格。去 Quick / Deep / Agent 点「保存到人格库」试试。</div>';
    return;
  }
  box.innerHTML=arr.map(it=>{
    const t=escapeHtml(it.title||'Untitled Persona');
    const s=escapeHtml(it.summary||'');
    const srcRaw=escapeHtml(it.source||'manual');
    const srcLabel=srcRaw==='quick'?'Quick':srcRaw==='deep'?'Deep':srcRaw==='agent'?'Agent':'Manual';
    const srcClass=srcRaw==='quick'?'source-quick':srcRaw==='deep'?'source-deep':srcRaw==='agent'?'source-agent':'source-manual';
    const c=escapeHtml(it.content||'');
    return `<article class="item ${srcClass}" data-id="${it.id}" data-copy="${encodeURIComponent(it.content||'')}">
      <div class="item-actions">
        <span class="source-badge ${srcClass}">${srcLabel}</span>
        <button class="copy-btn" title="复制">✓</button>
        <button class="mini-btn toggle-btn" title="展开">▾</button>
        <button class="mini-btn del-btn" title="删除">×</button>
      </div>
      <h3>${t}</h3>
      <p>${s || '（暂无摘要）'}</p>
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
      try{ await navigator.clipboard.writeText(text); showToast('已复制'); }catch{}
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
      if(!window.confirm('确认删除这条人格吗？此操作不可恢复。')) return;
      const arr=readPersonaList().filter(x=>String(x.id)!==String(id));
      writePersonaList(arr);
      renderPersonaList();
      showToast('已删除');
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
      <span class="drag-handle" title="拖动排序">⋮⋮</span>
      <input class="draft-title" value="${escapeHtml(it.title||'')}" placeholder="标题（可选）" />
    </div>
    <textarea class="draft-body" placeholder="写点什么…">${escapeHtml(it.body||'')}</textarea>
    <div class="draft-actions">
      <button class="draft-btn save-draft" title="保存">保存</button>
      <button class="draft-btn copy-draft" title="复制">复制</button>
      <button class="draft-btn del-draft" title="删除">×</button>
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
  showToast('已保存');
}

function deleteOneDraft(item){
  const id=item.getAttribute('data-id');
  if(!id) return;
  const arr=readDraftList().filter(x=>String(x.id)!==String(id));
  writeDraftList(arr);
  renderDraftList();
  showToast('已删除');
}

function copyOneDraft(item){
  const text=(item.querySelector('.draft-body')?.value||'').trim();
  if(!text) return;
  navigator.clipboard.writeText(text).then(()=>showToast('已复制')).catch(()=>{});
}

function addDraft(){
  const arr=readDraftList();
  arr.unshift({id:'d_'+Date.now(),title:'',body:''});
  writeDraftList(arr);
  renderDraftList();
}

function reorderDraftByDom(){
  const box=document.getElementById('draftList');
  if(!box) return;
  const ids=[...box.querySelectorAll('.draft-item')].map(x=>x.getAttribute('data-id'));
  const map=new Map(readDraftList().map(x=>[String(x.id),x]));
  const sorted=ids.map(id=>map.get(String(id))).filter(Boolean);
  writeDraftList(sorted);
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
      if(!window.confirm('确认删除这条草稿吗？')) return;
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
      showToast('排序已更新');
      renderDraftList();
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
