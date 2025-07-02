import { z } from "zod"
import {
  isSuspiciousEmail,
  isSuspiciousName,
  validatePasswordStrength,
} from "./security"

export const registerSchema = z.object({
  name: z
    .string()
    .min(2, "Your name must be at least 2 characters")
    .max(50, "Your name must be at most 50 characters")
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, "Your name must contain only letters and spaces")
    .refine((name) => !isSuspiciousName(name), {
      message: "This name is not allowed for security reasons",
    }),
  email: z
    .string()
    .email("Invalid email")
    .min(1, "Email is required")
    .max(254, "Email is too long")
    .refine((email) => !isSuspiciousEmail(email), {
      message: "This email pattern is not allowed for security reasons",
    }),
  password: z
    .string()
    .min(12, "Password must be at least 12 characters")
    .max(128, "Password is too long")
    .refine(
      (password) => {
        const validation = validatePasswordStrength(password)
        return validation.isValid
      },
      {
        message: "Password does not meet security requirements",
      }
    ),
})

export type RegisterFormData = z.infer<typeof registerSchema>

export const loginSchema = z.object({
  email: z
    .string()
    .email("Invalid email")
    .min(1, "Email is required")
    .max(254, "Email is too long"),
  password: z
    .string()
    .min(1, "Password is required")
    .max(128, "Password is too long"),
})

export type LoginFormData = z.infer<typeof loginSchema>

export const passwordStrengthSchema = z.object({
  password: z.string(),
})

export type PasswordStrengthData = z.infer<typeof passwordStrengthSchema>
