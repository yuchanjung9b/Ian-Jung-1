// Home page: hero carousel and the highlight cards.
const slides = [...document.querySelectorAll("[data-slide]")];
const dotsBox = document.getElementById("dots");
let current = 0;
let timer = null;
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

dotsBox.innerHTML = slides.map((_, i) => `<button type="button" aria-label="Show slide ${i + 1}"></button>`).join("");
const dots = [...dotsBox.children];

function show(i) {
  current = (i + slides.length) % slides.length;
  slides.forEach((s, k) => s.classList.toggle("on", k === current));
  dots.forEach((d, k) => d.setAttribute("aria-current", String(k === current)));
}
function start() {
  if (reduceMotion) return;
  stop();
  timer = setInterval(() => show(current + 1), 6500);
}
function stop() {
  clearInterval(timer);
}
document.getElementById("prev").addEventListener("click", () => { show(current - 1); start(); });
document.getElementById("next").addEventListener("click", () => { show(current + 1); start(); });
dots.forEach((d, k) => d.addEventListener("click", () => { show(k); start(); }));
const carousel = document.querySelector(".carousel");
carousel.addEventListener("mouseenter", stop);
carousel.addEventListener("mouseleave", start);
carousel.addEventListener("focusin", stop);
carousel.addEventListener("focusout", start);
show(0);
start();

// Highlights come from data.js so the text stays in sync with the guide.
const baseName = (n) => (n ?? "").replace(/ \(.*\)/, "");
const slug = (n) => baseName(n).toLowerCase().replace(/\s+/g, "-");
const esc = (t) => { const d = document.createElement("div"); d.textContent = t ?? ""; return d.innerHTML; };

const PICKS = ["Bulguksa Temple", "Seongsan Ilchulbong", "Jeonju Hanok Village"];
document.getElementById("highlights").innerHTML = PICKS.map((name) => {
  for (const p of PROVINCES) {
    const it = (p.attractions || []).find((a) => a.name === name);
    if (!it) continue;
    return `
      <a class="pcard" href="city.html?p=${p.id}&c=${slug(it.city)}">
        <img src="images/${p.id}.svg" alt="" loading="lazy" />
        <div class="body">
          <p class="tag">${esc(baseName(it.city))} · ${esc(p.name)}</p>
          <h3>${esc(it.name)} <small>${esc(it.ko)}</small></h3>
          <p>${esc(it.desc)}</p>
          <span class="meta">${esc(it.price)}</span>
        </div>
      </a>`;
  }
  return "";
}).join("");
