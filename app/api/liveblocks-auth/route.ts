import { auth, currentUser } from '@clerk/nextjs/server';
import { Liveblocks } from '@liveblocks/node';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '~/convex/_generated/api';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

const liveblocks = new Liveblocks({
  secret: 'sk_prod_qFeXNC_boUoZ3UBsVCblz8s1yZnyhjFgLEsnwJW5J2KWgIpl9xnZ9ol27blOK7aN',
});

export async function POST(req: Request) {
  const authorization = await auth();
  const user = await currentUser();

  if (!user || !authorization) {
    return new Response('Unauthorized', { status: 403 });
  }

  const { room } = await req.json();
  const board = await convex.query(api.board.get, { id: room });

  if (board?.orgId !== authorization.orgId) {
    return new Response('Unauthorized', { status: 403 });
  }

  const userInfo = {
    name: user.firstName || 'Team Member',
    picture: user.imageUrl,
  };

  const session = liveblocks.prepareSession(user.id, { userInfo });

  if (room) {
    session.allow(room, session.FULL_ACCESS);
  }

  const { status, body } = await session.authorize();
  return new Response(body, { status });
}
