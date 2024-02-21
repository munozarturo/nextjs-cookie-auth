import { createBlankSessionCookie, verifyHash } from "@/lib/api/auth/utils";
import {
    getBody,
    handleError,
    handleResponse,
    parseBody,
    parseContext,
} from "@/lib/api/utils";

import { DB } from "@/lib/db/actions";
import { NextRequest } from "next/server";
import { VerificationError } from "@/lib/api/errors";
import { cookies } from "next/headers";
import { createDbClient } from "@/lib/db/client";
import { z } from "zod";

interface Params {
    sessionId: string;
}

const paramsSchema = z.object({ sessionId: z.string() });

export async function GET(req: NextRequest, context: { params: Params }) {
    try {
        const params = parseContext(context.params, paramsSchema);
        const dbClient = createDbClient();

        const { sessionId } = params;

        const session = await DB.findSessionById(dbClient, { sessionId });

        const user = await DB.findUserById(dbClient, {
            userId: session.userId,
        });

        if (new Date(session.expiresAt) < new Date(Date.now())) {
            const sessionCookie = createBlankSessionCookie();
            cookies().set(
                sessionCookie.name,
                sessionCookie.value,
                sessionCookie.attributes
            );
        }

        return handleResponse({
            message: "Verified.",
            data: {
                session,
                user,
            },
            status: 200,
        });
    } catch (e: any) {
        return handleError(e);
    }
}
