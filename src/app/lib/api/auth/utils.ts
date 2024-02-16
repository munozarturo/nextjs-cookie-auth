import { hash, verify } from "argon2";

async function createChallenge(data: string): Promise<string> {
    return (await hash(data)).toString();
}

async function verifyChallenge(data: string, hash: string): Promise<boolean> {
    return await verify(hash, data);
}

export { createChallenge, verifyChallenge };
