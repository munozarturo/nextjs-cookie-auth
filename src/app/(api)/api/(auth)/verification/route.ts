import { NextRequest, NextResponse } from "next/server";

import { sendEmail } from "@/app/lib/api/send-email";

export function POST(req: NextRequest) {
    return NextResponse.json({});
}
