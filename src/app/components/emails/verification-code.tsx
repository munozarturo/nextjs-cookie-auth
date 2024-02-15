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
import { renderEmail } from "@/app/lib/api/render-email";

interface VerificationCodeEmailProps {
    userName: string;
    verificationCode: string;
    verificationUrl: string;
    websiteUrl: string;
}

function VerificationCodeEmail({
    userName,
    verificationCode,
    verificationUrl,
    websiteUrl,
}: VerificationCodeEmailProps) {
    return (
        <Html>
            <Head />
            <Preview>Verify your email</Preview>
            <Tailwind>
                <Body className="bg-white font-sans">
                    <Container className="mx-auto py-5 px-0 max-w-xl flex flex-col">
                        <Heading className="text-2xl leading-8 font-bold text-gray-800 pt-4 -tracking-tighter">
                            Verify your email
                        </Heading>
                        <Text className="mb-4 text-base leading-normal text-gray-900">
                            Hello {userName},
                        </Text>
                        <Text className="mb-4 text-base leading-normal text-gray-900">
                            This link and code will only be valid for the next 5
                            minutes.
                        </Text>
                        <Section className="py-3 flex flex-row items-center justify-center w-full">
                            <Button
                                className="bg-black rounded text-white font-semibold text-base no-underline text-center block px-5 py-2"
                                href={verificationUrl}
                            >
                                Verify
                            </Button>
                        </Section>
                        <Text className="mb-4 text-base leading-normal text-gray-900">
                            If the link does not work, you can use the
                            verification code directly:
                        </Text>
                        <Section className="py-3 flex flex-row items-center justify-center w-full">
                            <code className="font-mono font-bold bg-gray-200 text-lg rounded text-gray-900 p-1">
                                {verificationCode}
                            </code>
                        </Section>
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

function renderVerificationCodeEmail(props: VerificationCodeEmailProps): {
    html: string;
    text: string;
} {
    return renderEmail(<VerificationCodeEmail {...props} />);
}

export { VerificationCodeEmail, renderVerificationCodeEmail };
