import { fetchAuthChallenge, passAuthChallenge } from "@/app/lib/db/actions";
import {
    getBody,
    handleError,
    handleResponse,
    parseContext,
} from "@/app/lib/api/utils";

import { NextRequest } from "next/server";
import { VerificationError } from "@/app/lib/api/errors";
import { createDbClient } from "@/app/lib/db/client";
import { verifyChallenge } from "@/app/lib/api/auth/utils";
import { z } from "zod";

const contextSchema = z.object({
    code: z.string(),
});

interface Params {
    challengeId: string;
}

export async function POST(req: NextRequest, context: { params: Params }) {
    try {
        const body = getBody(req);
        const input = parseContext(body, contextSchema);
        const dbClient = createDbClient();

        const { challengeId } = context.params;

        const challenge = await fetchAuthChallenge(dbClient, { challengeId });
        const passed = await verifyChallenge(input.code, challenge.expected);

        if (!passed) {
            throw new VerificationError(
                "Verification failed. Bad verification token.",
                404
            );
        }

        await passAuthChallenge(dbClient, { challengeId });

        return handleResponse({ message: "Verified.", data: {}, status: 200 });
    } catch (e: any) {
        return handleError(e);
    }
}
