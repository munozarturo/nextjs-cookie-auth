import { credentialsSchema, usernameSchema } from "@/lib/validations/auth";
import {
    getBody,
    handleError,
    handleResponse,
    parseBody,
} from "@/lib/api/utils";

import { APIError } from "@/lib/api/errors";
import { DB } from "@/lib/db/actions";
import { NextRequest } from "next/server";
import { createDbClient } from "@/lib/db/client";
import { hash } from "@/lib/api/auth/utils";
import { z } from "zod";

const reqSchema = z.object({
    username: usernameSchema,
    credentials: credentialsSchema,
});

async function POST(req: NextRequest) {
    try {
        const body = await getBody(req);
        const input = parseBody(body, reqSchema);
        const dbClient = createDbClient();

        const { username, credentials } = input;

        const passwordHash = await hash(credentials.password);

        if (await DB.checkUsernameExists(dbClient, { username }))
            throw new APIError("Username taken.", 400);

        if (
            await DB.checkUserEmailExists(dbClient, {
                email: credentials.email,
            })
        )
            throw new APIError("Email taken.", 400);

        const createdUserId = await DB.createUser(dbClient, {
            username,
            email: credentials.email,
            passwordHash: passwordHash,
        });

        const user = await DB.findUserById(dbClient, { userId: createdUserId });

        return handleResponse({
            message: "Succesfully created user.",
            data: { user },
            status: 200,
        });
    } catch (e: any) {
        return handleError(e);
    }
}

export { POST };
