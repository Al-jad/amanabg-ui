<template>
  <div class="flex bg-LightGray min-h-screen">
    <div class="m-auto my-12 sm:my-0 flex flex-col w-full max-w-lg">
      <div class="m-auto sm:my-12">
        <img src="/assets/img/moen.png" class="w-36 sm:w-28 rounded-full h-auto" alt="Logo">
      </div>
      <div class="flex flex-col text-center">
        <h1 class="text-3xl my-4 text-black sm:my-2 sm:text-xl">
          Login to dashboard
        </h1>
      </div>
      <div class="bg-white p-12 sm:w-[90%] rounded-xl container mx-auto text-black">
        <form @submit.prevent="handleLogin" class="flex flex-col gap-4">
          <div class="w-full mx-auto">
            <label for="username" class="block mb-2 text-sm font-medium text-gray-900">Username</label>
            <input v-model="username" id="username" type="text" required
              class="w-full p-2 bg-LightGray border-DarkBlue focus:border-DarkBlue border rounded-lg" />
          </div>
          <div class="w-full mx-auto">
            <label for="password" class="block mb-2 text-sm font-medium text-gray-900">Password</label>
            <input v-model="password" id="password" type="password" required
              class="w-full p-2 bg-LightGray border-DarkBlue focus:border-DarkBlue border rounded-lg" />
          </div>
          <div class="flex justify-center gap-4 mt-4">
            <button type="button" @click="$router.push('/')" 
              class="px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-100">
              Cancel
            </button>
            <button type="submit" :disabled="isLoading"
              class="px-4 py-2 bg-DarkBlue text-white rounded-lg hover:bg-opacity-80 w-1/2">
              {{ isLoading ? 'Logging in...' : 'Sign in' }}
            </button>
          </div>
          <p v-if="error" class="text-red-500 text-xs text-center mt-2">{{ error }}</p>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useNuxtApp } from '#app';

const username = ref('');
const password = ref('');
const error = ref('');
const isLoading = ref(false);
const router = useRouter();

const handleLogin = async () => {
  isLoading.value = true;
  error.value = '';
  
  try {
    const { $axios } = useNuxtApp();
    const response = await $axios.post('/Auth/login', {
      username: username.value,
      password: password.value
    });
    
    localStorage.setItem('authToken', response.data.accessToken);
    localStorage.setItem('username', username.value);
    
    if (username.value.toLowerCase() === 'admin') {
      localStorage.setItem('isAdmin', 'true');
      console.log('Logged in as admin');
    } else {
      localStorage.setItem('isAdmin', 'false');
      console.log('Logged in as non-admin');
    }
    console.log('Username:', username.value);
    console.log('isAdmin in localStorage:', localStorage.getItem('isAdmin'));
    
    if (localStorage.getItem('isAdmin') === 'true') {
      navigateTo('/dashboard/add-data');
    } else {
      navigateTo('/');
    }
  } catch (err) {
    console.error('Login failed', err);
    error.value = err.response?.status === 401 
      ? 'Invalid username or password.' 
      : 'An error occurred. Please try again later.';
      alert('Unauthorized Access. Please login again.');
      router.push('/login');
  } finally {
    isLoading.value = false;
  }
};
</script>