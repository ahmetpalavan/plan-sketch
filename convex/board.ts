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

export const update = mutation({
  args: {
    id: v.id('board'),
    title: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthorized');
    }

    const title = args.title.trim();

    if (!title) {
      throw new Error('Title is required');
    }

    if (title.length > 60) {
      throw new Error('Title is too long');
    }

    const board = ctx.db.patch(args.id, {
      title: args.title,
    });

    return board;
  },
});

export const favorite = mutation({
  args: {
    id: v.id('board'),
    orgId: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthorized');
    }
    const board = await ctx.db.get(args.id);
    if (!board) {
      throw new Error('Board not found');
    }

    const userId = identity.subject;

    const favorite = await ctx.db
      .query('userFavorites')
      .withIndex('by_user_board_org', (q) => q.eq('userId', userId).eq('boardId', board._id).eq('orgId', args.orgId))
      .unique();

    if (favorite) {
      throw new Error('Board already favorited');
    }

    await ctx.db.insert('userFavorites', {
      userId,
      boardId: board._id,
      orgId: args.orgId,
    });

    return board;
  },
});

export const unfavorite = mutation({
  args: {
    id: v.id('board'),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthorized');
    }
    const board = await ctx.db.get(args.id);

    if (!board) {
      throw new Error('Board not found');
    }

    const userId = identity.subject;

    const favorite = await ctx.db
      .query('userFavorites')
      .withIndex('by_user_board', (q) => q.eq('userId', userId).eq('boardId', board._id))
      .unique();

    if (!favorite) {
      throw new Error('Board not favorited');
    }

    await ctx.db.delete(favorite._id);

    return board;
  },
});
