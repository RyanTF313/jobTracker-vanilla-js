# Job Track

A kanban-style job application tracker built with vanilla JS ES modules and zero build tooling.

## Getting Started

The app uses ES modules, so it must be served over HTTP — opening `index.html` directly as a `file://` URL will not work.

```bash
# Option 1: VS Code Live Server extension (recommended)
# Right-click index.html → "Open with Live Server"

# Option 2: Python
python3 -m http.server 8080

# Option 3: Node
npx serve .
```

Then open `http://localhost:8080` (or whichever port your server uses).

## Architecture

| File | Responsibility |
|------|---------------|
| `js/index.js` | Entry point — bootstraps state, checks auth, hands off to UI |
| `js/state.js` | `State` class — owns the jobs array and auth instance, serializes to `localStorage` |
| `js/utils.js` | `Authentication` class — session management via `sessionStorage` |
| `js/ui.js` | All DOM manipulation — renders the board, wires login/logout events |
| `index.html` | Shell — uses native `<dialog>` for login modal, table-based kanban layout |

### Data flow

```
index.js
  └── State.loadState()        ← deserializes from localStorage
  └── auth.isLoggedInUser()    ← checks sessionStorage for active session
  └── handleInitialLoad()      ← shows board or login modal accordingly
        └── renderBoard()      ← maps jobs[] to table rows by status column
```

### Persistence

- **Jobs** are stored in `localStorage` under the key `jobTrackerState` as a JSON-serialized `State` object. They persist across browser sessions.
- **Auth** uses `sessionStorage` (`isLoggedIn`, `currentUser`). Sessions expire when the tab/browser closes — by design, since there's no backend.

## Kanban Columns

Jobs map to columns via their `status` field:

| Status | Column |
|--------|--------|
| `wishlist` | Wishlist |
| `applied` | Applied |
| `interviewing` | Interviewing |
| `offer` | Offer |
| `rejected` | Rejected |

## Project Structure

```
jobTracker-vanilla-js/
├── index.html
├── styles.css
└── js/
    ├── index.js   # entry point
    ├── state.js   # State class
    ├── ui.js      # DOM / rendering
    └── utils.js   # Authentication class
```

## Notes

- Authentication is intentionally faux — any username logs you in. There is no password validation or backend.
- No dependencies, no bundler, no transpilation step. Modern browser required (ES module support, native `<dialog>`).
