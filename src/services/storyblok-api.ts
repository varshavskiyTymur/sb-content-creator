import { error } from "console";
import * as dotenv from "dotenv";


dotenv.config();


const STORYBLOK_API_BASE = process.env.STORYBLOK_API_BASE;

export class StoryblokApiClient{
    private spaceId: string;
    private accessToken: string;

    constructor(spaceId: string, accessToken: string) {
        this.spaceId = spaceId;
        this.accessToken = accessToken;
    }

    private async request(
        method: string,
        endpoint: string,
        data?: any
    ) : Promise<any> {
        const url = `${STORYBLOK_API_BASE}/spaces/${this.spaceId}${endpoint}`;

        const headers = {
            "Authorization": `Bearer ${this.accessToken}`,
            "Content-Type": "application/json",
        };

        const response = await fetch(url, {
            method,
            headers,
            body: data ? JSON.stringify(data) : undefined, 
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(`${response.status} ${response.statusText}: ${error.message}`);
        }

        return await response.json();
    }

    async createStory( story: {
        name: string;
        slug: string;
        content: any;
        parent_id?: number;
        publish?: boolean;
    }) {
        return this.request("POST", "/stories", {
            story,
            publish: story.publish ? 1 : 0,
        });
    }

    async updateStory( storyId: number, story: Partial<{
        name: string;
        slug: string;
        content: any;
        parent_id?: number;
        publish?: boolean;
    }>) {
        return this.request("PUT", `/stories/${storyId}`, { story });
    }

    async deleteStory( storyId: number ) {
        return this.request("DELETE", `/stories/${storyId}`);
    }

    async getStory( storyId: number ) {
        return this.request("GET", `/stories/${storyId}`);
    }

    async listStories( params?: {
        per_page?: number;
        page?: number;
        filter_query?: string;
    }) {
        const query = new URLSearchParams();
        if (params?.per_page) query.set("per_page", params.per_page.toString());
        if (params?.page) query.set("page", params.page.toString());
        if (params?.filter_query) query.set("filter_query", params.filter_query);
        
        const endpoint = query.toString() ? `stories/?${query}` : "stories/";
        return this.request("GET", endpoint);
    }

    async getComponents(){
        return this.request("GET", "components/");
    }

    async getAssets(){
        return this.request("GET", "assets/");
    }

    async getAsset( assetId: number ){
        return this.request("GET", `assets/${assetId}`);
    }

    async deleteAsset( assetId: number ){
        return this.request("DELETE", `assets/${assetId}`);
    }
    


    // Separeted method for uploading assets with form data
    private async requestWithFormData(
        method: string,
        endpoint: string,
        formData: FormData
    ): Promise<any> {
        const url = `${STORYBLOK_API_BASE}/spaces/${this.spaceId}${endpoint}`;
    
        const headers = {
            "Authorization": `Bearer ${this.accessToken}`,
        };
    
        try {
            const response = await fetch(url, {
                method,
                headers,
                body: formData,
            });

            if (!response.ok) {
                let message = `HTTP ${response.status} ${response.statusText}`;
    

                try {
                    const jsonError = await response.json();
                    if (jsonError?.message) message += `: ${jsonError.message}`;
                    else message += `: ${JSON.stringify(jsonError)}`;
                } catch {
                    // Если это не JSON
                    try {
                        const text = await response.text();
                        message += `: ${text}`;
                    } catch {}
                }
    
                throw new Error(message);
            }

            try {
                return await response.json();
            } catch {
                throw new Error(`Invalid JSON in response from ${url}`);
            }
    
        } catch (err: any) {
            throw new Error(`Network error requesting ${endpoint}: ${err.message}`);
        }
    }
    

    async uploadAsset( file: File ){
        const formData = new FormData();
        formData.append("file", file);
        return this.requestWithFormData("POST", "assets/", formData);
    }
    
    async finishUpload(assetId: number){
        const endpoint = `assets/${assetId}/finish-upload`;

        const body = {};

        try {
            const response = await this.request("POST", endpoint, {});
        
            if (!response.ok) {
              let message = "Unknown error";
              try {
                const error = await response.json();
                message = error?.message ?? JSON.stringify(error);
              } catch {
                message = await response.text();
              }
        
              throw new Error(`${response.status} ${response.statusText}: ${message}`);
            }
        
            return await response.json();
          } catch (err: any) {
            throw new Error(`Network/request error: ${err.message}`);
          }
        }
}

