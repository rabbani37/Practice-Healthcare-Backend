import { ExecutableResponse } from "google-auth-library/build/src/auth/executable-response";
import z, { email } from "zod";


export const PatientRegisZodSchema = z.object({
    name: z.string(),
    email: z.email(),
    password: z.string()
        .min(8, { message: "Password must be at least 8 characters long" })
        .max(100, { message: "Password cannot exceed 100 characters" })
        .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
        .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
        .regex(/[0-9]/, { message: "Password must contain at least one number" })
        .regex(/[^A-Za-z0-9]/, { message: "Password must contain at least one special character" })
        .optional(),
    patient: z.object({
        contractNumber: z.string()
    }).optional()
})

export const UserLoginZodSchema = z.object({
    email: z.email("Please provide a valid email"),
    password: z.string()
});


export const ForgotPasswordZodSchema = z.object({
    email: z.email()
})

export const ResetPasswordZodSchema = z.object({
    email: z.email(),
    newPassword: z.string()
        .min(8, { message: "Password must be at least 8 characters long" })
        .max(100, { message: "Password cannot exceed 100 characters" })
        .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
        .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
        .regex(/[0-9]/, { message: "Password must contain at least one number" })
        .regex(/[^A-Za-z0-9]/, { message: "Password must contain at least one special character" }),
    otp: z.string().length(6)
})

export const VerifyEmailZodSchema = z.object({
    email: z.email(),
    otp: z.string().length(6)
})