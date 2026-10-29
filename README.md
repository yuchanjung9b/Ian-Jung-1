# Korea Travel Guide · 한국 여행 가이드

A bilingual (English/한국어) travel guide to South Korea with a trip planner that builds three itineraries to fit each traveler's age, budget, chosen places and transport.

**Live site:** https://yuchanjung9b.github.io/Ian-Jung-1/

<!-- Add a screenshot or GIF here: ![Home page](docs/home.png) -->

## Features

- **Trip planner** – enter travelers (with ages), budget, places and transport; get three itineraries with a cost breakdown and the assumptions behind it.
- **Browse by place** – all 9 provinces (도) and 8 major cities, each with attractions, restaurants, local food and hotels.
- **Search** – site-wide search with category and province filters; Korean and English terms both work (e.g. "맛집" or "restaurant").
- **Login** – Google or email sign-in through Firebase Authentication.
- **Responsive** – works on phone and desktop.

## Tech

Plain HTML, CSS and JavaScript with no framework or build step. Firebase Authentication for login. Deployed as a static site (GitHub Pages / Cloudflare Pages).

## How it's built

| File | Role |
| --- | --- |
| `data.js` | All places, prices and descriptions, as plain data. Add a place by copying one entry. |
| `plan.js` | Planner logic: builds itineraries and estimates costs from `data.js`. |
| `search.js` | Search over every place, with extra keywords per category. |
| `site.js` | Shared header, menu and footer injected into every page. |
| `auth.js` | Login gate (Firebase), with fallbacks when Firebase is slow or blocked. |

## Design decisions

- **Age-based pricing.** Traveler ages change prices using simple rules of thumb: child food portions, free or half-price sights, discounted transit and flights, and children under 7 sharing a bed. The rules are one-line functions at the top of `plan.js` and listed on the planner page, so estimates are transparent.
- **Data separate from code.** Content lives in `data.js`, so adding a city or fixing a price does not touch logic.
- **Graceful login failure.** The login never leaves a blank page if Firebase is slow or blocked, and works on hosts that hide `.html` from URLs without causing a redirect loop.

## Limitations

- Prices are rough estimates, not live data.
- The login is a front-door gate on a static site. The page files are still publicly reachable by direct URL, so it is not real access control. A backend or Firebase security rules would be needed for that.
- No automated tests yet.

## Run locally

```
python3 -m http.server 8000
```

Then open http://localhost:8000. To turn on login, see `README-login.txt`.

## Author

Ian Jung · yuchanjung9@gmail.com · https://github.com/yuchanjung9b
