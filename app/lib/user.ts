import { findUser } from "../dal/user"
import { verify } from "argon2"

type User = {
  id: string
  email: string
  name: string
  password?: string
}

export async function findUserByCredentials(
  email: string,
  password: string
): Promise<User | null> {
  const user = await findUser(email)

  if (!user) {
    return null
  }

  const passwordMatch = await verify(user.password, password)

  if (!passwordMatch) {
    return null
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
  }
}
