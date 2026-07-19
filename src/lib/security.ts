import { getRequest } from "@tanstack/react-start/server";

type RateLimitState = { count: number; resetAt: number };

const buckets = new Map<string, RateLimitState>();

function requestKey(): string {
  const request = getRequest();
  const forwarded = request?.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || request?.headers.get("x-real-ip") || "unknown";
}

export function assertSameOriginRequest(): void {
  const request = getRequest();
  if (!request) throw new Error("Request unavailable");

  if (request.headers.get("sec-fetch-site") === "cross-site") {
    throw new Error("Request origin rejected");
  }

  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (origin && host) {
    try {
      if (new URL(origin).host !== host) throw new Error("Request origin rejected");
    } catch {
      throw new Error("Request origin rejected");
    }
  }
}

export function enforceRateLimit(name: string, limit: number, windowMs: number): void {
  const now = Date.now();
  const key = `${name}:${requestKey()}`;
  const current = buckets.get(key);

  if (!current || current.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return;
  }
  if (current.count >= limit) throw new Error("Too many requests. Please try again later.");
  current.count += 1;

  if (buckets.size > 10_000) {
    for (const [bucketKey, bucket] of buckets) {
      if (bucket.resetAt <= now) buckets.delete(bucketKey);
    }
  }
}

export function escapeHtml(value: unknown): string {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
