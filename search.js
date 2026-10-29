// Site-wide search over every place in data.js, with category and province filters.
const CATS = [
  { key: "attractions", label: "Attractions", ko: "관광지" },
  { key: "restaurants", label: "Restaurants", ko: "맛집" },
  { key: "hotels", label: "Places to stay", ko: "숙소" },
  { key: "foods", label: "Local food", ko: "먹거리" },
];

const esc = (t) => { const d = document.createElement("div"); d.textContent = t ?? ""; return d.innerHTML; };
const baseName = (n) => (n ?? "").replace(/ \(.*\)/, "");
const slug = (n) => baseName(n).toLowerCase().replace(/\s+/g, "-");
const usd = (price) => {
  const nums = [...price.matchAll(/(\d{1,3}(?:,\d{3})+|\d+)/g)].map((m) => Number(m[1].replace(/,/g, ""))).filter((n) => n >= 500);
  if (!price.includes("₩") || !nums.length) return "";
  const d = nums.map((n) => Math.max(1, Math.round(n / KRW_PER_USD)));
  return ` <span class="usd">≈ ${d.length > 1 ? `$${d[0]}–${d[d.length - 1]}` : `$${d[0]}`}</span>`;
};

// Flatten every place and work out which city page it belongs on.
const SPECIAL_NAMES = SPECIAL_CITIES.map((c) => c.name);
const ALL = PROVINCES.flatMap((p) =>
  CATS.flatMap((c) =>
    (p[c.key] || []).map((it) => {
      const special = it.city && SPECIAL_NAMES.includes(it.city);
      const href = !it.city
        ? `province.html?p=${p.id}`
        : `city.html?p=${special ? "special" : p.id}&c=${slug(it.city)}`;
      const text = [it.name, it.ko, it.desc, it.city, p.name, p.ko].join(" ").toLowerCase();
      return { it, cat: c, prov: p, href, text, name: `${it.name} ${it.ko}`.toLowerCase() };
    })
  )
);

const qEl = document.getElementById("q");
const filtersEl = document.getElementById("filters");
const countEl = document.getElementById("count");
const resultsEl = document.getElementById("results");
const params = new URLSearchParams(location.search);
let type = CATS.some((c) => c.key === params.get("type")) ? params.get("type") : "all";
let province = PROVINCES.some((p) => p.id === params.get("p")) ? params.get("p") : "all";
qEl.value = params.get("q") || "";

function highlight(text, words) {
  let out = esc(text);
  words.forEach((w) => {
    if (!w) return;
    const safe = esc(w).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    out = out.replace(new RegExp(`(${safe})`, "gi"), "<mark>$1</mark>");
  });
  return out;
}

function matches() {
  const words = qEl.value.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const list = ALL.filter(
    (r) => (type === "all" || r.cat.key === type) && (province === "all" || r.prov.id === province) && words.every((w) => r.text.includes(w))
  );
  // Name matches first, then everything else in guide order.
  list.sort((a, b) => Number(words.some((w) => b.name.includes(w))) - Number(words.some((w) => a.name.includes(w))));
  return { words, list };
}

function render() {
  const { words, list } = matches();
  // Counts for the category chips ignore the category filter itself, so the chips stay useful.
  const base = ALL.filter((r) => (province === "all" || r.prov.id === province) && words.every((w) => r.text.includes(w)));
  const n = (k) => base.filter((r) => r.cat.key === k).length;
  filtersEl.innerHTML =
    `<button type="button" data-type="all" aria-pressed="${type === "all"}">All <small>${base.length}</small></button>` +
    CATS.map((c) => `<button type="button" data-type="${c.key}" aria-pressed="${type === c.key}">${c.label} ${c.ko} <small>${n(c.key)}</small></button>`).join("") +
    `<select id="prov" aria-label="Province"><option value="all">All provinces</option>${PROVINCES.map((p) => `<option value="${p.id}"${p.id === province ? " selected" : ""}>${esc(p.name)}</option>`).join("")}</select>`;
  filtersEl.querySelectorAll("[data-type]").forEach((b) => b.addEventListener("click", () => { type = b.dataset.type; render(); }));
  filtersEl.querySelector("#prov").addEventListener("change", (e) => { province = e.target.value; render(); });

  countEl.textContent = list.length ? `${list.length} place${list.length === 1 ? "" : "s"} found` : "";
  resultsEl.innerHTML = list.length
    ? list
        .map(
          ({ it, cat, prov, href }) => `
        <li><a class="result" href="${href}">
          <span class="cat">${cat.label} · ${cat.ko}</span>
          <h3>${highlight(it.name, words)} <small>${esc(it.ko)}</small></h3>
          <p class="where">📍 ${esc(it.city ? `${baseName(it.city)}, ` : "")}${esc(prov.name)}</p>
          <p>${highlight(it.desc, words)}</p>
          <span class="price">${esc(it.price)}${usd(it.price)}</span>
        </a></li>`
        )
        .join("")
    : `<li class="empty">No places match that. Try a shorter word, another spelling, or clear the filters.</li>`;

  // Keep the address shareable.
  const next = new URLSearchParams();
  if (qEl.value.trim()) next.set("q", qEl.value.trim());
  if (type !== "all") next.set("type", type);
  if (province !== "all") next.set("p", province);
  history.replaceState(null, "", next.toString() ? `?${next}` : location.pathname);
}

qEl.addEventListener("input", render);
document.getElementById("search-form").addEventListener("submit", (e) => e.preventDefault());
render();
