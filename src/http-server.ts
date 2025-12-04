import express from "express";
import cors from "cors";
import { createStoryblokServer } from "./server/storyblok-server.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { randomUUID } from "crypto";


export function createHttpServer(port: number = 3000) {
    const app = express();

    app.use(cors());
    app.use(express.json());


    app.get("/health", (req, res) => {
        res.json({ status: "ok" });
    });

    // Единый endpoint для MCP (GET для SSE, POST для сообщений)
    const handleMcpRequest = async (req: express.Request, res: express.Response) => {
        const spaceId = process.env.SPACE_ID || '';
        const accessToken = process.env.ACCESS_TOKEN || '';
        const apiBase = process.env.API_BASE || 'https://mapi.storyblok.com/v1';

        const mcpServer = createStoryblokServer(spaceId, accessToken, apiBase);
        
        // Создаем транспорт с генератором session ID
        const transport = new StreamableHTTPServerTransport({
            sessionIdGenerator: () => randomUUID()
        });
        
        await mcpServer.connect(transport);
        
        // Передаем запрос транспорту (он сам разберется GET это или POST)
        await transport.handleRequest(req, res, req.body);
    };

    app.get('/mcp', handleMcpRequest);
    app.post('/mcp', handleMcpRequest);

    return app;
}