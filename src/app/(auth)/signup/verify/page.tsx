import { useRouter, useSearchParams } from "next/navigation";

import { API } from "@/lib/api/actions";
import React from "react";
import { VerifyEmailForm } from "@/components/forms/verify-email-form";
import { useMutation } from "react-query";

export default function VerifyEmail() {
    const params = useSearchParams();

    const [verificationId, setVerificationId] = React.useState<string | null>(
        params.get("id")
    );

    const requestEmailVerificationMutation = useMutation(
        API.requestEmailVerification,
        {
            retry: false,
            onSuccess: (data) => {},
        }
    );

    const verifyEmailMutation = useMutation(API.verifyEmail, {
        retry: false,
    });

    React.useEffect(() => {
        if (!verificationId) {
        }
    }, [requestEmailVerificationMutation]);

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
