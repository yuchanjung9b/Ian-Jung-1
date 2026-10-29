const TABS = [
  { key: "attractions", label: "Attractions", ko: "관광지" },
  { key: "hotels", label: "Hotels", ko: "호텔" },
  { key: "foods", label: "Local Food", ko: "먹거리" },
  { key: "restaurants", label: "Where to Eat", ko: "식당" },
];

const grid = document.getElementById("province-grid");
const detail = document.getElementById("detail");
let currentTab = "attractions";

document.getElementById("rate").textContent = KRW_PER_USD.toLocaleString();

// Escape text before putting it into HTML.
function esc(text) {
  const div = document.createElement("div");
  div.textContent = text ?? "";
  return div.innerHTML;
}

// Add an approximate USD amount after each ₩ number, e.g. "₩3,000" → "₩3,000 (≈ $2)".
function withUsd(price) {
  const amounts = [...price.matchAll(/₩?(\d{1,3}(?:,\d{3})+|\d+)/g)]
    .map((m) => Number(m[1].replace(/,/g, "")))
    .filter((n) => n >= 500);
  if (!price.includes("₩") || amounts.length === 0) return esc(price);
  const usd = amounts.map((n) => Math.max(1, Math.round(n / KRW_PER_USD)));
  const usdText = usd.length > 1 ? `$${usd[0]}–${usd[usd.length - 1]}` : `$${usd[0]}`;
  return `${esc(price)} <span class="usd">≈ ${usdText}</span>`;
}

// Photos are optional. A missing file is removed so the colored card shows instead.
// Province photos: images/<id>.svg (e.g. images/gangwon.svg). Item photos: set "image" on the item.
function photo(src, alt = "") {
  return `<img src="${esc(src)}" alt="${esc(alt)}" loading="lazy" onerror="this.remove()" />`;
}

function renderGrid(activeId) {
  grid.innerHTML = PROVINCES.map(
    (p) => `
      <a class="province-card${p.id === activeId ? " active" : ""}" href="#${p.id}" style="--accent:${p.color}">
        <span class="thumb">${photo(p.image || `images/${p.id}.svg`)}</span>
        <span class="ko">${esc(p.ko)}</span>
        <span class="en">${esc(p.name)}</span>
        <span class="cities">${esc(p.cities)}</span>
      </a>`
  ).join("");
}

function renderItems(p, key) {
  const items = p[key] || [];
  if (items.length === 0) return `<p class="empty">Coming soon.</p>`;
  return `<ul class="items">${items
    .map(
      (it) => `
        <li class="item">
          ${it.image ? `<div class="item-photo">${photo(it.image, it.name)}</div>` : ""}
          <div class="item-body">
          <div class="item-head">
            <h4>${esc(it.name)} <span class="item-ko">${esc(it.ko)}${it.city ? ` · 📍 ${esc(it.city)}` : ""}</span></h4>
            ${it.type ? `<span class="badge badge-${esc(it.type.toLowerCase())}">${esc(it.type)}</span>` : ""}
          </div>
          <p>${esc(it.desc)}</p>
          ${it.address ? `<p class="address">📍 ${esc(it.address)}
            <a href="https://map.naver.com/p/search/${encodeURIComponent(it.ko + " " + it.address)}" target="_blank" rel="noopener">Map</a></p>` : ""}
          <p class="price">${withUsd(it.price)}</p>
          ${it.source ? `<p class="source">Source: ${esc(it.source)}</p>` : ""}
          </div>
        </li>`
    )
    .join("")}</ul>`;
}

function renderDetail(p) {
  if (!p) {
    detail.innerHTML = `<p class="hint">👆 Pick a province above to see where to go, stay and eat.</p>`;
    return;
  }
  detail.innerHTML = `
    <div class="detail-head" style="--accent:${p.color}">
      ${photo(p.image || `images/${p.id}.svg`)}
      <div class="detail-text">
      <h3>${esc(p.name)} <span>${esc(p.ko)}</span></h3>
      <p class="cities">${esc(p.cities)}</p>
      <p>${esc(p.intro)}</p>
      </div>
    </div>
    <div class="tabs" role="tablist">
      ${TABS.map(
        (t) => `
          <button role="tab" type="button" data-tab="${t.key}" aria-selected="${t.key === currentTab}">
            ${t.label} <small>${t.ko}</small>
          </button>`
      ).join("")}
    </div>
    <div class="tab-panel" role="tabpanel">${renderItems(p, currentTab)}</div>`;

  detail.querySelectorAll("[data-tab]").forEach((btn) =>
    btn.addEventListener("click", () => {
      currentTab = btn.dataset.tab;
      renderDetail(p);
    })
  );
}

// The selected province lives in the URL (e.g. #gangwon), so links can be shared.
function route() {
  const id = location.hash.slice(1);
  const province = PROVINCES.find((p) => p.id === id);
  renderGrid(province?.id);
  renderDetail(province);
  if (province) detail.scrollIntoView({ behavior: "smooth", block: "start" });
}

window.addEventListener("hashchange", () => {
  currentTab = "attractions";
  route();
});
route();
