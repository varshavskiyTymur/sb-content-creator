import * as dotenv from "dotenv";
import { CreateStoryParams, StoryResponse, AssetResponse, StoryblokError, UpdateStoryParams} from "../types/storyblok.js";


dotenv.config();





export class StoryblokApiClient {
    private spaceId: string;
    private accessToken: string;
    private apiBase: string;

    constructor(spaceId: string, accessToken: string, apiBase: string) {
        this.spaceId = spaceId;
        this.accessToken = accessToken;
        this.apiBase = apiBase;
    }

    private async handleResponse<T>(response: Response): Promise<T> {
      if (!response.ok) {
        let details;
        
        try {
          details = await response.json();
        } catch {
          try {
            details = await response.text();
          } catch {
            details = response.statusText;
          }
        }
        
        throw new StoryblokError(
          response.status,
          response.url,
          details
        );
      }
      
      try {
        return await response.json();
      } catch {
        throw new Error(`Invalid JSON response from ${response.url}`);
      }
    }
    
    private async request<T>(
      method: string,
      endpoint: string,
      options: {
        body?: any;
        isFormData?: boolean;
      } = {}
    ): Promise<T> {
      const url = `${this.apiBase}/spaces/${this.spaceId}${endpoint}`;
      
      const headers: Record<string, string> = {
        "Authorization": this.accessToken,
      };
      
      if (!options.isFormData) {
        headers["Content-Type"] = "application/json";
      }
      
      let body;
      if (options.body) {
        body = options.isFormData 
          ? options.body 
          : JSON.stringify(options.body); 
      }
      
      const response = await fetch(url, {
        method,
        headers,
        body,
      });
      
      return this.handleResponse<T>(response);
    }
    
    async createStory(story: CreateStoryParams): Promise<StoryResponse> {
      return this.request<StoryResponse>("POST", "/stories", {
        body: { story, publish: story.publish ? 1 : 0 }
      });
    }
    
    async uploadAssetFromUrl(fileUrl: string): Promise<AssetResponse> {
      const response = await fetch(fileUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch file: ${response.statusText}`);
      }
      
      const blob = await response.blob();
      const filename = new URL(fileUrl).pathname.split('/').pop() || 'upload.bin';
      
      const formData = new FormData();
      formData.append('file', blob, filename);
      
      return this.request<AssetResponse>("POST", "/assets/", {
        body: formData,
        isFormData: true
      });
    }

    async updateStory(storyId: number, story: UpdateStoryParams): Promise<StoryResponse> {
        return this.request<StoryResponse>("PUT", `/stories/${storyId}`, {
            body: { story }
        });
    }
    

    async deleteStory(storyId: number): Promise<void> {
        await this.request<void>("DELETE", `/stories/${storyId}`);
    }

    async getStory(storyId: number): Promise<StoryResponse> {
        return this.request<StoryResponse>("GET", `/stories/${storyId}`);
    }

    async listStories(params?: {
        per_page?: number;
        page?: number;
        filter_query?: string;
      }): Promise<{ stories: any[] }> {
        const query = new URLSearchParams();
        if (params?.per_page) query.set("per_page", params.per_page.toString());
        if (params?.page) query.set("page", params.page.toString());
        if (params?.filter_query) query.set("filter_query", params.filter_query);
        
        const endpoint = query.toString() ? `/stories/?${query}` : "/stories/";
        return this.request("GET", endpoint);
      }

      async getComponents(){
        return this.request("GET", "/components/");
      }
      async getAssets(params?: {
        per_page?: number;
        page?: number;
        filter_query?: string;
      }) {
        const query = new URLSearchParams();
        if (params?.per_page) query.set("per_page", params.per_page.toString());
        if (params?.page) query.set("page", params.page.toString());
        if (params?.filter_query) query.set("filter_query", params.filter_query);
        
        const endpoint = query.toString() ? `/assets/?${query}` : "/assets/";
        return this.request("GET", endpoint);
      }
  
      async getAsset(assetId: number): Promise<AssetResponse> {
        return this.request<AssetResponse>("GET", `/assets/${assetId}`);
      }
  
      async deleteAsset(assetId: number): Promise<void> {
        return this.request<void>("DELETE", `/assets/${assetId}`);
      }
  
      async finishUpload(assetId: number) {
        return this.request("POST", `/assets/${assetId}/finish_upload`, {
          body: {}
        });
      }
    }