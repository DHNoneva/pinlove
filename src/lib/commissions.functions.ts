import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";
import { ADMIN_EMAIL, sendEmail } from "@/lib/email";
import { assertSameOriginRequest, enforceRateLimit, escapeHtml } from "@/lib/security";

const inputSchema = z
  .object({
    name: z.string().trim().min(1).max(120),
    email: z.string().trim().email().max(255),
    phone: z.string().trim().max(50).optional().default(""),
    explanation: z.string().trim().min(1).max(2000),
  })
  .strict();

export type SubmitCommissionRequestInput = z.infer<typeof inputSchema>;

function serverSupabase() {
  return createClient<Database>(process.env.SUPABASE_URL!, process.env.SUPABASE_PUBLISHABLE_KEY!, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
  });
}

export const submitCommissionRequest = createServerFn({ method: "POST" })
  .inputValidator((data: SubmitCommissionRequestInput) => inputSchema.parse(data))
  .handler(async ({ data }): Promise<{ success: true }> => {
    assertSameOriginRequest();
    enforceRateLimit("commission", 5, 10 * 60 * 1000);
    const supabase = serverSupabase();

    const { error } = await supabase
      .from("custom_requests")
      .insert({
        full_name: data.name,
        email: data.email,
        phone: data.phone || null,
        description: data.explanation,
      });

    if (error) {
      console.error("[commissions] failed to store request", error);
      throw new Error("Unable to submit your request right now.");
    }

    // Notify the studio admin. Never let an email hiccup fail the submission —
    // the request is already saved above.
    void sendEmail({
      to: ADMIN_EMAIL,
      subject: `New "Craft Your Own" request from ${data.name}`,
      replyTo: data.email,
      html: `
        <h2>New commission request — pinlove.studio</h2>
        <p><strong>Name:</strong> ${escapeHtml(data.name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
        ${data.phone ? `<p><strong>Phone:</strong> ${escapeHtml(data.phone)}</p>` : ""}
        <p><strong>Concept:</strong></p>
        <p>${escapeHtml(data.explanation).replace(/\n/g, "<br/>")}</p>
        <p style="color:#888;font-size:12px;">Reply directly to this email to respond to ${escapeHtml(data.name)}, or open the admin dashboard to update the request status.</p>
      `,
    });

    // Confirm receipt with the customer too.
    void sendEmail({
      to: data.email,
      subject: "We received your commission request — pinlove.studio",
      replyTo: ADMIN_EMAIL,
      html: `
        <h2>Thank you, ${escapeHtml(data.name)}!</h2>
        <p>We've received your "Craft Your Own" request and our master jeweler will review your vision and reach out within 48 hours to confirm the design details.</p>
        <p style="color:#888;font-size:12px;">Questions in the meantime? Just reply to this email or reach us at ${ADMIN_EMAIL}.</p>
        <hr style="border:none;border-top:1px solid #eee;margin:24px 0;" />
        <h3>Благодарим ти, ${escapeHtml(data.name)}!</h3>
        <p>Получихме заявката ти за "Craft Your Own" и нашият майстор бижутер ще се свърже с теб в рамките на 48 часа, за да уточните дизайна.</p>
      `,
    });

    return { success: true };
  });
