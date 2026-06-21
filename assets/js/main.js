/* Portfolio — Clément Roussel — interactions */
(function () {
  "use strict";

  /* ---- Nav: scrolled state + mobile toggle ---- */
  const nav = document.querySelector(".nav");
  const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 12);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  if (toggle) {
    toggle.addEventListener("click", () => links.classList.toggle("open"));
    links.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => links.classList.remove("open"))
    );
  }

  /* ---- Active section in nav ---- */
  const navLinks = Array.from(document.querySelectorAll(".nav-links a[href^='#']"));
  const sections = navLinks
    .map((a) => document.querySelector(a.getAttribute("href")))
    .filter(Boolean);
  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          const id = "#" + e.target.id;
          navLinks.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === id));
        }
      });
    },
    { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
  );
  sections.forEach((s) => spy.observe(s));

  /* ---- Reveal on scroll ---- */
  const revealer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          obs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  document.querySelectorAll(".reveal").forEach((el) => revealer.observe(el));

  /* ---- Hero mini-chart : animate bar heights ---- */
  document.querySelectorAll(".minichart .bar").forEach((bar, i) => {
    const h = bar.dataset.h || 40;
    bar.style.height = "0%";
    bar.style.animationDelay = i * 0.07 + "s";
    requestAnimationFrame(() => requestAnimationFrame(() => (bar.style.height = h + "%")));
  });

  /* ---- SAÉ filter by competence ---- */
  const filterBtns = document.querySelectorAll(".filter-btn");
  const saeCards = document.querySelectorAll(".sae-card[data-comp]");
  function applyFilter(key) {
    saeCards.forEach((card) => {
      const comps = (card.dataset.comp || "").split(" ");
      const show = key === "all" || comps.includes(key);
      card.classList.toggle("is-hidden", !show);
    });
  }
  filterBtns.forEach((btn) =>
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      applyFilter(btn.dataset.filter);
    })
  );

  /* ---- competence chips jump to SAÉ section + filter ---- */
  document.querySelectorAll("[data-jump]").forEach((chip) =>
    chip.addEventListener("click", () => {
      const key = chip.dataset.jump;
      const target = document.querySelector("#saes");
      if (target) target.scrollIntoView({ behavior: "smooth" });
      const btn = document.querySelector(`.filter-btn[data-filter='${key}']`);
      if (btn) setTimeout(() => btn.click(), 350);
    })
  );

  /* ---- BUT1 / BUT2 level toggle ---- */
  const levelBtns = document.querySelectorAll(".level-btn");
  levelBtns.forEach((btn) =>
    btn.addEventListener("click", () => {
      const lvl = btn.dataset.level;
      document.body.classList.toggle("view-but1", lvl === "but1");
      levelBtns.forEach((b) => b.classList.toggle("active", b.dataset.level === lvl));
      const allBtn = document.querySelector(".filter-btn[data-filter='all']");
      if (allBtn) allBtn.click();
    })
  );

  /* ---- SAÉ detail expand ---- */
  document.querySelectorAll(".sae-toggle").forEach((btn) =>
    btn.addEventListener("click", () => {
      const panel = btn.closest(".sae-body").querySelector(".sae-detail");
      const open = panel.classList.toggle("open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
      btn.querySelector("span").textContent = open ? "Réduire" : "Voir le détail";
    })
  );

  /* ---- Lightbox ---- */
  const lb = document.querySelector(".lightbox");
  const lbImg = lb.querySelector("img");
  const lbCap = lb.querySelector("figcaption");
  document.querySelectorAll("[data-zoom]").forEach((el) =>
    el.addEventListener("click", () => {
      const img = el.querySelector("img");
      if (!img) return;
      lbImg.src = img.src;
      lbCap.textContent = el.dataset.caption || img.alt || "";
      lb.classList.add("open");
      document.body.style.overflow = "hidden";
    })
  );
  const closeLb = () => {
    lb.classList.remove("open");
    document.body.style.overflow = "";
  };
  lb.addEventListener("click", closeLb);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && lb.classList.contains("open")) closeLb();
  });

  /* ---- Footer year ---- */
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
})();
