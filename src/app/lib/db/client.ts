import { Database } from "./db.types";
import { SupabaseClient as DatabaseClient } from "@supabase/supabase-js";
import { createBrowserClient } from "@supabase/ssr";

function createClient(): DatabaseClient {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!supabaseUrl) {
        throw new Error(
            "Environment variable `NEXT_PUBLIC_SUPABASE_URL` undefined."
        );
    }

    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!supabaseKey) {
        throw new Error(
            "Environment variable `NEXT_PUBLIC_SUPABASE_ANON_KEY` undefined."
        );
    }

    return createBrowserClient<Database>(supabaseUrl, supabaseKey);
}

export { createClient as createDbClient, type DatabaseClient };
