import useUser from '@/composables/useUser'

export default defineNuxtRouteMiddleware(() => {
  const user = useUser()

  if (!user.value)
    return navigateTo('/login')
})
