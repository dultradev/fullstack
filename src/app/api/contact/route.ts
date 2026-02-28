import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";
import { isValidLocale } from "@/lib/i18n";

const schema = z.object({
  locale: z.string().refine((value) => isValidLocale(value), "Invalid locale"),
  name: z.string().min(2).max(120),
  email: z.string().email().max(200),
  message: z.string().min(10).max(2000)
});

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Invalid payload" }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL ?? "rian.albert.dultra@gmail.com";
  const from = process.env.CONTACT_FROM_EMAIL ?? "Portfolio <onboarding@resend.dev>";

  if (!apiKey) {
    return NextResponse.json({ ok: false, error: "Email provider is not configured" }, { status: 500 });
  }

  try {
    const resend = new Resend(apiKey);
    const { locale, name, email, message } = parsed.data;

    await resend.emails.send({
      from,
      to,
      replyTo: email,
      subject: `[Portfolio ${locale}] ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nLocale: ${locale}\n\n${message}`
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "Email provider failed" }, { status: 500 });
  }
}
