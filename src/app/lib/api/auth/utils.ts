import { hash as argon2, verify as argon2Verify } from "argon2";

import { Session } from "../../db/actions";

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

export {
    hash,
    verifyHash,
    createVerificationCode,
    createVerificationToken,
    createSessionCookie,
};
