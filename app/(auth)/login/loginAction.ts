"use server"

import { loginSchema } from "@/app/lib/validation"
import { signIn } from "@/app/lib/auth"
import { sanitizeEmail } from "@/app/lib/security"
import { findUser } from "@/app/dal/user"
import { verifyPassword } from "@/app/dal/user"
import { redirect } from "next/navigation"

export async function loginAction(_prevState: any, formData: FormData) {
  const entries = Array.from(formData.entries())
  const rawData = Object.fromEntries(entries) as {
    email: string
    password: string
  }

  // Data sanitization
  const sanitizedData = {
    email: sanitizeEmail(rawData.email),
    password: rawData.password,
  }

  // Validation with Zod
  const validationResult = loginSchema.safeParse(sanitizedData)

  if (!validationResult.success) {
    const errors = validationResult.error.errors
    const firstError = errors[0]

    return {
      message: firstError.message,
      success: "false",
    }
  }

  const validatedData = validationResult.data

  try {
    // Find user by email
    const user = await findUser(validatedData.email)

    if (!user) {
      return {
        message: "Invalid email or password",
        success: "false",
      }
    }

    // Verify password
    const passwordMatch = await verifyPassword(
      user.password,
      validatedData.password
    )

    if (!passwordMatch) {
      return {
        message: "Invalid email or password",
        success: "false",
      }
    }

    await signIn("credentials", {
      email: validatedData.email,
      password: validatedData.password,
      redirect: true,
      redirectTo: "/dashboard",
    })

    return redirect("/dashboard")
  } catch (error) {
    console.error("Login error:", error)

    return {
      message: "Opps! Something went wrong",
      success: "false",
    }
  }
}
