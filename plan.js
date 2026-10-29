// Trip planner: builds three itineraries from PROVINCES (data.js) using age, budget, regions and transport.
// All costs are rough estimates. The assumptions are in the ASSUMPTIONS table below and shown on the page.

const AGES = {
  young: { label: "18–29", stops: 3 },
  adult: { label: "30–49", stops: 3 },
  mature: { label: "50–64", stops: 2 },
  senior: { label: "65+", stops: 2 },
};

// Per-person assumptions in KRW. "car" figures are per vehicle (up to 4 people) and are split.
const ASSUMPTIONS = {
  breakfast: 8000,
  flight: 80000, // per person, one way, between Jeju and the mainland
  transport: {
    ktx: { label: "KTX train + subway", local: 10000, leg: 45000, extraStops: 0 },
    bus: { label: "Intercity bus + local bus", local: 8000, leg: 28000, extraStops: 0 },
    car: { label: "Rental car", localCar: 100000, legCar: 30000, extraStops: 1 },
    taxi: { label: "Taxi / private driver", localCar: 70000, legCar: 130000, extraStops: 0 },
  },
};

const TIERS = ["Budget", "Mid-range", "Luxury"];
const ACTIVE = /hik|trail|mountain|beach|surf|cable|climb|island|cycl|night|K-pop|festival|mud|zip|neon|rail bike/i;
const HARD = /hik|trail|climb|mud|zip|steep|summit/i;
const RELAX = /temple|palace|garden|tea|hanok|spa|museum|village|lake|forest|walk|scenic|heritage|UNESCO|fortress|tomb/i;
const NIGHT = /night|K-pop|neon|club|nightlife/i;

const form = document.getElementById("plan-form");
const results = document.getElementById("results");
const regionBox = document.getElementById("regions");
let seed = 1;

regionBox.innerHTML = PROVINCES.map(
  (p, i) => `
    <label class="chip">
      <input type="checkbox" name="region" value="${p.id}"${i === 0 ? " checked" : ""} />
      <span>${esc(p.name)} <small>${esc(p.ko)}</small></span>
    </label>`
).join("");

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

function ageScore(it, age) {
  const t = `${it.name} ${it.desc}`;
  if (age === "young") return (ACTIVE.test(t) ? 2 : 0) + (NIGHT.test(t) ? 1.5 : 0);
  if (age === "adult") return (ACTIVE.test(t) ? 0.5 : 0) + (RELAX.test(t) ? 0.5 : 0);
  if (age === "mature") return (RELAX.test(t) ? 1.5 : 0) - (HARD.test(t) ? 1 : 0);
  return (RELAX.test(t) ? 2 : 0) - (HARD.test(t) ? 3 : 0);
}

const THEMES = [
  {
    key: "saver",
    name: "Smart Saver",
    blurb: "Free and low-cost sights, budget stays, local eats.",
    tier: "Budget",
    score: (it, age) => -cost(it.price) / 15000 + ageScore(it, age),
  },
  {
    key: "classic",
    name: "Classic Comfort",
    blurb: "Heritage sights and a comfortable mid-range hotel.",
    tier: "Mid-range",
    score: (it, age) => (RELAX.test(`${it.name} ${it.desc}`) ? 1.5 : 0) + ageScore(it, age),
  },
  {
    key: "treat",
    name: "Treat Yourself",
    blurb: "Headline experiences and the best hotel your budget allows.",
    tier: "Luxury",
    score: (it, age) => cost(it.price) / 40000 + ageScore(it, age),
  },
];

