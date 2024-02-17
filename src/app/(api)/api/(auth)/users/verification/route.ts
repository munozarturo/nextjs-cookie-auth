import { DatabaseClient, createDbClient } from "@/app/lib/db/client";
import { NextRequest, NextResponse } from "next/server";
import { ZodError, z } from "zod";
import { createAuthChallenge, fetchUser } from "@/app/lib/db/actions";
import {
    createChallenge,
    createVerificationCode,
} from "@/app/lib/api/auth/utils";

import { renderVerificationCodeEmail } from "@/app/components/emails/verification-code";
import { sendEmail } from "@/app/lib/api/email/send-email";

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

    const { userId } = input;

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

    const user = await fetchUser(dbClient, { userId });

    const verificationCode = createVerificationCode(6);
    const verificationChallenge = await createChallenge(verificationCode);

    const authChallengeId = createAuthChallenge(dbClient, {
        userId,
        challenge: verificationChallenge,
    });

    const URL = process.env.NEXT_PUBLIC_URL;
    if (!URL) {
        throw new Error("`NEXT_PUBLIC_URL` environment variable is undefined.");
    }

    const { html: htmlBody, text: textBody } = renderVerificationCodeEmail({
        userName: user.username,
        verificationCode: verificationCode,
        verificationUrl: URL,
        websiteUrl: URL,
    });

    sendEmail({
        sender: `munoz.arturoroman@gmail.com`,
        recipient: user.email,
        subject: "Verify your email",
        textBody: textBody,
        htmlBody: htmlBody,
    });

    return NextResponse.json({
        challengeId: authChallengeId,
    });
}
