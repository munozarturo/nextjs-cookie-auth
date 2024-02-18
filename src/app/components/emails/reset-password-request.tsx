import {
    Body,
    Button,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Link,
    Preview,
    Section,
    Tailwind,
    Text,
} from "@react-email/components";

import React from "react";
import { renderEmail } from "@/app/lib/api/email/render-email";

interface PasswordResetRequestEmailProps {
    userName: string;
    resetUrl: string;
    websiteUrl: string;
}

function PasswordResetRequestEmail({
    userName,
    resetUrl,
    websiteUrl,
}: PasswordResetRequestEmailProps) {
    return (
        <Html>
            <Head />
            <Preview>Password Reset Request</Preview>
            <Tailwind>
                <Body className="bg-white font-sans">
                    <Container className="mx-auto py-5 px-0 max-w-xl flex flex-col">
                        <Heading className="text-2xl leading-8 font-bold text-gray-800 pt-4 -tracking-tighter">
                            Reset your password
                        </Heading>
                        <Text className="mb-4 text-base leading-normal text-gray-900">
                            Hello {userName},
                        </Text>
                        <Text className="mb-4 text-base leading-normal text-gray-900">
                            Someone recently requested a password change for
                            your account. If this was you, you can set a new
                            password here:
                        </Text>
                        <Section className="py-3 flex flex-row items-center justify-center w-full">
                            <Button
                                className="bg-black rounded text-white font-semibold text-base no-underline text-center block px-5 py-2"
                                href={resetUrl}
                            >
                                Reset Password
                            </Button>
                        </Section>
                        <Text className="mb-4 text-base leading-normal text-gray-900">
                            If you don't want to change your password or didn't
                            request this, just ignore and delete this message.
                        </Text>
                        <Hr className="border-gray-300 my-10" />
                        <Link
                            href={websiteUrl}
                            className="text-sm text-gray-400"
                        >
                            Auth
                        </Link>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
}

function renderPasswordResetRequestEmail(
    props: PasswordResetRequestEmailProps
): {
    html: string;
    text: string;
} {
    return renderEmail(<PasswordResetRequestEmail {...props} />);
}

export { PasswordResetRequestEmail, renderPasswordResetRequestEmail };
