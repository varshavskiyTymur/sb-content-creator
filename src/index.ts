import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { createStoryblokServer } from "./server/storyblok-server.js";
import 'tsconfig-paths/register';


async function main() {
    const transport = new StdioServerTransport();

    const server = createStoryblokServer();

    await server.connect(transport);
    console.error("Storyblok content creator server is running");
}

main().catch(console.error);