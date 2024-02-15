import { NextRequest, NextResponse } from "next/server";
import { SupabaseClient, createDbClient } from "@/app/lib/db/client";
import { ZodError, z } from "zod";

import { createVerifChallenge } from "@/app/lib/api/auth/utils";
import { renderVerificationCodeEmail } from "@/app/components/emails/verification-code";
import { sendEmail } from "@/app/lib/api/send-email";

const verificationPOSTReq = z.object({
    userId: z.string(),
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
    const user = getUserRes.data[0];

    const verifCode = Math.floor(Math.random() * 1000000)
        .toString()
        .padEnd(6, "0");
    const verifChallenge = await createVerifChallenge(verifCode);

    const createAuthChallengeRes = await dbClient.rpc("create_auth_challenge", {
        _userid: input.userId,
        _expected: verifChallenge,
    });

    const url = process.env.NEXT_PUBLIC_URL;
    if (!url) {
        throw new Error("`NEXT_PUBLIC_URL` environment variable is undefined.");
    }

    const { html: htmlBody, text: textBody } = renderVerificationCodeEmail({
        userName: user.username,
        verificationCode: verifCode,
        verificationUrl: url,
        websiteUrl: url,
    });

    sendEmail({
        sender: `munoz.arturoroman@gmail.com`,
        recipient: user.email,
        subject: "Verify your email",
        textBody: textBody,
        htmlBody: htmlBody,
    });

    return NextResponse.json({
        challengeId: createAuthChallengeRes.data,
    });
}
