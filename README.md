# Next.JS Cookie Authentication

## .env

```.env
# authentication
NEXT_PUBLIC_AUTH_SECRET="auth secret"

# supabase db
NEXT_PUBLIC_SUPABASE_URL="supabase url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="supabase anon key"

# amazon aws user
AWS_REGION=""
AWS_ACCESS_KEY_ID=""
AWS_SECRET_ACCESS_KEY=""
```

## Database

Generating types with Supabase:

```bash
npx supabase gen types typescript --project-id "$PROJECT_ID" --schema public > src/app/lib/db/db.types.ts --debug
```

## Email Service

## Sources

* <https://supabase.com/docs/guides/auth/server-side/creating-a-client?framework=nextjs&environment=middleware>
* <https://supabase.com/docs/guides/auth/server-side/nextjs>
* <https://supabase.com/docs/guides/auth/auth-helpers/nextjs>
