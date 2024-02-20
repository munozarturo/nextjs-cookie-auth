import { ResetPasswordForm } from "@/components/forms/reset-password-form";

export default function ResetPassword() {
    return (
        <div className="w-fit h-fit flex flex-col items-center gap-4">
            <h1 className="text-xl font-bold">Reset Password</h1>
            <ResetPasswordForm />
        </div>
    );
}
