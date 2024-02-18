import {
    getBody,
    handleError,
    handleResponse,
    parseBody,
} from "@/app/lib/api/utils";

import { NextRequest } from "next/server";
import { createDbClient } from "@/app/lib/db/client";
import { z } from "zod";

const reqSchema = z.object({
    userId: z.string(),
});

export async function POST(req: NextRequest) {
    try {
        const body = await getBody(req);
        const input = parseBody(body, reqSchema);
        const dbClient = createDbClient();

        return handleResponse({ message: "Ok", data: {}, status: 200 });
    } catch (e: any) {
        return handleError(e);
    }
}
