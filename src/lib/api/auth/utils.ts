import { Session, User, findSessionById, findUserById } from "../../db/actions";
import { hash as argon2, verify as argon2Verify } from "argon2";

import { DatabaseClient } from "../../db/client";
import { cookies } from "next/headers";

function createVerificationCode(length: number): string {
    const verifCode = Math.floor(Math.random() * Math.pow(10, length))
        .toString()
        .padEnd(length, "0");

    return verifCode;
}

function createVerificationToken(length: number): string {
    const chars =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";

    let verifToken: string[] = Array(length);
    for (let i = 0; i < length; i++) {
        verifToken[i] = chars.charAt(Math.floor(chars.length * Math.random()));
    }

    return verifToken.join("");
}

async function hash(data: string): Promise<string> {
    return (await argon2(data)).toString();
}

async function verifyHash(data: string, hash: string): Promise<boolean> {
    return await argon2Verify(hash, data);
}

function createSessionCookie(session: Session): {
    name: string;
    value: string;
    attributes: any;
} {
    const cookieName = "user-session";
    const cookieValue = session.sessionId;
    const cookieAttributes = {
        httpOnly: true,
        secure: true,
        sameSite: "Strict",
        expires: session.expiresAt,
    };

    return {
        name: cookieName,
        value: cookieValue,
        attributes: cookieAttributes,
    };
}

function createBlankSessionCookie(): {
    name: string;
    value: string;
    attributes: any;
} {
    return { name: "user-session", value: "", attributes: {} };
}

interface ServerSession {
    sessionId: string;
    createdAt: Date;
    expiresAt: Date;
    userId: string;
    user: User;
}

async function getSession(
    client: DatabaseClient
): Promise<ServerSession | null> {
    const sessionId = cookies().get("user-session")?.value;

    if (!sessionId) return null;

    const session = await findSessionById(client, { sessionId });
    const user = await findUserById(client, { userId: session.userId });

    return { ...session, user };
}

export {
    hash,
    verifyHash,
    createVerificationCode,
    createVerificationToken,
    createSessionCookie,
    createBlankSessionCookie,
    getSession,
};
