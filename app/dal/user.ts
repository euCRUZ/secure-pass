"use server"

import { PrismaClient } from "@prisma/client"
import { redirect } from "next/navigation"

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
  const data = Object.fromEntries(entries) as {
    name: string
    email: string
    password: string
  }

  if (!data.name || !data.email || !data.password) {
    return {
      message: "Missing required fields",
      success: "false",
    }
  }

  const existingUser = await findUser(data.email)
  if (existingUser) {
    return {
      message: "User already exists",
      success: "false",
    }
  }

  try {
    const argon2 = await import("argon2")
    const hashedPassword = await argon2.hash(data.password, {
      type: argon2.argon2id,
      memoryCost: 2 ** 16, // 64MB
      timeCost: 3,
      parallelism: 1,
    })

    await db.user.create({
      data: {
        email: data.email,
        name: data.name,
        password: hashedPassword,
      },
    })
  } catch (error) {
    console.error("Error creating user:", error)
    return {
      message: "Error creating user",
      success: "false",
    }
  }

  return redirect("/login")
}
