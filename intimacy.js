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
    "Load from Persona Vault (select one)",
  );
  fillPick(
    "draftPick",
    readArr("pb_draftbook_v1"),
    (x, i) => ({ id: String(x.id || i), label: x.title || `Draft ${i + 1}` }),
    "Load from Drafts (select one)",
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
    sel.innerHTML = conf.options
      .map((o) => `<option value="${o.value}">${o.text}</option>`)
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

  return `# INTIMACY MODULE\n\n[BASE]\n${$("baseText").value.trim() || "(empty)"}\n\n[PARAM_PROMPTS]\n${topLines.join("\n") || "- (empty)"}\n\n[CUSTOM_MODULES]\n${customLines.join("\n") || "- (empty)"}\n\n[RULE]\n${RULE_TEXT}`;
}

function saveDraft() {
  const body = ($("out").textContent || "").trim();
  if (!body) return;
  const arr = readArr("pb_draftbook_v1");
  arr.unshift({ id: "d_" + Date.now(), title: "Intimacy Module", body });
  localStorage.setItem("pb_draftbook_v1", JSON.stringify(arr));
  initSources();
}

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
