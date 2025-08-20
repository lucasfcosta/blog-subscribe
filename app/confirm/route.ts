import { prismaClient } from '@/lib/prisma';

export async function GET(request: Request): Promise<Response> {
  try {
    const url = new URL(request.url);
    const token = url.searchParams.get('token');
    if (!token) {
      return new Response('Missing token', { status: 400 });
    }

    const subscriber = await prismaClient.subscriber.findUnique({
      where: { confirmationToken: token },
    });

    if (!subscriber) {
      return new Response('Invalid token', { status: 404 });
    }

    await prismaClient.subscriber.update({
      where: { id: subscriber.id },
      data: { status: 'CONFIRMED', confirmationToken: null },
    });

    return new Response('Subscription confirmed. Thank you!', {
      status: 200,
      headers: { 'content-type': 'text/plain; charset=utf-8' },
    });
  } catch {
    return new Response('Internal Server Error', { status: 500 });
  }
}


