import {
    getBody,
    handleError,
    handleResponse,
    parseBody,
    parseContext,
} from "@/lib/api/utils";
import { hash, verifyHash } from "@/lib/api/auth/utils";

import { DB } from "@/lib/db/actions";
import { NextRequest } from "next/server";
import { VerificationError } from "@/lib/api/errors";
import { createDbClient } from "@/lib/db/client";
import { passwordSchema } from "@/lib/validations/auth";
import { renderPasswordResetEmail } from "@/components/emails/password-reset";
import { sendEmail } from "@/lib/api/email/send-email";
import { z } from "zod";

const reqSchema = z.object({
    token: z.string(),
    newPassword: passwordSchema,
});

interface Params {
    resetId: string;
}

const paramsSchema = z.object({ resetId: z.string() });

export async function POST(req: NextRequest, context: { params: Params }) {
    try {
        const body = await getBody(req);
        const input = parseBody(body, reqSchema);
        const params = parseContext(context.params, paramsSchema);
        const dbClient = createDbClient();

        const { token, newPassword } = input;
        const { resetId: passwordResetId } = params;

        const newPasswordHash = await hash(newPassword);

        const passwordReset = await DB.getPasswordReset(dbClient, {
            passwordResetId,
        });

        const user = await DB.findUserById(dbClient, {
            userId: passwordReset.userId,
        });

        const validToken = await verifyHash(token, passwordReset.tokenHash);

        if (passwordReset.utilized) {
            throw new VerificationError(
                "Reset failed. Password reset request has alrady been used.",
                400
            );
        }

        if (new Date(passwordReset.expiresAt) <= new Date(Date.now())) {
            throw new VerificationError(
                "Reset failed. Verification token expired.",
                400
            );
        }

        if (!validToken) {
            throw new VerificationError(
                "Reset failed. Bad verification token.",
                400
            );
        }

        await DB.resetPassword(dbClient, {
            passwordResetId,
            newPasswordHash,
        });

        const URL = process.env.NEXT_PUBLIC_BASE_URL;
        if (!URL) {
            throw new Error(
                "`NEXT_PUBLIC_BASE_URL` environment variable is undefined."
            );
        }

        const { html: htmlBody, text: textBody } = renderPasswordResetEmail({
            userName: user.username,
            websiteUrl: URL,
        });

        sendEmail({
            sender: "munoz.arturoroman@gmail.com",
            recipient: user.email,
            subject: "Your password has been reset.",
            textBody,
            htmlBody,
        });

        return handleResponse({
            message: "Succesfully reset password.",
            data: {},
            status: 200,
        });
    } catch (e: any) {
        return handleError(e);
    }
}
