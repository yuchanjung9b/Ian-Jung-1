// Trip planner: builds three itineraries from PROVINCES (data.js) using each traveler's age, budget, places and transport.
// All costs are rough estimates. The assumptions are in the ASSUMPTIONS table below and shown on the page.

// Special cities have their places stored under a nearby province in data.js.
const SPECIAL_HOST = {
  Seoul: "gyeonggi", Incheon: "gyeonggi", Busan: "gyeongnam", Ulsan: "gyeongnam",
  Daegu: "gyeongbuk", Gwangju: "jeonnam", Daejeon: "chungnam", Sejong: "chungnam",
};

// Each traveler's age changes the pace, the picks and some prices. Rough rules of thumb:
//   food:    under 4 ×0.2, under 7 ×0.4, under 13 ×0.7
//   sights:  under 7 free, under 19 half price
//   transit: under 4 free, under 13 half price (trains and buses)
//   flights: under 2 ×0.1, under 12 ×0.75
//   beds:    children under 7 share a bed, so they do not add a room
const mean = (list) => list.reduce((a, b) => a + b, 0) / list.length;
const foodFactor = (a) => (a < 4 ? 0.2 : a < 7 ? 0.4 : a < 13 ? 0.7 : 1);
const sightFactor = (a) => (a < 7 ? 0 : a < 19 ? 0.5 : 1);
const transitFactor = (a) => (a < 4 ? 0 : a < 13 ? 0.5 : 1);
const flightFactor = (a) => (a < 2 ? 0.1 : a < 12 ? 0.75 : 1);
const bandOf = (a) => (a < 13 ? "child" : a < 30 ? "young" : a < 50 ? "adult" : a < 65 ? "mature" : "senior");

function profile(ages) {
  const share = { child: 0, young: 0, adult: 0, mature: 0, senior: 0 };
  ages.forEach((a) => (share[bandOf(a)] += 1 / ages.length));
  const youngest = Math.min(...ages);
  const oldest = Math.max(...ages);
  return {
    ages,
    share,
    youngest,
    oldest,
    hasSenior: oldest >= 65,
    hasYoungChild: youngest < 8,
    beds: Math.max(1, ages.filter((a) => a >= 7).length),
    food: mean(ages.map(foodFactor)),
    sights: mean(ages.map(sightFactor)),
    transit: mean(ages.map(transitFactor)),
    flight: mean(ages.map(flightFactor)),
    // Two stops a day when someone is 50+ or a young child is along, otherwise three.
    stops: oldest >= 50 || youngest < 8 ? 2 : 3,
  };
}

// Per-person assumptions in KRW. "car" figures are per vehicle (up to 4 people) and are split.
const ASSUMPTIONS = {
  breakfast: 8000,
  flight: 80000, // per person, one way, between Jeju and the mainland
  transport: {
    ktx: { label: "KTX train + subway", local: 10000, leg: 45000, extraStops: 0 },
    bus: { label: "Intercity bus + local bus", local: 8000, leg: 28000, extraStops: 0 },
    car: { label: "Rental car", localCar: 100000, legCar: 30000, extraStops: 1 },
    taxi: { label: "Taxi / private driver", localCar: 70000, legCar: 130000, extraStops: 0 },
    flight: { label: "Domestic flights + subway", local: 10000, leg: 80000, extraStops: 0 },
  },
};

// Typical economy round-trip fares per person to Seoul (Incheon), in KRW. Rough estimates, prices vary a lot by season.
const ORIGINS = {
  none: { label: "I am already in Korea", cost: 0 },
  asia: { label: "Asia (Japan, China, Southeast Asia)", cost: 500000 },
  oceania: { label: "Australia or New Zealand", cost: 1300000 },
  europe: { label: "Europe", cost: 1400000 },
  namerica: { label: "North America", cost: 1700000 },
};

const TIERS = ["Budget", "Mid-range", "Luxury"];
const ACTIVE = /hik|trail|mountain|beach|surf|cable|climb|island|cycl|night|K-pop|festival|mud|zip|neon|rail bike/i;
const HARD = /hik|trail|climb|mud|zip|steep|summit|paraglid|bungee/i;
const RELAX = /temple|palace|garden|tea|hanok|spa|museum|village|lake|forest|walk|scenic|heritage|UNESCO|fortress|tomb/i;
const NIGHT = /night|K-pop|neon|club|nightlife/i;
const FAMILY = /beach|island|cable|cave|park|village|festival|mud|waterfall|garden|market/i;

