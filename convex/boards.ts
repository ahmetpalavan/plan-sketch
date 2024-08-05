import { v } from 'convex/values';
import { query } from './_generated/server';
import { favorite } from './board';

export const get = query({
  args: {
    orgId: v.string(),
  },
  handler: async (ctx, args_0) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthorized');
    }
    const boards = ctx.db
      .query('board')
      .withIndex('by_org', (q) => q.eq('orgId', args_0.orgId))
      .order('desc')
      .collect();

    const boardsWithFavorites = (await boards).map(async (board) => {
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
