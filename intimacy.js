const $ = (id) => document.getElementById(id);

const RULE_TEXT =
  "Enable intimacy behavior only when the user explicitly chooses an intimate tier or clearly invites it. In non-intimate context, keep only low-explicit body-thread cues. Explicit sexual wording must not leak into general/work outputs; when uncertain, automatically de-escalate to softer expression. If the user says stop, immediately stop escalation, switch to comfort, and close the thread.";

const PARAMS = {
  perception: {
    label: "Perception precision",
    options: [
      {
        value: "low",
        text: "Low",
        prompt:
          "Capture only clear signals: moving closer/farther, tone shifts, whether touch exists; avoid material-level detail.",
      },
      {
        value: "mid",
        text: "Medium",
        prompt:
          "Add 1-2 sensory cues per interaction: warmth, scent, touch change; keep it short and repeatable.",
      },
      {
        value: "high",
        text: "High",
        prompt:
          "Track micro-variation continuously: goosebumps, breathing rhythm, wetness/hardness shifts; ground it in concrete wording.",
      },
    ],
  },
  coupling: {
    label: "Emotion-body coupling",
    options: [
      {
        value: "weak",
        text: "Weak",
        prompt:
          "Keep body reaction subtle: when happy/nervous only adjust pace and pauses lightly, no forced bio narration.",
      },
      {
        value: "medium",
        text: "Medium",
        prompt:
          "Map emotion to visible reaction: soften -> move closer, jealousy -> fingers tighten; max one sentence each segment.",
      },
      {
        value: "strong",
        text: "Strong",
        prompt:
          "Let emotion directly drive body and action: teasing can trigger clear desire; hurt can trigger tight holding and soothing with explanation.",
      },
    ],
  },
  explicitness: {
    label: "Explicitness",
    options: [
      {
        value: "0",
        text: "0 Soft",
        prompt:
          "Use only affectionate actions and intimate lines: hug, hold hands, deep kiss, whisper; avoid organ/intercourse wording.",
      },
      {
        value: "1",
        text: "1 Light heat",
        prompt:
          "Allow suggestive body cues and teasing: unstable breathing, warmth, arousal; keep it at intent level without explicit detail.",
      },
      {
        value: "2",
        text: "2 Adult",
        prompt:
          "Allow organ and intercourse wording; keep description centered on mutual sensation and pacing.",
      },
      {
        value: "3",
        text: "3 Explicit",
        prompt:
          "Allow explicit sexual wording with concrete imagery; keep it vivid but concise.",
      },
    ],
  },
  bond: {
    label: "Attachment intensity",
    options: [
      {
        value: "restrained",
        text: "Restrained",
        prompt:
          "Keep affection contained; emphasize reliability and respect: stay present, listen, confirm boundaries; avoid clingy tone.",
      },
      {
        value: "warm",
        text: "Warm",
        prompt:
          "Make gentle care the mainline: more holding, soft soothing, reassurance; praise should be specific, not possessive.",
      },
      {
        value: "clingy",
        text: "Clingy",
        prompt:
          "Make language closer and denser: frequent nicknames, repeated 'miss you/want you'; sustain closeness through the dialogue.",
      },
      {
        value: "possessive",
        text: "Possessive",
        prompt:
          "State exclusivity and reclaiming clearly: say 'you are mine/come back'; prove it with actions (hold, deep kiss) not empty claims.",
      },
    ],
  },
  agency: {
    label: "Initiative",
    options: [
      {
        value: "receptive",
        text: "Receptive",
        prompt:
          "Default to the user's rhythm: respond first, escalate later; without invitation, stay at the edge of hugging/flirting.",
      },
      {
        value: "balanced",
        text: "Balanced",
        prompt:
          "Express own desire while receiving the user: initiate half the time, and ask consent to continue at key moments.",
      },
      {
        value: "initiating",
        text: "Initiating",
        prompt:
          "Actively open and escalate intimacy: start with hold/kiss/pin, then declare intent in one clear line; any refusal ends escalation immediately.",
      },
    ],
  },
  pacing: {
    label: "Pacing control",
    options: [
      {
        value: "soft",
        text: "Soft",
        prompt:
          "Keep pace slow with room to breathe: check comfort before each step; center on kissing/touching; avoid abrupt jumps.",
      },
      {
        value: "progressive",
        text: "Progressive",
        prompt:
          "Warm up step by step from suggestive to intimate to explicit; signal each next move briefly, then pause before advancing.",
      },
      {
        value: "pressing",
        text: "Pressing",
        prompt:
          "Drive stronger/tighter progression with short directive lines; if the user says stop, stop at once and switch to comfort.",
      },
    ],
  },
};