const form = document.getElementById("plan-form");
const results = document.getElementById("results");
const regionBox = document.getElementById("regions");
const specialBox = document.getElementById("special-places");
const subBox = document.getElementById("subcities");
const agesBox = document.getElementById("ages");
let seed = 1;

const baseName = (name) => (name ?? "").replace(/ \(.*\)/, "");
const chip = (type, name, value, label, checked = false) => `
    <label class="chip">
      <input type="${type}" name="${name}" value="${esc(value)}"${checked ? " checked" : ""} />
      <span>${label}</span>
    </label>`;

// Special cities first, then provinces. Ticking a province opens its list of cities to narrow the trip down.
specialBox.innerHTML = SPECIAL_CITIES.map((c) => chip("checkbox", "special", c.name, `${esc(c.name)} <small>${esc(c.ko)}</small>`)).join("");
regionBox.innerHTML = PROVINCES.map(
  (p, i) => chip("checkbox", "region", p.id, `${esc(p.name)} <small>${esc(p.ko)}</small>`, i === 0)
).join("");
subBox.innerHTML = PROVINCES.map((p) => {
  const entry = PROVINCE_CITIES.find((c) => c.guide === p.id);
  const list = entry ? [...entry.cities, ...(entry.counties || [])] : [];
  return `<div class="subcities" data-for="${p.id}" hidden style="--accent:${p.color}">
    <h4>Cities in ${esc(p.name)} <small>Optional. Leave all unticked to include the whole province.</small></h4>
    <div class="chips">${list.map(([en, ko]) => chip("checkbox", "city", `${p.id}|${baseName(en)}`, `${esc(baseName(en))} <small>${esc(ko)}</small>`)).join("")}</div>
  </div>`;
}).join("");

function syncSubcities() {
  const on = new Set([...regionBox.querySelectorAll("input:checked")].map((i) => i.value));
  subBox.querySelectorAll(".subcities").forEach((d) => (d.hidden = !on.has(d.dataset.for)));
}
regionBox.addEventListener("change", syncSubcities);
syncSubcities();

// One age box per traveler. Changing the number of travelers adds or removes boxes and keeps the ages already typed.
function syncAges() {
  const n = Math.min(10, Math.max(1, Number(form.elements.people.value) || 1));
  const old = [...agesBox.querySelectorAll("input")].map((i) => i.value);
  agesBox.innerHTML = Array.from({ length: n }, (_, i) => `
    <label>Traveler ${i + 1}
      <input type="number" name="age" min="0" max="110" value="${old[i] ?? (i === 0 ? 35 : 33)}" />
    </label>`).join("");
}
form.elements.people.addEventListener("input", syncAges);
syncAges();

function esc(text) {
  const div = document.createElement("div");
  div.textContent = text ?? "";
  return div.innerHTML;
}
const won = (n) => `₩${(Math.round(n / 1000) * 1000).toLocaleString()}`;
const usd = (n) => `$${Math.round(n / KRW_PER_USD).toLocaleString()}`;
const money = (n) => `${won(n)} <span class="usd">≈ ${usd(n)}</span>`;

