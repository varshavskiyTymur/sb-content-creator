import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StoryblokApiClient } from "../services/storyblok-api.js";
import { registerStoryTools } from "../tools/stories.js";
import { registerAssetTools } from "../tools/assets.js";
import { registerComponentTools } from "../tools/components.js";


export function createStoryblokServer() {
    console.log("Creating McpServer instance...");
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
    console.log("McpServer instance created");

    const args = process.argv.slice(2);
    function getArgs(name: string): string | undefined {
        const index = args.indexOf(name);
        return index !== -1 ? args[index + 1] : undefined;
    }

    const spaceId = getArgs("--space-id");
    const accessToken = getArgs("--access-token");
    const apiBase = "https://mapi.storyblok.com/v1"; 
    console.log(`Parsed args - spaceId: ${spaceId ? 'present' : 'missing'}, accessToken: ${accessToken ? 'present' : 'missing'}, apiBase: ${apiBase}`);

    if (!spaceId || !accessToken || !apiBase) {
        const error = `Missing required arguments: spaceId=${!!spaceId}, accessToken=${!!accessToken}, apiBase=${!!apiBase}`;
        console.error(error);
        throw new Error(error);
    }

    console.log("Creating StoryblokApiClient...");
    const apiClient = new StoryblokApiClient(spaceId, accessToken, apiBase);
    console.log("StoryblokApiClient created");

    try {
        console.log("Registering story tools...");
        registerStoryTools(server, apiClient);
        console.log("Story tools registered");
        
        console.log("Registering asset tools...");
        registerAssetTools(server, apiClient);
        console.log("Asset tools registered");

        console.log("Registering component tools...");
        registerComponentTools(server, apiClient);
        console.log("Component tools registered");
        
        console.log("All tools registered successfully");
    } catch (error) {
        console.error("Error registering tools:", error);
        throw error;
    }

    
    return server;
}