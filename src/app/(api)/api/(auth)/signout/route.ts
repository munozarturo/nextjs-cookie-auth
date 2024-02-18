import { createBlankSessionCookie, getSession } from "@/app/lib/api/auth/utils";
import { handleError, handleResponse } from "@/app/lib/api/utils";

import { AuthError } from "@/app/lib/api/errors";
import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { createDbClient } from "@/app/lib/db/client";
import { deleteSessionById } from "@/app/lib/db/actions";

export async function POST(req: NextRequest) {
    try {
        const dbClient = createDbClient();

        const session = await getSession(dbClient);

        if (!session) throw new AuthError("User not signed in.", 400);

        await deleteSessionById(dbClient, { sessionId: session.sessionId });

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