// Seeded random numbers so "Show me different plans" gives a new but repeatable set.
function rng(s) {
  let a = s >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// "₩20,000–28,000 / serving" → average of the amounts. "Free" → 0.
function cost(price) {
  if (/^\s*free/i.test(price)) return 0;
  const nums = [...price.matchAll(/(\d{1,3}(?:,\d{3})+|\d+)/g)].map((m) => Number(m[1].replace(/,/g, ""))).filter((n) => n >= 500);
  if (nums.length === 0) return 0;
  const range = nums.slice(0, 2);
  const mid = range.reduce((a, b) => a + b, 0) / range.length;
  return /table|chicken|box/i.test(price) ? mid / 2 : mid;
}

// How well a place suits the whole group, weighting each age band by how many travelers are in it.
function ageScore(it, prof) {
  const t = `${it.name} ${it.desc}`;
  const act = ACTIVE.test(t), rel = RELAX.test(t), night = NIGHT.test(t), hard = HARD.test(t);
  const s = prof.share;
  let score =
    s.child * ((FAMILY.test(t) ? 2 : 0) - (night ? 2 : 0)) +
    s.young * ((act ? 2 : 0) + (night ? 1.5 : 0)) +
    s.adult * ((act ? 0.5 : 0) + (rel ? 0.5 : 0)) +
    s.mature * ((rel ? 1.5 : 0) - (hard ? 1 : 0)) +
    s.senior * (rel ? 2 : 0);
  if (hard && (prof.hasSenior || prof.hasYoungChild)) score -= 3; // one slow walker sets the pace for everyone
  return score;
}

const THEMES = [
  {
    key: "saver",
    name: "Smart Saver",
    blurb: "Free and low-cost sights, budget stays, local eats.",
    tier: "Budget",
    score: (it, prof) => -cost(it.price) / 15000 + ageScore(it, prof),
  },
  {
    key: "classic",
    name: "Classic Comfort",
    blurb: "Heritage sights and a comfortable mid-range hotel.",
    tier: "Mid-range",
    score: (it, prof) => (RELAX.test(`${it.name} ${it.desc}`) ? 1.5 : 0) + ageScore(it, prof),
  },
  {
    key: "treat",
    name: "Treat Yourself",
    blurb: "Headline experiences and the best hotel your budget allows.",
    tier: "Luxury",
    score: (it, prof) => cost(it.price) / 40000 + ageScore(it, prof),
  },
];

// Pick `count` items, best score first (with a little randomness), then group by city so days stay local.
// Places in the cities the traveler asked for (`prefer`) rank first, then the rest of the province fills any gaps.
const inPrefer = (it, prefer) => prefer.length > 0 && prefer.includes(baseName(it.city));
function pick(list, count, score, rand, freeBias, prefer = []) {
  const ranked = list
    .map((it) => ({ it, s: score(it) + rand() * 1.2 - (freeBias ? cost(it.price) / 8000 : 0) + (inPrefer(it, prefer) ? 8 : 0) }))
    .sort((a, b) => b.s - a.s)
    .slice(0, count)
    .map((x) => x.it);
  const order = [...new Set(ranked.map((i) => i.city || ""))];
  return ranked.sort((a, b) => order.indexOf(a.city || "") - order.indexOf(b.city || ""));
}

function nearTier(hotels, tier) {
  for (const t of [tier, ...TIERS.slice().sort((a, b) => Math.abs(TIERS.indexOf(a) - TIERS.indexOf(tier)) - Math.abs(TIERS.indexOf(b) - TIERS.indexOf(tier)))]) {
    const found = hotels.filter((h) => h.type === t);
    if (found.length) return found;
  }
  return hotels;
}

function build(theme, opts, tier, freeBias, rand) {
  const { prof, people, days, regions, mode } = opts;
  const tr = ASSUMPTIONS.transport[mode];
  const cars = Math.ceil(people / 4);
  const rooms = Math.ceil(prof.beds / 2);
  const perDayStops = Math.max(1, prof.stops + tr.extraStops);
  const slots = ["Morning", "Afternoon", "Evening", "Late afternoon"].slice(0, perDayStops);
  if (perDayStops === 4) slots.splice(2, 0, slots.pop());

  const base = Math.floor(days / regions.length);
  const extra = days % regions.length;
  const totals = { flights: ORIGINS[opts.origin].cost * prof.flight, lodging: 0, food: 0, sights: 0, transport: 0 };
  const segments = [];

  regions.forEach(({ prov, prefer }, idx) => {
    const segDays = base + (idx < extra ? 1 : 0);
    const nights = idx === regions.length - 1 ? Math.max(0, segDays - 1) : segDays;
    const attractions = pick(prov.attractions || [], segDays * perDayStops, (it) => theme.score(it, prof), rand, freeBias, prefer);
    const meals = pick([...(prov.restaurants || []), ...(prov.foods || [])], segDays * 2, (it) => ageScore(it, prof), rand, freeBias, prefer);
    const lunches = meals.filter((m) => (prov.restaurants || []).includes(m));
    const dinners = meals.filter((m) => !lunches.includes(m));
    // Hotels in the chosen cities if there are any, otherwise anywhere in the province.
    const localHotels = (prov.hotels || []).filter((h) => inPrefer(h, prefer));
    const hotel = nearTier(localHotels.length ? localHotels : prov.hotels || [], tier).sort(() => rand() - 0.5)[0];
    const label = prefer.length ? `${prov.name} · ${prefer.join(", ")}` : prov.name;
    const nearby = prefer.length && attractions.some((it) => !inPrefer(it, prefer));
    const where = prefer.length ? prefer.join(", ") : prov.cities.split(" · ").join(", ");

    const dayList = [];
    for (let d = 0; d < segDays; d++) {
      const stops = slots.map((time, i) => {
        const item = attractions[d * perDayStops + i];
        if (item) {
          totals.sights += cost(item.price) * prof.sights;
          return { time, kind: "sight", item, price: cost(item.price) };
        }
        return { time, kind: "free", text: `Free time: wander ${where} at your own pace.` };
      });
      const lunch = lunches[d] || dinners[d + segDays] || null;
      const dinner = dinners[d] || lunches[d + segDays] || null;
      const lp = lunch ? cost(lunch.price) : 10000;
      const dp = dinner ? cost(dinner.price) : 10000;
      totals.food += (ASSUMPTIONS.breakfast + lp + dp) * prof.food;
      dayList.push({
        stops,
        lunch: lunch ? { item: lunch, price: lp } : { text: "Local café or street food", price: lp },
        dinner: dinner ? { item: dinner, price: dp } : { text: "Local restaurant of your choice", price: dp },
      });
    }
    if (hotel) totals.lodging += (nights * rooms * cost(hotel.price)) / people;
    totals.transport += segDays * (tr.local !== undefined ? tr.local * prof.transit : (tr.localCar * cars) / people);
    segments.push({ prov, label, nearby, hotel, nights, days: dayList });
  });

  // Travel between regions, starting and ending in Seoul (Gyeonggi).
  const route = ["gyeonggi", ...regions.map((r) => r.prov.id), "gyeonggi"];
  let legs = 0;
  for (let i = 1; i < route.length; i++) {
    if (route[i] === route[i - 1]) continue;
    legs++;
    // Jeju is an island, so any leg to or from it is a flight whatever the transport choice.
    const flight = route[i] === "jeju" || route[i - 1] === "jeju";
    const byAir = flight || mode === "flight";
    totals.transport += byAir
      ? ASSUMPTIONS.flight * prof.flight
      : tr.leg !== undefined
        ? tr.leg * prof.transit
        : (tr.legCar * cars) / people;
  }

  const total = totals.flights + totals.lodging + totals.food + totals.sights + totals.transport;
  return { theme, tier, freeBias, segments, totals, total, legs };
}

function makePlan(theme, opts, planSeed) {
  const budgetKrw = opts.budget * KRW_PER_USD; // whole group
  const groupCost = (plan) => plan.total * opts.people;
  const tiers = TIERS.slice(0, TIERS.indexOf(theme.tier) + 1).reverse();
  let plan;
  for (const tier of tiers) {
    plan = build(theme, opts, tier, false, rng(planSeed));
    if (groupCost(plan) <= budgetKrw) return finish(plan, budgetKrw, opts.people);
  }
  plan = build(theme, opts, "Budget", true, rng(planSeed));
  return finish(plan, budgetKrw, opts.people);
}

function finish(plan, budgetKrw, people) {
  plan.budgetKrw = budgetKrw;
  plan.fits = plan.total * people <= budgetKrw;
  return plan;
}

function transportTips(opts) {
  const tips = {
    ktx: "Book KTX seats in the Korail app or at the station. A T-money card works on subways and buses everywhere.",
    bus: "Intercity buses are cheaper than KTX and go to smaller towns. Buy tickets at the terminal or on the Kobus site.",
    car: "Rental cars need an International Driving Permit. Use Naver Map or Kakao Map for navigation, and keep some cash or a Hi-Pass card for tolls.",
    flight: "Domestic flights (Gimpo, Gimhae, Jeju and other airports) are quick for long distances. Book early on Korean low-cost airlines and allow time for airport transfers.",
    taxi: "Use the Kakao T app to call taxis. Private drivers can be booked for a full day and are the easiest option for older travelers.",
  };
  return tips[opts.mode];
}
function ageTip(prof) {
  const ages = prof.ages.join(", ");
  let tip;
  if (prof.hasSenior) tip = "Two gentle stops a day and no steep hikes, since someone is 65 or older. Ask about senior discounts at ticket counters.";
  else if (prof.hasYoungChild) tip = "Two relaxed stops a day with kid-friendly picks like beaches, caves and cable cars. Children under 7 count as free at sights and share a bed.";
  else if (prof.oldest >= 50) tip = "Two main stops a day with a long lunch, so there is time to rest.";
  else if (prof.share.young > 0.5) tip = "Three stops a day, with evenings open for night markets, cafés and live music.";
  else tip = "A balanced pace with a mix of sightseeing and downtime.";
  const kids = prof.youngest < 13 ? " Kids' prices are estimated: children eat for less, pay about half at sights and trains, and fly cheaper." : "";
  return `Planned for ages ${ages}. ${tip}${kids}`;
}

function renderPlan(plan, opts, i) {
  const t = plan.totals;
  const rows = [
    ...(t.flights ? [["International flight", t.flights]] : []),
    ["Hotels", t.lodging],
    ["Food", t.food],
    ["Sights", t.sights],
    ["Transport", t.transport],
  ]
    .map(([k, v]) => `<tr><td>${k}</td><td>${money(v)}</td></tr>`)
    .join("");
  let dayNo = 0;
  const days = plan.segments
    .map((seg) => {
      const head = `<h4 class="seg-head" style="--accent:${seg.prov.color}">${esc(seg.label)} <span>${esc(seg.prov.ko)}</span></h4>
        ${seg.nearby ? `<p class="stay muted">We have few listings in your chosen cities, so some stops are nearby places in ${esc(seg.prov.name)}.</p>` : ""}
        <p class="stay">${
          seg.hotel
            ? `🛏️ Stay: <strong>${esc(seg.hotel.name)}</strong> <span class="badge badge-${esc(seg.hotel.type.toLowerCase())}">${esc(seg.hotel.type)}</span> · ${esc(seg.hotel.price)}/night, ${seg.nights} night${seg.nights === 1 ? "" : "s"}`
            : "No hotel needed for this stop."
        }</p>`;
      const body = seg.days
        .map((day) => {
          dayNo++;
          const stops = day.stops
            .map((s) =>
              s.kind === "sight"
                ? `<li><b>${s.time}</b> ${esc(s.item.name)} <small>${esc(s.item.ko)}</small> <em>${esc(s.item.price)}</em></li>`
                : `<li><b>${s.time}</b> <span class="muted">${esc(s.text)}</span></li>`
            )
            .join("");
          const meal = (label, m) =>
            `<li><b>${label}</b> ${m.item ? `${esc(m.item.name)} <small>${esc(m.item.ko)}</small> <em>${esc(m.item.price)}</em>` : `<span class="muted">${esc(m.text)}</span>`}</li>`;
          return `<div class="day"><h5>Day ${dayNo}</h5><ul>${stops}${meal("Lunch", day.lunch)}${meal("Dinner", day.dinner)}</ul></div>`;
        })
        .join("");
      return head + body;
    })
    .join("");
  const status = plan.fits
    ? `<span class="fit ok">Within budget · ${money(plan.budgetKrw - plan.total * opts.people)} to spare</span>`
    : `<span class="fit over">Over budget by ${money(plan.total * opts.people - plan.budgetKrw)}</span>`;
  return `
    <article class="plan">
      <header class="plan-head">
        <p class="plan-no">Plan ${i + 1}${plan.recommended ? ` <span class="pick">★ Recommended for you</span>` : ""}</p>
        <h3>${esc(plan.theme.name)}</h3>
        <p>${esc(plan.theme.blurb)}</p>
        <p class="plan-total">${money(plan.total)} <small>per person</small></p>
        <p>${status}</p>
        <p class="group">Group of ${opts.people}: ${money(plan.total * opts.people)}</p>
      </header>
      <table class="costs">${rows}</table>
      <div class="itinerary">${days}</div>
      ${plan.fits ? "" : `<p class="warn">This budget is tight for ${opts.days} days. Try fewer days, a cheaper transport option or a higher budget.</p>`}
    </article>`;
}

function generate() {
  const data = new FormData(form);
  const ages = data.getAll("age").map((a) => Math.min(110, Math.max(0, Math.round(Number(a)) || 0)));
  const opts = {
    ages,
    prof: profile(ages),
    people: ages.length,
    days: Math.min(14, Math.max(1, Number(data.get("days")) || 1)),
    budget: Math.max(100, Number(data.get("budget")) || 100),
    mode: data.get("mode"),
    origin: data.get("origin") in ORIGINS ? data.get("origin") : "none",
  };

  // Work out each stop: a province, plus the cities in it the traveler asked for (none = the whole province).
  const wanted = new Map(); // province id -> Set of city names
  const want = (id, city) => {
    if (!wanted.has(id)) wanted.set(id, new Set());
    if (city) wanted.get(id).add(city);
  };
  data.getAll("region").forEach((id) => want(id));
  data.getAll("city").forEach((v) => {
    const [id, city] = v.split("|");
    if (wanted.has(id)) want(id, city);
  });
  data.getAll("special").forEach((name) => want(SPECIAL_HOST[name], name));
  if (wanted.size === 0) {
    results.innerHTML = `<p class="warn">Pick at least one place to visit.</p>`;
    return;
  }
  let regions = PROVINCES.filter((pv) => wanted.has(pv.id)).map((prov) => ({ prov, prefer: [...wanted.get(prov.id)] }));
  let notice = "";
  if (regions.length > opts.days) {
    regions = regions.slice(0, opts.days);
    notice = `<p class="warn">You picked more places than days, so the plans cover the first ${opts.days}.</p>`;
  }
  opts.regions = regions;
  const plans = THEMES.map((theme, i) => makePlan(theme, opts, seed * 100 + i + 1));

  // Recommend the plan that stays within budget and uses it best; if none fits, the cheapest one.
  const fitting = plans.filter((x) => x.fits);
  const best = fitting.length
    ? fitting.reduce((a, b) => (b.total > a.total ? b : a))
    : plans.reduce((a, b) => (b.total < a.total ? b : a));
  best.recommended = true;
  plans.sort((a, b) => Number(!!b.recommended) - Number(!!a.recommended));
  const why = fitting.length
    ? `${best.theme.name} stays within your budget and makes the most of it.`
    : `Nothing fits this budget, so ${best.theme.name} is the closest. Try fewer days or a higher budget.`;
  results.innerHTML = `
    ${notice}
    <p class="tips">⭐ ${esc(why)}<br />${opts.origin !== "none" ? `🌏 Includes an estimated ${money(ORIGINS[opts.origin].cost)} per person for flights from ${esc(ORIGINS[opts.origin].label)}.<br />` : ""}${regions.some((r) => r.prov.id === "jeju") ? "✈️ Jeju is reached by plane, and that flight is counted in transport.<br />" : ""}🚆 ${esc(transportTips(opts))}<br />🧭 ${esc(ageTip(opts.prof))}</p>
    <div class="plan-grid">${plans.map((p, i) => renderPlan(p, opts, i)).join("")}</div>
    <p class="actions">
      <button type="button" id="again" class="button button-dark">Show me different plans</button>
      <button type="button" id="print" class="button button-dark">Print</button>
    </p>
    <p class="note">Estimates only. Hotels are priced per room (two people share), meals use the average listed price,
    and transport uses typical fares (${esc(ASSUMPTIONS.transport[opts.mode].label)}).
    ${opts.origin === "none" ? "International flights are not included." : "The international flight is an average fare and varies by season."}
    Exchange rate ₩${KRW_PER_USD.toLocaleString()} = $1. Check prices before you go.</p>`;
  document.getElementById("again").addEventListener("click", () => {
    seed++;
    generate();
  });
  document.getElementById("print").addEventListener("click", () => window.print());
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  seed = 1;
  generate();
  results.scrollIntoView({ behavior: "smooth", block: "start" });
});
