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

// Items are tagged with a city (e.g. "Changwon (Jinhae)"). The part before any bracket is the city name.
const baseName = (name) => (name ?? "").replace(/ \(.*\)/, "");
const slug = (name) => baseName(name).toLowerCase().replace(/\s+/g, "-");
const inCity = (it, name) => baseName(it.city) === baseName(name);
const placesIn = (p, name) => TABS.reduce((n, t) => n + (p[t.key] || []).filter((it) => inCity(it, name)).length, 0);

// Cities, counties and nearby special cities that belong to a province, in the order they are shown.
function placesOf(p) {
  const entry = PROVINCE_CITIES.find((c) => c.guide === p.id);
  if (!entry) return [];
  const special = (entry.nearby || []).map((n) => SPECIAL_CITIES.find((s) => s.name === n)).filter(Boolean);
  return [
    ...entry.cities.map(([name, ko]) => ({ name, ko, kind: "City" })),
    ...(entry.counties || []).map(([name, ko]) => ({ name, ko, kind: "County" })),
    ...special.map((s) => ({ name: s.name, ko: s.ko, kind: s.type })),
  ].map((c) => ({ ...c, slug: slug(c.name) }));
}

function renderItems(p, city, key) {
  const items = (p[key] || []).filter((it) => inCity(it, city.name));
  const label = TABS.find((t) => t.key === key).label.toLowerCase();
  if (items.length === 0) return `<p class="empty">No ${label} listed for ${esc(baseName(city.name))} yet.</p>`;
  return `<ul class="items">${items
    .map(
      (it) => `
        <li class="item">
          ${it.image ? `<div class="item-photo">${photo(it.image, it.name)}</div>` : ""}
          <div class="item-body">
          <div class="item-head">
            <h4>${esc(it.name)} <span class="item-ko">${esc(it.ko)}</span></h4>
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

function provinceHead(p) {
  return `
    <div class="detail-head" style="--accent:${p.color}">
      ${photo(p.image || `images/${p.id}.svg`)}
      <div class="detail-text">
      <h3>${esc(p.name)} <span>${esc(p.ko)}</span></h3>
      <p class="cities">${esc(p.cities)}</p>
      <p>${esc(p.intro)}</p>
      </div>
    </div>`;
}

// Step 2: a province shows its cities. Pick one to see its places.
function renderProvince(p) {
  const all = placesOf(p);
  const group = (title, list) =>
    list.length
      ? `<h4 class="city-group-title">${title} <small>${list.length}</small></h4>
         <div class="city-cards">${list
           .map((c) => {
             const n = placesIn(p, c.name);
             return `<a class="city-card${n ? "" : " empty-city"}" href="#${p.id}/${c.slug}">
               <span class="name">${esc(baseName(c.name))}</span>
               <span class="ko">${esc(c.ko)}</span>
               <span class="count">${n ? `${n} place${n === 1 ? "" : "s"}` : "Coming soon"}</span>
             </a>`;
           })
           .join("")}</div>`
      : "";
  detail.innerHTML = `
    ${provinceHead(p)}
    <div class="city-panel" style="--accent:${p.color}">
      <h3 class="pick-title">Choose a city in ${esc(p.name)}</h3>
      ${group("Cities", all.filter((c) => c.kind === "City"))}
      ${group("Counties with listings", all.filter((c) => c.kind === "County"))}
      ${group("Special cities nearby", all.filter((c) => c.kind !== "City" && c.kind !== "County"))}
    </div>`;
}

// Step 3: a city shows its attractions, hotels, local food and restaurants.
function renderCity(p, city) {
  const first = TABS.find((t) => (p[t.key] || []).some((it) => inCity(it, city.name)));
  if (!TABS.some((t) => t.key === currentTab && (p[t.key] || []).some((it) => inCity(it, city.name)))) {
    currentTab = first ? first.key : "attractions";
  }
  const total = placesIn(p, city.name);
  detail.innerHTML = `
    <p class="crumbs"><a href="#${p.id}">← ${esc(p.name)}</a></p>
    <div class="detail-head city-head" style="--accent:${p.color}">
      <div class="detail-text">
        <h3>${esc(baseName(city.name))} <span>${esc(city.ko)}</span></h3>
        <p class="cities">${esc(city.kind)} · ${esc(p.name)}</p>
        ${total ? "" : `<p>We have not added places for ${esc(baseName(city.name))} yet. Try the map link below, or pick a nearby city.</p>
          <p><a class="map-link" href="https://map.naver.com/p/search/${encodeURIComponent(city.ko)}" target="_blank" rel="noopener">Search ${esc(baseName(city.name))} on Naver Map</a></p>`}
      </div>
    </div>
    <div class="tabs" role="tablist">
      ${TABS.map((t) => {
        const n = (p[t.key] || []).filter((it) => inCity(it, city.name)).length;
        return `
          <button role="tab" type="button" data-tab="${t.key}" aria-selected="${t.key === currentTab}">
            ${t.label} <small>${t.ko}</small> <span class="tab-count">${n}</span>
          </button>`;
      }).join("")}
    </div>
    <div class="tab-panel" role="tabpanel">${renderItems(p, city, currentTab)}</div>`;

  detail.querySelectorAll("[data-tab]").forEach((btn) =>
    btn.addEventListener("click", () => {
      currentTab = btn.dataset.tab;
      renderCity(p, city);
    })
  );
}

// The choice lives in the URL: #gangwon shows its cities, #gangwon/sokcho shows one city. Links can be shared.
function route() {
  const [provId, citySlug] = location.hash.slice(1).split("/");
  const province = PROVINCES.find((p) => p.id === provId);
  renderGrid(province?.id);
  if (!province) {
    detail.innerHTML = `<p class="hint">👆 Pick a province above, then a city, to see where to go, stay and eat.</p>`;
    return;
  }
  const city = citySlug && placesOf(province).find((c) => c.slug === citySlug);
  if (city) renderCity(province, city);
  else renderProvince(province);
  detail.scrollIntoView({ behavior: "smooth", block: "start" });
}

window.addEventListener("hashchange", () => {
  currentTab = "attractions";
  route();
});
route();
