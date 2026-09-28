import { z } from "zod";

export const signupSchema = z
  .object({
    name: z.string().min(5, "Must be at least 5 characters"),
    email: z.email("Invalid email"),
    password: z.string().min(8, "Must be at least 8 characters"),
    confirm_password: z.string().min(8),
  })
  .refine((data) => data.password === data.confirm_password, {
    error: "Passwords must be equals",
    path: ["confirm_password"],
  });

export const loginSchema = z.object({
  email: z.email("Invalid email"),
  password: z.string().min(8, "Must be at least 8 characters"),
});

export type signupData = z.infer<typeof signupSchema>;
export type loginData = z.infer<typeof loginSchema>;
