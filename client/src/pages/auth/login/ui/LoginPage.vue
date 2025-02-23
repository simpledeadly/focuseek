<script setup lang="ts">
import { loginUser } from '@/shared/api/api'
import { ref } from 'vue';
import { useRouter } from 'vue-router'; // Импортируем useRouter для навигации

const username = ref(''); // Реактивное состояние для имени пользователя
const password = ref(''); // Реактивное состояние для пароля
const error = ref(null); // Реактивное состояние для ошибок
const router = useRouter(); // Получаем доступ к маршрутизатору

// Функция для входа
const login = async () => {
  error.value = null; // Сбрасываем ошибку
  
  try {
    const response = await loginUser(username.value, password.value);
    localStorage.setItem('token', response.token); // Сохраните токен в локальном хранилище
    router.push({ name: 'todo' }); // Перенаправление на домашнюю страницу после успешного входа
  } catch (e: any) {
    error.value = e.message; // Обработка ошибок
  }
};
</script>

<template>
  <div class="login-page">
    <h1>Sign In</h1>
    <form @submit.prevent="login" style="display: flex; flex-direction: column;">
      <label for="username">Username:</label>
      <input v-model="username" type="text" id="username" required />

      <label for="password">Password:</label>
      <input v-model="password" type="password" id="password" required />

      <button type="submit">Sign in</button>
    </form>
    <p v-if="error">{{ error }}</p>
    <br>
    <RouterLink to="/register">
      <p>Sign up</p>
    </RouterLink>
  </div>
</template>

<style lang="scss">
.login-page {
  /** keep */
}
</style>
