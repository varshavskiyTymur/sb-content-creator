import{ McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StoryblokApiClient } from "../services/storyblok-api.js";
import { registerStoryTools } from "../tools/stories.js";
import { registerAssetTools } from "../tools/assets.js";
import { registerComponentTools } from "../tools/components.js";


export function createStoryblokServer() {
    console.error("Creating McpServer instance...");
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
    console.error("McpServer instance created");

    const args = process.argv.slice(2);
    function getArgs(name: string): string | undefined {
        const index = args.indexOf(name);
        return index !== -1 ? args[index + 1] : undefined;
    }

    const spaceId = getArgs("--space-id");
    const accessToken = getArgs("--access-token");

    if(!spaceId) {
        throw new Error("Space ID is required");
    }

    if(!accessToken) {
        throw new Error("Access token is required");
    }

    const apiBase = "https://mapi.storyblok.com/v1"; 

    console.error(`Parsed args - spaceId: ${spaceId ? 'present' : 'missing'}, accessToken: ${accessToken ? 'present' : 'missing'}, apiBase: ${apiBase}`);

    if (!spaceId || !accessToken || !apiBase) {
        const error = `Missing required arguments: spaceId=${!!spaceId}, accessToken=${!!accessToken}, apiBase=${!!apiBase}`;
        console.error(error);
        throw new Error(error);
    }

    console.error("Creating StoryblokApiClient...");
    const apiClient = new StoryblokApiClient(spaceId, accessToken, apiBase);
    console.error("StoryblokApiClient created");

    try {
        console.error("Registering story tools...");
        registerStoryTools(server, apiClient);
        console.error("Story tools registered");
        
        console.error("Registering asset tools...");
        registerAssetTools(server, apiClient);
        console.error("Asset tools registered");
        
        console.error("All tools registered successfully");
    } catch (error) {
        console.error("Error registering tools:", error);
        throw error;
    }

    
    return server;
}