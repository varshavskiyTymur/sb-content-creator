import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StoryblokApiClient } from "../services/storyblok-api.js";
import { registerStoryTools } from "../tools/stories.js";
import { registerAssetTools } from "../tools/assets.js";


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

    const args = process.argv.slice(2);
    function getArgs(name: string): string | undefined {
        const index = args.indexOf(name);
        return index !== -1 ? args[index + 1] : undefined;
    }

    const spaceId = getArgs("--space-id");
    const accessToken = getArgs("--access-token");
    const apiBase = "https://mapi.storyblok.com/v1"; // hardcoded for development process

    if (!spaceId || !accessToken || !apiBase) {
        throw new Error("Missing required arguments");
    }

    const apiClient = new StoryblokApiClient(spaceId, accessToken, apiBase);

    // Регистрируем инструменты
    registerStoryTools(server, apiClient);
    registerAssetTools(server, apiClient);

    
    return server;
}