export interface StoryblokComponent {
    _uid: string;
    component: string;
    [key: string]: any;
}

export interface StoryContent {
    component: string;
    body?: StoryblokComponent[];
    [key: string]: any;
} 

export interface CreateStoryParams{
    name: string;
    slug: string;
    content: StoryContent;
    parent_id?: number;
    publish?: boolean;
}

export interface StoryResponse {
    story: {
        id: number;
        name: string;
        slug: string;
        content: StoryContent;
        parent_id?: number;
        created_at: string;
        publish?: boolean;
    }
}

export interface UpdateStoryParams {
    name?: string;
    slug?: string;
    content?: StoryContent;
    parent_id?: number;
    publish?: boolean;
}

export interface Asset{
    id: number;
    filename: string;
    space_id: number;
    created_at: string;
    updated_at: string;
    file: string; 
    content_type: string;
    content_length: number;
    alt?: string;
    title?: string;
  }
  
  export interface AssetResponse {
    asset: Asset;
  }
  
  export class StoryblokError extends Error {
    constructor(
        public statusCode: number,
        public url: string,
        public details?: any,
    ){
        super(`Storyblok API error: ${statusCode} on ${url}`);
        this.name = 'StoryblokError';   
    }
  }