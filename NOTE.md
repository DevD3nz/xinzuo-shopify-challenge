## What I picked

The **Bundle Builder page** (`/pages/bundle-builder`) — a conversion feature linked from the homepage CTA ("BUILD A BUNDLE") that was completely dead after running the setup script.

## Why it's the highest-impact thing here

The theme already ships a full bundle-builder section (tabbed series picker, tiered discounts, sticky summary bar, add-to-cart). But the seeded page never used the `page.bundle-builder` template, so visitors saw only an empty title block. On dev stores, manual series collections are also empty, so even with the right template the grid would show "No products found." This breaks a high-intent funnel path and is called out explicitly in the README as intentional technical debt.

## What I did

1. **Seed wiring** — `seed.json` sets `template_suffix: "bundle-builder"`; the seed script passes it when creating pages.
2. **Product fallback** — `bundle-builder.liquid` falls back to the `all-products` smart collection filtered by `series:*` tags when manual collections are empty (dev-store reality). Added `series_tag` per tab block in `page.bundle-builder.json`.
3. **Cart UX** — `bundle-builder.js` refreshes cart-drawer sections before opening the drawer, so bundle adds show immediately.
4. **Accessibility** — Enter/Space keyboard selection on bundle cards.

## What I'd do next

- Seed script: assign `collects` for manual series collections so production parity doesn't rely on tag fallback.
- Create matching Shopify discount codes (`BUNDLE-10`, `BUNDLE-15`) in the dev store admin.
- Add focus management when the sticky summary bar appears; Lighthouse pass on homepage LCP.

## Screenshots

**before.png** — `/pages/bundle-builder` after setup: blank page with "Bundle Builder" heading only (default `page` template).

**after.png** — Same URL: tabbed product grid, 3+ knives selected, sticky summary bar with tier progress and enabled "Add Bundle to Cart" CTA; optionally cart drawer open after add.
