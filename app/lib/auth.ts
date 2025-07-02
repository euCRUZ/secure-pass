import { PrismaAdapter } from "@next-auth/prisma-adapter"
import Credentials from "next-auth/providers/credentials"
import { findUserByCredentials } from "./user"
import NextAuth from "next-auth"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const { handlers, signIn, signOut, auth } = NextAuth({
  // adapter: PrismaAdapter(prisma),
  // session: {
  //   strategy: "database",
  // },
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        console.log(credentials)

        if (!credentials?.email || !credentials?.password) {
          return null
        }

        // auth logic here
        // find user with credentials
        const user = await findUserByCredentials(
          credentials.email as string,
          credentials.password as string
        )

        return user
      },
    }),
  ],
})
