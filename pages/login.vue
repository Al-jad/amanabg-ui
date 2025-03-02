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
  // Import composable
  import { useAuth } from '~/composables/useAuth';

  // Reactive variables for form inputs
  const username = ref('');
  const password = ref('');
  const error = ref('');
  const isLoading = ref(false);
  const router = useRouter();

  // Get auth utilities
  const auth = useAuth();

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
      // Send login request to the server
      const { $axios } = useNuxtApp();
      const response = await $axios.post('/Auth/login', {
        username: username.value,
        password: password.value,
      });

      // Store token and redirect
      if (response.data.accessToken) {
        // Use the composable to set auth data
        auth.setAuth(response.data.accessToken, username.value);

        // Redirect to home page
        router.push('/');
      } else {
        error.value = 'Invalid response from server';
      }
    } catch (err) {
      console.error('Login failed', err);

      // Handle different error scenarios
      if (err.response) {
        switch (err.response.status) {
          case 400:
          case 401:
            error.value = 'Invalid Username or Password';
            break;
          case 403:
            error.value = 'Your account is pending approval';
            break;
          case 404:
            error.value = 'User not found';
            break;
          default:
            error.value = `Login failed: ${err.response.data?.message || 'Unknown error'}`;
        }
      } else {
        error.value = 'Network error. Please check your connection';
      }
    } finally {
      isLoading.value = false;
    }
  };

  // Clear any previous errors when the component is mounted
  onMounted(() => {
    error.value = '';
  });
</script>
