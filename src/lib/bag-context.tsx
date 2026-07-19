import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type BagVariant = "hand" | "foot";
export type BagItem = { slug: string; quantity: number; variant?: BagVariant };

type BagContextValue = {
  items: BagItem[];
  count: number;
  add: (slug: string, quantity?: number, variant?: BagVariant) => Promise<void>;
  remove: (slug: string, variant?: BagVariant) => Promise<void>;
  setQuantity: (slug: string, quantity: number, variant?: BagVariant) => Promise<void>;
  clear: () => Promise<void>;
};

// NOTE: The bag is intentionally local-only (browser storage), matching the
// current backend, which has no bag/cart table. Checkout goes straight
// through the `place_order` RPC (see supabase_export.sql), so the bag here
// just needs to track { slug, quantity, variant } tuples until the customer
// checks out. Actual prices always come from the database (or, at checkout,
// from the server-side RPC) — never from this local cache.
const STORAGE_KEY = "pinlove:bag:v2";
const BagContext = createContext<BagContextValue | null>(null);

function sameLine(a: BagItem, slug: string, variant?: BagVariant) {
  return a.slug === slug && (a.variant ?? undefined) === (variant ?? undefined);
}

function readLocal(): BagItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as BagItem[];
    return Array.isArray(parsed) ? parsed.filter((i) => i && i.slug && i.quantity > 0) : [];
  } catch {
    return [];
  }
}

function writeLocal(items: BagItem[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    /* ignore */
  }
}

export function BagProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<BagItem[]>([]);

  useEffect(() => {
    setItems(readLocal());
  }, []);

  const persist = useCallback(async (next: BagItem[]) => {
    setItems(next);
    writeLocal(next);
  }, []);

  const add = useCallback<BagContextValue["add"]>(
    async (slug, quantity = 1, variant) => {
      const existing = items.find((i) => sameLine(i, slug, variant));
      const newQty = (existing?.quantity ?? 0) + quantity;
      const next = existing
        ? items.map((i) => (sameLine(i, slug, variant) ? { ...i, quantity: newQty } : i))
        : [...items, { slug, quantity: newQty, variant }];
      await persist(next);
    },
    [items, persist],
  );

  const remove = useCallback<BagContextValue["remove"]>(
    async (slug, variant) => {
      const next = items.filter((i) => !sameLine(i, slug, variant));
      await persist(next);
    },
    [items, persist],
  );

  const setQuantity = useCallback<BagContextValue["setQuantity"]>(
    async (slug, quantity, variant) => {
      if (quantity <= 0) return remove(slug, variant);
      const next = items.map((i) => (sameLine(i, slug, variant) ? { ...i, quantity } : i));
      await persist(next);
    },
    [items, persist, remove],
  );

  const clear = useCallback<BagContextValue["clear"]>(async () => {
    await persist([]);
  }, [persist]);

  const value = useMemo<BagContextValue>(() => {
    const count = items.reduce((s, i) => s + i.quantity, 0);
    return { items, count, add, remove, setQuantity, clear };
  }, [items, add, remove, setQuantity, clear]);

  return <BagContext.Provider value={value}>{children}</BagContext.Provider>;
}

export function useBag() {
  const ctx = useContext(BagContext);
  if (!ctx) throw new Error("useBag must be used within BagProvider");
  return ctx;
}
