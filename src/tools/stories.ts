import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { StoryblokApiClient } from "../services/storyblok-api.js";

// Схемы валидации для входных данных
const slugSchema = z.string()
    .min(1, "Slug cannot be empty")
    .regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens");

const nameSchema = z.string()
    .min(1, "Name cannot be empty")
    .max(255, "Name must be less than 255 characters");

export function registerStoryTools(server: McpServer, apiClient: StoryblokApiClient) {

    server.registerTool(
        'createStory',
        {
            title: 'Create Story',
            description: 'Create a new story in Storyblok',
            inputSchema: {
                name: nameSchema.describe('Story name (1-255 characters)'),
                slug: slugSchema.describe('Story slug (lowercase, alphanumeric with hyphens)'),
                content: z.record(z.any()).describe('Story content (must be an object)'),
                parent_id: z.number().positive().optional().describe('Parent story ID'),
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
                storyId: z.number().positive().describe('Story ID'),
                name: nameSchema.optional().describe('Story name (1-255 characters)'),
                slug: slugSchema.optional().describe('Story slug (lowercase, alphanumeric with hyphens)'),
                content: z.record(z.any()).optional().describe('Story content (must be an object)'),
                parent_id: z.number().positive().optional().describe('Parent story ID'),
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
            description: 'Delete a story from Storyblok',
            inputSchema: {
                storyId: z.number().positive().describe('Story ID to delete')
            },
            outputSchema: {
                success: z.boolean(),
                message: z.string()
            }
        },
        async ({ storyId }) => {
            try {
                await apiClient.deleteStory(storyId);
                const output = { 
                    success: true, 
                    message: `Story ${storyId} deleted successfully` 
                };
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
            description: 'Retrieve a single story by ID from Storyblok',
            inputSchema: {
                storyId: z.number().positive().describe('Story ID to retrieve')
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
                    content: [{ type: 'text', text: JSON.stringify(output, null, 2) }],
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
        'listStories',
        {
            title: 'List Stories',
            description: 'List all stories in Storyblok with optional filtering and pagination',
            inputSchema: {
                per_page: z.number().positive().max(100).optional().describe('Number of stories per page (1-100, default: 25)'),
                page: z.number().positive().optional().describe('Page number (default: 1)'),
                filter_query: z.string().optional().describe('Filter query string')
            },
            outputSchema: {
                stories: z.array(z.any()),
                success: z.boolean()
            }
        },
        async ({ per_page, page, filter_query }) => {
            try {
                const result = await apiClient.listStories({
                    per_page,
                    page,
                    filter_query
                });
                const output = { stories: result.stories || [], success: true };
                return {
                    content: [{ type: 'text', text: JSON.stringify(output, null, 2) }],
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
}