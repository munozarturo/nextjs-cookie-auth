import {
    findUserById,
    getPasswordReset,
    resetPassword,
} from "@/app/lib/db/actions";
import {
    getBody,
    handleError,
    handleResponse,
    parseBody,
    parseContext,
} from "@/app/lib/api/utils";
import { hash, verifyHash } from "@/app/lib/api/auth/utils";

import { NextRequest } from "next/server";
import { VerificationError } from "@/app/lib/api/errors";
import { createDbClient } from "@/app/lib/db/client";
import { renderPasswordResetEmail } from "@/app/components/emails/password-reset";
import { sendEmail } from "@/app/lib/api/email/send-email";
import { z } from "zod";

const reqSchema = z.object({
    token: z.string(),
    newPassword: z.string(),
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

        const passwordReset = await getPasswordReset(dbClient, {
            passwordResetId,
        });

        const user = await findUserById(dbClient, {
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

        await resetPassword(dbClient, {
            passwordResetId,
            newPasswordHash,
        });

        const URL = process.env.NEXT_PUBLIC_URL;
        if (!URL) {
            throw new Error(
                "`NEXT_PUBLIC_URL` environment variable is undefined."
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
