import 'server-only';

import { createClient, type SupabaseClient } from '@supabase/supabase-js';

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

interface Database {
  public: {
    Tables: {
      orders: {
        Row: {
          id: string;
          customer_name: string;
          order_type: string;
          items: Json;
          item_count: number;
          subtotal: number;
          app_discount: number;
          coupon_discount: number;
          total: number;
          coupon_code: string | null;
          payment_status: string;
          mp_preference_id: string | null;
          mp_payment_id: string | null;
          mp_merchant_order_id: string | null;
          mp_status: string | null;
          fulfillment_status: string;
          customer_arriving_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          customer_name: string;
          order_type: string;
          items: Json;
          item_count: number;
          subtotal: number;
          app_discount: number;
          coupon_discount: number;
          total: number;
          coupon_code?: string | null;
          payment_status: string;
          mp_preference_id?: string | null;
          mp_payment_id?: string | null;
          mp_merchant_order_id?: string | null;
          mp_status?: string | null;
          fulfillment_status?: string;
          customer_arriving_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          customer_name?: string;
          order_type?: string;
          items?: Json;
          item_count?: number;
          subtotal?: number;
          app_discount?: number;
          coupon_discount?: number;
          total?: number;
          coupon_code?: string | null;
          payment_status?: string;
          mp_preference_id?: string | null;
          mp_payment_id?: string | null;
          mp_merchant_order_id?: string | null;
          mp_status?: string | null;
          fulfillment_status?: string;
          customer_arriving_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

let supabaseAdminClient: SupabaseClient<Database> | null = null;

function getRequiredEnv(
  name: 'NEXT_PUBLIC_SUPABASE_URL' | 'SUPABASE_SERVICE_ROLE_KEY',
  fallbackName?: 'SUPABASE_SECRET_KEY',
) {
  const value = process.env[name] ?? (fallbackName ? process.env[fallbackName] : undefined);

  if (!value) {
    const missingLabel = fallbackName ? `${name} o ${fallbackName}` : name;
    throw new Error(`Supabase no está configurado. Falta ${missingLabel}.`);
  }

  return value;
}

export function isSupabaseAdminConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY),
  );
}

export function getSupabaseAdminClient() {
  if (!supabaseAdminClient) {
    supabaseAdminClient = createClient<Database>(
      getRequiredEnv('NEXT_PUBLIC_SUPABASE_URL'),
      getRequiredEnv('SUPABASE_SERVICE_ROLE_KEY', 'SUPABASE_SECRET_KEY'),
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      },
    );
  }

  return supabaseAdminClient;
}
