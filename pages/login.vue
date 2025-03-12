<template>
  <div class="flex min-h-screen bg-LightGray">
    <div class="flex flex-col w-full max-w-lg m-auto">
      <div class="m-auto">
        <img
          src="/assets/img/Amanat-Logo.png"
          class="h-auto rounded-full w-36 sm:w-28"
          alt="Logo"
        />
      </div>
      <div class="flex flex-col text-center">
        <h1 class="my-4 text-3xl text-black sm:my-2 sm:text-xl">
          Login to dashboard
        </h1>
      </div>
      <div
        class="container mx-auto rounded-xl bg-white p-12 text-black sm:w-[90%]"
      >
        <div
          v-if="error"
          class="p-3 mb-4 text-center rounded-md bg-red-50"
        >
          <p class="text-sm font-medium text-red-600">{{ error }}</p>
        </div>
        <form
          @submit.prevent="handleLogin"
          class="flex flex-col gap-4"
        >
          <div class="w-full mx-auto">
            <label
              for="username"
              class="block mb-2 text-sm font-medium text-gray-900"
            >
              Username
            </label>
            <input
              v-model="username"
              id="username"
              type="text"
              required
              class="w-full p-2 border rounded-lg border-DarkBlue bg-LightGray focus:border-DarkBlue"
            />
          </div>
          <div class="w-full mx-auto">
            <label
              for="password"
              class="block mb-2 text-sm font-medium text-gray-900"
            >
              Password
            </label>
            <input
              v-model="password"
              id="password"
              type="password"
              required
              class="w-full p-2 border rounded-lg border-DarkBlue bg-LightGray focus:border-DarkBlue"
            />
          </div>
          <div class="flex justify-center gap-4 mt-4">
            <button
              type="button"
              @click="$router.push('/')"
              class="px-4 py-2 text-red-500 border border-red-500 rounded-lg hover:bg-red-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="isLoading"
              class="w-1/2 px-4 py-2 text-white rounded-lg bg-DarkBlue hover:bg-opacity-80"
            >
              {{ isLoading ? 'Logging in...' : 'Sign in' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
<script setup>
  import { useAuthStore } from '~/stores/auth';
  const username = ref('');
  const password = ref('');
  const error = ref('');
  const isLoading = ref(false);
  const router = useRouter();
  const authStore = useAuthStore();
  const handleLogin = async () => {
    if (!username.value || !password.value) {
      error.value = 'Please enter both username and password';
      return;
    }
    isLoading.value = true;
    error.value = '';
    try {
      const success = await authStore.login(username.value, password.value);
      if (success) {
        console.log('Login successful, token:', authStore.getToken);
        await new Promise((resolve) => setTimeout(resolve, 100));
        await navigateTo('/', { replace: true });
      } else {
        error.value = authStore.getError;
      }
    } catch (err) {
      console.error('Login failed', err);
      error.value = 'An unexpected error occurred';
    } finally {
      isLoading.value = false;
    }
  };
  onMounted(() => {
    error.value = '';
  });
</script>
