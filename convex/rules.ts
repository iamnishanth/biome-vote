import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get all rules with vote counts and user votes
export const getAllRules = query({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id("rules"),
      _creationTime: v.number(),
      name: v.string(),
      description: v.string(),
      category: v.string(),
      url: v.string(),
      isRecommended: v.boolean(),
      upVotes: v.number(),
      downVotes: v.number(),
      totalScore: v.number(),
      userVotes: v.array(
        v.object({
          userId: v.string(),
          voteType: v.union(v.literal("up"), v.literal("down")),
        })
      ),
    })
  ),
  handler: async (ctx) => {
    // Get all rules
    const rules = await ctx.db.query("rules").collect();

    // Get votes for all rules
    const rulesWithVotes = await Promise.all(
      rules.map(async (rule) => {
        const votes = await ctx.db
          .query("votes")
          .withIndex("by_rule", (q) => q.eq("ruleId", rule._id))
          .collect();

        const upVotes = votes.filter((v) => v.voteType === "up").length;
        const downVotes = votes.filter((v) => v.voteType === "down").length;
        const totalScore = upVotes - downVotes;

        const userVotes = votes.map((vote) => ({
          userId: vote.userId,
          voteType: vote.voteType,
        }));

        return {
          ...rule,
          upVotes,
          downVotes,
          totalScore,
          userVotes,
        };
      })
    );

    return rulesWithVotes;
  },
});

// Get unique categories
export const getCategories = query({
  args: {},
  returns: v.array(v.string()),
  handler: async (ctx) => {
    const rules = await ctx.db.query("rules").collect();
    const categories = [...new Set(rules.map((rule) => rule.category))];
    return categories.sort();
  },
});

// Vote on a rule
export const voteOnRule = mutation({
  args: {
    ruleId: v.id("rules"),
    userId: v.string(),
    voteType: v.union(v.literal("up"), v.literal("down")),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    // Check if user has already voted on this rule
    const existingVote = await ctx.db
      .query("votes")
      .withIndex("by_rule_and_user", (q) =>
        q.eq("ruleId", args.ruleId).eq("userId", args.userId)
      )
      .unique();

    if (existingVote) {
      // Update existing vote
      await ctx.db.patch(existingVote._id, {
        voteType: args.voteType,
      });
    } else {
      // Create new vote
      await ctx.db.insert("votes", {
        ruleId: args.ruleId,
        userId: args.userId,
        voteType: args.voteType,
      });
    }

    return null;
  },
});

// Remove vote from a rule
export const removeVote = mutation({
  args: {
    ruleId: v.id("rules"),
    userId: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const existingVote = await ctx.db
      .query("votes")
      .withIndex("by_rule_and_user", (q) =>
        q.eq("ruleId", args.ruleId).eq("userId", args.userId)
      )
      .unique();

    if (existingVote) {
      await ctx.db.delete(existingVote._id);
    }

    return null;
  },
});
