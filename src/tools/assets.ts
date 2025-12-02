import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { StoryblokApiClient } from "../services/storyblok-api.js";

export function registerAssetTools(server: McpServer, apiClient: StoryblokApiClient) {
    server.registerTool(
        'getAssets',
        {
            title: 'Get Assets',
            description: 'Get all assets from Storyblok',
            inputSchema: {
                per_page: z.number().optional().describe('Number of assets per page'),
                page: z.number().optional().describe('Page number'),
                filter_query: z.string().optional().describe('Filter query')
            },
            outputSchema: {
                assets: z.array(z.any()),
                success: z.boolean()
            }
        },
        async ({ per_page, page, filter_query }) => {
            try {
                const result = await apiClient.getAssets({ per_page, page, filter_query });
                const output = { assets: result, success: true };
                return {
                    content: [{ type: 'text', text: JSON.stringify(output) }],
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

    server.registerTool(
        'getAsset',
        {
            title: 'Get Asset',
            description: 'Get an asset from Storyblok',
            inputSchema: {
                assetId: z.number().describe('Asset ID')
            },
            outputSchema: {
                asset: z.any(),
                success: z.boolean()
            }
        },
        async ({ assetId }) => {
            try {
                const result = await apiClient.getAsset(assetId);
                const output = { asset: result, success: true };
                return {
                    content: [{ type: 'text', text: JSON.stringify(output) }],
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

    server.registerTool(
        'deleteAsset',
        {
            title: 'Delete Asset',
            description: 'Delete an asset from Storyblok',
            inputSchema: {
                assetId: z.number().describe('Asset ID')
            },
            outputSchema: {
                success: z.boolean()
            }
        },
        async ({ assetId }) => {
            try {
                const result = await apiClient.deleteAsset(assetId);
                const output = { success: true };
                return {
                    content: [{ type: 'text', text: JSON.stringify(output) }],
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

    server.registerTool(
        'uploadAsset',
        {
          title: 'Upload Asset',
          description: 'Upload an asset to Storyblok from URL',
          inputSchema: {
            fileUrl: z.string().url().describe('Public URL of the file to upload')
          },
          outputSchema: {
            asset: z.any(),
            success: z.boolean()
          }
        },
        async ({ fileUrl }) => {
          try {
            const result = await apiClient.uploadAssetFromUrl(fileUrl);
            const output = { asset: result, success: true };
            return {
              content: [{ type: 'text', text: JSON.stringify(output) }],
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

    server.registerTool(
        'finishUpload',
        {
            title: 'Finish Upload',
            description: 'Finish uploading an asset to Storyblok',
            inputSchema: {
                assetId: z.number().describe('Asset ID')
            },
        },
        async ({ assetId }) => {
            try { 
                const result = await apiClient.finishUpload(assetId);
                const output = { asset: result, success: true };
                return {
                    content: [{ type: 'text', text: JSON.stringify(output) }],
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