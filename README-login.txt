LOGIN SETUP (Firebase Authentication, free tier)

1. https://console.firebase.google.com -> Add project.
2. Build -> Authentication -> Get started -> Sign-in method:
   enable "Google" and "Email/Password".
3. Authentication -> Settings -> Authorized domains: add
   yuchanjung9b.github.io (and your own domain later).
4. Project settings (gear) -> Your apps -> Web (</>) -> register app,
   copy the firebaseConfig values.
5. Paste them into firebase-config.js (window.FIREBASE_CONFIG = {...}), commit, push.

Until step 5 is done the login requirement is OFF.
Note: this is a static site, so the login is a front-door gate for visitors.
The page files themselves are public if someone requests them directly.
