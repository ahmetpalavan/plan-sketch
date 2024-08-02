import { v } from 'convex/values';
import { query } from './_generated/server';

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

    return boards;
  },
});
