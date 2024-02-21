import { createBlankSessionCookie, getSession } from "@/lib/api/auth/utils";
import { handleError, handleResponse } from "@/lib/api/utils";

import { AuthError } from "@/lib/api/errors";
import { DB } from "@/lib/db/actions";
import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { createDbClient } from "@/lib/db/client";

export async function POST(req: NextRequest) {
    try {
        const dbClient = createDbClient();

        const session = await getSession(dbClient);

        if (!session) throw new AuthError("User not signed in.", 400);

        await DB.deleteSessionById(dbClient, { sessionId: session.sessionId });

        const sessionCookie = createBlankSessionCookie();
        cookies().set(
            sessionCookie.name,
            sessionCookie.value,
            sessionCookie.attributes
        );

        return handleResponse({ message: "Ok", data: {}, status: 200 });
    } catch (e: any) {
        return handleError(e);
    }
}
