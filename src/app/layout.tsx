"use client";

import "./globals.css";

import { QueryClient, QueryClientProvider } from "react-query";

import { Inter } from "next/font/google";
import React from "react";

const inter = Inter({ subsets: ["latin"] });

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
