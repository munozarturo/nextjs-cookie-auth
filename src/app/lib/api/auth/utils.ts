import { compare, decodeBase64, genSalt, hash } from "bcryptjs";

async function createAuthChallenge(
    email: string,
    password: string
): Promise<string> {
    return await hash(email + password, 10);
}

async function authChallenge(email: string, password: string): Promise<string> {
    return await hash(email + password, 10);
}

async function createVerifChallenge(verificationCode: string): Promise<string> {
    return await hash(verificationCode, 10);
}

async function verifChallenge(verificationCode: string): Promise<string> {
    return await hash(verificationCode, 10);
}

export {
    authChallenge,
    createAuthChallenge,
    createVerifChallenge,
    verifChallenge,
};
