import { decodeBase64, genSalt, hash } from "bcryptjs";

async function createAuthChallenge(
    email: string,
    password: string
): Promise<{ salt: string; hash: string }> {
    // input, salt rounds
    const salt: string = await genSalt(10);

    return { salt, hash: await hash(email + password + salt, 10) };
}

async function authChallenge(
    email: string,
    password: string,
    salt: string
): Promise<string> {
    return await hash(email + password + salt, 10);
}

async function createVerifChallenge(
    verificationCode: string
): Promise<{ salt: string; hash: string }> {
    // input, salt rounds
    const salt: string = await genSalt(10);

    return { salt, hash: await hash(verificationCode + salt, 10) };
}

async function verifChallenge(
    verificationCode: string,
    salt: string
): Promise<string> {
    return await hash(verificationCode + salt, 10);
}

export {
    authChallenge,
    createAuthChallenge,
    createVerifChallenge,
    verifChallenge,
};
