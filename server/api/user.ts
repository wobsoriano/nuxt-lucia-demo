import { getSessionUser } from '~~/lib/lucia/server'
import { auth } from '@/server/api/auth/[...]'

export default defineEventHandler(async (event) => {
  const user = await getSessionUser(event, auth)
  return user
})
