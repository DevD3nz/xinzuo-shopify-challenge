# Playwright UI tests — submission screenshots

Tagged tests capture **before/after PNGs** and an **annotated walkthrough** you can follow while recording Loom.

## Setup (one time)

```bash
npm install
npx playwright install chromium
```

Optional in `.env` if your dev store has a password page:

```env
STORE_PASSWORD=your-store-password
```

## Commands

| Command | What it does |
|---------|----------------|
| `npm run test:screenshots` | Runs `@before`, `@after`, `@walkthrough`; copies `before.png` / `after.png` to repo root |
| `npm run test:walkthrough` | Step screenshots + `tests/output/SCREENSHOT-GUIDE.md` only |
| `npm run test:ui` | All Playwright tests |
| `npm run test:screenshots:headed` | Same as above but visible browser |

Filter by tag manually:

```bash
npx playwright test --grep @after
npx playwright test --grep @walkthrough
```

## Output

- `tests/output/before.png` — simulated pre-fix state (default page template)
- `tests/output/after.png` — live store with 3 knives selected + summary bar
- `tests/output/01-homepage-cta.png` … `04-cart-drawer.png` — Loom storyboard
- `tests/output/SCREENSHOT-GUIDE.md` — narration script per step

## Loom tip

Run `npm run test:walkthrough`, open `SCREENSHOT-GUIDE.md`, and read each **Say this** line while screen-sharing the matching PNG or re-running headed mode.
