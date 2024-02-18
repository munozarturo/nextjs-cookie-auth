import { createEmailVerification, findUserById } from "@/app/lib/db/actions";
import { createVerificationCode, hash } from "@/app/lib/api/auth/utils";
import {
    getBody,
    handleError,
    handleResponse,
    parseBody,
} from "@/app/lib/api/utils";

import { NextRequest } from "next/server";
import { createDbClient } from "@/app/lib/db/client";
import { renderVerificationCodeEmail } from "@/app/components/emails/verification-code";
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

        const user = await findUserById(dbClient, { userId });

        const verificationToken = createVerificationCode(6);
        const tokenHash = await hash(verificationToken);

        const emailVerificationId = await createEmailVerification(dbClient, {
            userId,
            tokenHash,
        });

        const URL = process.env.NEXT_PUBLIC_URL;
        if (!URL) {
            throw new Error(
                "`NEXT_PUBLIC_URL` environment variable is undefined."
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
            textBody: textBody,
            htmlBody: htmlBody,
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
