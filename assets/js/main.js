/* =========================================================
   7SMASH — main.js
   ========================================================= */
(function () {
  "use strict";

  const D = window.SMASH_DATA;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const euro = (n) => n.toFixed(2).replace(".", ",") + "\u00a0€";

  /* ---------------------------------------------------------
     SVG BURGER ENGINE
     Chaque couche est dessinée à partir de sa base (y = bas),
     et renvoie { h, svg }. On empile du bas vers le haut.
     --------------------------------------------------------- */
  const INK = "#111";
  const SW = 5; // stroke width : look cartoon / pop

  // pseudo-random déterministe (pour que les bords du steak ne bougent pas à chaque rendu)
  function rng(seed) {
    let s = seed % 2147483647;
    if (s <= 0) s += 2147483646;
    return () => (s = (s * 16807) % 2147483647) / 2147483647;
  }

  const L = {
    bunBottom(y) {
      const h = 40;
      return { h, svg: `
        <path d="M26 ${y - h} H274 Q282 ${y - h} 280 ${y - h + 10} L272 ${y - 8} Q270 ${y} 258 ${y} H42 Q30 ${y} 28 ${y - 8} L20 ${y - h + 10} Q18 ${y - h} 26 ${y - h} Z"
          fill="#E8913A" stroke="${INK}" stroke-width="${SW}" stroke-linejoin="round"/>
        <path d="M36 ${y - h + 8} H264" stroke="#F7C77A" stroke-width="6" stroke-linecap="round" opacity=".8"/>` };
    },
    bunTop(y) {
      const h = 96;
      const seeds = [[95, 30], [130, 18], [168, 22], [205, 34], [112, 52], [150, 44], [190, 56], [236, 58], [72, 58], [150, 70]]
        .map(([x, dy], i) => `<ellipse cx="${x}" cy="${y - h + dy}" rx="7" ry="3.6" transform="rotate(${(i * 37) % 60 - 30} ${x} ${y - h + dy})" fill="#FFF4E0" stroke="${INK}" stroke-width="2.5"/>`).join("");
      return { h, svg: `
        <path d="M18 ${y} Q10 ${y - 8} 16 ${y - 28} Q34 ${y - h} 150 ${y - h} Q266 ${y - h} 284 ${y - 28} Q290 ${y - 8} 282 ${y} Z"
          fill="#F0A040" stroke="${INK}" stroke-width="${SW}" stroke-linejoin="round"/>
        <path d="M60 ${y - 58} Q90 ${y - 84} 140 ${y - 86}" stroke="#FFD89A" stroke-width="10" fill="none" stroke-linecap="round" opacity=".9"/>
        ${seeds}` };
    },
    patty(y, seed = 1) {
      const h = 30, r = rng(seed * 97 + 13);
      let top = "", bot = "";
      for (let x = 30; x <= 270; x += 12) top += ` L${x} ${(y - h + r() * 6 - 3).toFixed(1)}`;
      for (let x = 270; x >= 30; x -= 12) bot += ` L${x} ${(y + r() * 6 - 3).toFixed(1)}`;
      const crumbs = Array.from({ length: 9 }, () => {
        const cx = 50 + r() * 200, cy = y - h / 2 + (r() * 14 - 7);
        return `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${(1.8 + r() * 2).toFixed(1)}" fill="#A8552A"/>`;
      }).join("");
      return { h, svg: `
        <path d="M24 ${y - h / 2}${top} Q286 ${y - h} 282 ${y - h / 2} Q286 ${y} 270 ${y}${bot} Q14 ${y} 24 ${y - h / 2} Z"
          fill="#6B2D14" stroke="${INK}" stroke-width="${SW}" stroke-linejoin="round"/>
        <path d="M40 ${y - h + 8} Q150 ${y - h + 3} 262 ${y - h + 8}" stroke="#8E4220" stroke-width="5" fill="none" stroke-linecap="round"/>
        ${crumbs}` };
    },
    cheese(y, seed = 1, color = "#FFB81C") {
      const h = 12, r = rng(seed * 31 + 7);
      const drips = [238, 186, 128, 70].map((x) => [x + (r() * 16 - 8), 10 + r() * 22]);
      let d = `M14 ${y - h} H286 L278 ${y}`;
      drips.forEach(([x, len]) => {
        d += ` L${(x + 9).toFixed(1)} ${y} C${(x + 9).toFixed(1)} ${(y + len).toFixed(1)} ${(x - 9).toFixed(1)} ${(y + len).toFixed(1)} ${(x - 9).toFixed(1)} ${y}`;
      });
      d += ` L22 ${y} Z`;
      return { h: h - 2, svg: `<path d="${d}" fill="${color}" stroke="${INK}" stroke-width="${SW - 1}" stroke-linejoin="round"/>
        <path d="M30 ${y - h + 4} H120" stroke="#FFE38A" stroke-width="3" stroke-linecap="round"/>` };
    },
    raclette(y, seed = 1) { return L.cheese(y, seed + 5, "#F7E08C"); },
    bacon(y) {
      const h = 12;
      let d = `M22 ${y - h / 2}`;
      for (let i = 0; i <= 16; i++) d += ` Q${22 + i * 16 + 8} ${y - h / 2 + (i % 2 ? -8 : 8)} ${22 + (i + 1) * 16} ${y - h / 2}`;
      return { h, svg: `<path d="${d}" stroke="${INK}" stroke-width="16" fill="none" stroke-linecap="round"/>
        <path d="${d}" stroke="#C0392B" stroke-width="9" fill="none" stroke-linecap="round"/>
        <path d="${d}" stroke="#F3B6A6" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-dasharray="14 18"/>` };
    },
    onion(y) {
      const h = 8;
      const rings = [60, 104, 150, 196, 240].map((x, i) => `<ellipse cx="${x}" cy="${y - 4}" rx="${18 + (i % 2) * 4}" ry="6" fill="#F7F0FF" stroke="${INK}" stroke-width="3"/><ellipse cx="${x}" cy="${y - 4}" rx="${9 + (i % 2) * 2}" ry="2.5" fill="#D9C4F0"/>`).join("");
      return { h, svg: rings };
    },
    pickles(y) {
      const h = 10;
      const p = [48, 96, 150, 204, 252].map((x) => `<ellipse cx="${x}" cy="${y - 5}" rx="22" ry="7" fill="#7CB342" stroke="${INK}" stroke-width="3"/><circle cx="${x - 8}" cy="${y - 5}" r="1.8" fill="#DCEDC8"/><circle cx="${x + 6}" cy="${y - 6}" r="1.8" fill="#DCEDC8"/>`).join("");
      return { h, svg: p };
    },
    salad(y) {
      const h = 14;
      let d = `M12 ${y}`;
      for (let x = 12; x < 288; x += 22) d += ` Q${x + 5} ${y - h - 6} ${x + 11} ${y - h + 2} Q${x + 16} ${y - h - 6} ${x + 22} ${y}`;
      return { h, svg: `<path d="${d} Z" fill="#4CAF50" stroke="${INK}" stroke-width="${SW - 1}" stroke-linejoin="round"/>` };
    },
    tomato(y) {
      const h = 14;
      return { h, svg: `<rect x="34" y="${y - h}" width="110" height="${h}" rx="7" fill="#E63022" stroke="${INK}" stroke-width="4"/>
        <rect x="156" y="${y - h}" width="110" height="${h}" rx="7" fill="#E63022" stroke="${INK}" stroke-width="4"/>
        <circle cx="70" cy="${y - 7}" r="2.5" fill="#FFB3A7"/><circle cx="112" cy="${y - 7}" r="2.5" fill="#FFB3A7"/><circle cx="190" cy="${y - 7}" r="2.5" fill="#FFB3A7"/><circle cx="232" cy="${y - 7}" r="2.5" fill="#FFB3A7"/>` };
    },
    sauce(y, color = "#FF8A3D") {
      const h = 6;
      let d = `M26 ${y - h}`;
      for (let x = 26; x < 274; x += 31) d += ` Q${x + 15} ${y + 10} ${x + 31} ${y - h}`;
      return { h, svg: `<path d="${d} Z" fill="${color}" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>` };
    }
  };

  const SAUCE_COLORS = { smash: "#F7941D", bbq: "#7A2E12", algerienne: "#F4A259", samourai: "#E4572E" };

  /**
   * layers : liste de haut en bas, ex. ["bunTop","sauce","cheese","patty","bunBottom"]
   * opts.fixedHeight : hauteur de viewBox fixe (builder) sinon auto.
   * opts.animateKeys : Set de clés à animer (sinon toutes si opts.animateAll)
   */
  function burgerSVG(layers, opts = {}) {
    const overlap = 3;
    const pad = 20;
    // hauteur totale estimée
    let parts = [];
    let y = 0;
    const counters = {};
    const bottomUp = layers.slice().reverse();
    bottomUp.forEach((spec) => {
      const [type, arg] = Array.isArray(spec) ? spec : [spec];
      counters[type] = (counters[type] || 0) + 1;
      const key = `${type}-${counters[type]}`;
      const layer = L[type](y, arg != null ? arg : counters[type]);
      parts.push({ key, top: y - layer.h, svg: layer.svg });
      y -= layer.h - overlap;
    });
    const total = -y + overlap;
    const H = opts.fixedHeight || total + pad * 2 + 30;
    const baseY = H - pad;
    const n = parts.length;
    const groups = parts.map((p, i) => {
      const anim = opts.animateAll || (opts.animateKeys && opts.animateKeys.has(p.key));
      return `<g class="layer${anim ? " drop" : ""}" style="--i:${opts.animateAll ? i : 0}" data-key="${p.key}"><g transform="translate(0 ${baseY})">${p.svg}</g></g>`;
    }).join("");
    const shadow = `<ellipse cx="150" cy="${baseY + 6}" rx="130" ry="10" fill="rgba(0,0,0,.18)"/>`;
    const pour = opts.pour ? pourSVG(baseY + parts[n - 1].top) : "";
    return {
      keys: parts.map((p) => p.key),
      html: `<svg viewBox="${opts.pour ? "0 -150 300 " + (H + 150) : "0 0 300 " + H}" preserveAspectRatio="xMidYMax meet" role="img">${shadow}${groups}${pour}</svg>`,
      count: n
    };
  }

  /* Le geste signature du logo : la louche de cheddar versée sur le burger.
     by = haut du bun (coordonnées SVG). */
  function pourSVG(by) {
    const C = "#FFB81C";
    const stream = `M236 -52 C214 -20 162 ${by - 60} 156 ${by + 8}`;
    const cap = `M78 ${by + 22} Q92 ${by - 2} 150 ${by - 4} Q210 ${by - 2} 224 ${by + 22}
      L224 ${by + 30} C224 ${by + 58} 208 ${by + 58} 208 ${by + 30}
      L186 ${by + 30} C186 ${by + 74} 168 ${by + 74} 168 ${by + 30}
      L132 ${by + 30} C132 ${by + 50} 116 ${by + 50} 116 ${by + 30}
      L96 ${by + 30} C96 ${by + 64} 80 ${by + 64} 80 ${by + 30} Z`;
    return `<g class="pour">
      <g class="pour__pot" transform="rotate(-38 250 -80)">
        <rect x="206" y="-120" width="90" height="62" rx="10" fill="#2A2A2A" stroke="${INK}" stroke-width="${SW}"/>
        <rect x="206" y="-120" width="90" height="16" rx="6" fill="${C}" stroke="${INK}" stroke-width="4"/>
        <rect x="292" y="-108" width="70" height="14" rx="7" fill="#3A3A3A" stroke="${INK}" stroke-width="4"/>
        <path d="M220 -98 H280" stroke="#555" stroke-width="5" stroke-linecap="round"/>
      </g>
      <path class="pour__stream" d="${stream}" stroke="${INK}" stroke-width="22" fill="none" stroke-linecap="round"/>
      <path class="pour__stream" d="${stream}" stroke="${C}" stroke-width="13" fill="none" stroke-linecap="round"/>
      <path class="pour__shine" d="${stream}" stroke="#FFE08A" stroke-width="3" fill="none" stroke-linecap="round" stroke-dasharray="18 40"/>
      <path class="pour__cap" d="${cap}" fill="${C}" stroke="${INK}" stroke-width="${SW - 1}" stroke-linejoin="round"/>
      <path d="M104 ${by + 10} Q130 ${by + 2} 150 ${by + 2}" stroke="#FFE08A" stroke-width="4" fill="none" stroke-linecap="round"/>
    </g>`;
  }

  /* ---------------------------------------------------------
     HERO + ORDER BURGERS
     --------------------------------------------------------- */
  const HERO_STACK = ["bunTop", "salad", "cheese", "patty", "onion", "cheese", "patty", "bunBottom"];
  const heroEl = $("#heroBurger");
  if (heroEl) heroEl.innerHTML = burgerSVG(HERO_STACK, { animateAll: !reduceMotion, pour: true }).html;
  const orderEl = $("#orderBurger");
  if (orderEl) orderEl.innerHTML = burgerSVG(["bunTop", "salad", "tomato", "cheese", "patty", "bacon", "cheese", "patty", "bunBottom"]).html;

  // Parallax léger sur le burger du hero
  if (heroEl && !reduceMotion && window.matchMedia("(pointer:fine)").matches) {
    const hero = $(".hero");
    hero.addEventListener("pointermove", (e) => {
      const r = hero.getBoundingClientRect();
      const dx = (e.clientX - r.left) / r.width - 0.5;
      const dy = (e.clientY - r.top) / r.height - 0.5;
      heroEl.style.transform = `rotate(${dx * 6}deg) translate(${dx * 16}px, ${dy * 10}px)`;
    });
    hero.addEventListener("pointerleave", () => (heroEl.style.transform = ""));
  }

  /* ---------------------------------------------------------
     MENU
     --------------------------------------------------------- */
  const ICONS = {
    crousty: `<svg viewBox="0 0 120 100"><path d="M18 40h84l-8 50H26z" fill="#FFF4E0" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/><path d="M18 40h84" stroke="${INK}" stroke-width="5"/><path d="M26 44c4-18 20-26 34-20 8-12 30-8 32 8 6 2 8 8 6 12" fill="#E8913A" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/><path d="M40 34l4-4M60 28l4 2M78 32l2-4" stroke="#8E4220" stroke-width="4" stroke-linecap="round"/><rect x="40" y="58" width="40" height="10" rx="3" fill="#E63022" stroke="${INK}" stroke-width="3"/></svg>`,
    tacos: `<svg viewBox="0 0 120 100"><rect x="14" y="30" width="92" height="44" rx="14" fill="#F2C97D" stroke="${INK}" stroke-width="5"/><path d="M14 44h92" stroke="${INK}" stroke-width="4"/><path d="M30 38l6 4M52 36l6 4M74 38l6 4M90 36l4 4M30 58l6 4M52 56l6 4M74 58l6 4" stroke="#B9772E" stroke-width="4" stroke-linecap="round"/><path d="M106 40c8 4 8 24 0 28" fill="#FFC21A" stroke="${INK}" stroke-width="4"/></svg>`,
    fries: `<svg viewBox="0 0 120 100"><path d="M40 20l4 40M52 12l2 48M64 14l-1 46M76 18l-4 42M46 24l-6 36M70 10l0 50" stroke="${INK}" stroke-width="12" stroke-linecap="round"/><path d="M40 20l4 40M52 12l2 48M64 14l-1 46M76 18l-4 42M46 24l-6 36M70 10l0 50" stroke="#FFC21A" stroke-width="6" stroke-linecap="round"/><path d="M30 46h60l-8 46H38z" fill="#E63022" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/><text x="60" y="78" text-anchor="middle" font-family="Bowlby One" font-size="18" fill="#FFF4E0">7</text></svg>`,
    cup: `<svg viewBox="0 0 120 100"><path d="M68 4l-6 22" stroke="${INK}" stroke-width="5" stroke-linecap="round"/><path d="M34 26h52l-6 68H40z" fill="#FF6FB5" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/><rect x="30" y="20" width="60" height="12" rx="4" fill="#FFF4E0" stroke="${INK}" stroke-width="5"/><path d="M40 56h40" stroke="#FFF4E0" stroke-width="6" stroke-linecap="round"/></svg>`,
    cookie: `<svg viewBox="0 0 120 100"><circle cx="60" cy="52" r="38" fill="#D99A4E" stroke="${INK}" stroke-width="5"/><circle cx="46" cy="40" r="5" fill="#3E1F0D"/><circle cx="70" cy="36" r="4" fill="#3E1F0D"/><circle cx="76" cy="60" r="5" fill="#3E1F0D"/><circle cx="50" cy="66" r="4" fill="#3E1F0D"/><circle cx="60" cy="52" r="3" fill="#3E1F0D"/></svg>`,
    bowl: `<svg viewBox="0 0 120 100"><path d="M12 46h96c0 26-20 44-48 44S12 72 12 46z" fill="#2A2A2A" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/><path d="M18 46c6-14 20-18 30-12 8-10 26-10 32 0 10-6 24-2 28 12z" fill="#FFF6E5" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/><path d="M30 42c10-4 18 2 28-2s18 2 30-2" stroke="#F7941D" stroke-width="6" fill="none" stroke-linecap="round"/><circle cx="46" cy="36" r="5" fill="#8E4220"/><circle cx="70" cy="34" r="5" fill="#8E4220"/></svg>`,
    tiramisu: `<svg viewBox="0 0 120 100"><path d="M34 14h52v76H34z" fill="#FFF6E5" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/><rect x="34" y="14" width="52" height="16" fill="#6B3A1E" stroke="${INK}" stroke-width="5"/><path d="M34 50h52M34 70h52" stroke="#C99A6B" stroke-width="8"/><path d="M40 22l4 2M56 20l4 2M72 22l4 2" stroke="#3E1F0D" stroke-width="3" stroke-linecap="round"/></svg>`,
    chicken: `<svg viewBox="0 0 120 100"><path d="M30 60c-10-30 30-50 56-30 14 10 10 34-6 42-16 8-44 8-50-12z" fill="#E8913A" stroke="${INK}" stroke-width="5"/><path d="M44 46l6-4M64 40l6 2M74 56l4-4M50 64l6 0" stroke="#8E4220" stroke-width="4" stroke-linecap="round"/></svg>`
  };

  function itemVisual(catId, item) {
    const n = item.name.toLowerCase();
    if (catId === "smash" || n.includes("smash kid")) {
      if (n.includes("tenders")) return burgerSVG(["bunTop", "sauce", "salad", "cheese", ["patty", 4], "bunBottom"]).html.replace(/#6B2D14/g, "#D9822B").replace(/#8E4220/g, "#F0A857").replace(/#A8552A/g, "#B96A1E");
      const patties = n.includes("triple") ? 3 : n.includes("double") || n.includes("bacon") || n.includes("raclette") ? 2 : 1;
      if (n.includes("cheese") || n.includes("kid")) return burgerSVG(["bunTop", ["sauce", "#E63022"], "pickles", "cheese", "patty", "bunBottom"]).html;
      const cheese = n.includes("raclette") ? "raclette" : "cheese";
      const stack = ["bunTop", "sauce"];
      if (!n.includes("raclette") && !n.includes("bacon")) stack.push("pickles");
      for (let i = 0; i < patties; i++) {
        stack.push(cheese, "patty");
        if (i === 0 && n.includes("bacon")) stack.splice(stack.length - 1, 0, "bacon");
      }
      if (n.includes("raclette") || n.includes("bacon")) stack.push("onion");
      stack.push("bunBottom");
      return burgerSVG(stack).html;
    }
    if (catId === "tacos") return ICONS.tacos;
    if (n.includes("rice")) return ICONS.bowl;
    if (n.includes("tiramisu")) return ICONS.tiramisu;
    if (n.includes("frites") || n.includes("fries")) return ICONS.fries;
    if (/tenders|nuggets|camembert|mozza|chili/.test(n)) return ICONS.chicken;
    return ICONS.cup;
  }

  const tabsEl = $("#menuTabs");
  const gridEl = $("#menuGrid");
  const CARD_COLORS = ["cheddar", "orange", "lime", "cream"];

  function renderMenu(catId) {
    const cat = D.menu.find((c) => c.id === catId) || D.menu[0];
    $$("button", tabsEl).forEach((b) => {
      const on = b.dataset.cat === cat.id;
      b.setAttribute("aria-selected", on);
      b.tabIndex = on ? 0 : -1;
    });
    gridEl.setAttribute("aria-labelledby", "tab-" + cat.id);
    if (cat.compact) {
      gridEl.innerHTML = `<div class="drinklist">
        <div class="drinklist__head"><h3>${cat.emoji} ${cat.label}</h3><span class="price">${euro(cat.price)}</span></div>
        <ul>${cat.items.map((it) => `<li>${it.name}${it.tag ? `<small>${it.tag}</small>` : ""}</li>`).join("")}</ul>
      </div>`;
      return;
    }
    gridEl.innerHTML = cat.items.map((it, i) => `
      <article class="card card--${CARD_COLORS[i % CARD_COLORS.length]}" style="--d:${i * 60}ms">
        ${it.tag ? `<span class="card__tag">${it.tag}</span>` : ""}
        ${it.photo
          ? `<div class="card__visual card__visual--photo"><img src="${it.photo}" alt="${it.name}" loading="lazy"></div>`
          : `<div class="card__visual">${itemVisual(cat.id, it)}</div>`}
        <div class="card__body">
          <h3>${it.name}</h3>
          <p>${it.desc}</p>
        </div>
        <div class="card__foot">
          <span class="price">${euro(it.price)}</span>
          ${it.menu ? `<span class="price-menu">Menu <b>${euro(it.menu)}</b>${it.menuNote ? `<small>${it.menuNote}</small>` : ""}</span>` : ""}
        </div>
      </article>`).join("");
  }

  if (tabsEl && gridEl) {
    tabsEl.innerHTML = D.menu.map((c) => `<button role="tab" id="tab-${c.id}" data-cat="${c.id}" aria-controls="menuGrid"><span aria-hidden="true">${c.emoji}</span> ${c.label}</button>`).join("");
    tabsEl.addEventListener("click", (e) => {
      const b = e.target.closest("button[data-cat]");
      if (b) renderMenu(b.dataset.cat);
    });
    tabsEl.addEventListener("keydown", (e) => {
      if (!["ArrowRight", "ArrowLeft"].includes(e.key)) return;
      const btns = $$("button", tabsEl);
      const i = btns.indexOf(document.activeElement);
      const next = btns[(i + (e.key === "ArrowRight" ? 1 : -1) + btns.length) % btns.length];
      next.focus();
      renderMenu(next.dataset.cat);
    });
    renderMenu(D.menu[0].id);
  }

  /* ---------------------------------------------------------
     BUILDER
     --------------------------------------------------------- */
  const form = $("#buildForm");
  if (form) {
    const B = D.builder;
    const state = { patties: 2 };
    let prevKeys = new Set();
    const out = $("#pattyCount");

    function build() {
      const fd = new FormData(form);
      const cheese = fd.get("cheese");
      const sauce = fd.get("sauce");
      const tops = fd.getAll("top");

      const stack = ["bunTop", ["sauce", SAUCE_COLORS[sauce]]];
      if (tops.includes("salad")) stack.push("salad");
      if (tops.includes("tomato")) stack.push("tomato");
      if (tops.includes("pickles")) stack.push("pickles");
      for (let i = 0; i < state.patties; i++) {
        if (cheese !== "none") stack.push(cheese === "raclette" ? "raclette" : "cheese");
        if (i === 0 && tops.includes("bacon")) stack.push("bacon");
        stack.push("patty");
        if (i === 0 && tops.includes("onion")) stack.push("onion");
      }
      stack.push("bunBottom");

      const first = prevKeys.size === 0;
      const r = burgerSVG(stack, { fixedHeight: 440 });
      const fresh = new Set(r.keys.filter((k) => !prevKeys.has(k)));
      const r2 = burgerSVG(stack, { fixedHeight: 440, animateKeys: first || reduceMotion ? new Set() : fresh });
      $("#buildBurger").innerHTML = r2.html;
      prevKeys = new Set(r.keys);

      // fromage facturé par tranche (une par steak)
      const price = B.base + state.patties * (B.patty + (B.cheese[cheese] || 0))
        + tops.reduce((s, t) => s + (B.toppings[t] || 0), 0);
      $("#buildPrice").textContent = euro(price);
      out.textContent = state.patties;

      const names = { 1: "Single", 2: "Double", 3: "Triple", 4: "Quadruple" };
      const bits = [B.labels[cheese], ...tops.map((t) => B.labels[t]), B.labels[sauce]].filter(Boolean);
      $("#buildSummary").innerHTML = `<b>${names[state.patties]} Smash</b> · ${bits.join(", ")}`;
      $$("[data-step]", form).forEach((b) => {
        const s = +b.dataset.step;
        b.disabled = (s < 0 && state.patties <= 1) || (s > 0 && state.patties >= B.maxPatties);
      });
    }

    form.addEventListener("change", build);
    $$("[data-step]", form).forEach((b) =>
      b.addEventListener("click", () => {
        state.patties = Math.min(B.maxPatties, Math.max(1, state.patties + +b.dataset.step));
        build();
      })
    );
    build();
  }

  /* ---------------------------------------------------------
     HORAIRES + STATUT OUVERT/FERMÉ (heure de Paris)
     --------------------------------------------------------- */
  const DAYS = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
  function parisNow() {
    const parts = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Paris", weekday: "short", hour: "2-digit", minute: "2-digit", hour12: false }).formatToParts(new Date());
    const get = (t) => parts.find((p) => p.type === t).value;
    const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(get("weekday"));
    return { day, min: (+get("hour") % 24) * 60 + +get("minute") };
  }
  const toMin = (s) => { const [h, m] = s.split(":").map(Number); return h * 60 + m; };

  function isOpen(now) {
    // créneau du jour, ou créneau de la veille qui déborde après minuit
    const today = D.hours[now.day] || [];
    const yest = D.hours[(now.day + 6) % 7] || [];
    for (const [o, c] of today) {
      const oM = toMin(o), cM = toMin(c);
      if (cM > oM ? now.min >= oM && now.min < cM : now.min >= oM) return { open: true, until: c };
    }
    for (const [o, c] of yest) {
      const oM = toMin(o), cM = toMin(c);
      if (cM <= oM && now.min < cM) return { open: true, until: c };
    }
    const next = today.map(([o]) => o).find((o) => toMin(o) > now.min);
    return { open: false, next };
  }

  const now = parisNow();
  const status = isOpen(now);
  const pill = $("#openPill");
  if (pill) {
    pill.classList.toggle("is-open", status.open);
    $("b", pill).textContent = status.open ? `Ouvert · jusqu'à ${status.until.replace(":", "h")}` : status.next ? `Fermé · ouvre à ${status.next.replace(":", "h")}` : "Fermé";
  }

  const hb = $("#hoursBody");
  if (hb) {
    const order = [1, 2, 3, 4, 5, 6, 0];
    hb.innerHTML = order.map((d) => {
      const slots = D.hours[d] || [];
      const txt = slots.length ? slots.map(([o, c]) => `${o.replace(":", "h")} – ${c.replace(":", "h")}`).join(" · ") : "Fermé";
      return `<tr class="${d === now.day ? "is-today" : ""}"><th scope="row">${DAYS[d]}</th><td>${txt}</td></tr>`;
    }).join("");
  }

  /* ---------------------------------------------------------
     NAV, REVEAL, DIVERS
     --------------------------------------------------------- */
  const toggle = $("#navToggle");
  const links = $("#navLinks");
  if (toggle && links) {
    const setOpen = (open) => {
      toggle.setAttribute("aria-expanded", open);
      document.body.classList.toggle("nav-open", open);
    };
    toggle.addEventListener("click", () => setOpen(toggle.getAttribute("aria-expanded") !== "true"));
    links.addEventListener("click", (e) => { if (e.target.closest("a")) setOpen(false); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") setOpen(false); });
  }

  const nav = $(".nav");
  const onScroll = () => {
    if (nav) nav.classList.toggle("is-scrolled", window.scrollY > 40);
    document.body.classList.toggle("past-hero", window.scrollY > window.innerHeight * 0.8);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if ("IntersectionObserver" in window && !reduceMotion) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.2 });
    $$(".reveal").forEach((el, i) => { el.style.setProperty("--rd", (i % 6) * 70 + "ms"); io.observe(el); });
  } else {
    $$(".reveal").forEach((el) => el.classList.add("is-in"));
  }

  const y = $("#year");
  if (y) y.textContent = new Date().getFullYear();
})();
