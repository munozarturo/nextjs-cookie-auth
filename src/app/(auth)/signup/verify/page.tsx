import React from "react";
import { VerifyEmailForm } from "@/components/forms/verify-email-form";
import { useSession } from "@/components/providers/session";

export default function VerifyEmail() {
    const session = useSession();

    console.log(session);

    return (
        <div className="w-fit h-fit flex flex-col items-center gap-4">
            <h1 className="text-xl font-bold">Verify your email</h1>
            <p className="text-wrap">
                We sent a 6 digit code to your email. Use it to verify your
                email.
            </p>
            <VerifyEmailForm />
        </div>
    );
}
