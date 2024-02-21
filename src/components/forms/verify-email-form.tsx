"use client";

import * as React from "react";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

import { Button } from "@/components/ui/button";
import { Icons } from "../icons";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { verificationCodeSchema } from "@/lib/validations/auth";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
    code: verificationCodeSchema,
});

type Inputs = z.infer<typeof formSchema>;

export function VerifyEmailForm() {
    const [isPending, startTransition] = React.useTransition();

    // react-hook-form
    const form = useForm<Inputs>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            code: "",
        },
    });

    function onSubmit(data: Inputs) {}

    return (
        <Form {...form}>
            <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Verification Code</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="000000"
                                    {...field}
                                    onChange={(e) => {
                                        e.target.value = e.target.value.trim();
                                        field.onChange(e);
                                    }}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button disabled={isPending}>
                    {isPending && (
                        <Icons.spinner
                            className="mr-2 size-4 animate-spin"
                            aria-hidden="true"
                        />
                    )}
                    Verify email
                    <span className="sr-only">Verify email</span>
                </Button>
            </form>
        </Form>
    );
}
