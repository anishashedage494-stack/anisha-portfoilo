document.documentElement.classList.add("js");
document.getElementById("yr").textContent = new Date().getFullYear();
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

// ---- Typing roles in the hero ----
const roles = ["Full Stack Java Developer", "Web Developer", "Problem Solver"];
const typed = document.getElementById("typed");
if (typed && !reduce) {
  let r = 0, c = 0, del = false;
  const tick = () => {
    const word = roles[r];
    typed.textContent = word.slice(0, c);
    if (!del && c < word.length) { c++; setTimeout(tick, 80); }
    else if (!del) { del = true; setTimeout(tick, 1600); }
    else if (c > 0) { c--; setTimeout(tick, 40); }
    else { del = false; r = (r + 1) % roles.length; setTimeout(tick, 300); }
  };
  setTimeout(() => { c = typed.textContent.length; del = true; tick(); }, 2200);
}

// ---- Scroll reveal with stagger, headings underline, counters ----
const items = document.querySelectorAll("h2,.sub,.sheet,.project,.skills>div,.path li,.contact-grid>*");
items.forEach((el, i) => { el.classList.add("reveal"); el.style.setProperty("--d", (i % 3) * 0.12 + "s"); });
const countUp = (el) => {
  const end = parseFloat(el.dataset.count), dec = +el.dataset.dec || 0, t0 = performance.now();
  const step = (t) => {
    const p = Math.min((t - t0) / 1200, 1);
    el.textContent = (end * (1 - Math.pow(1 - p, 3))).toFixed(dec);
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
};
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (!e.isIntersecting) return;
    e.target.classList.add("in");
    e.target.querySelectorAll("[data-count]").forEach(countUp);
    io.unobserve(e.target);
  });
}, { threshold: 0.15 });
items.forEach((el) => io.observe(el));

// ---- Progress bar, header, active link, back-to-top ----
const progress = document.getElementById("progress");
const header = document.getElementById("top");
const links = [...document.querySelectorAll(".top nav a")];
const secs = links.map((a) => document.querySelector(a.getAttribute("href")));
const toTop = document.createElement("button");
toTop.className = "to-top"; toTop.setAttribute("aria-label", "Back to top"); toTop.textContent = "↑";
toTop.onclick = () => scrollTo({ top: 0, behavior: "smooth" });
document.body.appendChild(toTop);
addEventListener("scroll", () => {
  const d = document.documentElement;
  progress.style.width = (d.scrollTop / (d.scrollHeight - d.clientHeight)) * 100 + "%";
  header.classList.toggle("scrolled", d.scrollTop > 20);
  toTop.classList.toggle("show", d.scrollTop > 600);
  let cur = -1;
  secs.forEach((s, i) => { if (s && scrollY >= s.offsetTop - 160) cur = i; });
  links.forEach((a, i) => a.classList.toggle("on", i === cur));
}, { passive: true });

// ---- Cursor glow + 3D tilt on project cards ----
if (!reduce && matchMedia("(hover: hover)").matches) {
  addEventListener("pointermove", (e) => {
    document.body.style.setProperty("--mx", e.clientX + "px");
    document.body.style.setProperty("--my", e.clientY + "px");
  });
  document.querySelectorAll(".project").forEach((card) => {
    card.addEventListener("pointermove", (e) => {
      const b = card.getBoundingClientRect();
      const x = (e.clientX - b.left) / b.width - 0.5, y = (e.clientY - b.top) / b.height - 0.5;
      card.style.transform = `perspective(800px) rotateX(${-y * 7}deg) rotateY(${x * 9}deg) translateY(-6px)`;
    });
    card.addEventListener("pointerleave", () => (card.style.transform = ""));
  });
}

// ---- Contact form: opens the visitor's mail app ----
const MY_EMAIL = "your-email@example.com"; // change to your email
const form = document.getElementById("form");
const msg = document.getElementById("msg");
form.addEventListener("submit", (ev) => {
  ev.preventDefault();
  const name = document.getElementById("n").value.trim();
  const email = document.getElementById("e").value.trim();
  const text = document.getElementById("m").value.trim();
  if (!name || !email || !text) { msg.textContent = "Fill in your name, email and message, then send again."; msg.className = "err"; return; }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { msg.textContent = "Enter a valid email address, for example name@example.com."; msg.className = "err"; return; }
  location.href = "mailto:" + MY_EMAIL + "?subject=" + encodeURIComponent("Portfolio message from " + name) + "&body=" + encodeURIComponent(text + "\n\nFrom: " + name + " (" + email + ")");
  msg.textContent = "Your mail app is opening with the message ready to send."; msg.className = "ok"; form.reset();
});
