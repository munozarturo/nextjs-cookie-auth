import { APIError, BodyParsingError, RequestBodyError } from "./errors";
import { NextRequest, NextResponse } from "next/server";
import { ZodError, z } from "zod";

async function getBody(req: NextRequest): Promise<Object> {
    try {
        return await req.json();
    } catch (e: any) {
        throw new RequestBodyError("Missing request body.", 400);
    }
}

function parseBody<T extends z.ZodType<any, any>>(
    body: Object,
    schema: T
): z.infer<T> {
    try {
        return schema.parse(body);
    } catch (e: any) {
        if (e instanceof ZodError) {
            throw new BodyParsingError("Error parsing body.", 400);
        }

        throw e;
    }
}

function handleResponse(res: {
    message: string;
    data: Object | null;
    status: number;
}): NextResponse<{ timestamp: number; message: string; data: Object | null }> {
    return NextResponse.json(
        {
            timestamp: Date.now(),
            message: res.message,
            data: res.data,
        },
        { status: res.status }
    );
}

function handleError(
    e: any
): NextResponse<{ timestamp: number; message: string; data: Object | null }> {
    if (e instanceof APIError) {
        return handleResponse({
            message: e.message,
            data: null,
            status: e.status,
        });
    }

    return handleResponse({
        message: "Unknown error.",
        data: null,
        status: 500,
    });
}

export { getBody, parseBody, handleResponse, handleError };
