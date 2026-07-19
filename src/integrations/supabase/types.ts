export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5";
  };
  public: {
    Tables: {
      custom_requests: {
        Row: {
          additional_notes: string | null;
          budget: string | null;
          created_at: string;
          deadline: string | null;
          description: string | null;
          email: string;
          finish: string | null;
          full_name: string;
          id: string;
          inspiration_urls: string[];
          jewelry_type: string | null;
          material: string | null;
          metal: string | null;
          phone: string | null;
          ring_size: string | null;
          status: string;
          stones: string | null;
          updated_at: string;
          user_id: string | null;
        };
        Insert: {
          additional_notes?: string | null;
          budget?: string | null;
          created_at?: string;
          deadline?: string | null;
          description?: string | null;
          email: string;
          finish?: string | null;
          full_name: string;
          id?: string;
          inspiration_urls?: string[];
          jewelry_type?: string | null;
          material?: string | null;
          metal?: string | null;
          phone?: string | null;
          ring_size?: string | null;
          status?: string;
          stones?: string | null;
          updated_at?: string;
          user_id?: string | null;
        };
        Update: {
          additional_notes?: string | null;
          budget?: string | null;
          created_at?: string;
          deadline?: string | null;
          description?: string | null;
          email?: string;
          finish?: string | null;
          full_name?: string;
          id?: string;
          inspiration_urls?: string[];
          jewelry_type?: string | null;
          material?: string | null;
          metal?: string | null;
          phone?: string | null;
          ring_size?: string | null;
          status?: string;
          stones?: string | null;
          updated_at?: string;
          user_id?: string | null;
        };
        Relationships: [];
      };
      newsletter_subscribers: {
        Row: {
          created_at: string;
          email: string;
          id: string;
          is_active: boolean;
          source: string | null;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          email: string;
          id?: string;
          is_active?: boolean;
          source?: string | null;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          email?: string;
          id?: string;
          is_active?: boolean;
          source?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      order_items: {
        Row: {
          created_at: string;
          id: string;
          order_id: string;
          product_id: string | null;
          product_name: string;
          quantity: number;
          unit_price_eur: number;
          variant: string | null;
        };
        Insert: {
          created_at?: string;
          id?: string;
          order_id: string;
          product_id?: string | null;
          product_name: string;
          quantity: number;
          unit_price_eur: number;
          variant?: string | null;
        };
        Update: {
          created_at?: string;
          id?: string;
          order_id?: string;
          product_id?: string | null;
          product_name?: string;
          quantity?: number;
          unit_price_eur?: number;
          variant?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey";
            columns: ["order_id"];
            isOneToOne: false;
            referencedRelation: "orders";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "order_items_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
      orders: {
        Row: {
          created_at: string;
          customer_email: string;
          customer_name: string;
          customer_phone: string | null;
          id: string;
          notes: string | null;
          order_number: string;
          shipping_address: string;
          shipping_city: string;
          shipping_country: string;
          status: string;
          subtotal_eur: number;
          user_id: string | null;
        };
        Insert: {
          created_at?: string;
          customer_email: string;
          customer_name: string;
          customer_phone?: string | null;
          id?: string;
          notes?: string | null;
          order_number?: string;
          shipping_address: string;
          shipping_city: string;
          shipping_country: string;
          status?: string;
          subtotal_eur: number;
          user_id?: string | null;
        };
        Update: {
          created_at?: string;
          customer_email?: string;
          customer_name?: string;
          customer_phone?: string | null;
          id?: string;
          notes?: string | null;
          order_number?: string;
          shipping_address?: string;
          shipping_city?: string;
          shipping_country?: string;
          status?: string;
          subtotal_eur?: number;
          user_id?: string | null;
        };
        Relationships: [];
      };
      product_images: {
        Row: {
          alt: string | null;
          created_at: string;
          id: string;
          product_id: string;
          sort_order: number;
          url: string;
        };
        Insert: {
          alt?: string | null;
          created_at?: string;
          id?: string;
          product_id: string;
          sort_order?: number;
          url: string;
        };
        Update: {
          alt?: string | null;
          created_at?: string;
          id?: string;
          product_id?: string;
          sort_order?: number;
          url?: string;
        };
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
      products: {
        Row: {
          artisan_note: string | null;
          artisan_note_bg: string | null;
          category: string | null;
          created_at: string;
          dimensions: string | null;
          dimensions_bg: string | null;
          eyebrow: string | null;
          eyebrow_bg: string | null;
          foot_price_eur: number | null;
          id: string;
          is_available: boolean;
          is_signature: boolean;
          name: string;
          name_bg: string | null;
          price_eur: number;
          slug: string;
          sort_order: number;
          updated_at: string;
        };
        Insert: {
          artisan_note?: string | null;
          artisan_note_bg?: string | null;
          category?: string | null;
          created_at?: string;
          dimensions?: string | null;
          dimensions_bg?: string | null;
          eyebrow?: string | null;
          eyebrow_bg?: string | null;
          foot_price_eur?: number | null;
          id?: string;
          is_available?: boolean;
          is_signature?: boolean;
          name: string;
          name_bg?: string | null;
          price_eur: number;
          slug: string;
          sort_order?: number;
          updated_at?: string;
        };
        Update: {
          artisan_note?: string | null;
          artisan_note_bg?: string | null;
          category?: string | null;
          created_at?: string;
          dimensions?: string | null;
          dimensions_bg?: string | null;
          eyebrow?: string | null;
          eyebrow_bg?: string | null;
          foot_price_eur?: number | null;
          id?: string;
          is_available?: boolean;
          is_signature?: boolean;
          name?: string;
          name_bg?: string | null;
          price_eur?: number;
          slug?: string;
          sort_order?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          created_at: string;
          email: string | null;
          first_name: string | null;
          id: string;
          last_name: string | null;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          email?: string | null;
          first_name?: string | null;
          id: string;
          last_name?: string | null;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          email?: string | null;
          first_name?: string | null;
          id?: string;
          last_name?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      site_settings: {
        Row: {
          contact_email: string;
          contact_phone: string;
          created_at: string;
          homepage_banner: string;
          id: boolean;
          store_name: string;
          updated_at: string;
        };
        Insert: {
          contact_email?: string;
          contact_phone?: string;
          created_at?: string;
          homepage_banner?: string;
          id?: boolean;
          store_name?: string;
          updated_at?: string;
        };
        Update: {
          contact_email?: string;
          contact_phone?: string;
          created_at?: string;
          homepage_banner?: string;
          id?: boolean;
          store_name?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      user_roles: {
        Row: {
          created_at: string;
          id: string;
          role: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          role: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          role?: Database["public"]["Enums"]["app_role"];
          user_id?: string;
        };
        Relationships: [];
      };
      wishlists: {
        Row: {
          created_at: string;
          id: string;
          product_id: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          product_id: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          product_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "wishlists_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"];
          _user_id: string;
        };
        Returns: boolean;
      };
      place_order: {
        Args: {
          _customer_email: string;
          _customer_name: string;
          _customer_phone: string;
          _items: Json;
          _notes: string;
          _shipping_address: string;
          _shipping_city: string;
          _shipping_country: string;
        };
        Returns: {
          customer_email: string;
          customer_name: string;
          items: Json;
          order_id: string;
          order_number: string;
          shipping_address: string;
          shipping_city: string;
          shipping_country: string;
          subtotal_eur: number;
        }[];
      };
      subscribe_newsletter: {
        Args: { _email: string; _source?: string };
        Returns: undefined;
      };
    };
    Enums: {
      app_role: "admin" | "user";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    keyof DefaultSchema["Enums"] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    keyof DefaultSchema["CompositeTypes"] | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const;
