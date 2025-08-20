export const dynamic = 'force-dynamic';

import { prismaClient } from '@/lib/prisma';
import { Resend } from 'resend';

type ConfirmPageProps = {
  searchParams?: { token?: string };
};

export default async function ConfirmPage({ searchParams }: ConfirmPageProps) {
  const token = searchParams?.token;

  const render = (success: boolean, text: string) => (
    <main className="min-h-screen grid place-items-center p-4">
      <div className="w-full max-w-sm rounded-xl border border-gray-200 bg-white p-6 shadow-sm text-center">
        <h1 className="text-xl font-semibold mb-2">Subscription Confirmation</h1>
        <p className={"text-sm " + (success ? 'text-green-700' : 'text-red-700')}>{text}</p>
      </div>
    </main>
  );

  if (!token) return render(false, 'Missing confirmation token.');

  const subscriber = await prismaClient.subscriber.findUnique({
    where: { confirmationToken: token },
  });
  if (!subscriber) return render(false, 'Invalid or expired token.');

  await prismaClient.subscriber.update({
    where: { id: subscriber.id },
    data: { status: 'CONFIRMED', confirmationToken: null },
  });

  const resend = new Resend(process.env.RESEND_API_KEY);
  const { error: audienceError } = await resend.contacts.create({
    audienceId: '46c0a6cc-5018-42b3-9859-5596562fe462',
    email: subscriber.email,
    unsubscribed: false,
  });
  if (audienceError) console.error('Failed to add subscriber to Resend audience.', audienceError);

  return render(true, 'Your subscription is confirmed. Thank you!');
}


