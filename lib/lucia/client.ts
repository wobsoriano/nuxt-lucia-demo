import type { User } from 'lucia-auth'

export async function getUser(): Promise<Readonly<User> | null> {
  try {
    const { user } = await $fetch<{ user: User }>('/api/auth/user')
    return user
  }
  catch (error) {
    return null
  }
}

export async function signOut(): Promise<Readonly<User> | null> {
  try {
    const { error } = await $fetch<{ error?: string }>('/api/auth/logout', {
      method: 'POST',
    })
    if (!error)
      return null
    throw new Error(error)
  }
  catch (error) {
    return null
  }
}
