import { DatabaseClient, createDbClient } from "@/app/lib/db/client";
import { NextRequest, NextResponse } from "next/server";
import { ZodError, z } from "zod";
import { fetchAuthChallenge, passAuthChallenge } from "@/app/lib/db/actions";

import { verifyChallenge } from "@/app/lib/api/auth/utils";

const verificationChallengeIdPOSTReq = z.object({
    code: z.string(),
});

interface Params {
    challengeId: string;
}

export async function POST(req: NextRequest, context: { params: Params }) {
    let body: Object;
    try {
        body = await req.json();
    } catch (e: any) {
        return NextResponse.json(
            { status: "error", message: "No body." },
            { status: 400 }
        );
    }

    let input: z.infer<typeof verificationChallengeIdPOSTReq>;
    try {
        input = verificationChallengeIdPOSTReq.parse(body);
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

    const { challengeId } = context.params;

    const challenge = await fetchAuthChallenge(dbClient, { challengeId });

    const passed = await verifyChallenge(input.code, challenge.expected);

    if (!passed) {
        return NextResponse.json({ mesagge: "verif failed, bad code" });
    }

    await passAuthChallenge(dbClient, { challengeId });

    return NextResponse.json({
        msg: "verified",
    });
}
