import { NextRequest, NextResponse } from "next/server";
import { SupabaseClient, createDbClient } from "@/app/lib/db/client";
import { ZodError, z } from "zod";

import { createAuthChallenge } from "@/app/lib/api/auth/utils";

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

interface usersPOSTRes {
    userId?: string;
}

async function POST(req: NextRequest) {
    let body: Object;
    try {
        body = await req.json();
    } catch (e: any) {
        return NextResponse.json(
            { status: "error", message: "No body." },
            { status: 400 }
        );
    }

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

    let dbClient: SupabaseClient;
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

    const res: usersPOSTRes = {};
    // Check if user with username or email exists.
    if (
        (
            await dbClient.rpc("check_user_exists_by_username", {
                _username: input.username,
            })
        ).data
    ) {
        return NextResponse.json(
            {
                status: "error",
                message: "Username taken.",
            },
            { status: 400 }
        );
    }

    if (
        (
            await dbClient.rpc("check_user_exists_by_email", {
                _email: input.credentials.email,
            })
        ).data
    ) {
        return NextResponse.json(
            {
                status: "error",
                message: "Email already in use.",
            },
            { status: 400 }
        );
    }

    // Create user
    const authChallenge = await createAuthChallenge(
        input.credentials.email,
        input.credentials.password
    );

    const createUserRes = await dbClient.rpc("create_user", {
        _username: input.username,
        _email: input.credentials.email,
        _password: authChallenge.hash,
        _salt: authChallenge.salt,
    });

    // Fetch user and return
    const fetchUserRes = await dbClient.rpc("find_user_by_id", {
        _userid: createUserRes.data,
    });

    return NextResponse.json({
        user: fetchUserRes.data,
    });
}

export { POST };
