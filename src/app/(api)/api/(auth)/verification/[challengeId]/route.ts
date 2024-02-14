import { NextRequest, NextResponse } from "next/server";
import { SupabaseClient, createDbClient } from "@/app/lib/db/client";
import { ZodError, z } from "zod";

import { verifChallenge } from "@/app/lib/api/auth/utils";

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

    const passed = await verifChallenge(input.code);

    if (!passed) {
        return NextResponse.json({ mesagge: "verif failed, bad code" });
    }

    await dbClient.rpc("pass_auth_challenge", {
        _challengeid: context.params.challengeId,
    });

    return NextResponse.json({
        msg: "verified",
    });
}
