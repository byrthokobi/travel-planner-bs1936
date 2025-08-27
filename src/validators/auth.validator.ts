import z from "zod";

export const signupSchema = z.object({
    email: z.string().email("Invalid Email Format"),
    passowrd: z.string().min(6, "Password Must be at 6 characters")
});

export const loginSchema = z.object({
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});