import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StoryblokApiClient } from "../services/storyblok-api.js";
import { registerStoryTools } from "../tools/stories.js";
import { registerAssetTools } from "../tools/assets.js";
import { registerComponentTools } from "../tools/components.js";


export function createStoryblokServer(
    spaceId: string,
    accessToken: string,
    apiBase: string = "https://mapi.storyblok.com/v1",
) {
    const server = new McpServer(
        {
            name: "storyblok-content-creator",
            version: "1.0.4",
        },
        {
            capabilities: {
                resources: {},
                tools: {},
            },
        }
    );

    // Для CLI режима - получаем аргументы из командной строки
    const args = process.argv.slice(2);
    function getArgs(name: string): string | undefined {
        const index = args.indexOf(name);
        return index !== -1 ? args[index + 1] : undefined;
    }

    const finalSpaceId = spaceId || process.env.SPACE_ID || getArgs("--space-id") || "";
    const finalAccessToken = accessToken || process.env.ACCESS_TOKEN || getArgs("--access-token") || "";
    const finalApiBase = apiBase || process.env.API_BASE || "https://mapi.storyblok.com/v1";

    if (!finalSpaceId || !finalAccessToken) {
        throw new Error("Missing required credentials: spaceId and accessToken are required");
    }

    const apiClient = new StoryblokApiClient(finalSpaceId, finalAccessToken, finalApiBase);

    registerStoryTools(server, apiClient);
    registerAssetTools(server, apiClient);
    registerComponentTools(server, apiClient);
    
    return server;
}