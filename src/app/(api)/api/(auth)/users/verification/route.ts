import { createVerificationCode, hash } from "@/lib/api/auth/utils";
import {
    getBody,
    handleError,
    handleResponse,
    parseBody,
} from "@/lib/api/utils";

import { DB } from "@/lib/db/actions";
import { NextRequest } from "next/server";
import { createDbClient } from "@/lib/db/client";
import { renderVerificationCodeEmail } from "@/components/emails/verification-code";
import { sendEmail } from "@/lib/api/email/send-email";
import { z } from "zod";

const reqSchema = z.object({
    userId: z.string(),
});

export async function POST(req: NextRequest) {
    try {
        const body = await getBody(req);
        const input = parseBody(body, reqSchema);
        const dbClient = createDbClient();

        const { userId } = input;

        const verificationToken = createVerificationCode(6);
        const tokenHash = await hash(verificationToken);

        const user = await DB.findUserById(dbClient, { userId });

        const emailVerificationId = await DB.createEmailVerification(dbClient, {
            userId,
            tokenHash,
        });

        const URL = process.env.NEXT_PUBLIC_BASE_URL;
        if (!URL) {
            throw new Error(
                "`NEXT_PUBLIC_BASE_URL` environment variable is undefined."
            );
        }

        const { html: htmlBody, text: textBody } = renderVerificationCodeEmail({
            userName: user.username,
            verificationCode: verificationToken,
            verificationUrl: URL,
            websiteUrl: URL,
        });

        await sendEmail({
            sender: `munoz.arturoroman@gmail.com`,
            recipient: user.email,
            subject: "Verify your email",
            textBody,
            htmlBody,
        });

        return handleResponse({
            message: "Sucessfully created challenge.",
            data: { emailVerificationId },
            status: 200,
        });
    } catch (e: any) {
        return handleError(e);
    }
}
