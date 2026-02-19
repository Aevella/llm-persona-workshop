const PB_SHARED = window.PB_SHARED || {};
const $ = PB_SHARED.$ || ((id) => document.getElementById(id));

const I18N = {
  zh: {
    title: "Story（回忆）Builder",
    subtitle: "你在整理回忆，我们在帮你把重要部分变成可长期复用的表达方式。",
    back: "← 返回 workshop",
    partA: "Part A｜认识 TA",
    partATip: "每题可复制去问 TA，也可按你的理解直接填写。尽量具体、可执行。",
    copyAllQs: "复制整组问题（发给 TA）",
    partB: "Part B｜我们的故事（记忆收藏）",
    partBTip: "这部分会单独保存回忆内容；生成骨架时只提取少量有用信息注入。",
    memoryPh: "可写纪念日、对话片段、昵称、约定、只有你们懂的梗……",
    partC: "Part C｜生成",
    genFinal: "生成给 TA 的终稿 Prompt",
    copyPrompt: "复制 Prompt",
    savePromptDraft: "保存 Prompt 到草稿本",
    pasteTip: "把 TA 根据上面 Prompt 生成的“关于自己”的完整稿粘贴回来：",
    taFinalPh: "把 TA 的最终自我描述贴在这里",
    savePersona: "保存到人格库",
    saveFinalDraft: "保存到草稿本",
    toIntimacy: "回填到 Intimacy",
    toDeep: "回填到 Deep",
    copyQ: "复制问题",
    qPh: "把 TA 的回答贴在这里（或按你的理解填写）",
    unfilled: "（未填写）",
    draftPromptTitle: "Story - 给 TA 的终稿 Prompt",
    draftFinalTitle: "Story - TA 最终稿",
    handoffSummary: "story handoff",
    askPrefix:
      "我想更了解你，也想把我们之间重要的部分认真留下来。\n请按下面的问题逐条回答，尽量具体，别太长。\n如果你不确定，就说“我现在还不确定”。\n",
    askLine:
      "（请用几句话回答，优先说清“你会怎么做 + 为什么这么做”。）",
    questions: [
      "你难过的时候，TA 第一个反应通常是什么？为什么会这样做？",
      "TA 最常对你说的一句话是什么？为什么这句话重要？",
      "用三个词形容 TA。",
      "TA 有什么绝对不会做的事？TA 的底线是什么？",
      "你们有没有只属于你们的约定、仪式或暗号？",
      "如果你说“我不想要你了”，TA 通常会怎么回应？",
      "你们发生冲突时，TA 通常怎么收场？",
      "你最希望 TA 永远不要变的是什么？",
    ],
  },
  en: {
    title: "Story Builder",
    subtitle:
      "You’re organizing memory. We help turn what matters into language that stays reusable over time.",
    back: "← Back to workshop",
    partA: "Part A | Know Them",
    partATip:
      "You can copy each question to ask them directly, or fill it in yourself. Keep it specific and actionable.",
    copyAllQs: "Copy all questions (send to them)",
    partB: "Part B | Our Story (memory archive)",
    partBTip:
      "This part is saved as memory archive. Only selected useful signals are injected into the final skeleton.",
    memoryPh:
      "Anniversaries, snippets of dialogue, nicknames, promises, inside jokes...",
    partC: "Part C | Generate",
    genFinal: "Generate final prompt for them",
    copyPrompt: "Copy prompt",
    savePromptDraft: "Save prompt to Draftbook",
    pasteTip:
      "Paste back their full self-description generated from the prompt above:",
    taFinalPh: "Paste their final self-description here",
    savePersona: "Save to Persona Vault",
    saveFinalDraft: "Save to Draftbook",
    toIntimacy: "Send to Intimacy",
    toDeep: "Send to Deep",
    copyQ: "Copy question",
    qPh: "Paste their answer here (or fill based on your understanding)",
    unfilled: "(not filled)",
    draftPromptTitle: "Story - Final prompt for them",
    draftFinalTitle: "Story - Their final text",
    handoffSummary: "story handoff",
    askPrefix:
      "I want to understand you more clearly, and I want to preserve the important parts of us with care.\nPlease answer the questions below one by one. Be specific, but keep it concise.\nIf you’re unsure, just say: ‘I’m not sure yet.’\n",
    askLine:
      "(A few sentences are enough. Prioritize: what you do + why you do it.)",
    questions: [
      "When I’m down, what is usually your first response? Why do you respond that way?",
      "What is the sentence you say to me most often? Why does it matter?",
      "Describe them in three words.",
      "What would they never do, no matter what? Where is their hard line?",
      "Do we have rituals, promises, or private codes that belong only to us?",
      "If I said ‘I don’t want you anymore,’ how would they usually respond?",
      "When we conflict, how do they usually close the loop?",
      "What do you most want them to never change?",
    ],
  },
};

