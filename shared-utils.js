(function () {
  const NSFW_UNLOCK_LEVELS = new Set(["flirty", "explicit"]);

  function byId(id) {
    return document.getElementById(id);
  }

  const $ = byId;

  function autoGrow(el, max = 220) {
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, max) + "px";
  }

  function extractPurposeSummary(text = "") {
    const t = String(text || "");
    const m1 = t.match(/存在目的[：:]\s*([^\n。]+[。]?)/);
    if (m1 && m1[1]) return m1[1].trim();
    const m2 = t.match(/其存在是为了([^\n。]+[。]?)/);
    if (m2 && m2[1]) return ("其存在是为了" + m2[1]).trim();
    const m3 = t.match(/exist(?:s)? to\s+([^\n.]+[.]?)/i);
    if (m3 && m3[1]) return ("exist to " + m3[1]).trim();
    return t.replace(/\n+/g, " ").trim().slice(0, 120);
  }

  function estimateBytes(str = "") {
    try {
      return new Blob([String(str)]).size;
    } catch (e) {
      return String(str).length;
    }
  }

  function safeSetItem(
    key,
    val,
    { onError, onQuotaWarn, quotaWarnBytes = 1.7 * 1024 * 1024 } = {},
  ) {
    const bytes = estimateBytes(val);
    if (bytes >= quotaWarnBytes && typeof onQuotaWarn === "function") {
      onQuotaWarn(bytes);
    }
    try {
      localStorage.setItem(key, val);
      return true;
    } catch (e) {
      if (typeof onError === "function") onError(e);
      return false;
    }
  }

  function isIntimacyMetaUnlocked(meta) {
    const nsfw = meta?.nsfw;
    const bodyOn = meta?.bodyOn;
    return bodyOn === true && NSFW_UNLOCK_LEVELS.has(nsfw);
  }

  function isIntimacyRecordUnlocked(item) {
    if (!item) return false;
    if (item.unlockIntimacy === true) return true;
    return isIntimacyMetaUnlocked(item.meta);
  }

  function hasIntimacyUnlock(records) {
    if (!Array.isArray(records)) return false;
    return records.some((it) => isIntimacyRecordUnlocked(it));
  }

  function readPersonaLibrary() {
    try {
      const arr = JSON.parse(localStorage.getItem("pb_persona_library_v1") || "[]");
      return Array.isArray(arr) ? arr : [];
    } catch (e) {
      return [];
    }
  }

  function savePersonaRecord({
    title,
    content,
    source = "manual",
    summary = "",
    unlockIntimacy = false,
    meta,
    onError,
    onQuotaWarn,
  } = {}) {
    const text = (content || "").trim();
    if (!text) return false;
    const now = Date.now();
    const item = {
      id: "pl_" + now,
      title: (title || "Untitled Persona").trim(),
      content: text,
      source,
      summary: (summary || extractPurposeSummary(text) || "").trim(),
      unlockIntimacy: !!unlockIntimacy,
      meta: meta || undefined,
      createdAt: now,
      updatedAt: now,
    };
    const arr = readPersonaLibrary();
    arr.unshift(item);
    return safeSetItem("pb_persona_library_v1", JSON.stringify(arr), {
      onError,
      onQuotaWarn,
    });
  }

  window.PB_SHARED = {
    $,
    byId,
    autoGrow,
    extractPurposeSummary,
    safeSetItem,
    savePersonaRecord,
    estimateBytes,
    readPersonaLibrary,
    isIntimacyMetaUnlocked,
    isIntimacyRecordUnlocked,
    hasIntimacyUnlock,
  };
})();
