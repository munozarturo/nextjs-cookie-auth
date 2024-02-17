import { DatabaseClient, createDbClient } from "@/app/lib/db/client";
import { NextRequest, NextResponse } from "next/server";
import {
    User,
    checkUserEmailExists,
    checkUsernameExists,
    createUser,
    fetchUser,
} from "@/app/lib/db/actions";
import { ZodError, z } from "zod";

import { createChallenge } from "@/app/lib/api/auth/utils";

const passwordRegex = new RegExp(
    "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,64}$"
);

const usernameRegex = new RegExp("^[A-Za-z0-9]{4,20}$");

const usersPOSTReq = z.object({
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
    // Get body
    let body: Object;
    try {
        body = await req.json();
    } catch (e: any) {
        return NextResponse.json(
            { status: "error", message: "No body." },
            { status: 400 }
        );
    }

    // Parse input
    let input: z.infer<typeof usersPOSTReq>;
    try {
        input = usersPOSTReq.parse(body);
    } catch (e: any) {
        if (e instanceof ZodError) {
            return NextResponse.json(
                {
                    status: "error",
                    message: "Bad request contents.",
                },
                { status: 400 }
            );
        }

        return NextResponse.json(
            {
                status: "error",
                message: "Unknown error verifying request contents.",
            },
            { status: 500 }
        );
    }

    const { username, credentials } = input;

    // Connect to db
    let dbClient: DatabaseClient;
    try {
        dbClient = createDbClient();
    } catch (e: any) {
        return NextResponse.json(
            {
                status: "error",
                message: "Unknown error connecting to database.",
            },
            { status: 500 }
        );
    }

    // create auth challenge
    const passwordAuthChallenge = await createChallenge(
        credentials.email + credentials.password
    );

    // Check if user with username
    if (await checkUsernameExists(dbClient, { username })) {
        return NextResponse.json(
            {
                status: "error",
                message: "Username taken.",
            },
            { status: 400 }
        );
    }

    // Check if user with email exists
    if (await checkUserEmailExists(dbClient, { email: credentials.email })) {
        return NextResponse.json(
            {
                status: "error",
                message: "Email already in use.",
            },
            { status: 400 }
        );
    }

    // Create user
    let createdUserId: string;
    try {
        createdUserId = await createUser(dbClient, {
            username,
            email: credentials.email,
            hashedPassword: passwordAuthChallenge,
        });
    } catch (e: any) {
        return NextResponse.json(
            {
                status: "error",
                message: "Error creating user.",
            },
            { status: 500 }
        );
    }

    // Fetch user and return
    let user: User;
    try {
        user = await fetchUser(dbClient, { userId: createdUserId });
    } catch (e: any) {
        return NextResponse.json(
            {
                status: "error",
                message: "Error fetching user data.",
            },
            { status: 500 }
        );
    }

    return NextResponse.json({
        user: user,
    });
}

export { POST };
