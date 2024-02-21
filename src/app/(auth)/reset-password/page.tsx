"use client";

import { ResetPasswordForm } from "@/components/forms/reset-password-form";
import { useSearchParams } from "next/navigation";

export default function ResetPassword() {
    const params = useSearchParams();
    const token = params.get("token");
    const reset = params.get("reset");

    return (
        <div className="w-fit h-fit flex flex-col items-center gap-4">
            <h1 className="text-xl font-bold">Reset Password</h1>
            {token && reset && (
                <ResetPasswordForm token={token} reset={reset} />
            )}
        </div>
    );
}
