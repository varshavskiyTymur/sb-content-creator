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

    server.registerTool(
        'deleteStory',
        {
            title: 'Delete Story',
            description: 'Delete an existing story in Storyblok',
            inputSchema: {
                storyId: z.number().describe('Story ID')
            }
        },
        async ({ storyId }) => {
            try {
                const result = await apiClient.deleteStory(storyId);
                const output = { success: true };
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
        'getStory',
        {
            title: 'Get Story',
            description: 'Get an existing story from Storyblok',
            inputSchema: {
                storyId: z.number().describe('Story ID')
            },
            outputSchema: {
                story: z.any(),
                success: z.boolean()
            }
        },
        async ({ storyId }) => {
            try {
                const result = await apiClient.getStory(storyId);
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
    )
    

    server.registerTool(
        'listStories',
        {
            title: 'List Stories',
            description: 'List all stories in Storyblok',
            inputSchema: {
                per_page: z.number().optional().describe('Number of stories per page'),
                page: z.number().optional().describe('Page number'),
                filter_query: z.string().optional().describe('Filter query')
            },
            outputSchema: {
                stories: z.array(z.any()),
                success: z.boolean()
            }
        },
        async ({ per_page, page, filter_query }) => {
            try {
                const result = await apiClient.listStories({ per_page, page, filter_query });
                const output = { stories: result, success: true };
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
    )
}