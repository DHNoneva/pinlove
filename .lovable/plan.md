## Root cause

Confirmed by inspecting the generated route tree and running JS in the live preview at `/shop/moonlit-balance`:

- `src/routeTree.gen.ts` registers `shop.$slug` as a **child** of `/shop` (parent = `ShopRoute`).
- `src/routes/shop.tsx` renders the product-listing page and does NOT render `<Outlet />`.
- Result: navigating to `/shop/<slug>` matches both routes, but the parent renders its own body and never mounts the child. The page shows the Best Sellers grid (`h1 = "The most-loved handcrafted pieces."`) instead of the product detail.

Supabase data is fine — `moonlit-balance` and every other slug exists and `is_available = true`. The bug is purely file-based routing.

## Fix

Split `shop.tsx` into a layout + index leaf so the child route can mount:

1. **Create `src/routes/shop.index.tsx`** with the current listing code from `shop.tsx` (route path `/shop`, unchanged behavior).
2. **Rewrite `src/routes/shop.tsx`** to be a pathless layout: `head` for the section, `component: () => <Outlet />`. No loader, no page body.
3. Leave `src/routes/shop.$slug.tsx` alone — it will now correctly render inside the layout's outlet.

The TanStack Router Vite plugin regenerates `routeTree.gen.ts` automatically; no manual edit there.

## Verify after fix

- Hit `/shop/moonlit-balance` in the preview and confirm `h1` contains the product name and product images render.
- Click a card on `/shop`, `/home`, and the related-products strip to confirm each opens its own detail page.
- Click "Add to bag" and confirm the navbar counter increments (uses `useBag`, unaffected).

## Files touched

- `src/routes/shop.index.tsx` — new (moved from shop.tsx)
- `src/routes/shop.tsx` — rewritten to `<Outlet />` layout

No Supabase changes, no schema changes, no changes to `shop.$slug.tsx`, `bag.tsx`, `checkout.tsx`, or the cart context.
