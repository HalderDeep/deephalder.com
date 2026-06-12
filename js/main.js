/* ============================================================
   deephalder.com — interactions
   ============================================================ */

/* ---------- boot loader: run "evals" on the site itself ---------- */
(function boot() {
  const boot = document.getElementById("boot");
  const body = document.getElementById("bootBody");
  const skip = document.getElementById("bootSkip");
  if (!boot || !body) return;

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const seen = sessionStorage.getItem("booted");

  const lines = [
    { t: '<span class="cmd">$ run evals --target deephalder.com</span>', d: 200 },
    { t: 'loading candidate: <span class="cmd">deep_halder_v2026</span>', d: 350 },
    { t: '<span class="ok">✓</span> hallucination_check ......... <span class="ok">PASS</span>', d: 280 },
    { t: '<span class="ok">✓</span> agent_reliability ........... <span class="ok">PASS</span>', d: 240 },
    { t: '<span class="ok">✓</span> buzzword_density ............ <span class="ok">LOW — human-written</span>', d: 260 },
    { t: '<span class="warn">⚠</span> chai_dependency ............. <span class="warn">HIGH — wontfix</span>', d: 280 },
    { t: 'verdict: <span class="ok">strong hire</span> · rendering portfolio…', d: 420 },
  ];

  function finish() {
    boot.classList.add("done");
    sessionStorage.setItem("booted", "1");
    setTimeout(() => boot.remove(), 600);
  }

  if (reduced || seen) { finish(); return; }

  let i = 0;
  let cancelled = false;
  function next() {
    if (cancelled) return;
    if (i >= lines.length) { setTimeout(finish, 350); return; }
    body.innerHTML += lines[i].t + "\n";
    setTimeout(next, lines[i].d);
    i++;
  }
  next();

  skip.addEventListener("click", () => { cancelled = true; finish(); });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !boot.classList.contains("done")) { cancelled = true; finish(); }
  });
})();

/* ---------- custom cursor ---------- */
(function cursor() {
  const ring = document.getElementById("cursor");
  const dot = document.getElementById("cursorDot");
  if (!ring || !dot || window.matchMedia("(hover: none)").matches) return;

  let mx = -100, my = -100, rx = -100, ry = -100;
  document.addEventListener("mousemove", (e) => {
    mx = e.clientX; my = e.clientY;
    dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
  });
  (function follow() {
    rx += (mx - rx) * 0.16;
    ry += (my - ry) * 0.16;
    ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
    requestAnimationFrame(follow);
  })();

  document.querySelectorAll("a, button, [data-hover]").forEach((el) => {
    el.addEventListener("mouseenter", () => ring.classList.add("grow"));
    el.addEventListener("mouseleave", () => ring.classList.remove("grow"));
  });
})();

/* ---------- scroll progress ---------- */
(function progress() {
  const bar = document.getElementById("progress");
  if (!bar) return;
  document.addEventListener("scroll", () => {
    const h = document.documentElement;
    const pct = h.scrollTop / (h.scrollHeight - h.clientHeight);
    bar.style.width = pct * 100 + "%";
  }, { passive: true });
})();

/* ---------- hero: neural network canvas ---------- */
(function net() {
  const canvas = document.getElementById("net");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let W, H, nodes = [];
  const mouse = { x: -9999, y: -9999 };
  const DENSITY = 14000; // px² per node
  const LINK = 150;

  function resize() {
    W = canvas.width = canvas.offsetWidth * devicePixelRatio;
    H = canvas.height = canvas.offsetHeight * devicePixelRatio;
    const count = Math.min(110, Math.floor((canvas.offsetWidth * canvas.offsetHeight) / DENSITY));
    nodes = Array.from({ length: count }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.35 * devicePixelRatio,
      vy: (Math.random() - 0.5) * 0.35 * devicePixelRatio,
      r: (Math.random() * 1.6 + 0.8) * devicePixelRatio,
    }));
  }
  resize();
  window.addEventListener("resize", resize);

  canvas.parentElement.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = (e.clientX - rect.left) * devicePixelRatio;
    mouse.y = (e.clientY - rect.top) * devicePixelRatio;
  });
  canvas.parentElement.addEventListener("mouseleave", () => {
    mouse.x = -9999; mouse.y = -9999;
  });

  function frame() {
    ctx.clearRect(0, 0, W, H);
    const link = LINK * devicePixelRatio;

    for (const n of nodes) {
      n.x += n.vx; n.y += n.vy;
      if (n.x < 0 || n.x > W) n.vx *= -1;
      if (n.y < 0 || n.y > H) n.vy *= -1;

      // gentle pull toward mouse
      const dxm = mouse.x - n.x, dym = mouse.y - n.y;
      const dm = Math.hypot(dxm, dym);
      if (dm < link * 1.4 && dm > 1) {
        n.x += (dxm / dm) * 0.25 * devicePixelRatio;
        n.y += (dym / dm) * 0.25 * devicePixelRatio;
      }
    }

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < link) {
          const alpha = (1 - d / link) * 0.34;
          ctx.strokeStyle = `rgba(0, 255, 200, ${alpha})`;
          ctx.lineWidth = devicePixelRatio * 0.6;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    for (const n of nodes) {
      const dm = Math.hypot(mouse.x - n.x, mouse.y - n.y);
      const lit = dm < link;
      ctx.fillStyle = lit ? "rgba(0, 255, 200, 0.95)" : "rgba(130, 149, 167, 0.55)";
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r * (lit ? 1.5 : 1), 0, Math.PI * 2);
      ctx.fill();
    }

    if (!reduced) requestAnimationFrame(frame);
  }
  frame();
})();

/* ---------- hero: role typer ---------- */
(function typer() {
  const el = document.getElementById("roleTyper");
  if (!el) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    el.textContent = "a Senior AI SDET";
    return;
  }
  const roles = [
    "a Senior AI SDET",
    "an AI quality engineer",
    "a professional skeptic",
    "an eval-obsessed researcher",
    "the “prove it” guy",
  ];
  let r = 0, c = 0, deleting = false;

  function tick() {
    const word = roles[r];
    el.textContent = word.slice(0, c);
    let delay = deleting ? 38 : 72;
    if (!deleting && c === word.length) { delay = 1700; deleting = true; }
    else if (deleting && c === 0) { deleting = false; r = (r + 1) % roles.length; delay = 350; }
    c += deleting ? -1 : 1;
    setTimeout(tick, delay);
  }
  tick();
})();

/* ---------- scroll reveal + eval bars + stat counters ---------- */
(function reveal() {
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      e.target.classList.add("in");

      // animate eval bars inside
      e.target.querySelectorAll(".eval__fill").forEach((f) => {
        f.style.width = f.dataset.score + "%";
      });
      e.target.querySelectorAll(".eval__score").forEach((s) => {
        animateCount(s, parseInt(s.dataset.target, 10), "%");
      });
      e.target.querySelectorAll(".stat__num").forEach((s) => {
        animateCount(s, parseInt(s.dataset.count, 10), s.dataset.suffix || "");
      });

      io.unobserve(e.target);
    }
  }, { threshold: 0.18 });

  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

  // also handle bars/scores in evals not wrapped (safety)
  function animateCount(el, target, suffix) {
    if (el.dataset.done) return;
    el.dataset.done = "1";
    const dur = 1300;
    const start = performance.now();
    function step(now) {
      const p = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
})();

/* ---------- footer year ---------- */
document.getElementById("year").textContent = new Date().getFullYear();
