"use client";

import React, { useContext, useEffect } from "react";

import { API } from "@/lib/api/actions";

import Cookie from "js-cookie";
import SessionContext from "./session-context";
import { User } from "@/lib/db/actions";

interface ClientSession {
    user: User;
    sessionId: string;
    userId: string;
    createdAt: Date;
    expiresAt: Date;
}

interface SessionProviderProps {
    children: React.ReactNode;
}

const SessionProvider: React.FC<SessionProviderProps> = ({
    children,
}: SessionProviderProps) => {
    const [session, setSession] = React.useState<ClientSession | null>(null);

    const sessionId = Cookie.get("user-session");

    useEffect(() => {
        const fetchSession = async () => {
            try {
                if (sessionId) {
                    const fetchedSession = await API.fetchSession({
                        sessionId,
                    });
                    setSession(fetchedSession);
                } else {
                    setSession(null);
                }
            } catch (e: any) {
                console.error("Failed to fetch session:", e);

                setSession(null);
            }
        };

        fetchSession();
    }, [sessionId]);

    return (
        <SessionContext.Provider value={session}>
            {children}
        </SessionContext.Provider>
    );
};

function useSession() {
    const context = useContext(SessionContext);

    if (context === undefined) {
        throw new Error("useSession must be used within a SessionProvider");
    }

    return context;
}

export { SessionProvider, useSession, type ClientSession };
