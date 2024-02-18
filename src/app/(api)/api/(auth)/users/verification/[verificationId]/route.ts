import {
    getBody,
    handleError,
    handleResponse,
    parseBody,
    parseContext,
} from "@/app/lib/api/utils";
import { getEmailVerification, verifyEmail } from "@/app/lib/db/actions";

import { NextRequest } from "next/server";
import { VerificationError } from "@/app/lib/api/errors";
import { createDbClient } from "@/app/lib/db/client";
import { verifyHash } from "@/app/lib/api/auth/utils";
import { z } from "zod";

const reqSchema = z.object({
    token: z.string(),
});

interface Params {
    verificationId: string;
}

const paramsSchema = z.object({ verificationId: z.string() });

export async function POST(req: NextRequest, context: { params: Params }) {
    try {
        const body = await getBody(req);
        const input = parseBody(body, reqSchema);
        const params = parseContext(context.params, paramsSchema);
        const dbClient = createDbClient();

        const { verificationId } = params;

        const challenge = await getEmailVerification(dbClient, {
            verificationId,
        });

        const passed = await verifyHash(input.token, challenge.tokenHash);

        if (challenge.verified) {
            throw new VerificationError(
                "Verification failed. Challenge has already been verified.",
                400
            );
        }

        if (new Date(challenge.expiresAt) <= new Date(Date.now())) {
            throw new VerificationError(
                "Verification failed. Verification token expired.",
                400
            );
        }

        if (!passed) {
            throw new VerificationError(
                "Verification failed. Bad verification token.",
                400
            );
        }

        await verifyEmail(dbClient, { verificationId });

        return handleResponse({ message: "Verified.", data: {}, status: 200 });
    } catch (e: any) {
        return handleError(e);
    }
}
