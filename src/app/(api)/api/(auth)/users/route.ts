import {
    checkUserEmailExists,
    checkUsernameExists,
    createUser,
    findUserById,
} from "@/app/lib/db/actions";
import { credentialsSchema, usernameSchema } from "@/app/lib/validations";
import {
    getBody,
    handleError,
    handleResponse,
    parseBody,
} from "@/app/lib/api/utils";

import { APIError } from "@/app/lib/api/errors";
import { NextRequest } from "next/server";
import { createDbClient } from "@/app/lib/db/client";
import { hash } from "@/app/lib/api/auth/utils";
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

        if (await checkUsernameExists(dbClient, { username }))
            throw new APIError("Username taken.", 400);

        if (await checkUserEmailExists(dbClient, { email: credentials.email }))
            throw new APIError("Email taken.", 400);

        const createdUserId = await createUser(dbClient, {
            username,
            email: credentials.email,
            passwordHash: passwordHash,
        });

        const user = await findUserById(dbClient, { userId: createdUserId });

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
