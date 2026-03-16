// Auto-generated format — keep in sync with supabase/migrations/0001_initial_schema.sql
// Regenerate after schema changes:
//   supabase gen types typescript --local > packages/database/src/database.types.ts

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  public: {
    Tables: {
      assets: {
        Row: {
          id: string
          project_id: string
          memory_id: string | null
          storage_path: string
          storage_bucket: string
          mime_type: string
          size_bytes: number
          asset_type: Database['public']['Enums']['asset_type']
          width: number | null
          height: number | null
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          memory_id?: string | null
          storage_path: string
          storage_bucket?: string
          mime_type: string
          size_bytes: number
          asset_type?: Database['public']['Enums']['asset_type']
          width?: number | null
          height?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          memory_id?: string | null
          storage_path?: string
          storage_bucket?: string
          mime_type?: string
          size_bytes?: number
          asset_type?: Database['public']['Enums']['asset_type']
          width?: number | null
          height?: number | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'assets_project_id_fkey'
            columns: ['project_id']
            referencedRelation: 'projects'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'assets_memory_id_fkey'
            columns: ['memory_id']
            referencedRelation: 'memories'
            referencedColumns: ['id']
          },
        ]
      }
      event_logs: {
        Row: {
          id: string
          project_id: string | null
          user_id: string | null
          event: string
          payload: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          project_id?: string | null
          user_id?: string | null
          event: string
          payload?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string | null
          user_id?: string | null
          event?: string
          payload?: Json | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'event_logs_project_id_fkey'
            columns: ['project_id']
            referencedRelation: 'projects'
            referencedColumns: ['id']
          },
        ]
      }
      leads: {
        Row: {
          id: string
          email: string
          source: string | null
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          source?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          source?: string | null
          created_at?: string
        }
        Relationships: []
      }
      memories: {
        Row: {
          id: string
          project_id: string
          title: string
          short_description: string | null
          description: string | null
          occurred_at: string
          emoji: string | null
          position: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          title: string
          short_description?: string | null
          description?: string | null
          occurred_at?: string
          emoji?: string | null
          position?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          title?: string
          short_description?: string | null
          description?: string | null
          occurred_at?: string
          emoji?: string | null
          position?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'memories_project_id_fkey'
            columns: ['project_id']
            referencedRelation: 'projects'
            referencedColumns: ['id']
          },
        ]
      }
      payments: {
        Row: {
          id: string
          project_id: string
          user_id: string
          provider: string
          provider_payment_id: string | null
          status: Database['public']['Enums']['payment_status']
          amount_cents: number
          currency: string
          metadata: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          user_id: string
          provider?: string
          provider_payment_id?: string | null
          status?: Database['public']['Enums']['payment_status']
          amount_cents: number
          currency?: string
          metadata?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          user_id?: string
          provider?: string
          provider_payment_id?: string | null
          status?: Database['public']['Enums']['payment_status']
          amount_cents?: number
          currency?: string
          metadata?: Json | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'payments_project_id_fkey'
            columns: ['project_id']
            referencedRelation: 'projects'
            referencedColumns: ['id']
          },
        ]
      }
      projects: {
        Row: {
          id: string
          user_id: string
          title: string
          slug: string
          status: Database['public']['Enums']['project_status']
          partner_name_1: string
          partner_name_2: string
          relationship_start_date: string
          theme_id: string | null
          cover_asset_id: string | null
          final_message: string | null
          published_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          slug: string
          status?: Database['public']['Enums']['project_status']
          partner_name_1: string
          partner_name_2: string
          relationship_start_date: string
          theme_id?: string | null
          cover_asset_id?: string | null
          final_message?: string | null
          published_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          slug?: string
          status?: Database['public']['Enums']['project_status']
          partner_name_1?: string
          partner_name_2?: string
          relationship_start_date?: string
          theme_id?: string | null
          cover_asset_id?: string | null
          final_message?: string | null
          published_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'projects_user_id_fkey'
            columns: ['user_id']
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'projects_theme_id_fkey'
            columns: ['theme_id']
            referencedRelation: 'themes'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'projects_cover_asset_id_fkey'
            columns: ['cover_asset_id']
            referencedRelation: 'assets'
            referencedColumns: ['id']
          },
        ]
      }
      themes: {
        Row: {
          id: string
          name: string
          description: string | null
          preview_url: string | null
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          preview_url?: string | null
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          preview_url?: string | null
          is_active?: boolean
          created_at?: string
        }
        Relationships: []
      }
    }
    // Using `{}` (not `Record<string, never>`) so Supabase's TablesAndViews<Schema>
    // intersection doesn't reduce all table types to `never`.
    Views: {}
    Functions: {}
    Enums: {
      asset_type: 'image' | 'video'
      payment_status: 'pending' | 'approved' | 'rejected' | 'cancelled' | 'refunded'
      project_status:
        | 'draft'
        | 'awaiting_payment'
        | 'paid'
        | 'pending_manual_creation'
        | 'processing'
        | 'published'
        | 'delivery_sent'
        | 'archived'
        | 'deleted'
    }
    CompositeTypes: {}
  }
}

// Convenience type helpers — mirrors Supabase CLI output
export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row']

export type TablesInsert<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert']

export type TablesUpdate<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update']

export type Enums<T extends keyof Database['public']['Enums']> =
  Database['public']['Enums'][T]