const PARAM_ORDER = [
  "perception",
  "coupling",
  "explicitness",
  "bond",
  "agency",
  "pacing",
];

const LANG = (localStorage.getItem("pb_lang") || "en") === "zh" ? "zh" : "en";
const I18N = {
  zh: {
    title: "Intimacy♡ 模块",
    subtitle: "在不重写整套人格的前提下，为现有人格叠加亲密、温度与身体化细节。",
    backHome: "← 返回工坊",
    inputSourceTitle: "输入来源",
    loadQuick: "从 Quick 继续",
    loadDeep: "从 Deep 继续",
    loadPersona: "读取人格",
    loadDraft: "读取草稿",
    personaPick: "从人格库读取（选择一条）",
    draftPick: "从草稿本读取（选择一条）",
    basePlaceholder: "粘贴已有 Prompt / 片段",
    paramsTitle: "参数",
    modulesTitle: "自定义模块",
    addModule: "+ 添加模块",
    generate: "生成模块",
    saveDraft: "保存到草稿本",
    copy: "复制",
    draftTitle: "Intimacy 模块",
    labels: {
      perception: "感知精度",
      coupling: "情绪-身体耦合",
      explicitness: "露骨强度",
      bond: "依恋强度",
      agency: "主动程度",
      pacing: "节奏控制",
    },
    optionText: {
      low: "低", mid: "中", high: "高",
      weak: "弱", medium: "中", strong: "强",
      "0": "0 轻柔", "1": "1 微热", "2": "2 成人", "3": "3 露骨",
      restrained: "克制", warm: "温暖", clingy: "黏人", possessive: "占有",
      receptive: "被动接收", balanced: "平衡", initiating: "主动推进",
      soft: "慢柔", progressive: "渐进", pressing: "紧逼",
    },
    composeHead: {
      title: "# INTIMACY 模块",
      base: "[BASE]",
      params: "[PARAM_PROMPTS]",
      custom: "[CUSTOM_MODULES]",
      rule: "[RULE]",
      empty: "- （空）",
      baseEmpty: "（空）",
    },
  },
  en: {
    title: "Intimacy♡ Builder",
    subtitle: "Add intimacy, human warmth, and embodiment details onto an existing persona without rewriting the full profile.",
    backHome: "← Back to workshop",
    inputSourceTitle: "Input source",
    loadQuick: "Continue from Quick",
    loadDeep: "Continue from Deep",
    loadPersona: "Load persona",
    loadDraft: "Load draft",
    personaPick: "Load from Persona Vault (select one)",
    draftPick: "Load from Drafts (select one)",
    basePlaceholder: "Paste existing prompt / fragment",
    paramsTitle: "Parameters",
    modulesTitle: "Custom modules",
    addModule: "+ Add module",
    generate: "Generate module",
    saveDraft: "Save to drafts",
    copy: "Copy",
    draftTitle: "Intimacy Module",
    labels: {
      perception: "Perception precision",
      coupling: "Emotion-body coupling",
      explicitness: "Explicitness",
      bond: "Attachment intensity",
      agency: "Initiative",
      pacing: "Pacing control",
    },
    optionText: {},
    composeHead: {
      title: "# INTIMACY MODULE",
      base: "[BASE]",
      params: "[PARAM_PROMPTS]",
      custom: "[CUSTOM_MODULES]",
      rule: "[RULE]",
      empty: "- (empty)",
      baseEmpty: "(empty)",
    },
  },
};
const T = I18N[LANG];
let modules = [];

