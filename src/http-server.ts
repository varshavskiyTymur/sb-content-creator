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

    // Информация о настройке
    app.get("/", (req, res) => {
        res.json({
            name: "Storyblok MCP Server",
            version: "1.0.4",
            description: "MCP server for Storyblok CMS integration",
            setup: {
                instructions: "Pass your Storyblok credentials via HTTP headers",
                headers: {
                    "X-Space-Id": "Your Storyblok Space ID (required)",
                    "X-Access-Token": "Your Storyblok Management API token (required)"
                },
                endpoint: "/mcp"
            },
            links: {
                documentation: "https://github.com/varshavskiyTymur/sb-content-creator",
                storyblok_tokens: "https://app.storyblok.com/ → Settings → Access Tokens"
            }
        });
    });

    // Единый endpoint для MCP (GET для SSE, POST для сообщений)
    const handleMcpRequest = async (req: express.Request, res: express.Response) => {
        // Получаем credentials из HTTP заголовков (приоритет) или env variables (fallback)
        const spaceId = (req.headers['x-space-id'] as string) || process.env.SPACE_ID || '';
        const accessToken = (req.headers['x-access-token'] as string) || process.env.ACCESS_TOKEN || '';
        const apiBase = (req.headers['x-api-base'] as string) || process.env.API_BASE || 'https://mapi.storyblok.com/v1';

        // Проверяем наличие обязательных credentials
        if (!spaceId || !accessToken) {
            res.status(401).json({
                error: "Missing credentials",
                message: "Please provide X-Space-Id and X-Access-Token headers",
                setup: {
                    headers: {
                        "X-Space-Id": "Your Storyblok Space ID",
                        "X-Access-Token": "Your Storyblok Management API token"
                    },
                    howToGet: "Go to https://app.storyblok.com/ → Settings → Access Tokens"
                }
            });
            return;
        }

        try {
            const mcpServer = createStoryblokServer(spaceId, accessToken, apiBase);
            
            // Создаем транспорт с генератором session ID
            const transport = new StreamableHTTPServerTransport({
                sessionIdGenerator: () => randomUUID()
            });
            
            await mcpServer.connect(transport);
            
            // Передаем запрос транспорту (он сам разберется GET это или POST)
            await transport.handleRequest(req, res, req.body);
        } catch (error) {
            console.error("MCP request error:", error);
            res.status(500).json({
                error: "Server error",
                message: error instanceof Error ? error.message : "Unknown error"
            });
        }
    };

    app.get('/mcp', handleMcpRequest);
    app.post('/mcp', handleMcpRequest);

    return app;
}