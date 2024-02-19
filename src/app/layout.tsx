import "./globals.css";

import { Inter } from "next/font/google";
import type { Metadata } from "next";

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
    return (
        <html className={inter.className} lang="en">
            {children}
        </html>
    );
}
