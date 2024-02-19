import {
    createSession,
    findSessionById,
    findUserByEmail,
} from "@/lib/db/actions";
import { createSessionCookie, verifyHash } from "@/lib/api/auth/utils";
import {
    getBody,
    handleError,
    handleResponse,
    parseBody,
} from "@/lib/api/utils";

import { AuthError } from "@/lib/api/errors";
import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { createDbClient } from "@/lib/db/client";
import { credentialsSchema } from "@/lib/validations/auth";
import { z } from "zod";

const reqSchema = z.object({
    credentials: credentialsSchema,
});

export async function POST(req: NextRequest) {
    try {
        const dbClient = createDbClient();
        const body = await getBody(req);
        const input = parseBody(body, reqSchema);

        const { email, password } = input.credentials;

        const user = await findUserByEmail(dbClient, {
            email,
        });

        const passwordMatch = await verifyHash(password, user.passwordHash);

        if (!passwordMatch)
            throw new AuthError("Invalid email or password.", 400);

        const createdSessionId = await createSession(dbClient, {
            userId: user.userId,
        });
        const session = await findSessionById(dbClient, {
            sessionId: createdSessionId,
        });

        const sessionCookie = createSessionCookie(session);
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