// Pick `count` items, best score first (with a little randomness), then group by city so days stay local.
function pick(list, count, score, rand, freeBias) {
  const ranked = list
    .map((it) => ({ it, s: score(it) + rand() * 1.2 - (freeBias ? cost(it.price) / 8000 : 0) }))
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
  const { age, people, days, regions, mode } = opts;
  const tr = ASSUMPTIONS.transport[mode];
  const cars = Math.ceil(people / 4);
  const rooms = Math.ceil(people / 2);
  const perDayStops = Math.max(1, AGES[age].stops + tr.extraStops);
  const slots = ["Morning", "Afternoon", "Evening", "Late afternoon"].slice(0, perDayStops);
  if (perDayStops === 4) slots.splice(2, 0, slots.pop());

  const base = Math.floor(days / regions.length);
  const extra = days % regions.length;
  const totals = { lodging: 0, food: 0, sights: 0, transport: 0 };
  const segments = [];

  regions.forEach((prov, idx) => {
    const segDays = base + (idx < extra ? 1 : 0);
    const nights = idx === regions.length - 1 ? Math.max(0, segDays - 1) : segDays;
    const attractions = pick(prov.attractions || [], segDays * perDayStops, (it) => theme.score(it, age), rand, freeBias);
    const meals = pick([...(prov.restaurants || []), ...(prov.foods || [])], segDays * 2, (it) => ageScore(it, age), rand, freeBias);
    const lunches = meals.filter((m) => (prov.restaurants || []).includes(m));
    const dinners = meals.filter((m) => !lunches.includes(m));
    const hotel = nearTier(prov.hotels || [], tier).sort(() => rand() - 0.5)[0];

    const dayList = [];
    for (let d = 0; d < segDays; d++) {
      const stops = slots.map((time, i) => {
        const item = attractions[d * perDayStops + i];
        if (item) {
          totals.sights += cost(item.price);
          return { time, kind: "sight", item, price: cost(item.price) };
        }
        return { time, kind: "free", text: `Free time: wander ${prov.cities.split(" · ").join(", ")} at your own pace.` };
      });
      const lunch = lunches[d] || dinners[d + segDays] || null;
      const dinner = dinners[d] || lunches[d + segDays] || null;
      const lp = lunch ? cost(lunch.price) : 10000;
      const dp = dinner ? cost(dinner.price) : 10000;
      totals.food += ASSUMPTIONS.breakfast + lp + dp;
      dayList.push({
        stops,
        lunch: lunch ? { item: lunch, price: lp } : { text: "Local café or street food", price: lp },
        dinner: dinner ? { item: dinner, price: dp } : { text: "Local restaurant of your choice", price: dp },
      });
    }
    if (hotel) totals.lodging += (nights * rooms * cost(hotel.price)) / people;
    totals.transport += segDays * (tr.local ?? (tr.localCar * cars) / people);
    segments.push({ prov, hotel, nights, days: dayList });
  });

  // Travel between regions, starting and ending in Seoul (Gyeonggi).
  const route = ["gyeonggi", ...regions.map((r) => r.id), "gyeonggi"];
  let legs = 0;
  for (let i = 1; i < route.length; i++) {
    if (route[i] === route[i - 1]) continue;
    legs++;
    // Jeju is an island, so any leg to or from it is a flight whatever the transport choice.
    const flight = route[i] === "jeju" || route[i - 1] === "jeju";
    totals.transport += flight ? ASSUMPTIONS.flight : tr.leg ?? (tr.legCar * cars) / people;
  }

  const total = totals.lodging + totals.food + totals.sights + totals.transport;
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
    taxi: "Use the Kakao T app to call taxis. Private drivers can be booked for a full day and are the easiest option for older travelers.",
  };
  return tips[opts.mode];
}
function ageTip(age) {
  return {
    young: "Evenings are free for night markets, cafés and live music, so we kept them open.",
    adult: "A balanced pace with a mix of sightseeing and downtime.",
    mature: "Two main stops a day with a long lunch, so there is time to rest.",
    senior: "Two gentle stops a day, avoiding steep hikes. Ask about senior discounts at ticket counters.",
  }[age];
}

function renderPlan(plan, opts, i) {
  const t = plan.totals;
  const rows = [
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
      const head = `<h4 class="seg-head" style="--accent:${seg.prov.color}">${esc(seg.prov.name)} <span>${esc(seg.prov.ko)}</span></h4>
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
        <p class="plan-no">Plan ${i + 1}</p>
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
  const regionIds = data.getAll("region");
  if (regionIds.length === 0) {
    results.innerHTML = `<p class="warn">Pick at least one region.</p>`;
    return;
  }
  const opts = {
    age: data.get("age"),
    people: Math.min(10, Math.max(1, Number(data.get("people")) || 1)),
    days: Math.min(14, Math.max(1, Number(data.get("days")) || 1)),
    budget: Math.max(100, Number(data.get("budget")) || 100),
    mode: data.get("mode"),
  };
  let regions = regionIds.map((id) => PROVINCES.find((p) => p.id === id));
  let notice = "";
  if (regions.length > opts.days) {
    regions = regions.slice(0, opts.days);
    notice = `<p class="warn">You picked more regions than days, so the plans cover the first ${opts.days}.</p>`;
  }
  opts.regions = regions;
  const plans = THEMES.map((theme, i) => makePlan(theme, opts, seed * 100 + i + 1));
  results.innerHTML = `
    ${notice}
    <p class="tips">${regions.some((r) => r.id === "jeju") ? "✈️ Jeju is reached by plane. Flights are counted in transport here. " : ""}🚆 ${esc(transportTips(opts))}<br />🧭 ${esc(ageTip(opts.age))}</p>
    <div class="plan-grid">${plans.map((p, i) => renderPlan(p, opts, i)).join("")}</div>
    <p class="actions">
      <button type="button" id="again" class="button button-dark">Show me different plans</button>
      <button type="button" id="print" class="button button-dark">Print</button>
    </p>
    <p class="note">Estimates only. Hotels are priced per room (two people share), meals use the average listed price,
    and transport uses typical fares (${esc(ASSUMPTIONS.transport[opts.mode].label)}). Flights are not included.
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
