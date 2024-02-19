import {
    Body,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Link,
    Preview,
    Tailwind,
    Text,
} from "@react-email/components";

import React from "react";
import { renderEmail } from "@/lib/api/email/render-email";

interface PasswordResetEmailProps {
    userName: string;
    websiteUrl: string;
}

function PasswordResetEmail({ userName, websiteUrl }: PasswordResetEmailProps) {
    return (
        <Html>
            <Head />
            <Preview>Password Reset Succesfull</Preview>
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
                            Your password has been succesfully changed.
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

function renderPasswordResetEmail(props: PasswordResetEmailProps): {
    html: string;
    text: string;
} {
    return renderEmail(<PasswordResetEmail {...props} />);
}

export { PasswordResetEmail, renderPasswordResetEmail };