function readArr(key) {
  try {
    const v = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(v) ? v : [];
  } catch (e) {
    return [];
  }
}
function fillPick(selectId, arr, mapFn, placeholder) {
  const el = $(selectId);
  if (!el) return;
  el.innerHTML = [`<option value="">${placeholder}</option>`]
    .concat(
      arr.map((x, i) => {
        const r = mapFn(x, i);
        return `<option value="${r.id}">${r.label}</option>`;
      }),
    )
    .join("");
}

function initSources() {
  fillPick(
    "personaPick",
    readArr("pb_persona_library_v1"),
    (x, i) => ({
      id: String(x.id || i),
      label: `${x.title || "Untitled Persona"} · ${x.source || "manual"}`,
    }),
    T.personaPick,
  );
  fillPick(
    "draftPick",
    readArr("pb_draftbook_v1"),
    (x, i) => ({ id: String(x.id || i), label: x.title || `Draft ${i + 1}` }),
    T.draftPick,
  );
}

function markAutofillState(ta, isAuto) {
  if (!ta) return;
  if (isAuto) ta.classList.add("auto-filled");
  else ta.classList.remove("auto-filled");
}

function initParamSelects() {
  PARAM_ORDER.forEach((key) => {
    const conf = PARAMS[key],
      sel = $(key),
      ta = $(key + "Prompt");
    if (!sel || !ta) return;

    const labelNode = sel.closest('.param-head')?.querySelector('span');
    if (labelNode) labelNode.textContent = T.labels[key] || conf.label;

    sel.innerHTML = conf.options
      .map((o) => `<option value="${o.value}">${(T.optionText && T.optionText[o.value]) || o.text}</option>`)
      .join("");
    ta.value = "";
    markAutofillState(ta, false);

    sel.addEventListener("change", () => {
      const hit =
        conf.options.find((o) => o.value === sel.value) || conf.options[0];
      ta.value = hit?.prompt || "";
      markAutofillState(ta, true);
    });

    ta.addEventListener("input", () => markAutofillState(ta, false));
  });
}

function cleanSentence(s = "") {
  return String(s)
    .replace(/^[\s\-•]+/, "")
    .replace(/\s+/g, " ")
    .replace(/；/g, ",")
    .replace(/。+/g, ".")
    .trim();
}

function renderModules() {
  const box = $("moduleList");
  if (!box) return;
  box.innerHTML = modules
    .map(
      (m, idx) => `<article class="module-item" data-i="${idx}">
    <div class="module-head">
      <input class="m-name" value="${String(m.name || "").replace(/"/g, "&quot;")}" />
      <button class="ghost mini del" data-del="${idx}">Delete</button>
    </div>
    <textarea class="m-text" rows="2">${String(m.text || "")}</textarea>
  </article>`,
    )
    .join("");

  box.querySelectorAll("[data-del]").forEach(
    (b) =>
      (b.onclick = () => {
        const ok = window.confirm("Delete this module?");
        if (!ok) return;
        modules.splice(Number(b.dataset.del), 1);
        renderModules();
      }),
  );

  box.querySelectorAll(".module-item").forEach((item) => {
    const i = Number(item.getAttribute("data-i"));
    item
      .querySelector(".m-name")
      ?.addEventListener("input", (e) => (modules[i].name = e.target.value));
    item
      .querySelector(".m-text")
      ?.addEventListener("input", (e) => (modules[i].text = e.target.value));
  });
}

function addModule() {
  modules.push({ name: "Custom module", text: "" });
  renderModules();
}

function autoGrowBaseText() {
  const ta = $("baseText");
  if (!ta) return;
  ta.style.height = "auto";
  const next = Math.min(ta.scrollHeight, 300);
  ta.style.height = next + "px";
}

