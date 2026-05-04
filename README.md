# OSS — BJJ Training Log

> A web app for Brazilian Jiu-Jitsu practitioners to log, track, and review their training sessions.

## Author

**Reid Kuhl** — [github.com/ReidKuhl](https://github.com/ReidKuhl)

---

## User Story

- *As a* Brazilian Jiu-Jitsu practitioner,
- *I want* to log my training sessions, track competition results, and monitor my belt progress,
- *So that* I can stay accountable, measure improvement, and see how far I've come on the mat.

---

## Narrative

### What the app does
OSS is a BJJ Training Log that lets users sign in with a password, then log and review training sessions and competition results. The dashboard displays a belt progress tracker, session history, a stats overview, and a 90-day activity heatmap. Data persists in `localStorage` so entries survive page refreshes.

### Why I chose it
I train BJJ and wanted a cleaner way to track my sessions than a notes app. This project let me build something I'd actually use while applying everything from the semester — modules, fetch, sessionStorage, DOM manipulation, and clean CSS.

### What I built
- Password-protected login using `sessionStorage` for auth state
- Training log with add, edit, and delete for practice sessions
- Competition tracker with win/loss record
- Belt and stripe progress selector with visual belt segments
- Stats tab with session totals, hours, streaks, type breakdown, and 90-day heatmap
- Seed data loaded via the Fetch API from a local JSON file on first run
- All form entries packaged as JSON objects and logged to the console

### Development story
Started with the login screen and password flow, then built the tracker dashboard section by section — log tab first, then competitions, then stats. Refactored all inline event handlers into `addEventListener` calls and converted both scripts to ES modules. Added the footer, seed data fetch, and sessionStorage auth guard last.

---

## Attribution

- [Google Fonts](https://fonts.google.com/) — Bebas Neue, DM Mono, Crimson Pro
- AI assistance (Claude) used for debugging, refactoring inline handlers, and code review
- No external libraries, frameworks, or images used — custom CSS throughout

---

## Project Structure

```
zorbus-gorbus-final-project/
├── index.html
├── README.md
├── pages/
│   ├── password-screen.html
│   └── tracker.html
├── scripts/
│   ├── password.js
│   └── tracker.js
├── styles/
│   └── main.css
└── data/
    └── sessions.json
```

---

## Code Highlight

### sessionStorage Auth Guard (`tracker.js`)

```js
// tracker.js — runs on page load
// Reads the user's name from sessionStorage (set by password.js on login).
// If no session exists, the user is immediately redirected back to login.
// sessionStorage clears automatically when the browser tab is closed,
// so there's no persistent login — clean and simple without a backend.

const userName = sessionStorage.getItem('bjj-user') || null;
if (!userName) {
  window.location.href = 'password-screen.html';
}
document.getElementById('user-display-name').textContent = userName;
```

**What it does:** Checks for an active session and redirects unauthenticated users.  
**Why it matters:** Every visit to `tracker.html` runs this check — it's the security layer for the whole app without needing a server.  
**How it works:** `sessionStorage` is tab-scoped and auto-clears on tab close, so the "login" resets naturally each session.

---

### JSON Packaging + Console Log (`tracker.js`)

```js
// saveEntry — packages form inputs into a structured JSON object,
// logs it to the console, then saves it to localStorage.
const entry = {
  id: genId(), date,
  type:   document.getElementById('p-type').value,
  mins:   parseInt(document.getElementById('p-mins').value) || 60,
  school: document.getElementById('p-school').value.trim(),
  techs:  document.getElementById('p-techs').value.split(',').map(t => t.trim()).filter(Boolean),
  notes:  document.getElementById('p-notes').value.trim(),
  createdAt: now()
};
console.log('[OSS] New practice session (JSON):', JSON.stringify(entry, null, 2));
```

**What it does:** Collects all form fields into a single JSON object and logs it.  
**Why it matters:** Satisfies the rubric requirement to "package new form data in JSON format and print to console."  
**How it works:** Each field is read, trimmed, and typed correctly (strings, ints, arrays) before being stored.

---

## Validation

- ✅ [Nu HTML Validator — password-screen.html](https://validator.w3.org/nu/?doc=http%3A%2F%2F136.119.73.97%2Fpages%2Fpassword-screen.html)
- ✅ [Nu HTML Validator — tracker.html](https://validator.w3.org/nu/?doc=http%3A%2F%2F136.119.73.97%2Fpages%2Ftracker.html)
- ✅ [WAVE Accessibility Report — password-screen.html](https://wave.webaim.org/report#/http://136.119.73.97/pages/password-screen.html)

---

## Future Improvements

👉 [Sprint 99 Milestone](https://github.com/ReidKuhl/zorbus-gorbus-final-project/milestone/1)

Planned issues include:
- Add technique tag filtering and search on the log tab
- Export training log to CSV
- Dark mode toggle
- Mobile layout improvements for the stats tab
- Add a notes/journal tab for free-form writing between sessions

---

## Deployed App

- 🌐 **GitHub Pages:** [reidkuhl.github.io/zorbus-gorbus-final-project](https://reidkuhl.github.io/zorbus-gorbus-final-project)
- ☁️ **GCP:** [http://136.119.73.97/pages/password-screen.html](http://136.119.73.97/pages/password-screen.html)

> **Login hint (also printed to browser console on load):** password = `flobjj`
