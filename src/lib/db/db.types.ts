export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      email_verifications: {
        Row: {
          created_at: string | null
          expires_at: string | null
          token_hash: string
          user_id: string
          verification_id: string
          verified: boolean | null
        }
        Insert: {
          created_at?: string | null
          expires_at?: string | null
          token_hash: string
          user_id: string
          verification_id?: string
          verified?: boolean | null
        }
        Update: {
          created_at?: string | null
          expires_at?: string | null
          token_hash?: string
          user_id?: string
          verification_id?: string
          verified?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "email_verifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          }
        ]
      }
      password_resets: {
        Row: {
          created_at: string | null
          expires_at: string | null
          password_reset_id: string
          token_hash: string
          user_id: string
          utilized: boolean | null
        }
        Insert: {
          created_at?: string | null
          expires_at?: string | null
          password_reset_id?: string
          token_hash: string
          user_id: string
          utilized?: boolean | null
        }
        Update: {
          created_at?: string | null
          expires_at?: string | null
          password_reset_id?: string
          token_hash?: string
          user_id?: string
          utilized?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "password_resets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          }
        ]
      }
      sessions: {
        Row: {
          created_at: string | null
          expires_at: string | null
          session_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          expires_at?: string | null
          session_id?: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          expires_at?: string | null
          session_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          }
        ]
      }
      users: {
        Row: {
          email: string
          email_verified: boolean | null
          password_hash: string
          user_id: string
          username: string
        }
        Insert: {
          email: string
          email_verified?: boolean | null
          password_hash: string
          user_id?: string
          username: string
        }
        Update: {
          email?: string
          email_verified?: boolean | null
          password_hash?: string
          user_id?: string
          username?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_user_exists_by_email: {
        Args: {
          _email: string
        }
        Returns: boolean
      }
      check_user_exists_by_username: {
        Args: {
          _username: string
        }
        Returns: boolean
      }
      create_email_verification: {
        Args: {
          _user_id: string
          _token_hash: string
        }
        Returns: string
      }
      create_password_reset: {
        Args: {
          _user_id: string
          _token_hash: string
        }
        Returns: string
      }
      create_session: {
        Args: {
          _user_id: string
        }
        Returns: string
      }
      create_user: {
        Args: {
          _username: string
          _email: string
          _password_hash: string
        }
        Returns: string
      }
      delete_session_by_id: {
        Args: {
          _session_id: string
        }
        Returns: undefined
      }
      find_session_by_id: {
        Args: {
          _session_id: string
        }
        Returns: {
          session_id: string
          user_id: string
          created_at: string
          expires_at: string
        }[]
      }
      find_user_by_id: {
        Args: {
          _user_id: string
        }
        Returns: {
          user_id: string
          username: string
          email: string
          email_verified: boolean
        }[]
      }
      get_email_verification: {
        Args: {
          _verification_id: string
        }
        Returns: {
          verification_id: string
          user_id: string
          token_hash: string
          verified: boolean
          created_at: string
          expires_at: string
        }[]
      }
      get_password_reset: {
        Args: {
          _password_reset_id: string
        }
        Returns: {
          password_reset_id: string
          user_id: string
          token_hash: string
          utilized: boolean
          created_at: string
          expires_at: string
        }[]
      }
      reset_password: {
        Args: {
          _password_reset_id: string
          _password_hash: string
        }
        Returns: undefined
      }
      verify_email:
        | {
            Args: {
              _verification_id: string
            }
            Returns: undefined
          }
        | {
            Args: {
              _verification_id: string
              _token_hash: string
            }
            Returns: undefined
          }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
      Database["public"]["Views"])
  ? (Database["public"]["Tables"] &
      Database["public"]["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
  ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : never
