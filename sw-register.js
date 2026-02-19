(function () {
  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
  const isInStandalone =
    window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone === true;
  const page = (location.pathname.split("/").pop() || "home.html").toLowerCase();
  const isHome = page === "home.html" || page === "";

  function getLang() {
    const saved = localStorage.getItem("pb_lang");
    if (saved === "zh" || saved === "en") return saved;
    return (navigator.language || "").toLowerCase().startsWith("zh") ? "zh" : "en";
  }

  function applyBrandByLang() {
    const lang = getLang();
    const brand = lang === "zh" ? "你的提示词" : "VibePrompt";
    const manifestHref = lang === "zh" ? "./manifest.zh.webmanifest" : "./manifest.en.webmanifest";

    const link = document.getElementById("manifestLink") || document.querySelector('link[rel="manifest"]');
    if (link) link.setAttribute("href", manifestHref);

    const apple = document.getElementById("appleTitleMeta") || document.querySelector('meta[name="apple-mobile-web-app-title"]');
    if (apple) apple.setAttribute("content", brand);

    // Keep document title readable while preserving page-specific suffix if exists.
    if (!document.title || /Persona|Workshop|Builder|PBW/i.test(document.title)) {
      document.title = brand;
    }
  }

  function ensureInstallHint() {
    // Only show guidance on non-home pages when opened in browser mode.
    if (isHome || isInStandalone) return;
    if (document.getElementById("installHomeHint")) return;

    const box = document.createElement("div");
    box.id = "installHomeHint";
    box.style.cssText = [
      "position:fixed",
      "left:12px",
      "right:12px",
      "bottom:12px",
      "z-index:9999",
      "background:#111827",
      "color:#e5e7eb",
      "border:1px solid #374151",
      "border-radius:12px",
      "padding:10px 12px",
      "font-size:13px",
      "line-height:1.4",
      "box-shadow:0 8px 24px rgba(0,0,0,.35)",
    ].join(";");

    const text = isIOS
      ? "建议从首页安装：Safari 点分享 → 添加到主屏幕。"
      : "建议从首页安装应用，以获得稳定图标与启动入口。";

    box.innerHTML = `${text} <a href="./home.html" style="color:#93c5fd;text-decoration:underline">去首页</a> <button id="dismissInstallHomeHint" style="float:right;background:transparent;border:0;color:#9ca3af;font-size:16px">×</button>`;
    document.body.appendChild(box);

    document.getElementById("dismissInstallHomeHint")?.addEventListener("click", () => {
      box.remove();
      try {
        sessionStorage.setItem("pb_install_hint_dismissed", "1");
      } catch {}
    });
  }

  // Removed forced standalone redirect to avoid first-tap jump feeling like a bug.

  applyBrandByLang();

  if (!("serviceWorker" in navigator)) {
    if (!(sessionStorage.getItem("pb_install_hint_dismissed") === "1")) ensureInstallHint();
    return;
  }

  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(() => {});
    if (!(sessionStorage.getItem("pb_install_hint_dismissed") === "1")) ensureInstallHint();
  });
})();
