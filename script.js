const TABS = [
  { key: "attractions", label: "Attractions", ko: "관광지" },
  { key: "hotels", label: "Hotels", ko: "호텔" },
  { key: "foods", label: "Local Food", ko: "먹거리" },
  { key: "restaurants", label: "Where to Eat", ko: "식당" },
];

const grid = document.getElementById("province-grid");
const detail = document.getElementById("detail");
let currentTab = "attractions";
let currentCity = null; // city name chosen in the city list, or null for all

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

// Items tagged with a city (e.g. "Changwon (Garosu-gil)") belong to that city.
const inCity = (it, city) => !!it.city && it.city.startsWith(city.replace(/ \(.*\)/, ""));

function renderCities(p) {
  const entry = PROVINCE_CITIES.find((c) => c.guide === p.id);
  if (!entry) return "";
  const tagged = (name) => TABS.reduce((n, t) => n + (p[t.key] || []).filter((it) => inCity(it, name)).length, 0);
  const chip = (name, ko) => {
    const n = tagged(name);
    const label = `${esc(name.replace(/ \(.*\)/, ""))} <small>${esc(ko)}</small>${n ? ` <b>${n}</b>` : ""}`;
    return n
      ? `<button type="button" class="city-chip" data-city="${esc(name)}" aria-pressed="${currentCity === name}">${label}</button>`
      : `<span class="city-chip plain">${label}</span>`;
  };
  const nearby = (entry.nearby || [])
    .map((n) => SPECIAL_CITIES.find((s) => s.name === n))
    .filter(Boolean);
  return `
    <div class="city-panel" style="--accent:${p.color}">
      <h4>Cities in ${esc(p.name)} <small>${entry.cities.length}</small>
        ${currentCity ? `<button type="button" class="city-clear" data-city="">Show all</button>` : ""}</h4>
      <div class="city-chips">${entry.cities.map(([en, ko]) => chip(en, ko)).join("")}</div>
      ${nearby.length ? `<h4 class="special-label">Special cities nearby</h4><div class="city-chips">${nearby.map((s) => chip(s.name, s.ko)).join("")}</div>` : ""}
      <p class="city-hint">Cities with a number have places listed here. Select one to filter.</p>
    </div>`;
}

function renderItems(p, key) {
  const all = p[key] || [];
  const items = currentCity ? all.filter((it) => inCity(it, currentCity)) : all;
  if (all.length === 0) return `<p class="empty">Coming soon.</p>`;
  if (items.length === 0) return `<p class="empty">Nothing listed in ${esc(currentCity)} for this tab yet.</p>`;
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
    ${renderCities(p)}
    <div class="tabs" role="tablist">
      ${TABS.map(
        (t) => `
          <button role="tab" type="button" data-tab="${t.key}" aria-selected="${t.key === currentTab}">
            ${t.label} <small>${t.ko}</small>
          </button>`
      ).join("")}
    </div>
    <div class="tab-panel" role="tabpanel">${renderItems(p, currentTab)}</div>`;

  detail.querySelectorAll("[data-city]").forEach((btn) =>
    btn.addEventListener("click", () => {
      currentCity = btn.dataset.city && btn.dataset.city !== currentCity ? btn.dataset.city : null;
      // Jump to the first tab that has places in this city, so the list is never empty.
      if (currentCity && !(p[currentTab] || []).some((it) => inCity(it, currentCity))) {
        currentTab = TABS.find((t) => (p[t.key] || []).some((it) => inCity(it, currentCity)))?.key ?? currentTab;
      }
      renderDetail(p);
    })
  );
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
  currentCity = null;
  route();
});
route();
