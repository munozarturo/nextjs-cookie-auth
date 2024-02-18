import { handleError, handleResponse, parseContext } from "@/app/lib/api/utils";

import { NextRequest } from "next/server";
import { createDbClient } from "@/app/lib/db/client";
import { z } from "zod";

interface Params {
    userId: string;
}

const paramsSchema = z.object({
    userId: z.string(),
});

export async function GET(req: NextRequest, context: { params: Params }) {
    try {
        const params = parseContext(context.params, paramsSchema);
        const dbClient = createDbClient();

        return handleResponse({ message: "Ok", data: {}, status: 200 });
    } catch (e: any) {
        return handleError(e);
    }
}
