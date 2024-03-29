import { z } from "zod";

const usernameRegex = new RegExp("^[A-Za-z0-9]{4,20}$");

const usernameSchema = z
    .string()
    .min(4, { message: "Username must be at least 4 characters long." })
    .max(20, { message: "Username must be at least 4 characters long." })
    .refine((val) => usernameRegex.test(val), {
        message: "Username can only contain numbers and letters.",
    });

const emailSchema = z.string().email();

const passwordSchema = z
    .string()
    .max(64, {
        message: "Password must be at most 64 characters long.",
    })
    .min(8, {
        message: "Password must be at least 8 characters long.",
    })
    .refine((val) => /[a-z]/.test(val), {
        message: "Password must include at least one lowercase letter.",
    })
    .refine((val) => /[A-Z]/.test(val), {
        message: "Password must include at least one uppercase letter.",
    })
    .refine((val) => /[0-9]/.test(val), {
        message: "Password must include at least one number.",
    })
    .refine((val) => /[\^$*.[\]{}()?"!@#%&/,><':;|_~`\\]/.test(val), {
        message: "Password must include at least one special character.",
    });

const credentialsSchema = z.object({
    email: emailSchema,
    password: passwordSchema,
});

const verificationCodeRegex = new RegExp("^[0-9]{6}$");

const verificationCodeSchema = z
    .string()
    .max(6, { message: "Code must be at least 6 characters." })
    .min(6, { message: "Code must be at most 6 characters." })
    .refine((val) => verificationCodeRegex.test(val), {
        message: "Code only contains numbers.",
    });

export {
    usernameSchema,
    emailSchema,
    passwordSchema,
    credentialsSchema,
    verificationCodeSchema,
};
