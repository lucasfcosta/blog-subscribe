import { Resend } from 'resend';
import { prismaClient } from '@/lib/prisma';
import crypto from 'node:crypto';

export async function POST(request: Request): Promise<Response> {
  try {
    const body = await request.json().catch(() => null);
    const email: string | undefined = body?.email;
    if (!email || typeof email !== 'string') {
      return new Response('Invalid email', { status: 400 });
    }

    const token = crypto.randomUUID();

    const subscriber = await prismaClient.subscriber.upsert({
      where: { email },
      create: { email, status: 'PENDING', confirmationToken: token },
      update: { status: 'PENDING', confirmationToken: token },
    });

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
    const confirmUrl = `${baseUrl}/confirm?token=${encodeURIComponent(subscriber.confirmationToken!)}`;

    const resend = new Resend(process.env.RESEND_API_KEY);
    const { error: sendError } = await resend.emails.send({
      from: 'Lucas da Costa <newsletter@updates.lucasfcosta.com>',
      to: email,
      subject: 'Confirm your subscription',
      html: `Please confirm your subscription: <a href="${confirmUrl}">${confirmUrl}</a>`
    });

    if (sendError) {
      return new Response('Failed to send confirmation email', { status: 502 });
    }

    return new Response('Subscribed. Check your email to confirm.', {
      status: 200,
      headers: { 'content-type': 'text/plain; charset=utf-8' },
    });
  } catch (error) {
    return new Response('Internal Server Error', { status: 500 });
  }
}


