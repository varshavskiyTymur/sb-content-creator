# Storyblok Content Creator

An MCP (Model Context Protocol) server for AI interaction with Storyblok CMS, enabling automated content creation without manual intervention.

## Features

- 🚀 Create, read, update, and delete Storyblok stories
- 📁 Manage assets (upload, download, delete)
- 🧩 List and inspect components
- 🤖 Full AI integration through MCP protocol
- 🔒 Secure authentication with Storyblok Management API

## Installation

### Using npx (Recommended)

Add to your MCP configuration file (e.g., `~/.cursor/mcp.json`):

```json
{
  "mcpServers": {
    "storyblok": {
      "command": "npx",
      "args": [
        "-y",
        "sb-content-creator@latest",
        "--space-id",
        "YOUR_SPACE_ID",
        "--access-token",
        "YOUR_ACCESS_TOKEN"
      ]
    }
  }
}
```

### Global Installation

```bash
npm install -g sb-content-creator
```

Then use in your MCP config:

```json
{
  "mcpServers": {
    "storyblok": {
      "command": "sb-content-creator",
      "args": [
        "--space-id",
        "YOUR_SPACE_ID",
        "--access-token",
        "YOUR_ACCESS_TOKEN"
      ]
    }
  }
}
```

## Configuration

### Required Parameters

- `--space-id`: Your Storyblok space ID
- `--access-token`: Your Storyblok Management API token

### Getting Credentials

1. Go to [Storyblok](https://app.storyblok.com/)
2. Navigate to **Settings → Access Tokens**
3. Create a new **Management API** token
4. Note your **Space ID** from the URL or settings

## Available Tools

### Stories

- `createStory` - Create a new story
- `updateStory` - Update existing story
- `deleteStory` - Delete a story
- `getStory` - Get story by ID
- `listStories` - List all stories with pagination

### Assets

- `uploadAsset` - Upload asset from URL
- `getAsset` - Get asset by ID
- `getAssets` - List all assets with pagination
- `deleteAsset` - Delete an asset
- `finishUpload` - Finalize asset upload

### Components

- `getComponents` - List all components in space

## Usage Example

Once configured in your MCP client (like Cursor), you can use natural language:

```
"Create a new blog post in Storyblok with title 'Hello World'"
"Upload an image from https://example.com/image.jpg to Storyblok"
"List all stories in my Storyblok space"
"Update story with ID 12345 and change the title"
```

## Remote Server (Multi-User)

You can use the publicly hosted MCP server where each user provides their own Storyblok credentials via HTTP headers.

### Configuration for ChatGPT / Remote MCP Clients

Connect to the remote server with your credentials:

**Endpoint:** `https://your-railway-url.railway.app/mcp`

**Required Headers:**
| Header | Description |
|--------|-------------|
| `X-Space-Id` | Your Storyblok Space ID |
| `X-Access-Token` | Your Storyblok Management API token |

### Example MCP Configuration (Remote)

```json
{
  "mcpServers": {
    "storyblok": {
      "url": "https://your-railway-url.railway.app/mcp",
      "headers": {
        "X-Space-Id": "YOUR_SPACE_ID",
        "X-Access-Token": "YOUR_ACCESS_TOKEN"
      }
    }
  }
}
```

### Self-Hosting

Deploy your own instance:

```bash
# Using Railway
railway login
railway link
railway up

# Or using Docker
docker build -t storyblok-mcp .
docker run -p 3000:3000 storyblok-mcp
```

No environment variables needed for multi-user mode - each user passes their own credentials via headers.

## Development

### Prerequisites

- Node.js >= 18.0.0
- npm or yarn

### Setup

```bash
git clone https://github.com/varshavskiyTymur/sb-content-creator.git
cd sb-content-creator
npm install
npm run build
```

### Project Structure

```
sb-content-creator/
├── src/
│   ├── index.ts           # Entry point
│   ├── server/            # MCP server setup
│   ├── services/          # Storyblok API client
│   ├── tools/             # MCP tool definitions
│   └── types/             # TypeScript types
├── build/                 # Compiled output
└── package.json
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see [LICENSE](LICENSE) file for details

## Author

Leetio

## Links

- [GitHub Repository](https://github.com/varshavskiyTymur/sb-content-creator)
- [npm Package](https://www.npmjs.com/package/sb-content-creator)
- [Storyblok API Docs](https://www.storyblok.com/docs/api/management)
- [Model Context Protocol](https://modelcontextprotocol.io/)

## Support

For issues and questions, please use the [GitHub Issues](https://github.com/varshavskiyTymur/sb-content-creator/issues) page.
