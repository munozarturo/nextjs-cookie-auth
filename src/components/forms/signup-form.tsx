"use client";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    emailSchema,
    passwordSchema,
    usernameSchema,
} from "@/lib/validations/auth";

import { Button } from "../ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/password-input";
import React from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
    username: usernameSchema,
    email: emailSchema,
    password: passwordSchema,
});

type Inputs = z.infer<typeof formSchema>;

export function SignUpForm() {
    const router = useRouter();
    const [isPending, startTransition] = React.useTransition();

    // react-hook-form
    const form = useForm<Inputs>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
        },
    });

    function onSubmit(data: Inputs) {
        startTransition(async () => {
            // try {
            //     await signUp.create({
            //         emailAddress: data.email,
            //         password: data.password,
            //     });
            //     // Send email verification code
            //     await signUp.prepareEmailAddressVerification({
            //         strategy: "email_code",
            //     });
            //     router.push("/signup/verify-email");
            //     toast.message("Check your email", {
            //         description: "We sent you a 6-digit verification code.",
            //     });
            // } catch (err) {
            //     catchClerkError(err);
            // }
        });
    }

    return (
        <Form {...form}>
            <form
                className="grid gap-4"
                onSubmit={(...args) =>
                    void form.handleSubmit(onSubmit)(...args)
                }
            >
                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                                <Input placeholder="username" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="someone@example.com"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <PasswordInput
                                    placeholder="**********"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button disabled={isPending}>
                    {/* {isPending && (
                        <Icons.spinner
                            className="mr-2 size-4 animate-spin"
                            aria-hidden="true"
                        />
                    )} */}
                    Continue
                    <span className="sr-only">
                        Continue to email verification page
                    </span>
                </Button>
            </form>
        </Form>
    );
}
