import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StoryblokApiClient } from "@services/storyblok-api.js";
import { registerStoryTools } from "@tools/stories.js";


export function createStoryblokServer() {
    const server = new McpServer(
        {
            name: "storyblok-content-creator",
            version: "1.0.0",
        },
        {
            capabilities: {
                resources: {},
                tools: {},
            },
        }
    );

    const spaceId = process.env.STORYBLOK_SPACE_ID!;
    const accessToken = process.env.STORYBLOK_ACCESS_TOKEN!;
    const apiClient = new StoryblokApiClient(spaceId, accessToken);

    // Регистрируем инструменты
    registerStoryTools(server, apiClient);

    
    return server;
}