<script setup lang="ts">
const username = ref('')
const password = ref('')

async function handleSubmit() {
  try {
    await $fetch('/api/signup', {
      method: 'POST',
      body: {
        username: username.value,
        password: password.value,
      },
    })

    navigateTo('/login')
  }
  catch (error) {
    console.log(error)
  }
}

definePageMeta({
  middleware: 'public',
})
</script>

<template>
  <div>
    <h1>Create an account</h1>
    <form method="post" action="/api/signup" @submit.prevent="handleSubmit">
      <label htmlFor="username">username</label>
      <br>
      <input v-model="username" name="username">
      <br>
      <label htmlFors="password">password</label>
      <br>
      <input v-model="password" type="password" name="password">
      <br>
      <button type="submit" class="button">
        Continue
      </button>
    </form>
  </div>
</template>
