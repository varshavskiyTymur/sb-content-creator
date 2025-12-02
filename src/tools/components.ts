import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { StoryblokApiClient } from "../services/storyblok-api.js";

export function registerComponentTools(server: McpServer, apiClient: StoryblokApiClient) {
    server.registerTool(
        'getComponents',
        {
            title: 'Get Components',
            description: 'Retrieve all component definitions from Storyblok',
            inputSchema: {},
            outputSchema: {
                components: z.array(z.any()),
                success: z.boolean()
            }
        },
        async () => {
            try {
                const result = await apiClient.getComponents();
                const output = { 
                    components: result.components || [], 
                    success: true 
                };
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