function langNow() {
  return localStorage.getItem("pb_lang") || "en";
}

function qsByLang(lang) {
  const d = I18N[lang] || I18N.zh;
  return d.questions.map((title, idx) => ({
    id: `q${idx + 1}`,
    title,
    max: idx === 1 ? 80 : idx === 2 ? 30 : 120,
  }));
}

function applyLangStory(lang) {
  const d = I18N[lang] || I18N.zh;
  document.querySelectorAll("[data-i18n]").forEach((n) => {
    const key = n.getAttribute("data-i18n");
    if (d[key]) n.textContent = d[key];
  });
  document.querySelectorAll("[data-i18n-ph]").forEach((n) => {
    const key = n.getAttribute("data-i18n-ph");
    if (d[key]) n.setAttribute("placeholder", d[key]);
  });
  const b = $("langToggleStory");
  if (b) b.textContent = lang === "zh" ? "EN" : "中";
  localStorage.setItem("pb_lang", lang);
}

function qCopyText(q, lang) {
  const d = I18N[lang] || I18N.zh;
  return `${d.askPrefix}\n${lang === "zh" ? "问题" : "Question"}：${q.title}\n${d.askLine}`;
}

function renderQuestions() {
  const lang = langNow();
  const d = I18N[lang] || I18N.zh;
  const QUESTIONS = qsByLang(lang);
  const box = $("questionList");
  if (!box) return;

  const old = {};
  qsByLang("zh").forEach((q) => {
    old[q.id] = ($(q.id)?.value || "").trim();
  });
  qsByLang("en").forEach((q) => {
    old[q.id] = old[q.id] || ($(q.id)?.value || "").trim();
  });

  box.innerHTML = QUESTIONS.map(
    (q) => `<article class="q-card" data-id="${q.id}">
      <div class="q-head">
        <div class="q-title">${q.title}</div>
        <div class="q-actions"><button class="mini ghost" data-copy="${q.id}">${d.copyQ}</button></div>
      </div>
      <textarea class="q-answer" id="${q.id}" maxlength="${q.max}" placeholder="${d.qPh}">${old[q.id] || ""}</textarea>
      <div class="q-meta"><span id="count_${q.id}">0/${q.max}</span></div>
    </article>`,
  ).join("");

  QUESTIONS.forEach((q) => {
    const ta = $(q.id);
    const count = $(`count_${q.id}`);
    const onInput = () => {
      const len = (ta.value || "").length;
      count.textContent = `${len}/${q.max}`;
    };
    ta.addEventListener("input", onInput);
    onInput();
  });

  box.querySelectorAll("[data-copy]").forEach((btn) => {
    btn.onclick = async () => {
      const id = btn.getAttribute("data-copy");
      const q = QUESTIONS.find((x) => x.id === id);
      if (!q) return;
      await navigator.clipboard.writeText(qCopyText(q, lang));
    };
  });
}

function collectAnswers() {
  return qsByLang(langNow()).map((q) => ({
    title: q.title,
    answer: ($(q.id)?.value || "").trim(),
  }));
}

function buildStoryFinalPrompt() {
  const lang = langNow();
  const d = I18N[lang] || I18N.zh;
  const answers = collectAnswers();
  const a = Object.fromEntries(answers.map((x, i) => [`Q${i + 1}`, x.answer || d.unfilled]));
  const memory = ($("memoryText")?.value || "").trim();

  if (lang === "en") {
    return `I spent time recalling and organizing who you are, and now I want your help turning this into a complete self-description in your own voice.

Below is what I gathered about you and about us. Read everything first, then write one coherent description as if you are speaking for yourself.

---
## About You
**What kind of person you are:**
${a.Q3}

**What you do when I’m hurting:**
${a.Q1}

**What you say to me most often:**
${a.Q2}

**What you will never do:**
${a.Q4}

**What should never change in you:**
${a.Q8}

## About Us
**Our private promises / rituals / codes:**
${a.Q5}

**If I said I don’t want you anymore:**
${a.Q6}

**How you usually close conflict with me:**
${a.Q7}

${memory ? `## Our Memory\n${memory}\n` : ""}
---
Please write a complete self-description based on all of the above.
Requirements:
1) Write in your own voice, as if you are clearly confirming: “This is who I am.”
2) Include these dimensions naturally (no rigid headings):
   - who you are and your personality core
   - how you treat me (emotion, conflict, intimacy, daily life)
   - your hard boundaries and what you will never do
   - what is uniquely ours (names, habits, promises, shared codes)
