// Shared header and footer, so every page has the same menu. Loaded first thing inside <body>.
(function () {
  const PROVINCE_LINKS = [
    ["Gyeonggi-do", "gyeonggi"], ["Gangwon", "gangwon"], ["Chungcheongbuk-do", "chungbuk"],
    ["Chungcheongnam-do", "chungnam"], ["Jeonbuk", "jeonbuk"], ["Jeollanam-do", "jeonnam"],
    ["Gyeongsangbuk-do", "gyeongbuk"], ["Gyeongsangnam-do", "gyeongnam"], ["Jeju-do", "jeju"],
  ];
  const SPECIAL_LINKS = ["Seoul", "Busan", "Daegu", "Incheon", "Gwangju", "Daejeon", "Ulsan", "Sejong"];

  const MENU = [
    {
      label: "Plan Your Trip",
      groups: [
        { title: "Trip planner", links: [["Get trip recommendations", "plan.html"], ["Suggested itineraries", "index.html#itineraries"]] },
        { title: "About Korea", links: [["Korea at a glance", "index.html#about"], ["Provinces and cities", "hanbando.html"], ["Map of cities", "hanbando.html#map"]] },
        { title: "Travel basics", links: [["Money and prices", "index.html#about"], ["Getting around", "index.html#about"]] },
      ],
    },
    {
      label: "Where to Go",
      groups: [
        { title: "Destinations", links: [["All provinces", "guide.html"], ["Special cities", "guide.html#special"], ["한반도 overview", "hanbando.html"]] },
        { title: "Provinces", links: PROVINCE_LINKS.map(([n, id]) => [n, `province.html?p=${id}`]) },
        { title: "Special cities", links: SPECIAL_LINKS.map((n) => [n, `city.html?p=special&c=${n.toLowerCase()}`]) },
      ],
    },
    {
      label: "Things to Do",
      groups: [
        {
          title: "Browse by type",
          links: [
            ["Attractions 관광지", "search.html?type=attractions"],
            ["Restaurants 맛집", "search.html?type=restaurants"],
            ["Places to stay 숙소", "search.html?type=hotels"],
            ["Local food 먹거리", "search.html?type=foods"],
          ],
        },
        {
          title: "Browse by theme",
          links: [
            ["UNESCO World Heritage", "search.html?q=UNESCO"], ["Temples", "search.html?q=temple"],
            ["Traditional markets", "search.html?q=market"], ["Beaches and islands", "search.html?q=beach"],
            ["Mountains and hiking", "search.html?q=mountain"], ["Festivals", "search.html?q=festival"],
          ],
        },
      ],
    },
  ];

  const file = location.pathname.split("/").pop() || "index.html";
  const link = ([text, href]) => `<li><a href="${href}">${text}</a></li>`;

  const header = `
  <a class="skip" href="#main">Skip to content</a>
  <header class="site-header">
    <div class="wrap bar">
      <a class="brand" href="index.html"><span class="mark" aria-hidden="true">K</span><span>Korea Travel Guide <small>한국 여행 가이드</small></span></a>
      <button type="button" class="menu-toggle" aria-expanded="false" aria-controls="site-menu">Menu</button>
      <nav id="site-menu" class="site-menu" aria-label="Main">
        <ul>
          ${MENU.map(
            (m, i) => `
          <li class="has-sub">
            <button type="button" class="top" aria-expanded="false" aria-controls="mega-${i}">${m.label}</button>
            <div class="mega" id="mega-${i}">
              ${m.groups.map((g) => `<div class="col"><h3>${g.title}</h3><ul>${g.links.map(link).join("")}</ul></div>`).join("")}
            </div>
          </li>`
          ).join("")}
        </ul>
        <div class="tools">
          <a class="search-link" href="search.html">Search</a>
          <a class="cta" href="plan.html">Make a plan</a>
        </div>
      </nav>
    </div>
  </header>`;

  const footer = `
  <footer class="site-footer">
    <div class="wrap">
      <div class="foot-grid">
        <div>
          <h3>Explore</h3>
          <ul>${[["Provinces", "guide.html"], ["Special cities", "guide.html#special"], ["한반도 overview", "hanbando.html"], ["Search places", "search.html"]].map(link).join("")}</ul>
        </div>
        <div>
          <h3>Plan</h3>
          <ul>${[["Trip planner", "plan.html"], ["Suggested itineraries", "index.html#itineraries"], ["Korea at a glance", "index.html#about"]].map(link).join("")}</ul>
        </div>
        <div>
          <h3>Helpful resources</h3>
          <ul>
            <li><a href="https://english.visitkorea.or.kr/" target="_blank" rel="noopener">Official Korea tourism site (VisitKorea)</a></li>
            <li><a href="https://www.letskorail.com/" target="_blank" rel="noopener">Korail (KTX trains)</a></li>
            <li><a href="https://map.naver.com/" target="_blank" rel="noopener">Naver Map</a></li>
            <li>Korea Travel Helpline: dial 1330</li>
          </ul>
        </div>
        <div>
          <h3>About this site</h3>
          <p>An independent trip-planning guide. Prices are rough estimates in Korean won and change often, so check before you go.</p>
        </div>
      </div>
      <p class="copy">Korea Travel Guide · 한국 여행 가이드</p>
    </div>
  </footer>`;

  document.body.insertAdjacentHTML("afterbegin", header);
  const addFooter = () => document.body.insertAdjacentHTML("beforeend", footer);
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", addFooter);
  else addFooter();

  // Mark the current page in the menu.
  document.querySelectorAll(".site-menu .mega a").forEach((a) => {
    if (a.getAttribute("href").split(/[?#]/)[0] === file && !a.getAttribute("href").includes("#") && !a.getAttribute("href").includes("?")) {
      a.setAttribute("aria-current", "page");
    }
  });

  // Dropdowns open on hover (CSS) and on click or Enter, so keyboard and touch users can use them too.
  const bar = document.querySelector(".site-header");
  const menu = document.getElementById("site-menu");
  const toggle = bar.querySelector(".menu-toggle");
  const tops = [...bar.querySelectorAll("button.top")];
  const closeAll = () => tops.forEach((b) => { b.setAttribute("aria-expanded", "false"); b.parentElement.classList.remove("open"); });
  tops.forEach((b) =>
    b.addEventListener("click", () => {
      const open = b.getAttribute("aria-expanded") !== "true";
      closeAll();
      b.setAttribute("aria-expanded", String(open));
      b.parentElement.classList.toggle("open", open);
    })
  );
  toggle.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") !== "true";
    toggle.setAttribute("aria-expanded", String(open));
    menu.classList.toggle("show", open);
  });
  document.addEventListener("click", (e) => { if (!bar.contains(e.target)) closeAll(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeAll(); });
})();
