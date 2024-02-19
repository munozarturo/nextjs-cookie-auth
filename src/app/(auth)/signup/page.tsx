import { SignUpForm } from "@/components/forms/signup-form";

export default function SignUp() {
    return (
        <div className="w-fit h-fit flex flex-col items-center gap-4">
            <h1 className="text-xl font-bold">Sign Up</h1>
            <SignUpForm />
        </div>
    );
}
