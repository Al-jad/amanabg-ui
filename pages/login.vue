<template>
  <!-- Main container with full height and light gray background -->
  <div class="flex min-h-screen bg-LightGray">
    <!-- Centered content container -->
    <div class="m-auto flex w-full max-w-lg flex-col">
      <!-- Logo container -->
      <div class="m-auto">
        <img
          src="/assets/img/Amanat-Logo.png"
          class="h-auto w-36 rounded-full sm:w-28"
          alt="Logo"
        />
      </div>
      <!-- Login header -->
      <div class="flex flex-col text-center">
        <h1 class="my-4 text-3xl text-black sm:my-2 sm:text-xl">
          Login to dashboard
        </h1>
      </div>
      <!-- Login form container -->
      <div
        class="container mx-auto rounded-xl bg-white p-12 text-black sm:w-[90%]"
      >
        <!-- Error message display -->
        <div
          v-if="error"
          class="mb-4 rounded-md bg-red-50 p-3 text-center"
        >
          <p class="text-sm font-medium text-red-600">{{ error }}</p>
        </div>

        <!-- Login form -->
        <form
          @submit.prevent="handleLogin"
          class="flex flex-col gap-4"
        >
          <!-- Username input field -->
          <div class="mx-auto w-full">
            <label
              for="username"
              class="mb-2 block text-sm font-medium text-gray-900"
            >
              Username
            </label>
            <input
              v-model="username"
              id="username"
              type="text"
              required
              class="w-full rounded-lg border border-DarkBlue bg-LightGray p-2 focus:border-DarkBlue"
            />
          </div>
          <!-- Password input field -->
          <div class="mx-auto w-full">
            <label
              for="password"
              class="mb-2 block text-sm font-medium text-gray-900"
            >
              Password
            </label>
            <input
              v-model="password"
              id="password"
              type="password"
              required
              class="w-full rounded-lg border border-DarkBlue bg-LightGray p-2 focus:border-DarkBlue"
            />
          </div>
          <!-- Form buttons -->
          <div class="mt-4 flex justify-center gap-4">
            <!-- Cancel button -->
            <button
              type="button"
              @click="$router.push('/')"
              class="rounded-lg border border-red-500 px-4 py-2 text-red-500 hover:bg-red-100"
            >
              Cancel
            </button>
            <!-- Sign in button -->
            <button
              type="submit"
              :disabled="isLoading"
              class="w-1/2 rounded-lg bg-DarkBlue px-4 py-2 text-white hover:bg-opacity-80"
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
  // Import store
  import { useAuthStore } from '~/stores/auth';

  // Reactive variables for form inputs
  const username = ref('');
  const password = ref('');
  const error = ref('');
  const isLoading = ref(false);
  const router = useRouter();

  // Get auth store
  const authStore = useAuthStore();

  // Handle login form submission
  const handleLogin = async () => {
    // Basic validation
    if (!username.value || !password.value) {
      error.value = 'Please enter both username and password';
      return;
    }

    isLoading.value = true;
    error.value = '';

    try {
      // Use auth store for login
      const success = await authStore.login(username.value, password.value);

      if (success) {
        console.log('Login successful, token:', authStore.getToken);

        // Force a small delay to ensure state is updated
        await new Promise((resolve) => setTimeout(resolve, 100));

        // Use navigateTo for more reliable navigation
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

  // Clear any previous errors when the component is mounted
  onMounted(() => {
    error.value = '';
  });
</script>
