(function () {
  const cfg = window.EBMA_CONFIG || {};
  const cookieName = cfg.PORTAL_SESSION_HINT_COOKIE || "ebma-session-active";

  function hasPortalSessionHint() {
    return new RegExp(`(?:^|; )${cookieName}=1(?:;|$)`).test(document.cookie);
  }

  function applyPortalCtas() {
    const loggedIn = hasPortalSessionHint();
    document.querySelectorAll("[data-ebma-portal-auth]").forEach((el) => {
      const mode = el.getAttribute("data-ebma-portal-auth");
      const show = mode === "in" ? loggedIn : mode === "out" ? !loggedIn : false;
      el.classList.toggle("hidden", !show);
    });
  }

  function bindExternalConfigLinks() {
    document.querySelectorAll("[data-ebma-href]").forEach((el) => {
      const key = el.getAttribute("data-ebma-href");
      if (!key || !(key in cfg)) return;
      el.setAttribute("href", cfg[key]);
    });
  }

  function initMobileMenu() {
    const toggle = document.querySelector("[data-ebma-menu-toggle]");
    const panel = document.querySelector("[data-ebma-mobile-menu]");
    const overlay = document.querySelector("[data-ebma-menu-overlay]");
    if (!toggle || !panel) return;

    let open = false;

    const setOpen = (next) => {
      open = next;
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      panel.classList.toggle("pointer-events-none", !open);
      panel.classList.toggle("-translate-y-2", !open);
      panel.classList.toggle("scale-[0.98]", !open);
      panel.classList.toggle("opacity-0", !open);
      panel.classList.toggle("pointer-events-auto", open);
      panel.classList.toggle("translate-y-0", open);
      panel.classList.toggle("scale-100", open);
      panel.classList.toggle("opacity-100", open);
      if (overlay) overlay.classList.toggle("hidden", !open);
    };

    toggle.addEventListener("click", () => setOpen(!open));
    overlay?.addEventListener("click", () => setOpen(false));
    panel.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => setOpen(false));
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && open) setOpen(false);
    });
  }

  function initProductsMenuDesktop(root) {
    if (!root || root.dataset.ebmaProductsBound === "1") return;
    root.dataset.ebmaProductsBound = "1";

    const trigger = root.querySelector("[data-ebma-products-trigger]");
    const panel = root.querySelector("[data-ebma-products-panel]");
    if (!trigger || !panel) return;

    let open = false;
    let closeTimer = null;

    const clearCloseTimer = () => {
      if (closeTimer !== null) {
        window.clearTimeout(closeTimer);
        closeTimer = null;
      }
    };

    const chevron = root.querySelector("[data-ebma-products-chevron]");

    const setOpen = (next) => {
      open = next;
      trigger.setAttribute("aria-expanded", open ? "true" : "false");
      chevron?.classList.toggle("rotate-180", open);
      panel.classList.toggle("pointer-events-none", !open);
      panel.classList.toggle("-translate-y-1.5", !open);
      panel.classList.toggle("scale-[0.98]", !open);
      panel.classList.toggle("opacity-0", !open);
      panel.classList.toggle("pointer-events-auto", open);
      panel.classList.toggle("translate-y-0", open);
      panel.classList.toggle("scale-100", open);
      panel.classList.toggle("opacity-100", open);
      trigger.classList.toggle("text-[#121528]", open);
      trigger.classList.toggle("text-[#5c6478]", !open);
    };

    root.addEventListener("mouseenter", () => {
      clearCloseTimer();
      setOpen(true);
    });
    root.addEventListener("mouseleave", () => {
      clearCloseTimer();
      closeTimer = window.setTimeout(() => setOpen(false), 120);
    });

    trigger.addEventListener("click", () => setOpen(!open));

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && open) setOpen(false);
    });
    document.addEventListener("mousedown", (event) => {
      if (!root.contains(event.target)) setOpen(false);
    });
  }

  function initProductsMenuMobile(root) {
    if (!root || root.dataset.ebmaProductsMobileBound === "1") return;
    root.dataset.ebmaProductsMobileBound = "1";

    const trigger = root.querySelector("[data-ebma-products-mobile-trigger]");
    const panel = root.querySelector("[data-ebma-products-mobile-panel]");
    const chevron = root.querySelector("[data-ebma-products-mobile-chevron]");
    if (!trigger || !panel) return;

    let open = false;

    const setOpen = (next) => {
      open = next;
      trigger.setAttribute("aria-expanded", open ? "true" : "false");
      panel.classList.toggle("grid-rows-[1fr]", open);
      panel.classList.toggle("opacity-100", open);
      panel.classList.toggle("grid-rows-[0fr]", !open);
      panel.classList.toggle("opacity-0", !open);
      chevron?.classList.toggle("rotate-180", open);
    };

    trigger.addEventListener("click", () => setOpen(!open));
    panel.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => setOpen(false));
    });
  }

  function initFooterYear() {
    const yearEl = document.querySelector("[data-ebma-year]");
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());
  }

  function init() {
    bindExternalConfigLinks();
    applyPortalCtas();
    initMobileMenu();
    document.querySelectorAll("[data-ebma-products-desktop]").forEach(initProductsMenuDesktop);
    document.querySelectorAll("[data-ebma-products-mobile]").forEach(initProductsMenuMobile);
    initFooterYear();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
