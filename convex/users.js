import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { query } from "./_generated/server";

export const createUser = mutation({
    args: {
        name: v.string(),
        email: v.string(),
        picture: v.string(),
        uid: v.string(),
    },
    handler: async (ctx, args) => {
        // Check if the user already exists
        const existingUser = await ctx.db
            .query("users")
            .filter((q) => q.eq(q.field("email"), args.email))
            .collect();

        if (existingUser.length > 0) {
            console.log("User already exists:", existingUser[0]);
            return { success: true, user: existingUser[0], isNew: false };
        }

        // Insert a new user
        const newUser = await ctx.db.insert("users", {
            name: args.name,
            email: args.email,
            picture: args.picture,
            uid: args.uid,
        });

        console.log("User created successfully:", newUser);
        return { success: true, user: newUser, isNew: true };
    },
});


export const getUser = query({
    args: {
      email: v.string(),
    },
    handler: async (ctx, args) => {
      const existingUser = await ctx.db
        .query("users")
        .filter((q) => q.eq(q.field("email"), args.email))
        .collect();
      return existingUser[0] || null; // Return null if no user is found
    },
  });