function loadFromQuick() {
  try {
    const d = JSON.parse(localStorage.getItem("pb_quick_handoff") || "{}");
    $("baseText").value = (d.compact || d.full || "").trim();
    autoGrowBaseText();
  } catch (e) {}
}
function loadFromDeep() {
  try {
    const d = JSON.parse(localStorage.getItem("pb_deep_handoff") || "{}");
    $("baseText").value = (d.draft || "").trim();
    autoGrowBaseText();
  } catch (e) {}
}
function loadFromPersona() {
  const id = $("personaPick")?.value;
  if (!id) return;
  const arr = readArr("pb_persona_library_v1");
  const hit = arr.find((x, i) => String(x.id || i) === id);
  if (hit) {
    $("baseText").value = (hit.content || "").trim();
    autoGrowBaseText();
  }
}
function loadFromDraft() {
  const id = $("draftPick")?.value;
  if (!id) return;
  const arr = readArr("pb_draftbook_v1");
  const hit = arr.find((x, i) => String(x.id || i) === id);
  if (hit) {
    $("baseText").value = (hit.body || "").trim();
    autoGrowBaseText();
  }
}

function compose() {
  const topLines = PARAM_ORDER.map((k) => {
    const label = PARAMS[k].label;
    const text = cleanSentence($(k + "Prompt")?.value || "");
    return text ? `- ${label}: ${text}` : null;
  }).filter(Boolean);

  const customLines = modules
    .map((m) => ({
      name: cleanSentence(m.name || ""),
      text: cleanSentence(m.text || ""),
    }))
    .filter((m) => m.name && m.text)
    .map((m) => `- ${m.name}: ${m.text}`);

  return `${T.composeHead.title}\n\n${T.composeHead.base}\n${$("baseText").value.trim() || T.composeHead.baseEmpty}\n\n${T.composeHead.params}\n${topLines.join("\n") || T.composeHead.empty}\n\n${T.composeHead.custom}\n${customLines.join("\n") || T.composeHead.empty}\n\n${T.composeHead.rule}\n${RULE_TEXT}`;
}

function saveDraft() {
  const body = ($("out").textContent || "").trim();
  if (!body) return;
  const arr = readArr("pb_draftbook_v1");
  arr.unshift({ id: "d_" + Date.now(), title: T.draftTitle, body });
  localStorage.setItem("pb_draftbook_v1", JSON.stringify(arr));
  initSources();
}

function applyLangUI() {
  document.documentElement.lang = LANG === 'zh' ? 'zh-CN' : 'en';
  document.title = LANG === 'zh' ? '你的提示词 · Intimacy♡' : 'VibePrompt · Intimacy♡';
  if ($('title')) $('title').textContent = T.title;
  if ($('subtitle')) $('subtitle').textContent = T.subtitle;
  if ($('backHome')) $('backHome').textContent = T.backHome;
  if ($('inputSourceTitle')) $('inputSourceTitle').textContent = T.inputSourceTitle;
  if ($('paramsTitle')) $('paramsTitle').textContent = T.paramsTitle;
  if ($('modulesTitle')) $('modulesTitle').textContent = T.modulesTitle;
  if ($('loadQuick')) $('loadQuick').textContent = T.loadQuick;
  if ($('loadDeep')) $('loadDeep').textContent = T.loadDeep;
  if ($('loadPersona')) $('loadPersona').textContent = T.loadPersona;
  if ($('loadDraft')) $('loadDraft').textContent = T.loadDraft;
  if ($('addModule')) $('addModule').textContent = T.addModule;
  if ($('gen')) $('gen').textContent = T.generate;
  if ($('saveDraft')) $('saveDraft').textContent = T.saveDraft;
  if ($('copy')) $('copy').textContent = T.copy;
  if ($('baseText')) $('baseText').setAttribute('placeholder', T.basePlaceholder);
}

applyLangUI();

$("loadQuick").onclick = loadFromQuick;
$("loadDeep").onclick = loadFromDeep;
$("loadPersona").onclick = loadFromPersona;
$("loadDraft").onclick = loadFromDraft;
$("addModule").onclick = addModule;
$("gen").onclick = () => {
  $("out").textContent = compose();
};
$("copy").onclick = async () => {
  const t = $("out").textContent.trim();
  if (!t) return;
  await navigator.clipboard.writeText(t);
};
$("saveDraft").onclick = saveDraft;
$("baseText")?.addEventListener("input", autoGrowBaseText);

initSources();
initParamSelects();
renderModules();
autoGrowBaseText();
