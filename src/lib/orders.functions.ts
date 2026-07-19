import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";
import { ADMIN_EMAIL, sendEmail } from "@/lib/email";
import { assertSameOriginRequest, enforceRateLimit, escapeHtml } from "@/lib/security";

const itemSchema = z.object({
  product_id: z.string().uuid(),
  quantity: z.number().int().min(1).max(20),
  variant: z.enum(["hand", "foot"]).optional(),
}).strict();

const inputSchema = z.object({
  customer_name: z.string().trim().min(2).max(120),
  customer_email: z.string().trim().email().max(255),
  customer_phone: z.string().trim().max(50).optional().default(""),
  shipping_address: z.string().trim().min(4).max(500),
  shipping_city: z.string().trim().max(120).optional().default(""),
  shipping_country: z.string().trim().max(120).optional().default("Bulgaria"),
  notes: z.string().trim().max(1000).optional().default(""),
  items: z.array(itemSchema).min(1).max(50),
});

export type PlaceOrderInput = z.infer<typeof inputSchema>;

function serverSupabase() {
  return createClient<Database>(process.env.SUPABASE_URL!, process.env.SUPABASE_PUBLISHABLE_KEY!, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
  });
}

export const placeOrder = createServerFn({ method: "POST" })
  .inputValidator((data: PlaceOrderInput) => inputSchema.parse(data))
  .handler(async ({ data }): Promise<{ order_number: string }> => {
    assertSameOriginRequest();
    enforceRateLimit("order", 10, 10 * 60 * 1000);
    const supabase = serverSupabase();
    const { data: res, error } = await supabase.rpc("place_order", {
      _customer_name: data.customer_name,
      _customer_email: data.customer_email,
      _customer_phone: data.customer_phone || "",
      _shipping_address: data.shipping_address,
      _shipping_city: data.shipping_city || "",
      _shipping_country: data.shipping_country || "Bulgaria",
      _notes: data.notes || "",
      _items: data.items.map((i) => ({
        product_id: i.product_id,
        quantity: i.quantity,
        variant: i.variant ?? null,
      })),
    });
    if (error) {
      console.error("[orders] place_order failed", error);
      throw new Error("Unable to place the order right now.");
    }
    const row = Array.isArray(res) ? res[0] : res;
    if (!row?.order_number) throw new Error("Order could not be created.");

    // Notify the store admin that a new order came in. This must never block
    // or fail the checkout flow, so any email error is only logged.
    const items = Array.isArray(row.items) ? (row.items as Array<Record<string, unknown>>) : [];
    const itemsHtml = items
      .map((i) => {
        const name = escapeHtml(i.product_name ?? i.name ?? i.product_id ?? "Item");
        const qty = i.quantity ?? 1;
        const variant = i.variant ? ` (${escapeHtml(i.variant)})` : "";
        return `<li>${qty} × ${name}${variant}</li>`;
      })
      .join("");

    void sendEmail({
      to: ADMIN_EMAIL,
      subject: `New order ${row.order_number} — pinlove.studio`,
      replyTo: row.customer_email,
      html: `
        <h2>New order received</h2>
        <p><strong>Order number:</strong> ${escapeHtml(row.order_number)}</p>
        <p><strong>Customer:</strong> ${escapeHtml(row.customer_name)} (${escapeHtml(row.customer_email)})</p>
        <p><strong>Shipping address:</strong> ${escapeHtml(row.shipping_address)}, ${escapeHtml(row.shipping_city)}, ${escapeHtml(row.shipping_country)}</p>
        ${data.customer_phone ? `<p><strong>Phone:</strong> ${escapeHtml(data.customer_phone)}</p>` : ""}
        ${itemsHtml ? `<p><strong>Items:</strong></p><ul>${itemsHtml}</ul>` : ""}
        ${typeof row.subtotal_eur === "number" ? `<p><strong>Subtotal:</strong> €${row.subtotal_eur.toFixed(2)}</p>` : ""}
        ${data.notes ? `<p><strong>Notes:</strong> ${escapeHtml(data.notes)}</p>` : ""}
        <p style="color:#888;font-size:12px;">Log in to the admin dashboard to view full order details.</p>
      `,
    });

    // Confirm the order with the customer too, so they know it went through.
    void sendEmail({
      to: row.customer_email,
      subject: `Your pinlove.studio order ${row.order_number} is confirmed`,
      replyTo: ADMIN_EMAIL,
      html: `
        <h2>Thank you for your order, ${escapeHtml(row.customer_name)}!</h2>
        <p>We've received your order and will handcraft your piece especially for you. Here's a summary:</p>
        <p><strong>Order number:</strong> ${escapeHtml(row.order_number)}</p>
        ${itemsHtml ? `<p><strong>Items:</strong></p><ul>${itemsHtml}</ul>` : ""}
        ${typeof row.subtotal_eur === "number" ? `<p><strong>Subtotal:</strong> €${row.subtotal_eur.toFixed(2)}</p>` : ""}
        <p><strong>Shipping to:</strong> ${escapeHtml(row.shipping_address)}, ${escapeHtml(row.shipping_city)}, ${escapeHtml(row.shipping_country)}</p>
        <p>Payment is made upon delivery — you only pay once your package arrives and you're happy with it. We'll email you again within 24 hours to confirm delivery details.</p>
        <p style="color:#888;font-size:12px;">Questions? Just reply to this email or reach us at ${ADMIN_EMAIL}.</p>
        <hr style="border:none;border-top:1px solid #eee;margin:24px 0;" />
        <h3>Благодарим за поръчката, ${escapeHtml(row.customer_name)}!</h3>
        <p>Получихме поръчката ви и ще изработим изделието специално за вас.</p>
        <p><strong>Номер на поръчката:</strong> ${escapeHtml(row.order_number)}</p>
        <p>Плащането се извършва при доставка — плащате само когато пратката пристигне и сте доволни от нея. Ще се свържем с вас в рамките на 24 часа, за да потвърдим детайлите по доставката.</p>
      `,
    });

    return { order_number: row.order_number as string };
  });
