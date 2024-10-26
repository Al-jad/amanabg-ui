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
        <!-- Login form -->
        <form @submit.prevent="handleLogin" class="flex flex-col gap-4">
          <!-- Username input field -->
          <div class="mx-auto w-full">
            <label
              for="username"
              class="mb-2 block text-sm font-medium text-gray-900"
              >Username</label
            >
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
              >Password</label
            >
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
              {{ isLoading ? "Logging in..." : "Sign in" }}
            </button>
          </div>
          <!-- Error message display -->
          <p v-if="error" class="mt-2 text-center text-xs text-red-500">
            {{ error }}
          </p>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
// Reactive variables for form inputs and state
const username = ref("");
const password = ref("");
const error = ref("");
const isLoading = ref(false);
const router = useRouter();

// Handle login form submission
const handleLogin = async () => {
  isLoading.value = true;
  error.value = "";

  try {
    // Send login request to the server
    const { $axios } = useNuxtApp();
    const response = await $axios.post("/Auth/login", {
      username: username.value,
      password: password.value,
    });

    // Store authentication token and username in local storage
    localStorage.setItem("authToken", response.data.accessToken);
    localStorage.setItem("username", username.value);

    // Check if the user is an admin and set the appropriate flag
    if (username.value.toLowerCase() === "admin") {
      localStorage.setItem("isAdmin", "true");
      console.log("Logged in as admin");
    } else {
      localStorage.setItem("isAdmin", "false");
      console.log("Logged in as non-admin");
    }
    console.log("Username:", username.value);
    console.log("isAdmin in localStorage:", localStorage.getItem("isAdmin"));

    // Navigate to the appropriate page based on user role
    if (localStorage.getItem("isAdmin") === "true") {
      navigateTo("/dashboard/add-data");
    } else {
      navigateTo("/");
    }
  } catch (err) {
    // Handle login errors
    console.error("Login failed", err);
    error.value =
      err.response?.status === 401
        ? "Invalid username or password."
        : "An error occurred. Please try again later.";
    alert("Unauthorized Access. Please login again.");
    router.push("/login");
  } finally {
    isLoading.value = false;
  }
};
</script>
