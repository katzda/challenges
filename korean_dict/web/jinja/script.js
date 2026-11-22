function initializeJinja() {
  const JINJA = {
    pages: new Map(),      // pageKey -> { root, container, assets }
    activePage: null,
    ready: false
  };

  // ---------------------------
  // Public API (HTML-facing)
  // ---------------------------
  window.jinja = {
    registerPage,
    start
  };

  // ---------------------------
  // Page registration
  // ---------------------------
  function registerPage({ key, src, container }) {
    const rootURL = new URL("./", new URL(src, location.href));

    JINJA.pages.set(key, {
      key,
      src,
      rootURL,              // full URL (for rebasing)
      rootPath: rootURL.pathname, // pathname (for SW)
      container,
      assets: {
        scripts: [],
        styles: []
      }
    });
  }


  // ---------------------------
  // Start framework
  // ---------------------------
  function start() {
    window.addEventListener("hashchange", syncWithHash);
    syncWithHash();
  }

  function syncWithHash() {
    const key = location.hash.replace(/^#/, "");
    if (!key || !JINJA.pages.has(key)) {
      unloadActivePage();
      return;
    }
    loadPage(key);
  }

  // ---------------------------
  // Page loading
  // ---------------------------
  async function loadPage(key) {
    if (JINJA.activePage === key) return;

    unloadActivePage();

    const page = JINJA.pages.get(key);
    const res = await fetch(page.src);
    const html = await res.text();
    const doc = new DOMParser().parseFromString(html, "text/html");

    // --- styles ---
    doc.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
      const href = link.getAttribute("href");
      if (!href) return;

      const el = document.createElement("link");
      el.rel = "stylesheet";
      el.href = new URL(href, page.rootURL).href;
      el.dataset.jinja = key;

      document.head.appendChild(el);
      page.assets.styles.push(el);
    });

    // --- body ---
    page.container.innerHTML = "";
    Array.from(doc.body.children).forEach(node => {
      if (node.tagName !== "SCRIPT") {
        page.container.appendChild(node.cloneNode(true));
      }
    });

    // --- scripts ---
    doc.querySelectorAll("script").forEach(old => {
      const src = old.getAttribute("src");
      const el = document.createElement("script");
      el.async = false;
      el.dataset.jinja = key;

      if (src) {
        el.src = new URL(src, page.rootURL).href;
      } else {
        el.textContent = old.textContent;
      }

      document.body.appendChild(el);
      page.assets.scripts.push(el);
    });

    // --- title ---
    const title = doc.querySelector("title");
    if (title) document.title = title.textContent;

    // --- service worker sync ---
    navigator.serviceWorker?.controller?.postMessage({
      type: "SET_CHILD_ROOT",
      root: page.rootPath
    });

    JINJA.activePage = key;
  }

  // ---------------------------
  // Page unloading
  // ---------------------------
  function unloadActivePage() {
    if (!JINJA.activePage) return;

    const page = JINJA.pages.get(JINJA.activePage);

    page.assets.scripts.forEach(s => s.remove());
    page.assets.styles.forEach(l => l.remove());
    page.assets.scripts = [];
    page.assets.styles = [];

    page.container.innerHTML = "";

    navigator.serviceWorker?.controller?.postMessage({
      type: "CLEAR_CHILD_ROOT"
    });

    JINJA.activePage = null;
  }
}