#!/usr/bin/env node
import "dotenv/config";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createStoryblokServer } from "./server/storyblok-server.js";

async function main() {
    const transport = new StdioServerTransport();

    const server = createStoryblokServer();

    await server.connect(transport);
    console.error("Storyblok content creator server is running");
}

main().catch(console.error);