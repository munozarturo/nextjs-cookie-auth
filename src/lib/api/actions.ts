import {
    credentialsSchema,
    emailSchema,
    passwordSchema,
    usernameSchema,
} from "@/lib/validations/auth";

import axiosInstance from "@/lib/api/axios-instance";
import { z } from "zod";

async function signIn(credentials: z.infer<typeof credentialsSchema>) {
    const res = await axiosInstance.post("/api/signin", { credentials });

    return res;
}

async function signOut() {
    const res = await axiosInstance.post("/api/signout");

    return res;
}

async function signUp(
    username: z.infer<typeof usernameSchema>,
    credentials: z.infer<typeof credentialsSchema>
) {
    const res = await axiosInstance.post("/api/signup", {
        username,
        credentials,
    });

    return res;
}

async function requestPasswordReset(email: z.infer<typeof emailSchema>) {
    const res = await axiosInstance.post("/api/users/password/reset", {
        email,
    });

    return res;
}

async function resetPassword(
    resetId: string,
    token: string,
    newPassword: z.infer<typeof passwordSchema>
) {
    const res = await axiosInstance.post(
        `/api/users/password/reset/${resetId}`,
        { token, newPassword }
    );

    return res;
}

async function requestEmailVerification(userId: string) {
    const res = await axiosInstance.post("/api/users/verification", { userId });

    return res;
}

async function verifyEmail(verificationId: string, token: string) {
    const res = await axiosInstance.post(
        `/api/users/verify/${verificationId}`,
        { token }
    );

    return res;
}

export const API = {};
