import { NextRequest, NextResponse } from "next/server";
import { handleError, handleResponse } from "@/app/lib/api/utils";

import { createDbClient } from "@/app/lib/db/client";

export async function GET(req: NextRequest) {
    try {
        const client = createDbClient();

        return handleResponse({ message: "Ok", data: {}, status: 200 });
    } catch (e: any) {
        return handleError(e);
    }
}

export function POST(req: NextRequest) {
    return NextResponse.json({});
}
