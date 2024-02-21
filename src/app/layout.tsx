"use client";

import "./globals.css";

import { QueryClient, QueryClientProvider } from "react-query";

import { Inter } from "next/font/google";
import React from "react";
import { SessionProvider } from "@/components/providers/session";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const [client] = React.useState(new QueryClient());

    return (
        <html className={inter.className} lang="en">
            <SessionProvider>
                <QueryClientProvider client={client}>
                    {children}
                </QueryClientProvider>
            </SessionProvider>
        </html>
    );
}
