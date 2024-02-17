import {
    checkUserEmailExists,
    checkUsernameExists,
    createUser,
    fetchUser,
} from "@/app/lib/db/actions";
import {
    getBody,
    handleError,
    handleResponse,
    parseBody,
} from "@/app/lib/api/utils";

import { APIError } from "@/app/lib/api/errors";
import { NextRequest } from "next/server";
import { createChallenge } from "@/app/lib/api/auth/utils";
import { createDbClient } from "@/app/lib/db/client";
import { z } from "zod";

const passwordRegex = new RegExp(
    "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,64}$"
);

const usernameRegex = new RegExp("^[A-Za-z0-9]{4,20}$");

const reqSchema = z.object({
    username: z
        .string()
        .min(4, { message: "Username must be at least 4 characters long." })
        .max(20, { message: "Username must be at least 4 characters long." })
        .refine((val) => usernameRegex.test(val), {
            message: "Username can only contain numbers and letters.",
        }),
    credentials: z.object({
        email: z.string().email(),
        password: z
            .string()
            .max(64, {
                message: "Password must be at most 64 characters long.",
            })
            .min(8, { message: "Password must be at least 8 characters long." })
            .refine((val) => passwordRegex.test(val), {
                message:
                    "Password must include at least one uppercase and one lowercase letter, at least one number, and at least one special character.",
            }),
    }),
});

async function POST(req: NextRequest) {
    try {
        const body = getBody(req);
        const input = parseBody(body, reqSchema);
        const dbClient = createDbClient();

        const { username, credentials } = input;

        const passwordAuthChallenge = await createChallenge(
            credentials.email + credentials.password
        );

        if (await checkUsernameExists(dbClient, { username }))
            throw new APIError("Username taken.", 400);

        if (await checkUserEmailExists(dbClient, { email: credentials.email }))
            throw new APIError("Email taken.", 400);

        const createdUserId = await createUser(dbClient, {
            username,
            email: credentials.email,
            hashedPassword: passwordAuthChallenge,
        });

        const user = fetchUser(dbClient, { userId: createdUserId });

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
