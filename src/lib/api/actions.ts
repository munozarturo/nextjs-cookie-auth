"use client";

import {
    credentialsSchema,
    emailSchema,
    passwordSchema,
    usernameSchema,
} from "@/lib/validations/auth";

import { APIError } from "./errors";
import axiosInstance from "@/lib/api/axios-instance";
import { z } from "zod";

async function signIn(variables: {
    credentials: z.infer<typeof credentialsSchema>;
}) {
    const { credentials } = variables;

    await axiosInstance.post("/api/signin", { credentials }).then(
        (response) => {
            return response;
        },
        (error) => {
            throw new APIError(
                error.response.data.message,
                error.response.status
            );
        }
    );
}

async function signOut() {
    await axiosInstance.post("/api/signout").then(
        (response) => {
            return response;
        },
        (error) => {
            throw new APIError(
                error.response.data.message,
                error.response.status
            );
        }
    );
}

async function signUp(variables: {
    username: z.infer<typeof usernameSchema>;
    credentials: z.infer<typeof credentialsSchema>;
}) {
    const { username, credentials } = variables;

    await axiosInstance
        .post("/api/signup", {
            username,
            credentials,
        })
        .then(
            (response) => {
                return response;
            },
            (error) => {
                throw new APIError(
                    error.response.data.message,
                    error.response.status
                );
            }
        );
}

async function requestPasswordReset(variables: {
    email: z.infer<typeof emailSchema>;
}) {
    const { email } = variables;

    await axiosInstance
        .post("/api/users/password/reset", {
            email,
        })
        .then(
            (response) => {
                return response;
            },
            (error) => {
                throw new APIError(
                    error.response.data.message,
                    error.response.status
                );
            }
        );
}

async function resetPassword(variables: {
    resetId: string;
    token: string;
    newPassword: z.infer<typeof passwordSchema>;
}) {
    const { resetId, token, newPassword } = variables;

    await axiosInstance
        .post(`/api/users/password/reset/${resetId}`, { token, newPassword })
        .then(
            (response) => {
                return response;
            },
            (error) => {
                throw new APIError(
                    error.response.data.message,
                    error.response.status
                );
            }
        );
}

async function requestEmailVerification(variables: { userId: string }) {
    const { userId } = variables;

    await axiosInstance.post("/api/users/verification", { userId }).then(
        (response) => {
            return response;
        },
        (error) => {
            throw new APIError(
                error.response.data.message,
                error.response.status
            );
        }
    );
}

async function verifyEmail(variables: {
    verificationId: string;
    token: string;
}) {
    const { verificationId, token } = variables;

    await axiosInstance
        .post(`/api/users/verify/${verificationId}`, { token })
        .then(
            (response) => {
                return response;
            },
            (error) => {
                throw new APIError(
                    error.response.data.message,
                    error.response.status
                );
            }
        );
}

export const API = {
    signIn,
    signOut,
    signUp,
    requestEmailVerification,
    verifyEmail,
    requestPasswordReset,
    resetPassword,
};
