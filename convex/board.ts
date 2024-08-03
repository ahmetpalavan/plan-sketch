import { v } from 'convex/values';
import { mutation } from './_generated/server';

const images = [
  'https://picsum.photos/200/300',
  'https://picsum.photos/200/',
  'https://picsum.photos/200/100',
  'https://picsum.photos/200/600',
  'https://picsum.photos/200/400',
  'https://picsum.photos/200/500',
  'https://picsum.photos/200/200',
  'https://picsum.photos/200/700',
  'https://picsum.photos/200/800',
];

export const create = mutation({
  args: {
    orgId: v.string(),
    title: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error('Unauthorized');
    }

    const randomImage = images[Math.floor(Math.random() * images.length)];
    const board = ctx.db.insert('board', {
      authorId: identity.subject,
      authorName: identity.name!,
      imageUrl: randomImage,
      orgId: args.orgId,
      title: args.title,
    });

    return board;
  },
});

export const remove = mutation({
  args: {
    id: v.id('board'),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthorized');
    }
    await ctx.db.delete(args.id);
  },
});
