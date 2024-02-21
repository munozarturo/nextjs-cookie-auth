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

async function signIn(credentials: z.infer<typeof credentialsSchema>) {
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

async function requestPasswordReset(email: z.infer<typeof emailSchema>) {
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

async function resetPassword(
    resetId: string,
    token: string,
    newPassword: z.infer<typeof passwordSchema>
) {
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

async function requestEmailVerification(userId: string) {
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

async function verifyEmail(verificationId: string, token: string) {
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
