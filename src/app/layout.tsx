import "./globals.css";

import { QueryClient, QueryClientProvider } from "react-query";

import { Inter } from "next/font/google";
import type { Metadata } from "next";
import React from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Next.js Cookie Auth",
    authors: { url: "https://github.com/munozarturo", name: "Arturo Munoz" },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const [client] = React.useState(new QueryClient());

    return (
        <html className={inter.className} lang="en">
            <QueryClientProvider client={client}>
                {children}
            </QueryClientProvider>
        </html>
    );
}
