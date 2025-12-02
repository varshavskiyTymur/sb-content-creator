# Storyblok Content Creator

An MCP (Model Context Protocol) server for AI interaction with Storyblok CMS, allowing for automated content creation, management, and retrieval without manual intervention.

## Features

- 🤖 **AI-Powered**: Works with AI assistants through the Model Context Protocol
- 📝 **Full CRUD Operations**: Create, read, update, and delete stories
- 🔍 **Content Discovery**: List and filter stories with pagination
- 🧩 **Component Management**: Retrieve Storyblok component schemas
- 🔒 **Type-Safe**: Written in TypeScript with full type definitions
- ✅ **Input Validation**: Zod schemas for robust data validation

## Prerequisites

- Node.js 18+ (required for native `fetch` API)
- A Storyblok account with Management API access
- Storyblok Space ID and Personal Access Token

## Installation

```bash
# Clone the repository
git clone https://github.com/varshavskiyTymur/sb-content-creator.git
cd sb-content-creator

# Install dependencies
npm install

# Build the project
npm run build
```

## Configuration

Create a `.env` file in the root directory with the following variables:

```env
# Required: Your Storyblok Space ID
STORYBLOK_SPACE_ID=your_space_id_here

# Required: Your Storyblok Management API Access Token
STORYBLOK_ACCESS_TOKEN=your_token_here

# Optional: Custom API base URL (defaults to official endpoint)
STORYBLOK_API_BASE=https://mapi.storyblok.com/v1
```

### Getting Your Credentials

1. **Space ID**: Find it in your Storyblok space settings under "Settings" → "General"
2. **Access Token**: Create a personal access token in "Settings" → "Access Tokens"
   - Make sure to enable "Management API" permissions

## Available Tools

### Story Management

#### `createStory`
Create a new story in Storyblok.

**Parameters:**
- `name` (string, required): Story name (1-255 characters)
- `slug` (string, required): URL slug (lowercase, alphanumeric with hyphens)
- `content` (object, required): Story content object
- `parent_id` (number, optional): Parent story ID for nested content
- `publish` (boolean, optional): Publish immediately (default: false)

**Example:**
```json
{
  "name": "My New Article",
  "slug": "my-new-article",
  "content": {
    "component": "page",
    "body": []
  },
  "publish": false
}
```

#### `updateStory`
Update an existing story.

**Parameters:**
- `storyId` (number, required): ID of the story to update
- `name` (string, optional): New story name
- `slug` (string, optional): New slug
- `content` (object, optional): Updated content
- `parent_id` (number, optional): New parent ID
- `publish` (boolean, optional): Publish the changes

#### `getStory`
Retrieve a single story by ID.

**Parameters:**
- `storyId` (number, required): Story ID to retrieve

#### `deleteStory`
Delete a story permanently.

**Parameters:**
- `storyId` (number, required): Story ID to delete

#### `listStories`
List stories with optional filtering and pagination.

**Parameters:**
- `per_page` (number, optional): Items per page (1-100, default: 25)
- `page` (number, optional): Page number (default: 1)
- `filter_query` (string, optional): Filter query string

### Component Management

#### `getComponents`
Retrieve all component definitions from Storyblok.

**Parameters:** None

**Returns:** List of all components with their schemas.

## Usage with AI Assistants

This MCP server is designed to work with AI assistants that support the Model Context Protocol. Once configured, the AI can:

- Create blog posts, pages, and other content types
- Update existing content based on requirements
- Retrieve content for analysis or modification
- Manage content structure and organization

## Development

```bash
# Run in development mode with auto-reload
npx tsx src/index.ts

# Build for production
npm run build

# Run built version
node build/index.js
```

## Project Structure

```
src/
├── index.ts              # Entry point
├── server/
│   └── storyblok-server.ts  # MCP server setup
├── services/
│   └── storyblok-api.ts     # Storyblok API client
├── tools/
│   ├── stories.ts           # Story management tools
│   └── components.ts        # Component tools
└── types/
    └── storyblok.ts         # TypeScript type definitions
```

## Error Handling

The server includes comprehensive error handling:

- **Environment validation**: Clear errors if required variables are missing
- **API errors**: Detailed error messages from Storyblok API
- **Network errors**: Proper handling of connection issues
- **Input validation**: Zod schema validation with helpful error messages

## Troubleshooting

### "STORYBLOK_SPACE_ID environment variable is required"
Make sure your `.env` file exists and contains valid credentials.

### "Network error"
Check your internet connection and ensure the Storyblok API is accessible.

### "401 Unauthorized"
Verify your access token has the correct permissions in Storyblok settings.

### Slug validation errors
Slugs must be lowercase and contain only letters, numbers, and hyphens.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

ISC

## Links

- [Storyblok Management API Documentation](https://www.storyblok.com/docs/api/management)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [Repository](https://github.com/varshavskiyTymur/sb-content-creator)
