import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { StoryblokApiClient } from "../services/storyblok-api.js";

export function registerStoryTools(server: McpServer, apiClient: StoryblokApiClient) {

    server.registerTool(
        'createStory',
        {
            title: 'Create Story',
            description: 'Create a new story in Storyblok',
            inputSchema: {
                name: z.string().describe('Story name'),
                slug: z.string().describe('Story slug'),
                content: z.any().describe('Story content'),
                parent_id: z.number().optional().describe('Parent story ID'),
                publish: z.boolean().optional().describe('Publish immediately')
            },
            outputSchema: {
                story: z.any(),
                success: z.boolean()
            }
        },
        async ({ name, slug, content, parent_id, publish }) => {
            try {
                const result = await apiClient.createStory({
                    name,
                    slug,
                    content,
                    parent_id,
                    publish: publish ?? false
                });
                const output = { story: result, success: true };
                return {
                    content: [{ type: 'text', text: JSON.stringify(output) }],
                    structuredContent: output
                };
            } catch (error) {
                return {
                    content: [{ type: 'text', text: `Error: ${error}` }],
                    isError: true
                };
            }
        }
    );

    server.registerTool(
        'updateStory', 
        {
            title: 'Update Story',
            description: 'Update an existing story in Storyblok',
            inputSchema: {
                storyId: z.number().describe('Story ID'),
                name: z.string().optional().describe('Story name'),
                slug: z.string().optional().describe('Story slug'),
                content: z.any().optional().describe('Story content'),
                parent_id: z.number().optional().describe('Parent story ID'),
                publish: z.boolean().optional().describe('Publish immediately')
            },
            outputSchema: {
                story: z.any(),
                success: z.boolean()
            }
        },
        async ({ storyId, name, slug, content, parent_id, publish }) => {
            try {
                const result = await apiClient.updateStory(storyId, {
                    name,
                    slug,
                    content,
                    parent_id,
                    publish: publish ?? false
                });
                const output = { story: result, success: true };
                return {
                    content: [{ type: 'text', text: JSON.stringify(output) }],
                    structuredContent: output
                };
            } catch (error) {
                return {
                    content: [{ type: 'text', text: `Error: ${error}` }],
                    isError: true
                };
            }
        }
    );

    // server.registerTool('deleteStory', ...)
    // server.registerTool('getStory', ...)
    // server.registerTool('listStories', ...)
}