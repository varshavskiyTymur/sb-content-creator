import * as dotenv from "dotenv";
import type {
    StoryblokStory,
    StoryblokComponent,
    StoryblokApiResponse,
    CreateStoryRequest,
    UpdateStoryRequest,
    ListStoriesParams
} from "../types/storyblok.js";

dotenv.config();

const STORYBLOK_API_BASE = process.env.STORYBLOK_API_BASE || "https://mapi.storyblok.com/v1";

export class StoryblokApiClient {
    private spaceId: string;
    private accessToken: string;

    constructor(spaceId: string, accessToken: string) {
        this.spaceId = spaceId;
        this.accessToken = accessToken;
    }

    private async request<T>(
        method: string,
        endpoint: string,
        data?: unknown
    ): Promise<T> {
        const url = `${STORYBLOK_API_BASE}/spaces/${this.spaceId}${endpoint}`;

        const headers = {
            "Authorization": `Bearer ${this.accessToken}`,
            "Content-Type": "application/json",
        };

        try {
            const response = await fetch(url, {
                method,
                headers,
                body: data ? JSON.stringify(data) : undefined,
            });

            if (!response.ok) {
                const errorText = await response.text();
                let errorMessage = `${response.status} ${response.statusText}`;
                
                try {
                    const errorJson = JSON.parse(errorText);
                    errorMessage += `: ${errorJson.error || errorJson.message || errorText}`;
                } catch {
                    errorMessage += `: ${errorText}`;
                }
                
                throw new Error(errorMessage);
            }

            return await response.json();
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error(`Network error: ${String(error)}`);
        }
    }

    async createStory(story: CreateStoryRequest): Promise<StoryblokApiResponse<StoryblokStory>> {
        return this.request<StoryblokApiResponse<StoryblokStory>>(
            "POST", 
            "/stories", 
            {
                story,
                publish: story.publish ? 1 : 0,
            }
        );
    }

    async updateStory(
        storyId: number, 
        story: UpdateStoryRequest
    ): Promise<StoryblokApiResponse<StoryblokStory>> {
        return this.request<StoryblokApiResponse<StoryblokStory>>(
            "PUT", 
            `/stories/${storyId}`, 
            { story }
        );
    }

    async deleteStory(storyId: number): Promise<StoryblokApiResponse<StoryblokStory>> {
        return this.request<StoryblokApiResponse<StoryblokStory>>(
            "DELETE", 
            `/stories/${storyId}`
        );
    }

    async getStory(storyId: number): Promise<StoryblokApiResponse<StoryblokStory>> {
        return this.request<StoryblokApiResponse<StoryblokStory>>(
            "GET", 
            `/stories/${storyId}`
        );
    }

    async listStories(params?: ListStoriesParams): Promise<StoryblokApiResponse<StoryblokStory[]>> {
        const query = new URLSearchParams();
        if (params?.per_page) query.set("per_page", params.per_page.toString());
        if (params?.page) query.set("page", params.page.toString());
        if (params?.filter_query) query.set("filter_query", params.filter_query);
        
        const endpoint = query.toString() ? `/stories?${query}` : "/stories";
        return this.request<StoryblokApiResponse<StoryblokStory[]>>("GET", endpoint);
    }

    async getComponents(): Promise<StoryblokApiResponse<StoryblokComponent[]>> {
        return this.request<StoryblokApiResponse<StoryblokComponent[]>>("GET", "/components");
    }
}