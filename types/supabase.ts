export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      blogs: {
        Row: {
          id: string
          title: string
          description: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          created_at?: string
          updated_at?: string
        }
      }
      gallery_albums: {
        Row: {
          id: string
          title: string
          description: string | null
          cover_image: string
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          cover_image: string
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          cover_image?: string
          created_at?: string
        }
      }
      gallery_images: {
        Row: {
          id: string
          album_id: string
          image_url: string
          caption: string | null
          created_at: string
        }
        Insert: {
          id?: string
          album_id: string
          image_url: string
          caption?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          album_id?: string
          image_url?: string
          caption?: string | null
          created_at?: string
        }
      }
      timeline_posts: {
        Row: {
          id: string
          content: string
          image_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          content: string
          image_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          content?: string
          image_url?: string | null
          created_at?: string
        }
      }
      bookmarks: {
        Row: {
          id: string
          title: string
          url: string
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          url: string
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          url?: string
          description?: string | null
          created_at?: string
        }
      }
      github_repos: {
        Row: {
          id: string
          name: string
          description: string | null
          url: string
          stars: number
          language: string | null
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          url: string
          stars: number
          language?: string | null
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          url?: string
          stars?: number
          language?: string | null
        }
      }
      github_commits: {
        Row: {
          id: string
          message: string
          repo: string
          commit_date: string
        }
        Insert: {
          id?: string
          message: string
          repo: string
          commit_date?: string
        }
        Update: {
          id?: string
          message?: string
          repo?: string
          commit_date?: string
        }
      }
      stats: {
        Row: {
          id: number
          blog_count: number
          page_views: number
          projects_count: number
          github_stars: number
          current_project: string | null
          current_stack: string | null
        }
        Insert: {
          id?: number
          blog_count?: number
          page_views?: number
          projects_count?: number
          github_stars?: number
          current_project?: string | null
          current_stack?: string | null
        }
        Update: {
          id?: number
          blog_count?: number
          page_views?: number
          projects_count?: number
          github_stars?: number
          current_project?: string | null
          current_stack?: string | null
        }
      }
    }
    Functions: {
      increment_page_view: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
    }
  }
}

