import {
    getBody,
    handleError,
    handleResponse,
    parseBody,
    parseContext,
} from "@/app/lib/api/utils";

import { NextRequest } from "next/server";
import { createDbClient } from "@/app/lib/db/client";
import { z } from "zod";

const reqSchema = z.object({});

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

        return handleResponse({ message: "Ok", data: {}, status: 200 });
    } catch (e: any) {
        return handleError(e);
    }
}
