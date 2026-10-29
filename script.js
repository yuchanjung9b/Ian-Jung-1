const TABS = [
  { key: "attractions", label: "Attractions", ko: "관광지" },
  { key: "restaurants", label: "Restaurants", ko: "맛집" },
  { key: "hotels", label: "Places to stay", ko: "숙소" },
  { key: "foods", label: "Local food", ko: "먹거리" },
];

// One script powers three pages, chosen by <body data-page="...">:
//   guide.html    provinces and special cities
//   province.html?p=gangwon             the cities of one province
//   city.html?p=gangwon&c=sokcho        one city's attractions, 맛집, places to stay and local food
// Special cities use p=special, e.g. city.html?p=special&c=seoul.
const page = document.body.dataset.page;
const view = document.getElementById("view");
const query = new URLSearchParams(location.search);
let currentTab = "attractions";

const rateEl = document.getElementById("rate");
if (rateEl) rateEl.textContent = KRW_PER_USD.toLocaleString();

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

// Items are tagged with a city (e.g. "Changwon (Jinhae)"). The part before any bracket is the city name.
const baseName = (name) => (name ?? "").replace(/ \(.*\)/, "");
const slug = (name) => baseName(name).toLowerCase().replace(/\s+/g, "-");
const inCity = (it, name) => baseName(it.city) === baseName(name);
const placesIn = (p, name) => TABS.reduce((n, t) => n + (p[t.key] || []).filter((it) => inCity(it, name)).length, 0);

// Cities and counties that belong to a province, in the order they are shown.
function placesOf(p) {
  const entry = PROVINCE_CITIES.find((c) => c.guide === p.id);
  if (!entry) return [];
  return [
    ...entry.cities.map(([name, ko]) => ({ name, ko, kind: "City" })),
    ...(entry.counties || []).map(([name, ko]) => ({ name, ko, kind: "County" })),
  ].map((c) => ({ ...c, slug: slug(c.name) }));
}

// Special cities (Seoul, Busan...) are their own section. Their places are stored under a nearby province in
// data.js, tagged with the special city's name, so gather them into one pseudo-province with the id "special".
// A tag with brackets, like "Gwangju (Gyeonggi)", is an ordinary city that shares the name, so it is skipped.
const SPECIAL_COLOR = "#c0392b";
const specialList = SPECIAL_CITIES.map((c) => ({ ...c, kind: c.type, slug: slug(c.name) }));
const specialProvince = {
  id: "special",
  name: "Special cities",
  color: SPECIAL_COLOR,
  ...Object.fromEntries(
    TABS.map((t) => [
      t.key,
      PROVINCES.flatMap((p) =>
        (p[t.key] || []).filter((it) => it.city === baseName(it.city) && SPECIAL_CITIES.some((c) => c.name === it.city))
      ),
    ])
  ),
};

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


const cityHref = (provId, c) => `city.html?p=${provId}&c=${c.slug}`;
const countText = (n) => (n ? `${n} place${n === 1 ? "" : "s"}` : "Coming soon");

// Page 1: guide.html lists the special cities and the provinces.
function renderGuide() {
  document.getElementById("special-grid").innerHTML = specialList
    .map(
      (c) => `
      <a class="province-card special-card" href="${cityHref("special", c)}" style="--accent:${SPECIAL_COLOR}">
        <span class="ko">${esc(c.ko)}</span>
        <span class="en">${esc(c.name)}</span>
        <span class="cities">${esc(c.type)} · ${countText(placesIn(specialProvince, c.name))}</span>
      </a>`
    )
    .join("");
  document.getElementById("province-grid").innerHTML = PROVINCES.map(
    (p) => `
      <a class="province-card" href="province.html?p=${p.id}" style="--accent:${p.color}">
        <span class="thumb">${photo(p.image || `images/${p.id}.svg`)}</span>
        <span class="ko">${esc(p.ko)}</span>
        <span class="en">${esc(p.name)}</span>
        <span class="cities">${esc(p.cities)}</span>
      </a>`
  ).join("");
}

function notFound(text) {
  view.innerHTML = `<p class="hint">${esc(text)} <a href="guide.html">Back to the guide</a></p>`;
}

// Page 2: province.html lists the cities of one province.
function renderProvince() {
  const p = PROVINCES.find((x) => x.id === query.get("p"));
  if (!p) return notFound("We could not find that province.");
  document.title = `${p.name} · Korea Travel Guide`;
  const all = placesOf(p);
  const group = (title, list) =>
    list.length
      ? `<h4 class="city-group-title">${title} <small>${list.length}</small></h4>
         <div class="city-cards">${list
           .map((c) => {
             const n = placesIn(p, c.name);
             return `<a class="city-card${n ? "" : " empty-city"}" href="${cityHref(p.id, c)}">
               <span class="name">${esc(baseName(c.name))}</span>
               <span class="ko">${esc(c.ko)}</span>
               <span class="count">${countText(n)}</span>
             </a>`;
           })
           .join("")}</div>`
      : "";
  view.innerHTML = `
    <p class="crumbs"><a href="guide.html">← All provinces</a></p>
    ${provinceHead(p)}
    <div class="city-panel" style="--accent:${p.color}">
      <h3 class="pick-title">Choose a city in ${esc(p.name)}</h3>
      ${group("Cities", all.filter((c) => c.kind === "City"))}
      ${group("Counties with listings", all.filter((c) => c.kind === "County"))}
    </div>`;
}

// Page 3: city.html shows a city's attractions, 맛집, places to stay and local food.
function renderCity() {
  const provId = query.get("p");
  const p = provId === "special" ? specialProvince : PROVINCES.find((x) => x.id === provId);
  const city = p && (provId === "special" ? specialList : placesOf(p)).find((c) => c.slug === query.get("c"));
  if (!city) return notFound("We could not find that city.");
  document.title = `${baseName(city.name)} · Korea Travel Guide`;

  const has = (key) => (p[key] || []).some((it) => inCity(it, city.name));
  if (!has(currentTab)) currentTab = TABS.find((t) => has(t.key))?.key ?? "attractions";
  const total = placesIn(p, city.name);
  const back = provId === "special" ? `<a href="guide.html">← All special cities</a>` : `<a href="province.html?p=${p.id}">← ${esc(p.name)}</a>`;
  const where = provId === "special" ? esc(city.kind) : `${esc(city.kind)} · ${esc(p.name)}`;

  view.innerHTML = `
    <p class="crumbs">${back}</p>
    <div class="detail-head city-head" style="--accent:${p.color}">
      <div class="detail-text">
        <h3>${esc(baseName(city.name))} <span>${esc(city.ko)}</span></h3>
        <p class="cities">${where}</p>
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

  view.querySelectorAll("[data-tab]").forEach((btn) =>
    btn.addEventListener("click", () => {
      currentTab = btn.dataset.tab;
      renderCity();
    })
  );
}

({ guide: renderGuide, province: renderProvince, city: renderCity })[page]();
