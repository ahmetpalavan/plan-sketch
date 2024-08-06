import { getAllOrThrow } from 'convex-helpers/server/relationships';
import { v } from 'convex/values';
import { query } from './_generated/server';
export const get = query({
  args: {
    orgId: v.string(),
    search: v.optional(v.string()),
    favorites: v.optional(v.string()),
  },
  handler: async (ctx, args_0) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthorized');
    }

    if (args_0.favorites) {
      const favorites = await ctx.db
        .query('userFavorites')
        .withIndex('by_user_org', (q) => q.eq('userId', identity.subject))
        .order('desc')
        .collect();

      const ids = favorites.map((favorite) => favorite.boardId);

      const boards = await getAllOrThrow(ctx.db, ids);

      return boards.map((board) => {
        return {
          ...board,
          isFavorite: true,
        };
      });
    }

    const title = args_0.search as string;
    let boards = [];

    if (title) {
      boards = await ctx.db
        .query('board')
        .withSearchIndex('by_title', (q) => q.search('title', title).eq('orgId', args_0.orgId))
        .collect();
    } else {
      boards = await ctx.db
        .query('board')
        .withIndex('by_org', (q) => q.eq('orgId', args_0.orgId))
        .order('desc')
        .collect();
    }

    const boardsWithFavorites = boards.map(async (board) => {
      const isFavorite = await ctx.db
        .query('userFavorites')
        .withIndex('by_user_board_org', (q) => q.eq('userId', identity.subject).eq('boardId', board._id))
        .unique()
        .then((favorite) => {
          return {
            ...board,
            isFavorite: !!favorite,
          };
        });

      return isFavorite;
    });

    const boardsWithFavoriteBoolean = await Promise.all(boardsWithFavorites);

    return boardsWithFavoriteBoolean;
  },
});
