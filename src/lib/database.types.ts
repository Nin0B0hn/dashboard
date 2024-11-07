/* eslint-disable @typescript-eslint/no-empty-object-type */
// database.types.ts

export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
  public: {
    Tables: {
      comments: {
        Row: {
          id: string;
          user_name: string;
          content: string;
          parent_id: string | null;
          sentiment: string | null;
          themes: string | null;
          created_at: string;
        };
        Insert: {
          user_name: string;
          content: string;
          parent_id?: string | null;
          sentiment?: string | null;
          themes?: string | null;
        };
        Update: {
          sentiment?: string | null;
          themes?: string | null;
        };
      };
      // Weitere Tabellen können hier hinzugefügt werden
    };
    Views: {};
    Functions: {};
    Enums: {};
  };
}
