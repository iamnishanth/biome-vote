import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  rules: defineTable({
    name: v.string(),
    description: v.string(),
    category: v.string(),
    url: v.string(),
    isRecommended: v.boolean(),
  })
    .index("by_category", ["category"])
    .index("by_name", ["name"])
    .index("by_recommended", ["isRecommended"]),

  votes: defineTable({
    ruleId: v.id("rules"),
    userId: v.string(), // User name (Nishanth, Shreeyansh, etc.)
    voteType: v.union(v.literal("up"), v.literal("down")),
  })
    .index("by_rule", ["ruleId"])
    .index("by_user", ["userId"])
    .index("by_rule_and_user", ["ruleId", "userId"]),
});
