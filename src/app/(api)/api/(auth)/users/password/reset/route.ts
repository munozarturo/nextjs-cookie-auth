import { createPasswordReset, findUserById } from "@/app/lib/db/actions";
import { createVerificationToken, hash } from "@/app/lib/api/auth/utils";
import {
    getBody,
    handleError,
    handleResponse,
    parseBody,
} from "@/app/lib/api/utils";

import { NextRequest } from "next/server";
import { VerificationError } from "@/app/lib/api/errors";
import { createDbClient } from "@/app/lib/db/client";
import { renderPasswordResetEmail } from "@/app/components/emails/reset-password";
import { sendEmail } from "@/app/lib/api/email/send-email";
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

        const token = createVerificationToken(64);
        const tokenHash = await hash(token);

        const user = await findUserById(dbClient, { userId });

        if (!user.emailVerified) {
            throw new VerificationError(
                "User email address is not verified.",
                400
            );
        }

        const resetRequestId = await createPasswordReset(dbClient, {
            userId: userId,
            tokenHash: tokenHash,
        });

        const URL = process.env.NEXT_PUBLIC_URL;
        if (!URL) {
            throw new Error(
                "`NEXT_PUBLIC_URL` environment variable is undefined."
            );
        }

        const { html: htmlBody, text: textBody } = renderPasswordResetEmail({
            userName: user.username + token,
            resetUrl: URL,
            websiteUrl: URL,
        });

        await sendEmail({
            sender: "munoz.arturoroman@gmail.com",
            recipient: user.email,
            subject: "Reset your possword",
            htmlBody,
            textBody,
        });

        return handleResponse({
            message: "Created password reset request.",
            data: { resetRequestId },
            status: 200,
        });
    } catch (e: any) {
        return handleError(e);
    }
}
