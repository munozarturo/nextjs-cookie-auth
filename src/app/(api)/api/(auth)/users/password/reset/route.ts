import { NextRequest, NextResponse } from "next/server";

import { renderPasswordResetEmail } from "@/app/components/emails/reset-password";
import { sendEmail } from "@/app/lib/api/email/send-email";

export function POST(req: NextRequest) {
    const { text: textBody, html: htmlBody } = renderPasswordResetEmail({
        userName: "munozarturo",
        resetUrl: "example.com",
        websiteUrl: "example.com",
    });

    sendEmail({
        sender: "munoz.arturoroman@gmail.com",
        recipient: "hsh47@case.edu",
        subject: "Reset your password",
        textBody: textBody,
        htmlBody: htmlBody,
    });

    return NextResponse.json({});
}
