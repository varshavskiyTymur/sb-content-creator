import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StoryblokApiClient } from "../services/storyblok-api.js";
import { registerStoryTools } from "@tools/stories.js";
import { registerComponentTools } from "@tools/components.js";

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

    // Валидация переменных окружения
    const spaceId = process.env.STORYBLOK_SPACE_ID;
    const accessToken = process.env.STORYBLOK_ACCESS_TOKEN;

    if (!spaceId) {
        throw new Error("STORYBLOK_SPACE_ID environment variable is required");
    }

    if (!accessToken) {
        throw new Error("STORYBLOK_ACCESS_TOKEN environment variable is required");
    }

    const apiClient = new StoryblokApiClient(spaceId, accessToken);

    // Регистрируем инструменты
    registerStoryTools(server, apiClient);
    registerComponentTools(server, apiClient);
    
    return server;
}