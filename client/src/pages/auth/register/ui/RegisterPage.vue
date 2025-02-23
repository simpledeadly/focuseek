<script setup lang="ts">
import { router } from '@/app/router'
import { registerUser } from '@/shared/api/api'
import { ref } from 'vue';

const username = ref('');
const password = ref('');
const error = ref(null);

const register = async () => {
  error.value = null;
  try {
    await registerUser(username.value, password.value);
    alert('Пользователь зарегистрирован!');
    router.push({ name: 'todo' }); // Перенаправление на страницу входа
  } catch (e: any) {
    error.value = e.message; // Обработка ошибок
  }
};
</script>

<template>
  <div class="register-page">
    <h1>Sign Up</h1>
    <form @submit.prevent="register" style="display: flex; flex-direction: column;">
      <label for="username">Username:</label>
      <input style="text: #000" v-model="username" type="text" id="username" required />

      <label for="password">Password:</label>
      <input v-model="password" type="password" id="password" required />

      <button type="submit">Sign up</button>
    </form>
    <p v-if="error">{{ error }}</p>
    <br>
    <RouterLink to="/login">
      <p>Sign in</p>
    </RouterLink>
  </div>
</template>

<style lang="scss">
.register-page {
  /** keep */
}
</style>
