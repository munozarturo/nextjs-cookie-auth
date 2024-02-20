import {
    createPasswordReset,
    findUserByEmail,
    findUserById,
} from "@/lib/db/actions";
import { createVerificationToken, hash } from "@/lib/api/auth/utils";
import {
    getBody,
    handleError,
    handleResponse,
    parseBody,
} from "@/lib/api/utils";

import { NextRequest } from "next/server";
import { VerificationError } from "@/lib/api/errors";
import { createDbClient } from "@/lib/db/client";
import { emailSchema } from "@/lib/validations/auth";
import { renderPasswordResetRequestEmail } from "@/components/emails/reset-password-request";
import { sendEmail } from "@/lib/api/email/send-email";
import { z } from "zod";

const reqSchema = z.object({
    email: emailSchema,
});

export async function POST(req: NextRequest) {
    try {
        const body = await getBody(req);
        const input = parseBody(body, reqSchema);
        const dbClient = createDbClient();

        const { email } = input;

        const token = createVerificationToken(64);
        const tokenHash = await hash(token);

        const user = await findUserByEmail(dbClient, { email });

        if (!user.emailVerified) {
            throw new VerificationError(
                "User email address is not verified.",
                400
            );
        }

        const resetRequestId = await createPasswordReset(dbClient, {
            userId: user.userId,
            tokenHash: tokenHash,
        });

        const URL = process.env.NEXT_PUBLIC_URL;
        if (!URL) {
            throw new Error(
                "`NEXT_PUBLIC_URL` environment variable is undefined."
            );
        }

        const { html: htmlBody, text: textBody } =
            renderPasswordResetRequestEmail({
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
