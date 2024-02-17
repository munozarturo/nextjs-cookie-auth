import { DatabaseClient } from "./client";

async function checkUsernameExists(
    client: DatabaseClient,
    args: { username: string }
): Promise<boolean> {
    const res = await client.rpc("check_user_exists_by_username", {
        _username: args.username,
    });

    return res.data;
}

async function checkUserEmailExists(
    client: DatabaseClient,
    args: { email: string }
): Promise<boolean> {
    const res = await client.rpc("check_user_exists_by_email", {
        _email: args.email,
    });

    return res.data;
}

async function createUser(
    client: DatabaseClient,
    args: { username: string; email: string; hashedPassword: string }
): Promise<string> {
    const res = await client.rpc("create_user", {
        _username: args.username,
        _email: args.email,
        _password: args.hashedPassword,
    });

    return res.data;
}

interface User {
    userid: string;
    username: string;
    email: string;
    verified: string;
}

async function fetchUser(
    client: DatabaseClient,
    args: { userId: string }
): Promise<{
    userid: string;
    username: string;
    email: string;
    verified: string;
}> {
    const res = await client.rpc("find_user_by_id", {
        _userid: args.userId,
    });

    return res.data[0];
}

async function createAuthChallenge(
    client: DatabaseClient,
    args: { userId: string; challenge: string }
): Promise<string> {
    const res = await client.rpc("create_auth_challenge", {
        _userid: args.userId,
        _expected: args.challenge,
    });

    return res.data;
}

interface Challenge {
    challengeid: string;
    userid: string;
    expected: string;
    passed: boolean;
    created_at: string;
}

async function fetchAuthChallenge(
    client: DatabaseClient,
    args: { challengeId: string }
): Promise<Challenge> {
    const res = await client.rpc("fetch_auth_challenge_by_id", {
        _challengeid: args.challengeId,
    });

    return res.data[0];
}

async function passAuthChallenge(
    client: DatabaseClient,
    args: { challengeId: string }
) {
    const res = await client.rpc("pass_auth_challenge", {
        _challengeid: args.challengeId,
    });
}

export {
    checkUsernameExists,
    checkUserEmailExists,
    createUser,
    fetchUser,
    type User,
    createAuthChallenge,
    fetchAuthChallenge,
    passAuthChallenge,
};
