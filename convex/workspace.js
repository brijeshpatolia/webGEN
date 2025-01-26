import { v } from "convex/values";
import { mutation, query } from "./_generated/server";



export const CreateWorkspace = mutation({
    args: {
        messages: v.any(),
        user: v.id("users"),
    },
    handler: async (ctx,args) => {
        const workspaceId = await ctx.db.insert('workspace', {
            messages: args.messages,
            user: args.user
        })
        console.log('Workspace created successfully:', workspaceId);
        return workspaceId;
    }
    
})



export const GetWorkspace = query({
    args: {
        workspaceId: v.id("workspace"), // Validate workspaceId as a Convex ID for the "workspace" table
    },
    handler: async (ctx, args) => {
        console.log("Fetching workspace with ID:", args.workspaceId);
        try {
            const result = await ctx.db.get(args.workspaceId);
            return result;
        } catch (error) {
            console.error("Error fetching workspace:", error);
            throw new Error('Failed to fetch workspace. Please check the workspace ID.');
        }
    },
});




export const UpdateMessages = mutation({
    args:{
        workspaceId: v.id("workspace"),
        messages: v.any(),
    },
    handler: async (ctx, args) => {
        console.log('Updating workspace messages with ID:', args.workspaceId);
        const result = await ctx.db.patch(args.workspaceId, {
            messages: args.messages

        })
        return result;
    }
})