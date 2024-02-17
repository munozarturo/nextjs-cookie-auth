import { hash, verify } from "argon2";

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

async function createChallenge(data: string): Promise<string> {
    return (await hash(data)).toString();
}

async function verifyChallenge(data: string, hash: string): Promise<boolean> {
    return await verify(hash, data);
}

export {
    createChallenge,
    verifyChallenge,
    createVerificationCode,
    createVerificationToken,
};
