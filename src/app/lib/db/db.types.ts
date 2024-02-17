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
      auth_challenges: {
        Row: {
          challengeid: string
          created_at: string | null
          expected: string
          passed: boolean | null
          userid: string
        }
        Insert: {
          challengeid?: string
          created_at?: string | null
          expected: string
          passed?: boolean | null
          userid: string
        }
        Update: {
          challengeid?: string
          created_at?: string | null
          expected?: string
          passed?: boolean | null
          userid?: string
        }
        Relationships: [
          {
            foreignKeyName: "auth_challenges_userid_fkey"
            columns: ["userid"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["userid"]
          }
        ]
      }
      users: {
        Row: {
          email: string
          password: string
          userid: string
          username: string
          verified: boolean | null
        }
        Insert: {
          email: string
          password: string
          userid?: string
          username: string
          verified?: boolean | null
        }
        Update: {
          email?: string
          password?: string
          userid?: string
          username?: string
          verified?: boolean | null
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
      create_auth_challenge: {
        Args: {
          _userid: string
          _expected: string
        }
        Returns: string
      }
      create_user: {
        Args: {
          _username: string
          _email: string
          _password: string
        }
        Returns: string
      }
      fetch_auth_challenge_by_id: {
        Args: {
          _challengeid: string
        }
        Returns: {
          challengeid: string
          userid: string
          expected: string
          passed: boolean
          created_at: string
        }[]
      }
      find_user_by_id: {
        Args: {
          _userid: string
        }
        Returns: {
          userid: string
          username: string
          email: string
          verified: boolean
        }[]
      }
      pass_auth_challenge: {
        Args: {
          _challengeid: string
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
