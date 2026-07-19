import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";
import { ADMIN_EMAIL, sendEmail } from "@/lib/email";
import { assertSameOriginRequest, enforceRateLimit, escapeHtml } from "@/lib/security";

const inputSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(255),
  message: z.string().trim().min(1).max(2000),
}).strict();

export type SubmitContactMessageInput = z.infer<typeof inputSchema>;

function serverSupabase() {
  return createClient<Database>(process.env.SUPABASE_URL!, process.env.SUPABASE_PUBLISHABLE_KEY!, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
  });
}

export const submitContactMessage = createServerFn({ method: "POST" })
  .inputValidator((data: SubmitContactMessageInput) => inputSchema.parse(data))
  .handler(async ({ data }): Promise<{ success: true }> => {
    assertSameOriginRequest();
    enforceRateLimit("contact", 5, 10 * 60 * 1000);
    const supabase = serverSupabase();

    const { error } = await supabase
      .from("contact_messages" as never)
      .insert({ name: data.name, email: data.email, message: data.message } as never);
    if (error) {
      console.error("[contact] failed to store message", error);
      throw new Error("Unable to submit your message right now.");
    }

    // Forward the message to the admin inbox. Never let an email hiccup
    // fail the form submission — the message is already saved above.
    void sendEmail({
      to: ADMIN_EMAIL,
      subject: `New contact form message from ${data.name}`,
      replyTo: data.email,
      html: `
        <h2>New message from the pinlove.studio contact form</h2>
        <p><strong>Name:</strong> ${escapeHtml(data.name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
        <p><strong>Message:</strong></p>
        <p>${escapeHtml(data.message).replace(/\n/g, "<br/>")}</p>
        <p style="color:#888;font-size:12px;">Reply directly to this email to respond to ${escapeHtml(data.name)}.</p>
      `,
    });

    return { success: true };
  });
