export default function DashLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <body>
            <main className="w-full h-full flex flex-col items-center justify-center">
                {children}
            </main>
        </body>
    );
}
