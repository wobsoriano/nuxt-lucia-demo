import { defineAuthHandler } from '@/lib/lucia/server'
import { getAuth } from '@/lib/lucia'

export const auth = getAuth()

export default defineAuthHandler(auth)
