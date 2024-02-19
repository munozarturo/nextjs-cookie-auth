import { DatabaseError } from "../api/errors";
import { DatabaseClient } from "./client";

interface User {
    userId: string;
    username: string;
    email: string;
    emailVerified: boolean;
}

async function createUser(
    client: DatabaseClient,
    args: { username: string; email: string; passwordHash: string }
): Promise<string> {
    const res = await client.rpc("create_user", {
        _username: args.username,
        _email: args.email,
        _password_hash: args.passwordHash,
    });

    if (res.error) {
        throw new DatabaseError("Error creating user.", 500);
    }

    return res.data;
}

async function findUserById(
    client: DatabaseClient,
    args: { userId: string }
): Promise<User> {
    const res = await client.rpc("find_user_by_id", {
        _user_id: args.userId,
    });

    if (res.error) {
        throw new DatabaseError("Error fetching user.", 500);
    }

    const { user_id, username, email, email_verified } = res.data[0];

    const user: User = {
        userId: user_id,
        username: username,
        email: email,
        emailVerified: email_verified,
    };

    return user;
}

interface UserWithCredentials extends User {
    passwordHash: string;
}

async function findUserByEmail(
    client: DatabaseClient,
    args: { email: string }
): Promise<UserWithCredentials> {
    const res = await client.rpc("find_user_by_email", {
        _email: args.email,
    });

    if (res.error) {
        throw new DatabaseError("Error fetching user.", 500);
    }

    const { user_id, username, email, email_verified, password_hash } =
        res.data[0];

    const user: UserWithCredentials = {
        userId: user_id,
        username: username,
        email: email,
        emailVerified: email_verified,
        passwordHash: password_hash,
    };

    return user;
}

async function checkUsernameExists(
    client: DatabaseClient,
    args: { username: string }
): Promise<boolean> {
    const res = await client.rpc("check_user_exists_by_username", {
        _username: args.username,
    });

    if (res.error) {
        throw new DatabaseError("Error checking username validity.", 500);
    }

    return res.data;
}

async function checkUserEmailExists(
    client: DatabaseClient,
    args: { email: string }
): Promise<boolean> {
    const res = await client.rpc("check_user_exists_by_email", {
        _email: args.email,
    });

    if (res.error) {
        throw new DatabaseError("Error checking email validity.", 500);
    }

    return res.data;
}

interface EmailVerification {
    verificationId: string;
    userId: string;
    tokenHash: string;
    verified: boolean;
    createdAt: Date;
    expiresAt: Date;
}

async function createEmailVerification(
    client: DatabaseClient,
    args: { userId: string; tokenHash: string }
): Promise<string> {
    const res = await client.rpc("create_email_verification", {
        _user_id: args.userId,
        _token_hash: args.tokenHash,
    });

    if (res.error) {
        throw new DatabaseError("Error creating email verification.", 500);
    }

    return res.data;
}

async function getEmailVerification(
    client: DatabaseClient,
    args: { verificationId: string }
): Promise<EmailVerification> {
    const res = await client.rpc("get_email_verification", {
        _verification_id: args.verificationId,
    });

    if (res.error) {
        throw new DatabaseError("Error getting email verification.", 500);
    }

    const {
        verification_id: verificationId,
        user_id: userId,
        token_hash: tokenHash,
        verified,
        created_at: createdAt,
        expires_at: expiresAt,
    } = res.data[0];

    const emailVerification: EmailVerification = {
        verificationId,
        userId,
        tokenHash,
        verified,
        createdAt: new Date(createdAt),
        expiresAt: new Date(expiresAt),
    };

    return emailVerification;
}

async function verifyEmail(
    client: DatabaseClient,
    args: { verificationId: string }
): Promise<void> {
    const res = await client.rpc("verify_email", {
        _verification_id: args.verificationId,
    });

    if (res.error) {
        throw new DatabaseError("Error verifying email.", 500);
    }
}

interface PasswordReset {
    passwordResetId: string;
    userId: string;
    tokenHash: string;
    utilized: boolean;
    createdAt: Date;
    expiresAt: Date;
}

async function createPasswordReset(
    client: DatabaseClient,
    args: { userId: string; tokenHash: string }
): Promise<string> {
    const res = await client.rpc("create_password_reset", {
        _user_id: args.userId,
        _token_hash: args.tokenHash,
    });

    if (res.error) {
        throw new DatabaseError("Error creating email verification.", 500);
    }

    return res.data;
}

async function getPasswordReset(
    client: DatabaseClient,
    args: { passwordResetId: string }
): Promise<PasswordReset> {
    const res = await client.rpc("get_password_reset", {
        _password_reset_id: args.passwordResetId,
    });

    if (res.error) {
        throw new DatabaseError("Error getting password reset.", 500);
    }

    const {
        password_reset_id: passwordResetId,
        user_id: userId,
        token_hash: tokenHash,
        utilized,
        created_at: createdAt,
        expires_at: expiresAt,
    } = res.data[0];

    const passwordReset: PasswordReset = {
        passwordResetId,
        userId,
        tokenHash,
        utilized,
        createdAt: new Date(createdAt),
        expiresAt: new Date(expiresAt),
    };

    return passwordReset;
}

async function resetPassword(
    client: DatabaseClient,
    args: { passwordResetId: string; newPasswordHash: string }
): Promise<void> {
    const res = await client.rpc("reset_password", {
        _password_reset_id: args.passwordResetId,
        _password_hash: args.newPasswordHash,
    });

    if (res.error) {
        throw new DatabaseError("Error resetting password.", 500);
    }
}

interface Session {
    sessionId: string;
    userId: string;
    createdAt: Date;
    expiresAt: Date;
}

async function createSession(
    client: DatabaseClient,
    args: { userId: string }
): Promise<string> {
    const res = await client.rpc("create_session", { _user_id: args.userId });

    if (res.error) {
        throw new DatabaseError("Error creating session.", 500);
    }

    return res.data;
}

async function findSessionById(
    client: DatabaseClient,
    args: { sessionId: string }
): Promise<Session> {
    const res = await client.rpc("find_session_by_id", {
        _session_id: args.sessionId,
    });

    if (res.error) {
        throw new DatabaseError("Error fetching session.", 500);
    }

    const {
        session_id: sessionId,
        user_id: userId,
        created_at: createdAt,
        expires_at: expiresAt,
    } = res.data[0];

    const session: Session = {
        sessionId,
        userId,
        createdAt: new Date(createdAt),
        expiresAt: new Date(expiresAt),
    };

    return session;
}

async function deleteSessionById(
    client: DatabaseClient,
    args: { sessionId: string }
): Promise<void> {
    const res = await client.rpc("delete_session_by_id", {
        _session_id: args.sessionId,
    });

    if (res.error) {
        throw new DatabaseError("Error deleting session.", 500);
    }
}

export {
    type User,
    checkUsernameExists,
    checkUserEmailExists,
    createUser,
    findUserById,
    findUserByEmail,
    type EmailVerification,
    createEmailVerification,
    getEmailVerification,
    verifyEmail,
    type PasswordReset,
    createPasswordReset,
    getPasswordReset,
    resetPassword,
    type Session,
    createSession,
    findSessionById,
    deleteSessionById,
};
