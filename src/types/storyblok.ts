/**
 * Типы для работы с Storyblok Management API
 * Документация: https://www.storyblok.com/docs/api/management
 */

// Базовые типы

export interface StoryblokStory {
    id: number;
    name: string;
    slug: string;
    full_slug: string;
    content: Record<string, any>;
    created_at: string;
    updated_at: string;
    published_at: string | null;
    parent_id: number | null;
    position: number;
    is_startpage: boolean;
    lang: string;
    path: string;
    translated_slugs?: Array<{
        lang: string;
        slug: string;
    }>;
}

export interface StoryblokComponent {
    id: number;
    name: string;
    display_name: string;
    created_at: string;
    updated_at: string;
    schema: Record<string, any>;
    image: string | null;
    preview_field: string | null;
    is_root: boolean;
    is_nestable: boolean;
    all_presets: any[];
    preset_id: number | null;
    real_name: string;
    component_group_uuid: string | null;
}

// Типы для запросов

export interface CreateStoryRequest {
    name: string;
    slug: string;
    content: Record<string, any>;
    parent_id?: number;
    publish?: boolean;
}

export interface UpdateStoryRequest {
    name?: string;
    slug?: string;
    content?: Record<string, any>;
    parent_id?: number;
    publish?: boolean;
}

export interface ListStoriesParams {
    per_page?: number;
    page?: number;
    filter_query?: string;
}

// Типы для ответов API

export interface StoryblokApiResponse<T> {
    story?: T;
    stories?: T[];
    component?: StoryblokComponent;
    components?: StoryblokComponent[];
}

export interface StoryblokErrorResponse {
    error: string;
    message?: string;
    status?: number;
}
