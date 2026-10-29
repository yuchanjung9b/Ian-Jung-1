// Login gate. Loaded in <head> on every page. Visitors who are not signed in are sent to login.html.
// Uses Firebase Authentication (Google, or email + password). Does nothing until firebase-config.js is filled in.
(function () {
  const cfg = window.FIREBASE_CONFIG;
  const onLogin = location.pathname.endsWith("/login.html");
  if (!cfg || !cfg.apiKey) return;

  // Hide the page until we know who is visiting, so nothing flashes before the redirect.
  const hide = document.createElement("style");
  hide.textContent = "html.auth-wait body{visibility:hidden}";
  document.head.appendChild(hide);
  document.documentElement.classList.add("auth-wait");

  const V = "10.12.2";
  const base = `https://www.gstatic.com/firebasejs/${V}/`;
  const ready = Promise.all([import(base + "firebase-app.js"), import(base + "firebase-auth.js")]).then(([app, a]) => {
    const auth = a.getAuth(app.initializeApp(cfg));
    return { a, auth };
  });

  const safeNext = () => {
    const n = new URLSearchParams(location.search).get("next") || "";
    return /^[\w.\-]+\.html([?#].*)?$/.test(n) ? n : "index.html";
  };

  window.Auth = {
    async google() { const { a, auth } = await ready; return a.signInWithPopup(auth, new a.GoogleAuthProvider()); },
    async signIn(e, p) { const { a, auth } = await ready; return a.signInWithEmailAndPassword(auth, e, p); },
    async signUp(e, p) { const { a, auth } = await ready; return a.createUserWithEmailAndPassword(auth, e, p); },
    async reset(e) { const { a, auth } = await ready; return a.sendPasswordResetEmail(auth, e); },
    async signOut() { const { a, auth } = await ready; await a.signOut(auth); location.href = "login.html"; },
  };

  // Show the signed-in name and a Sign out button in the header.
  function addUi(user) {
    const tools = document.querySelector(".site-header .tools");
    if (!tools || tools.querySelector(".signout")) return;
    const b = document.createElement("button");
    b.type = "button";
    b.className = "signout";
    b.textContent = "Sign out";
    b.title = user.email || "";
    b.addEventListener("click", () => window.Auth.signOut());
    tools.appendChild(b);
  }

  ready.then(({ a, auth }) => {
    a.onAuthStateChanged(auth, (user) => {
      if (onLogin) {
        if (user) location.replace(safeNext());
        else document.documentElement.classList.remove("auth-wait");
        return;
      }
      if (!user) {
        const here = location.pathname.split("/").pop() + location.search + location.hash;
        location.replace("login.html?next=" + encodeURIComponent(here));
        return;
      }
      document.documentElement.classList.remove("auth-wait");
      const go = () => addUi(user);
      if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", go);
      else go();
    });
  }).catch(() => {
    // Firebase could not load (offline or blocked): keep the page hidden rather than show it unprotected.
    if (!onLogin) location.replace("login.html");
    else document.documentElement.classList.remove("auth-wait");
  });
})();
