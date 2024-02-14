import { NextRequest, NextResponse } from "next/server";
import { SupabaseClient, createDbClient } from "@/app/lib/db/client";
import { ZodError, z } from "zod";

import { createVerifChallenge } from "@/app/lib/api/auth/utils";
import { genSalt } from "bcryptjs";
import { sendEmail } from "@/app/lib/api/send-email";

const verificationPOSTReq = z.object({
    userId: z.string().uuid({ message: "Invalid UUID format." }),
});

export async function POST(req: NextRequest) {
    let body: Object;
    try {
        body = await req.json();
    } catch (e: any) {
        return NextResponse.json(
            { status: "error", message: "No body." },
            { status: 400 }
        );
    }

    let input: z.infer<typeof verificationPOSTReq>;
    try {
        input = verificationPOSTReq.parse(body);
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

    const getUserRes = await dbClient.rpc("find_user_by_id", {
        _userid: input.userId,
    });
    const user = getUserRes.data;

    const verifCode = Math.floor(Math.random() * 1000000).toString();
    const verifChallenge = await createVerifChallenge(verifCode);

    const createAuthChallengeRes = await dbClient.rpc("create_auth_challenge", {
        _userid: input.userId,
        _salt: verifChallenge.salt,
        _expected: verifChallenge.hash,
    });

    sendEmail({
        sender: `munoz.arturoroman@gmail.com`,
        recipient: user.email,
        subject: "Verify your email",
        textBody: `Your code is ${verifCode}.`,
    });

    return NextResponse.json({
        challengeId: createAuthChallengeRes.data,
    });
}
