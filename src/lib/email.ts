// Server-side email sending helper.
// Uses Resend (https://resend.com) to send transactional emails.
//
// SETUP REQUIRED:
// 1. Create a free account at https://resend.com using pinlove.studio@outlook.com
//    (this lets you send to that address even before verifying a domain).
// 2. Create an API key in the Resend dashboard.
// 3. Add it to your deployment's environment/secrets as RESEND_API_KEY
//    (e.g. in .env for local dev, and as a secret in your hosting provider,
//    such as `wrangler secret put RESEND_API_KEY` for Cloudflare).
// 4. Once you verify your own domain in Resend, update FROM_EMAIL below to
//    something like "orders@pinlove.studio" for a more professional sender.

export const ADMIN_EMAIL = "pinlove.studio@outlook.com";
const FROM_EMAIL = "Pinlove Studio <orders@pinlove.org>";

export async function sendEmail(options: {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    // Don't crash the request if email isn't configured yet — just log it.
    console.warn("[email] RESEND_API_KEY is not set — skipping email send:", options.subject);
    return;
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [options.to],
        subject: options.subject,
        html: options.html,
        ...(options.replyTo ? { reply_to: options.replyTo } : {}),
      }),
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.error("[email] Resend API error:", res.status, body);
    }
  } catch (err) {
    console.error("[email] Failed to send email:", err);
  }
}
