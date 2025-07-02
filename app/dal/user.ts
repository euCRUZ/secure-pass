"use server"

import { PrismaClient } from "@prisma/client"
import { redirect } from "next/navigation"
import { sanitizeString, sanitizeEmail } from "@/app/lib/security"
import { registerSchema } from "@/app/lib/validation"
import { signIn } from "@/auth"
declare global {
  var prisma: PrismaClient | undefined
}

const db = global.prisma || new PrismaClient()

export async function findUser(email: string) {
  return await db.user.findUnique({
    where: {
      email,
    },
  })
}

export async function verifyPassword(
  hashedPassword: string,
  plainPassword: string
) {
  try {
    const argon2 = await import("argon2")
    return await argon2.verify(hashedPassword, plainPassword)
  } catch (error) {
    console.error("Error verifying password:", error)
    return false
  }
}

export default async function registerAction(
  _prevState: any,
  formData: FormData
) {
  const entries = Array.from(formData.entries())
  const rawData = Object.fromEntries(entries) as {
    name: string
    email: string
    password: string
  }

  // Data sanitization
  const sanitizedData = {
    name: sanitizeString(rawData.name),
    email: sanitizeEmail(rawData.email),
    password: rawData.password,
  }

  // Validation with Zod
  const validationResult = registerSchema.safeParse(sanitizedData)

  if (!validationResult.success) {
    const errors = validationResult.error.errors
    const firstError = errors[0]

    return {
      message: firstError.message,
      success: "false",
    }
  }

  const validatedData = validationResult.data

  // Check if user already exists
  const existingUser = await findUser(validatedData.email)
  if (existingUser) {
    return {
      message: "User already exists",
      success: "false",
    }
  }

  try {
    // Hash password with more secure settings
    const argon2 = await import("argon2")
    const hashedPassword = await argon2.hash(validatedData.password, {
      type: argon2.argon2id,
      memoryCost: 2 ** 17, // 128MB
      timeCost: 4,
      parallelism: 1,
    })

    // Create user with sanitized data
    const newUser = await db.user.create({
      data: {
        email: validatedData.email,
        name: validatedData.name,
        password: hashedPassword,
      },
    })

    // Clear sensitive data from memory
    validatedData.password = ""
  } catch (error) {
    console.error("Error creating user:", error)

    return {
      message: "Error creating user. Please try again later.",
      success: "false",
    }
  }

  return redirect("/login")
}

export async function loginAction(_prevState: any, formData: FormData) {
  console.log("=== LOGIN ACTION STARTED ===")

  try {
    await signIn("credentials", {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      // redirect: true,
      // redirectTo: "/dashboard",
    })

    redirect("/dashboard")
  } catch (error: any) {
    if (error.type === "CredentialsSignin") {
      return { success: false, message: "Dados de login estão incorretos." }
    }

    return { success: false, message: "Ops, algum erro aconteceu" }
  }
}
