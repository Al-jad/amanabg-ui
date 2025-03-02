<template>
  <div class="flex items-center justify-between">
    <!-- Show user info when authenticated -->
    <div
      v-if="isAuthenticated"
      class="flex items-center gap-4"
    >
      <div class="flex items-center gap-2">
        <span class="pi pi-user text-lg"></span>
        <span class="font-medium">{{ username }}</span>
      </div>
    </div>

    <!-- Show login button when not authenticated -->
    <NuxtLink
      v-else
      to="/login"
      class="flex items-center gap-2 rounded-lg bg-DarkBlue px-4 py-2 text-white hover:bg-opacity-80"
    >
      <span class="pi pi-sign-in"></span>
      <span>Login</span>
    </NuxtLink>
  </div>
</template>

<script setup>
  import { onMounted, ref } from 'vue';
  import { useAuth } from '~/composables/useAuth';

  const auth = useAuth();
  const isAuthenticated = ref(false);
  const username = ref('');

  onMounted(() => {
    isAuthenticated.value = auth.isAuthenticated();
    username.value = auth.getUsername();
  });
</script>
