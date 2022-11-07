import lucia from 'lucia-auth'
import supabase from '@lucia-auth/adapter-supabase'
import { defineAuthHandler } from '@/lib/lucia/server'

const config = useRuntimeConfig()

export const auth = lucia({
  env: process.env.NODE_ENV === 'development' ? 'DEV' : 'PROD',
  adapter: supabase(config.supabaseUrl, config.supabaseSecret),
  transformUserData: (userData) => {
    return {
      userId: userData.id,
      username: userData.username,
    }
  },
})

export type Auth = typeof auth

export default defineAuthHandler(auth)
