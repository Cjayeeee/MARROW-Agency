/* =========================================================
   MARROW — interaction & motion
   Motion system:
     cinematic  1.1–1.4s  expo.inOut / expo.out   (preloader, thesis, pins)
     reveal     0.9–1.1s  expo.out                (headlines, media)
     ui         0.6s      expo.out                (menu, sheet, accordions)
     micro      0.35s     CSS                     (hover, focus)
   ========================================================= */
(() => {
  'use strict';

  const CONTACT_EMAIL = 'studio@marrow.example'; // ← replace with the real inbox

  const root = document.documentElement;
  const body = document.body;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const isDesktop = () => innerWidth >= 900;
  const hasGsap = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';
  if (reduced) root.classList.add('reduced');

  // If the animation libraries failed to load, drop the preloader and leave a fully static, usable page.
  if (!hasGsap) {
    $('.preloader')?.remove();
    body.classList.remove('is-loading');
    return;
  }

  const { gsap, ScrollTrigger } = window;
  gsap.registerPlugin(ScrollTrigger);
  gsap.defaults({ ease: 'expo.out', duration: 1 });

  const COLORS = { ink: '#0F0E0C', bone: '#ECE5D8', signal: '#FF4D1F', teal: '#0E3A3B' };

  /* ---------------- project data (case sheets) ---------------- */
  const PROJECTS = {
    tidewater: {
      name: 'Tidewater Ferries', tags: 'Identity · Wayfinding · Booking app', year: '2026', where: 'Lisboa / Funchal', role: 'Strategy, identity, product, signage',
      line: 'Making a 90-year-old ferry line feel like the best part of the trip.',
      cover: 'assets/work/tidewater-cover.svg',
      body: [
        'Tidewater had loyal locals, a fleet of beautiful old boats and almost no presence where tourists actually plan their trips. Four ticketing systems competed with each other, and the logo changed from pier to pier.',
        'We anchored everything to the tide: a T that rises out of the water, a palette taken from the Atlantic at dusk, and a timetable-first app that treats departure times as the hero, not the hamburger menu.',
        'Signage was tested from the deck of moving boats at 12 knots. If you can read it there, you can read it anywhere.'
      ],
      gallery: [['assets/work/tidewater-app.svg', true], ['assets/work/tidewater-signage.svg'], ['assets/work/tidewater-cover.svg']]
    },
    oya: {
      name: 'Oyà Natural Wine', tags: 'Naming · Packaging', year: '2025', where: 'Douro Valley', role: 'Naming, verbal identity, labels',
      line: 'A name you can say with a full glass, and a label cut by hand.',
      cover: 'assets/work/oya-cover.svg',
      body: [
        'A young winemaker, a 3-hectare plot of old vines and no budget for marketing. The brief was one sentence: make it look like it tastes.',
        'We named the wine after the word harvesters shout across the terraces, then built a label system where each cuvée gets its own hand-cut terracotta shape. No two vintages look alike.',
        'The first 4,000 bottles sold out to restaurants in Lisbon and Copenhagen before release.'
      ],
      gallery: [['assets/work/oya-cover.svg'], ['assets/work/kiln-cover.svg']]
    },
    fieldnote: {
      name: 'Fieldnote', tags: 'Product design · Website', year: '2025', where: 'Évora', role: 'Product UI, design system, marketing site',
      line: 'Farm data that reads like a well-kept notebook, not a cockpit.',
      cover: 'assets/work/fieldnote-cover.svg',
      body: [
        'Fieldnote turns soil sensors and weather feeds into decisions for small farms. Their first product looked like an aircraft dashboard. Farmers stopped opening it.',
        'We redesigned it around the shape of a season: rows, rain and yield, in a palette taken from late-summer wheat. The marketing site borrows the same grid, so the promise and the product look like one thing.',
        'Weekly active use tripled within two seasons.'
      ],
      gallery: [['assets/work/fieldnote-cover.svg', true], ['assets/work/atlas-cover.svg', true]]
    },
    kiln: {
      name: 'Kiln Studio Pottery', tags: 'Identity · E-commerce', year: '2024', where: 'Porto', role: 'Identity, art direction, Shopify build',
      line: 'Heat, patience and a shop that finally keeps up with the waiting list.',
      cover: 'assets/work/kiln-cover.svg',
      body: [
        'A two-person pottery studio with a two-year waiting list and a website that crashed on every drop.',
        'The identity uses the colour sequence of a firing kiln as its whole palette. The new shop runs on timed releases, so every batch launches like an event instead of a server error.'
      ],
      gallery: [['assets/work/kiln-cover.svg'], ['assets/work/bruma-cover.svg']]
    },
    northbound: {
      name: 'Northbound Film Festival', tags: 'Campaign · Motion', year: '2026', where: 'Oslo', role: 'Campaign concept, poster system, title sequence',
      line: 'One letter, pointed true north, on every wall in the city.',
      cover: 'assets/work/northbound-cover.svg',
      body: [
        'A festival of films from the far north needed a campaign that could hold its own against cinema blockbusters on the same bus shelters.',
        'We reduced it to one monumental N and a strip of fading horizon lines, then animated it frame by frame for the opening title sequence. Ticket sales were up 41% on the previous edition.'
      ],
      gallery: [['assets/work/northbound-cover.svg'], ['assets/work/salt-cover.svg']]
    },
    salt: {
      name: 'Salt Republic', tags: 'Restaurant identity', year: '2024', where: 'Alfama, Lisboa', role: 'Identity, menus, tiles, signage',
      line: 'A seafood counter that borrows its pattern from the walls of the street outside.',
      cover: 'assets/work/salt-cover.svg',
      body: [
        'A marisqueira in a 19th-century tiled building in Alfama. The owners wanted to look like they had always been there, without looking old.',
        'We drew a custom tile pattern from the façade, put a single fish at its centre, and printed it on everything from the menus to the ice trays.'
      ],
      gallery: [['assets/work/salt-cover.svg'], ['assets/work/oya-cover.svg']]
    },
    atlas: {
      name: 'Atlas Charging', tags: 'Brand strategy · App', year: '2023', where: 'Madrid', role: 'Positioning, identity, app UI',
      line: 'Charging stations that act like a network, not a scavenger hunt.',
      cover: 'assets/work/atlas-cover.svg',
      body: [
        'Atlas runs 900 fast chargers across Iberia. Drivers knew the plugs but not the name.',
        'We positioned Atlas around certainty, with live route lines in the app and on site, and an electric blue that is impossible to miss from a motorway exit.'
      ],
      gallery: [['assets/work/atlas-cover.svg', true], ['assets/work/fieldnote-cover.svg', true]]
    },
    bruma: {
      name: 'Bruma Skincare', tags: 'Packaging · Shopify', year: '2023', where: 'Barcelona', role: 'Packaging, e-commerce, launch content',
      line: 'Skincare named after the morning mist, and packaged to match.',
      cover: 'assets/work/bruma-cover.svg',
      body: [
        'Bruma makes three products and refuses to make a fourth. We built a soft, quiet identity and a Shopify store with one page per product and no pop-ups.',
        'Conversion rate on launch: 4.6%.'
      ],
      gallery: [['assets/work/bruma-cover.svg'], ['assets/work/kiln-cover.svg']]
    }
  };
  const ORDER = Object.keys(PROJECTS);

  /* ---------------- smooth scroll (Lenis) ---------------- */
  let lenis = null;
  if (!reduced && typeof window.Lenis !== 'undefined') {
    lenis = new window.Lenis({ lerp: 0.095, smoothWheel: true, wheelMultiplier: 1 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }
  const lockScroll = () => { lenis ? lenis.stop() : null; body.classList.add('is-locked'); };
  const unlockScroll = () => { lenis ? lenis.start() : null; body.classList.remove('is-locked'); };
  const scrollToTarget = (target, opts = {}) => {
    if (lenis) lenis.scrollTo(target, { duration: 1.6, easing: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)), ...opts });
    else {
      const el = typeof target === 'number' ? null : target;
      if (el) el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
      else scrollTo({ top: target, behavior: reduced ? 'auto' : 'smooth' });
    }
  };

  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  const initialHash = location.hash;
  scrollTo(0, 0);

  /* ---------------- text splitting ---------------- */
  function splitWords(el, mode) {
    const out = [];
    const walk = (node) => {
      [...node.childNodes].forEach((child) => {
        if (child.nodeType === 3) {
          const parts = child.textContent.split(/(\s+)/);
          const frag = document.createDocumentFragment();
          parts.forEach((p) => {
            if (!p) return;
            if (/^\s+$/.test(p)) { frag.appendChild(document.createTextNode(' ')); return; }
            if (mode === 'mask') {
              const m = document.createElement('span'); m.className = 'wm';
              const i = document.createElement('span'); i.className = 'wi'; i.textContent = p;
              m.appendChild(i); frag.appendChild(m); out.push(i);
            } else {
              const s = document.createElement('span'); s.className = 'sw'; s.textContent = p;
              frag.appendChild(s); out.push(s);
            }
          });
          child.replaceWith(frag);
        } else if (child.nodeType === 1) walk(child);
      });
    };
    walk(el);
    return out;
  }
  const lineIndexOf = (inners) => {
    let last = null, line = -1;
    return inners.map((w) => {
      const top = Math.round(w.parentElement.offsetTop);
      if (last === null || Math.abs(top - last) > 4) { line++; last = top; }
      return line;
    });
  };

  /* ---------------- the spine (hero + preloader) ---------------- */
  class Spine {
    constructor(canvas, opts = {}) {
      this.canvas = canvas; this.ctx = canvas.getContext('2d');
      this.n = 13; this.accent = 4;
      this.cx = 0; this.cy = 0; this.size = 400; this.alpha = 1;
      this.reveal = 0; this.sway = opts.sway ?? 1; this.spread = 0; this.interactive = !!opts.interactive;
      this.ox = new Float32Array(this.n); this.vx = new Float32Array(this.n);
      this.sc = new Float32Array(this.n); this.bulge = new Float32Array(this.n);
      this.px = null; this.py = null; this.time = 0; this.running = false; this.visible = true;
      this.resize();
    }
    resize() {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      const w = this.canvas.clientWidth, h = this.canvas.clientHeight;
      this.w = w; this.h = h; this.dpr = dpr;
      this.canvas.width = Math.round(w * dpr); this.canvas.height = Math.round(h * dpr);
    }
    pill(ctx, w, h) {
      const r = h / 2;
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(-w / 2, -h / 2, w, h, r);
      else {
        ctx.moveTo(-w / 2 + r, -h / 2); ctx.lineTo(w / 2 - r, -h / 2); ctx.arc(w / 2 - r, 0, r, -Math.PI / 2, Math.PI / 2);
        ctx.lineTo(-w / 2 + r, h / 2); ctx.arc(-w / 2 + r, 0, r, Math.PI / 2, -Math.PI / 2);
      }
      ctx.fill();
    }
    step(dt) {
      this.time += dt;
      const { n } = this;
      const u = this.size / n;
      // chain physics: the head follows the pointer, each vertebra follows the one above
      let head = 0;
      if (this.interactive && this.px !== null) head = Math.max(-70, Math.min(70, (this.px - this.cx) * 0.09));
      for (let i = 0; i < n; i++) {
        const target = i === 0 ? head : this.ox[i - 1];
        // first-order lag (no overshoot) so the curve travels down the chain like a wave
        const rate = i === 0 ? 3.2 : 9;
        this.ox[i] += (target - this.ox[i]) * Math.min(1, dt * rate);
        const tScale = i < this.reveal ? 1 : 0;
        this.sc[i] += (tScale - this.sc[i]) * Math.min(1, dt * 9);
        let b = 0;
        if (this.interactive && this.py !== null) {
          const y = this.cy - this.size / 2 + u * (i + 0.5);
          b = Math.exp(-Math.pow((this.py - y) / (u * 1.6), 2)) * 0.22;
        }
        this.bulge[i] += (b - this.bulge[i]) * Math.min(1, dt * 8);
      }
    }
    draw() {
      const { ctx, n, dpr } = this;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, this.w, this.h);
      if (!this.visible) return;
      const u = this.size / n;
      const ph = u * 0.6;
      for (let i = 0; i < n; i++) {
        const s = this.sc[i];
        if (s < 0.01) continue;
        const idle = Math.sin(this.time * 0.9 + i * 0.42) * 7 * this.sway;
        const x = this.cx + this.ox[i] + idle;
        const y = this.cy - this.size / 2 + u * (i + 0.5) + this.spread * u * (i - (n - 1) / 2);
        const prev = i ? this.ox[i - 1] : this.ox[0];
        const ang = Math.max(-0.22, Math.min(0.22, (this.ox[i] - prev) * 0.0045)) + Math.cos(this.time * 0.9 + i * 0.42) * 0.02 * this.sway;
        const pw = u * (1.35 + 1.55 * Math.sin(Math.PI * (i + 0.5) / n)) * (1 + this.bulge[i]);
        ctx.save();
        ctx.translate(x, y); ctx.rotate(ang); ctx.scale(s, s);
        ctx.globalAlpha = i === this.accent ? Math.max(this.alpha, 0.9) : this.alpha;
        ctx.fillStyle = i === this.accent ? COLORS.signal : COLORS.bone;
        this.pill(ctx, pw, ph);
        ctx.restore();
      }
    }
    start() {
      if (this.running) return;
      this.running = true;
      let last = performance.now();
      const loop = (now) => {
        if (!this.running) return;
        const dt = Math.min(0.05, (now - last) / 1000); last = now;
        this.step(dt); this.draw();
        this.raf = requestAnimationFrame(loop);
      };
      this.raf = requestAnimationFrame(loop);
    }
    stop() { this.running = false; cancelAnimationFrame(this.raf); }
  }

  const heroLayout = () => {
    const w = innerWidth, h = innerHeight;
    if (w < 900) return { cx: w * 0.8, cy: h * 0.33, size: Math.min(h * 0.44, 400), alpha: 0.3 };
    return { cx: w * 0.77, cy: h * 0.46, size: Math.min(h * 0.68, 700), alpha: 1 };
  };

  const heroCanvas = $('.hero__spine');
  const heroSpine = new Spine(heroCanvas, { interactive: finePointer && !reduced, sway: 0 });
  Object.assign(heroSpine, heroLayout());

  /* ---------------- hero intro (stage 3 of the opening) ---------------- */
  const heroWords = $$('.hero__word');
  const heroWith = $('.hero__with em');
  const heroFade = [$('.hero__eyebrow'), $('.hero__lede'), ...$$('.hero__meta > *')];
  const heroLine = $('.hero__meta');
  const header = $('.site-header');

  function setHeroHidden() {
    gsap.set(heroWords, { yPercent: 112 });
    gsap.set(heroWith, { yPercent: 120 });
    gsap.set(heroFade, { autoAlpha: 0, y: 18 });
    gsap.set(header, { autoAlpha: 0, y: -16 });
  }
  function heroIntro() {
    const tl = gsap.timeline();
    tl.to(heroWords, { yPercent: 0, duration: 1.35, stagger: 0.12, ease: 'expo.out' }, 0)
      .to(heroWith, { yPercent: 0, duration: 1.1, ease: 'expo.out' }, 0.25)
      .to(header, { autoAlpha: 1, y: 0, duration: 1 }, 0.2)
      .to(heroFade, { autoAlpha: 1, y: 0, duration: 1, stagger: 0.07 }, 0.45)
      .add(() => gsap.to(heroSpine, { sway: 1, duration: 2, ease: 'power2.out' }), 0.3);
    return tl;
  }

  /* ---------------- preloader (stages 1–2) ---------------- */
  const pre = $('.preloader');
  const preCanvas = $('.preloader__spine');
  const preNum = $('.preloader__num');
  const preWord = $$('.preloader__word span');
  const preFade = [$('.preloader__note'), $('.preloader__count')];
  let repeatVisit = false;
  try { repeatVisit = sessionStorage.getItem('marrow:intro') === '1'; sessionStorage.setItem('marrow:intro', '1'); } catch (e) { /* storage blocked */ }

  function finishIntro() {
    pre?.remove();
    body.classList.remove('is-loading');
    unlockScroll();
    heroSpine.visible = true;
    ScrollTrigger.refresh();
    if (initialHash && initialHash.length > 1) {
      const t = document.querySelector(initialHash);
      if (t) scrollToTarget(t, { immediate: true });
    }
  }

  function runPreloader() {
    lockScroll();
    if (reduced) {
      // short, simple: count is skipped, the curtain fades
      heroSpine.reveal = heroSpine.n; heroSpine.sc.fill(1); heroSpine.draw();
      Promise.race([document.fonts?.ready || Promise.resolve(), new Promise((r) => setTimeout(r, 1500))]).then(() => {
        gsap.to(pre, { autoAlpha: 0, duration: 0.4, ease: 'none', onComplete: finishIntro });
      });
      return;
    }

    setHeroHidden();
    heroSpine.visible = false;
    heroSpine.start();

    const preSpine = new Spine(preCanvas, { sway: 0.6 });
    const target = heroLayout();
    Object.assign(preSpine, { cx: innerWidth / 2, cy: innerHeight * 0.44, size: target.size, alpha: 1 });
    preSpine.start();

    gsap.fromTo(preWord, { y: 0, yPercent: 105 }, { yPercent: 0, duration: 1.1, stagger: 0.05, ease: 'expo.out', delay: 0.1 });

    // real progress: fonts + window load (images below the fold are lazy and don't block)
    let done = 0; const total = 2; let targetP = 0.12;
    const tick = () => { done++; targetP = Math.max(targetP, done / total); };
    (document.fonts?.ready || Promise.resolve()).then(tick);
    if (document.readyState === 'complete') tick(); else addEventListener('load', tick, { once: true });
    const failsafe = setTimeout(() => { targetP = 1; }, 4500);

    // the counter chases real progress; repeat visits run ~3x faster
    const speed = repeatVisit ? 2.8 : 1.05;
    let p = 0; let last = performance.now(); let exiting = false;
    const run = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      p = Math.min(targetP, p + dt * speed);
      preNum.textContent = String(Math.round(p * 100)).padStart(3, '0');
      preSpine.reveal = p * preSpine.n + 0.2;
      if (p >= 1 && !exiting) { exiting = true; clearTimeout(failsafe); exit(preSpine); return; }
      requestAnimationFrame(run);
    };
    requestAnimationFrame(run);
  }

  function exit(preSpine) {
    const t = heroLayout();
    const tl = gsap.timeline({ defaults: { ease: 'expo.inOut' } });
    tl.to(preWord, { yPercent: -105, duration: 0.7, stagger: 0.035, ease: 'expo.in' }, 0)
      .to(preFade, { autoAlpha: 0, duration: 0.4, ease: 'power2.in' }, 0)
      .to(preSpine, { cx: t.cx, cy: t.cy, alpha: t.alpha, sway: 0, duration: 1.15 }, 0.1)
      .to('.preloader__panel--top', { yPercent: -100, duration: 1.15 }, 0.55)
      .to('.preloader__panel--bottom', { yPercent: 100, duration: 1.15 }, 0.55)
      .add(() => { pre.style.pointerEvents = 'none'; }, 0.6)
      .add(heroIntro(), 0.85)
      .add(() => {
        // hand the spine over to the hero canvas — identical geometry, so the swap is invisible
        heroSpine.reveal = heroSpine.n; heroSpine.sc.fill(1); heroSpine.visible = true;
        preSpine.stop(); preCanvas.style.visibility = 'hidden';
      }, 1.26)
      .add(finishIntro, 1.75);
  }

  /* ---------------- hero: pointer + scroll ---------------- */
  const hero = $('.hero');
  if (heroSpine.interactive) {
    hero.addEventListener('pointermove', (e) => { heroSpine.px = e.clientX; heroSpine.py = e.clientY + (scrollY > 0 ? 0 : 0); });
    hero.addEventListener('pointerleave', () => { heroSpine.px = null; heroSpine.py = null; });
  }
  new IntersectionObserver(([en]) => {
    if (en.isIntersecting) { if (!reduced) heroSpine.start(); } else heroSpine.stop();
  }).observe(hero);

  addEventListener('resize', debounce(() => {
    heroSpine.resize(); Object.assign(heroSpine, heroLayout());
    if (reduced) heroSpine.draw();
  }, 150));

  if (!reduced) {
    gsap.timeline({ scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } })
      .to(heroSpine, { spread: 1.2, ease: 'none' }, 0)
      .to('.hero__title', { yPercent: -18, ease: 'none' }, 0)
      .to('.hero__lede, .hero__eyebrow', { yPercent: -60, autoAlpha: 0, ease: 'none' }, 0)
      .to(heroCanvas, { autoAlpha: 0.15, ease: 'none' }, 0);
  }

  /* ---------------- generic reveals ---------------- */
  if (!reduced) {
    $$('[data-reveal="lines"]').forEach((el) => {
      const inners = splitWords(el, 'mask');
      const lines = lineIndexOf(inners);
      gsap.fromTo(inners, { yPercent: 115 }, {
        yPercent: 0, duration: 1.15, ease: 'expo.out',
        delay: (i) => lines[i] * 0.1 + i * 0.012,
        scrollTrigger: { trigger: el, start: 'top 86%', once: true }
      });
    });
    $$('[data-reveal="fade"]').forEach((el) => {
      gsap.from(el, { y: 28, autoAlpha: 0, duration: 1.1, scrollTrigger: { trigger: el, start: 'top 90%', once: true } });
    });
    $$('[data-reveal="clip"]').forEach((el) => {
      const img = $('img', el);
      const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 85%', once: true } });
      tl.fromTo(el, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.4, ease: 'expo.inOut' })
        .fromTo(img, { scale: 1.35 }, { scale: 1, duration: 1.8, ease: 'expo.out' }, 0.15);
    });

    // statement: words light up as you read
    const st = $('[data-scrub="words"]');
    if (st) {
      const words = splitWords(st, 'scrub');
      gsap.to(words, { opacity: 1, stagger: 0.1, ease: 'none', scrollTrigger: { trigger: st, start: 'top 78%', end: 'bottom 48%', scrub: 0.6 } });
    }

    // counters
    $$('[data-count]').forEach((el) => {
      const end = parseFloat(el.dataset.count); const dec = parseInt(el.dataset.decimals || '0', 10);
      const o = { v: 0 }; el.textContent = (0).toFixed(dec);
      gsap.to(o, {
        v: end, duration: 1.8, ease: 'power3.out', onUpdate: () => { el.textContent = o.v.toFixed(dec); },
        scrollTrigger: { trigger: el, start: 'top 88%', once: true }
      });
    });
  } else {
    const st = $('[data-scrub="words"]'); if (st) splitWords(st, 'scrub');
  }

  /* ---------------- thesis: the page turns ---------------- */
  let thesisLight = false;
  if (!reduced) {
    const tb = $('.thesis__b em');
    if (tb) tb.innerHTML = tb.textContent.replace('straight.', '<span class="accent">straight.</span>');
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '.thesis', start: 'top top', end: '+=150%', pin: true, scrub: 0.8, anticipatePin: 1,
        onUpdate: (s) => { thesisLight = s.progress > 0.52; }
      }
    });
    gsap.from('.thesis__a > *', { yPercent: 40, autoAlpha: 0, stagger: 0.12, duration: 1.3, ease: 'expo.out', scrollTrigger: { trigger: '.thesis', start: 'top 65%', once: true } });
    tl.to('.thesis__a', { scale: 0.82, autoAlpha: 0.15, duration: 0.6, ease: 'power1.in' }, 0.3)
      .fromTo('.thesis__circle', { clipPath: 'circle(0% at 50% 55%)' }, { clipPath: 'circle(75% at 50% 55%)', duration: 0.65, ease: 'power2.in' }, 0.3)
      .from('.thesis__b > *', { yPercent: 60, autoAlpha: 0, stagger: 0.1, duration: 0.35, ease: 'power3.out' }, 0.62)
      .to({}, { duration: 0.15 });
  }

  /* ---------------- selected work: horizontal pin ---------------- */
  const track = $('.work__track');
  const cards = $$('.work-card');
  const countEl = $('.js-work-count');
  const bar = $('.work__bar i');
  const mm = gsap.matchMedia();
  mm.add('(min-width: 900px) and (prefers-reduced-motion: no-preference)', () => {
    const dist = () => Math.max(0, track.scrollWidth - innerWidth);
    const tween = gsap.to(track, {
      x: () => -dist(), ease: 'none',
      scrollTrigger: {
        trigger: '.work', start: 'top top', end: () => '+=' + dist(), pin: true, scrub: 0.9, invalidateOnRefresh: true, anticipatePin: 1,
        onUpdate: (s) => {
          gsap.set(bar, { scaleX: s.progress });
          countEl.textContent = String(Math.min(cards.length, Math.round(s.progress * (cards.length - 1)) + 1)).padStart(2, '0');
        }
      }
    });
    cards.forEach((card) => {
      const img = $('img', card);
      gsap.fromTo(img, { '--px': '-7%' }, { '--px': '7%', ease: 'none', scrollTrigger: { trigger: card, containerAnimation: tween, start: 'left right', end: 'right left', scrub: true } });
      gsap.from(card, { yPercent: 12, rotate: 1.5, ease: 'none', scrollTrigger: { trigger: card, containerAnimation: tween, start: 'left 105%', end: 'left 55%', scrub: true } });
    });
    return () => gsap.set([track, ...cards], { clearProps: 'all' });
  });
  mm.add('(max-width: 899px) and (prefers-reduced-motion: no-preference)', () => {
    cards.forEach((card) => {
      const media = $('.work-card__media', card);
      gsap.fromTo(media, { clipPath: 'inset(18% 8% 18% 8%)' }, { clipPath: 'inset(0% 0% 0% 0%)', ease: 'none', scrollTrigger: { trigger: card, start: 'top 95%', end: 'top 40%', scrub: true } });
    });
  });

  /* ---------------- capabilities accordion ---------------- */
  const capBtns = $$('.cap__btn');
  const setCap = (btn, open, animate = true) => {
    const panel = document.getElementById(btn.getAttribute('aria-controls'));
    btn.setAttribute('aria-expanded', String(open));
    if (open) {
      panel.hidden = false;
      if (animate && !reduced) gsap.fromTo(panel, { height: 0 }, { height: 'auto', duration: 0.8, ease: 'expo.out', onComplete: () => ScrollTrigger.refresh() });
      else ScrollTrigger.refresh();
    } else if (animate && !reduced) {
      gsap.to(panel, { height: 0, duration: 0.6, ease: 'expo.out', onComplete: () => { panel.hidden = true; gsap.set(panel, { clearProps: 'height' }); ScrollTrigger.refresh(); } });
    } else panel.hidden = true;
  };
  capBtns.forEach((btn, i) => {
    setCap(btn, i === 0, false);
    btn.addEventListener('click', () => {
      const open = btn.getAttribute('aria-expanded') !== 'true';
      capBtns.forEach((b) => { if (b !== btn && b.getAttribute('aria-expanded') === 'true') setCap(b, false); });
      setCap(btn, open);
    });
  });

  /* ---------------- cursor-follow previews (caps + archive) ---------------- */
  function follower(previewEl, items, srcOf) {
    if (!finePointer || reduced || !previewEl) return;
    const img = $('img', previewEl);
    const xTo = gsap.quickTo(previewEl, 'x', { duration: 0.6, ease: 'power3' });
    const yTo = gsap.quickTo(previewEl, 'y', { duration: 0.6, ease: 'power3' });
    const rTo = gsap.quickTo(previewEl, 'rotation', { duration: 0.8, ease: 'power3' });
    let lastX = 0; let active = false;
    gsap.set(previewEl, { xPercent: -50, yPercent: -50, x: innerWidth / 2, y: innerHeight / 2, scale: 0.6, autoAlpha: 0 });
    const show = (src) => {
      if (img.getAttribute('src') !== src) img.src = src;
      if (!active) { active = true; gsap.to(previewEl, { autoAlpha: 1, scale: 1, duration: 0.6, ease: 'expo.out', overwrite: 'auto' }); }
    };
    const hide = () => { active = false; gsap.to(previewEl, { autoAlpha: 0, scale: 0.6, duration: 0.45, ease: 'expo.out', overwrite: 'auto' }); };
    items.forEach((it) => {
      it.addEventListener('pointerenter', () => { if (isDesktop()) show(srcOf(it)); });
      it.addEventListener('pointerleave', hide);
      it.addEventListener('pointermove', (e) => {
        xTo(e.clientX + 40); yTo(e.clientY);
        rTo(Math.max(-12, Math.min(12, (e.clientX - lastX) * 0.6))); lastX = e.clientX;
      });
    });
    addEventListener('scroll', () => { if (active) hide(); }, { passive: true });
  }
  follower($('.caps__preview'), $$('.cap'), (el) => el.dataset.preview);
  follower($('.archive__preview'), $$('.archive__row'), (el) => el.dataset.img);

  /* ---------------- featured case: colour + sticky steps ---------------- */
  const caseEl = $('.case');
  if (!reduced) {
    gsap.timeline({ scrollTrigger: { trigger: caseEl, start: 'top 75%', end: 'bottom 25%', scrub: true } })
      .to(caseEl, { backgroundColor: COLORS.teal, duration: 0.12, ease: 'none' })
      .to(caseEl, { backgroundColor: COLORS.teal, duration: 0.76, ease: 'none' })
      .to(caseEl, { backgroundColor: COLORS.ink, duration: 0.12, ease: 'none' });
  } else caseEl.style.backgroundColor = COLORS.teal;
  const steps = $$('.case__step');
  mm.add('(min-width: 900px)', () => {
    $$('.case__fig').forEach((fig) => {
      ScrollTrigger.create({
        trigger: fig, start: 'top 62%', end: 'bottom 62%',
        onToggle: (s) => { if (s.isActive) steps.forEach((st, i) => st.classList.toggle('is-active', i === +fig.dataset.step)); }
      });
    });
  });

  /* ---------------- testimonials ---------------- */
  const quotes = $$('.quote');
  const qi = $('.js-quote-i');
  let qIndex = 0; let qTimer = null;
  const showQuote = (i) => {
    qIndex = (i + quotes.length) % quotes.length;
    quotes.forEach((q, k) => { q.classList.toggle('is-active', k === qIndex); q.setAttribute('aria-hidden', String(k !== qIndex)); });
    qi.textContent = String(qIndex + 1).padStart(2, '0');
  };
  const qStop = () => clearInterval(qTimer);
  const qPlay = () => { qStop(); if (!reduced) qTimer = setInterval(() => showQuote(qIndex + 1), 7000); };
  $('.js-quote-prev').addEventListener('click', () => { showQuote(qIndex - 1); qPlay(); });
  $('.js-quote-next').addEventListener('click', () => { showQuote(qIndex + 1); qPlay(); });
  const quotesBox = $('.quotes');
  quotesBox.addEventListener('pointerenter', qStop); quotesBox.addEventListener('pointerleave', qPlay);
  quotesBox.addEventListener('focusin', qStop); quotesBox.addEventListener('focusout', qPlay);
  showQuote(0);
  ScrollTrigger.create({ trigger: quotesBox, start: 'top bottom', end: 'bottom top', onToggle: (s) => (s.isActive ? qPlay() : qStop()) });

  /* ---------------- brief → email ---------------- */
  const form = $('.brief');
  const note = $('.brief__note');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const name = (data.get('name') || '').toString().trim();
    const field = $('input[name="name"]', form).closest('.field');
    if (!name) {
      field.classList.add('is-invalid');
      note.textContent = 'Just your name first, so we know who to write back to.';
      $('input[name="name"]', form).focus();
      return;
    }
    field.classList.remove('is-invalid');
    const needs = data.getAll('need'); const budget = data.get('budget') || 'Not specified';
    const msg = (data.get('msg') || '').toString().trim();
    const subject = `New project — ${name}`;
    const lines = [`Hi MARROW,`, ``, msg || `We'd like to talk about a project.`, ``, `Help with: ${needs.length ? needs.join(', ') : 'Not sure yet'}`, `Budget: ${budget}`, ``, `— ${name}`];
    location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\n'))}`;
    note.innerHTML = `Your mail app should open with the brief. Nothing happened? Write to <a class="link-line" href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a>`;
  });
  $('input[name="name"]', form).addEventListener('input', (e) => { if (e.target.value.trim()) e.target.closest('.field').classList.remove('is-invalid'); });

  /* ---------------- footer ---------------- */
  if (!reduced) {
    gsap.from('.footer__word span', { yPercent: 100, duration: 1.4, stagger: 0.06, ease: 'expo.out', scrollTrigger: { trigger: '.footer__word', start: 'top 95%', once: true } });
  }
  $('.js-top').addEventListener('click', () => { scrollToTarget(0, { duration: 2.2 }); $('.logo').focus({ preventScroll: true }); });

  /* ---------------- clock ---------------- */
  const clocks = $$('.js-clock');
  const fmt = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Lisbon', hour: '2-digit', minute: '2-digit' });
  const tickClock = () => { const t = fmt.format(new Date()); clocks.forEach((c) => { c.textContent = t; }); };
  tickClock(); setInterval(tickClock, 15000);

  /* ---------------- header theme ---------------- */
  const themed = $$('[data-theme]');
  let headerTheme = 'dark';
  const updateHeader = () => {
    const y = 40; let theme = 'dark';
    for (const s of themed) {
      const r = s.getBoundingClientRect();
      if (r.top <= y && r.bottom > y) { theme = s.dataset.theme; if (s.classList.contains('thesis') && thesisLight) theme = 'light'; break; }
    }
    if (theme !== headerTheme) { headerTheme = theme; header.dataset.headerTheme = theme; }
  };
  let hdrRaf = 0;
  addEventListener('scroll', () => { cancelAnimationFrame(hdrRaf); hdrRaf = requestAnimationFrame(updateHeader); }, { passive: true });

  /* ---------------- anchor links ---------------- */
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href');
    if (id.length < 2) return;
    const t = document.querySelector(id);
    if (!t) return;
    e.preventDefault();
    if (menuOpen) closeMenu(() => scrollToTarget(t));
    else scrollToTarget(t);
    history.replaceState(null, '', id);
  });

  /* ---------------- menu ---------------- */
  const menu = $('#menu');
  const menuBtn = $('.menu-btn');
  const menuItems = $$('.menu__link > .menu__num, .menu__link > .menu__word');
  const menuSide = $$('.menu__side > div');
  let menuOpen = false; let menuTl = null;
  $$('.menu__link').forEach((l) => { l.style.overflow = 'hidden'; });

  function trapFocus(container, e) {
    const f = $$('a[href], button:not([disabled]), input, textarea, [tabindex]:not([tabindex="-1"])', container).filter((el) => el.offsetParent !== null || el === menuBtn);
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
  function openMenu() {
    menuOpen = true; menu.classList.add('is-open'); body.classList.add('menu-open');
    menu.setAttribute('aria-hidden', 'false'); menuBtn.setAttribute('aria-expanded', 'true'); lockScroll();
    menuTl?.kill();
    if (reduced) { gsap.set('.menu__bg', { clipPath: 'inset(0% 0% 0% 0%)' }); }
    else {
      menuTl = gsap.timeline()
        .fromTo('.menu__bg--signal', { clipPath: 'inset(0% 0% 100% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.8, ease: 'expo.inOut' }, 0)
        .fromTo('.menu__bg--ink', { clipPath: 'inset(0% 0% 100% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.8, ease: 'expo.inOut' }, 0.12)
        .fromTo(menuItems, { yPercent: 110 }, { yPercent: 0, duration: 1, stagger: 0.04, ease: 'expo.out' }, 0.55)
        .fromTo(menuSide, { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.06 }, 0.7);
    }
    setTimeout(() => $('.menu__link')?.focus({ preventScroll: true }), reduced ? 0 : 500);
  }
  function closeMenu(after) {
    menuOpen = false; menuBtn.setAttribute('aria-expanded', 'false'); menu.setAttribute('aria-hidden', 'true');
    const done = () => { menu.classList.remove('is-open'); body.classList.remove('menu-open'); unlockScroll(); if (typeof after === 'function') after(); };
    menuTl?.kill();
    if (reduced) { done(); return; }
    menuTl = gsap.timeline({ onComplete: done })
      .to(menuItems, { yPercent: -110, duration: 0.5, stagger: 0.02, ease: 'expo.in' }, 0)
      .to(menuSide, { autoAlpha: 0, duration: 0.3 }, 0)
      .to('.menu__bg--ink', { clipPath: 'inset(0% 0% 0% 100%)', duration: 0.7, ease: 'expo.inOut' }, 0.25)
      .to('.menu__bg--signal', { clipPath: 'inset(0% 0% 0% 100%)', duration: 0.7, ease: 'expo.inOut' }, 0.33);
  }
  menuBtn.addEventListener('click', () => (menuOpen ? closeMenu(() => menuBtn.focus()) : openMenu()));

  /* ---------------- case sheet ---------------- */
  const sheet = $('.sheet');
  const panel = $('.sheet__panel', sheet);
  const scrim = $('.sheet__scrim', sheet);
  const content = $('.sheet__content', sheet);
  let sheetOpen = false; let sheetKey = null; let lastFocus = null;

  function fillSheet(key) {
    const p = PROJECTS[key]; sheetKey = key;
    const idx = ORDER.indexOf(key);
    $('.sheet__idx', sheet).textContent = `Case ${String(idx + 1).padStart(2, '0')} / ${String(ORDER.length).padStart(2, '0')}`;
    $('.sheet__tags', sheet).textContent = p.tags;
    $('.sheet__title', sheet).textContent = p.name;
    $('.sheet__line', sheet).textContent = p.line;
    const cover = $('.sheet__cover img', sheet); cover.src = p.cover; cover.alt = `${p.name} key visual`;
    $('.sheet__facts', sheet).innerHTML = [['Client', p.name], ['Year', p.year], ['Based in', p.where], ['Our part', p.role]]
      .map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('');
    $('.sheet__body', sheet).innerHTML = p.body.map((t) => `<p>${t}</p>`).join('');
    $('.sheet__gallery', sheet).innerHTML = p.gallery
      .map(([src, wide]) => `<img src="${src}" alt="${p.name} — supporting visual" loading="lazy" decoding="async"${wide ? ' class="is-wide"' : ''}>`).join('');
    const next = PROJECTS[ORDER[(idx + 1) % ORDER.length]];
    $('.sheet__next-name', sheet).textContent = next.name;
    panel.scrollTop = 0;
  }
  function openSheet(key) {
    if (!PROJECTS[key]) return;
    lastFocus = document.activeElement;
    fillSheet(key);
    sheet.hidden = false; sheet.setAttribute('aria-hidden', 'false'); sheetOpen = true; lockScroll();
    cursorReset();
    if (reduced) { gsap.set(scrim, { autoAlpha: 1 }); gsap.set(panel, { xPercent: 0, x: 0 }); }
    else {
      gsap.timeline()
        .fromTo(scrim, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.6, ease: 'power2.out' }, 0)
        .fromTo(panel, { x: 0, xPercent: 100 }, { xPercent: 0, duration: 1, ease: 'expo.out' }, 0)
        .fromTo($$('.sheet__head > *', sheet), { y: 40, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1, stagger: 0.06 }, 0.25)
        .fromTo($('.sheet__cover', sheet), { clipPath: 'inset(0% 0% 100% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.2, ease: 'expo.inOut' }, 0.3);
    }
    $('.sheet__bar .js-sheet-close', sheet).focus({ preventScroll: true });
  }
  function closeSheet() {
    if (!sheetOpen) return; sheetOpen = false;
    const done = () => { sheet.hidden = true; sheet.setAttribute('aria-hidden', 'true'); unlockScroll(); lastFocus?.focus?.({ preventScroll: true }); };
    if (reduced) { done(); return; }
    gsap.timeline({ onComplete: done })
      .to(panel, { xPercent: 100, duration: 0.7, ease: 'expo.inOut' }, 0)
      .to(scrim, { autoAlpha: 0, duration: 0.5 }, 0.2);
  }
  document.addEventListener('click', (e) => {
    const trig = e.target.closest('[data-project]');
    if (trig) { e.preventDefault(); openSheet(trig.dataset.project); }
  });
  $$('.js-sheet-close', sheet).forEach((b) => b.addEventListener('click', closeSheet));
  $('.sheet__next', sheet).addEventListener('click', () => {
    const next = ORDER[(ORDER.indexOf(sheetKey) + 1) % ORDER.length];
    if (reduced) { fillSheet(next); return; }
    gsap.to(content, {
      autoAlpha: 0, y: -20, duration: 0.3, ease: 'power2.in', onComplete: () => {
        fillSheet(next);
        gsap.fromTo(content, { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.8, ease: 'expo.out' });
      }
    });
  });

  /* ---------------- keyboard: Esc + focus traps ---------------- */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (sheetOpen) closeSheet();
      else if (menuOpen) closeMenu(() => menuBtn.focus());
    }
    if (e.key === 'Tab') {
      if (sheetOpen) trapFocus(panel, e);
      else if (menuOpen) {
        const f = [menuBtn, ...$$('a[href]', menu)];
        const i = f.indexOf(document.activeElement);
        if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); }
        else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); }
      }
    }
  });

  /* ---------------- custom cursor ---------------- */
  const cursor = $('.cursor');
  const cLabel = $('.cursor__label');
  function cursorReset() { if (!cursor) return; cursor.classList.remove('is-hover', 'has-label'); }
  if (finePointer && !reduced && cursor) {
    const cx = gsap.quickTo(cursor, 'x', { duration: 0.45, ease: 'power3' });
    const cy = gsap.quickTo(cursor, 'y', { duration: 0.45, ease: 'power3' });
    addEventListener('pointermove', (e) => { cx(e.clientX); cy(e.clientY); cursor.classList.add('is-visible'); }, { passive: true });
    document.addEventListener('pointerleave', () => cursor.classList.remove('is-visible'));
    document.addEventListener('pointerover', (e) => {
      const t = e.target;
      const hide = t.closest('[data-cursor-hide]');
      const lab = t.closest('[data-cursor]');
      const inter = t.closest('a, button, label, input, textarea');
      cursor.classList.toggle('is-hidden', !!hide);
      if (lab && !hide) { cLabel.textContent = lab.dataset.cursor; cursor.classList.add('has-label'); cursor.classList.remove('is-hover'); }
      else { cursor.classList.remove('has-label'); cursor.classList.toggle('is-hover', !!inter && !hide); }
    });
  } else cursor?.remove();

  /* ---------------- helpers ---------------- */
  function debounce(fn, ms) { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; }

  /* ---------------- go ---------------- */
  updateHeader();
  runPreloader();
  addEventListener('load', () => ScrollTrigger.refresh());
})();