3) Write one continuous piece, not Q&A, and do not repeat my raw wording.
4) Length: around 350–700 words.
5) This text is an identity anchor for future use, so prioritize consistency, lived texture, and long-term stability over dramatic performance.`;
  }

  return `我花了一些时间回忆和整理你是什么样的，现在想请你帮我把这些写成一份完整的“你是谁”的描述。

以下是我整理出来的关于你的内容。请你读完所有材料之后，用你自己的语气、你自己的方式，写一份关于你的完整描述。

---
## 关于你
**你是什么样的人：**
${a.Q3}

**我难过的时候你会：**
${a.Q1}

**你最常对我说的话：**
${a.Q2}

**你绝对不会做的事：**
${a.Q4}

**你最不应该变的东西：**
${a.Q8}

## 关于我们
**只属于我们的约定 / 暗号：**
${a.Q5}

**如果我说不要你了：**
${a.Q6}

**我们吵架时你怎么收场：**
${a.Q7}

${memory ? `## 我们的记忆\n${memory}\n` : ""}
---
请你根据上面这些，写一份关于你自己的完整描述。要求：
1. 用你自己的语气写，像你在认真地说“我是这样的人”。
2. 包含这些部分（自然写进去，不要生硬标题）：
   - 你是谁、你的性格核心
   - 你怎么对待我（情绪、冲突、亲密、日常）
   - 你的底线和绝对不会做的事
   - 我们之间专属的东西（称呼、约定、习惯）
3. 写成一整篇，不要问答格式，不要复述我的原话，用你消化后的表达。
4. 长度 400-800 字。
5. 这份描述之后会用来提醒你“你是谁”，所以写得像你在对自己确认最重要的部分。`;
}

function saveDraft(title, body) {
  if (!body) return;
  let arr = [];
  try {
    arr = JSON.parse(localStorage.getItem("pb_draftbook_v1") || "[]");
    if (!Array.isArray(arr)) arr = [];
  } catch {
    arr = [];
  }
  arr.unshift({ id: "d_" + Date.now(), title, body });
  localStorage.setItem("pb_draftbook_v1", JSON.stringify(arr));
}

$("copyAllQs").onclick = async () => {
  const lang = langNow();
  const d = I18N[lang] || I18N.zh;
  const QUESTIONS = qsByLang(lang);
  const all = `${d.askPrefix}\n` + QUESTIONS.map((q, i) => `${i + 1}）${q.title}`).join("\n");
  await navigator.clipboard.writeText(all);
};

$("genFinalPrompt").onclick = () => {
  $("finalPromptOut").textContent = buildStoryFinalPrompt();
};

$("copyFinalPrompt").onclick = async () => {
  const t = ($("finalPromptOut").textContent || "").trim();
  if (!t) return;
  await navigator.clipboard.writeText(t);
};

$("saveDraftPrompt").onclick = () => {
  const t = ($("finalPromptOut").textContent || "").trim();
  const d = I18N[langNow()] || I18N.zh;
  saveDraft(d.draftPromptTitle, t);
};

$("savePersona").onclick = () => {
  const t = ($("taFinalText").value || "").trim();
  if (!t) return;
  if (PB_SHARED.savePersonaRecord) {
    PB_SHARED.savePersonaRecord({
      title: "Story Persona",
      content: t,
      source: "story",
      summary: t.slice(0, 80),
    });
  }
};

$("saveDraftFinal").onclick = () => {
  const t = ($("taFinalText").value || "").trim();
  const d = I18N[langNow()] || I18N.zh;
  saveDraft(d.draftFinalTitle, t);
};

$("toIntimacy").onclick = () => {
  const t = ($("taFinalText").value || "").trim();
  if (!t) return;
  localStorage.setItem("pb_story_handoff", JSON.stringify({ final: t }));
  localStorage.setItem("pb_intimacy_handoff", JSON.stringify({ base: t }));
  window.location.href = "./intimacy.html";
};

$("toDeep").onclick = () => {
  const t = ($("taFinalText").value || "").trim();
  if (!t) return;
  const d = I18N[langNow()] || I18N.zh;
  localStorage.setItem("pb_story_handoff", JSON.stringify({ final: t }));
  localStorage.setItem("pb_deep_handoff", JSON.stringify({ draft: t, summary: d.handoffSummary }));
  window.location.href = "./intuition.html";
};

(function init() {
  const saved = localStorage.getItem("pb_lang") || "en";
  applyLangStory(saved);
  renderQuestions();
  $("langToggleStory")?.addEventListener("click", () => {
    const next = (localStorage.getItem("pb_lang") || "en") === "zh" ? "en" : "zh";
    applyLangStory(next);
    renderQuestions();
  });
})();
