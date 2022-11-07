<script setup lang="ts">
import { signOut } from '@/lib/lucia/client'

const user = useUser()

async function handleSignOut() {
  try {
    await signOut()
    user.value = null
    navigateTo('/login')
  }
  catch {}
}

definePageMeta({
  middleware: 'protected',
})
</script>

<template>
  <div>
    <p>This page is protected and can only be accessed by authenticated users.</p>
    <pre class="code">{{ JSON.stringify(user, null, 2) }}</pre>
    <button @click="handleSignOut">
      Sign out
    </button>
  </div>
</template>
