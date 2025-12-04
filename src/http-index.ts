import 'dotenv/config';
import { createHttpServer } from './http-server.js';

interface MainOptions {
    port?: number;
}

const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;

async function main(options: MainOptions = {port}) {
    const serverPort = options.port ?? port;

    const app = createHttpServer(serverPort);

    app.listen(serverPort, () => {
        console.log(`HTTP MCP Server running on port ${serverPort}`);
        console.log(`Health check: http://localhost:${serverPort}/health`);
        console.log(`MCP endpoint: http://localhost:${serverPort}/mcp`);
    })
}


main().catch(console.error);