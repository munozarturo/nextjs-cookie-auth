import { User } from "@/lib/db/actions";
import { createContext } from "react";

interface ClientSession {
    user: User;
    sessionId: string;
    userId: string;
    createdAt: Date;
    expiresAt: Date;
}

const SessionContext = createContext<ClientSession | null>(null);

export default SessionContext;
