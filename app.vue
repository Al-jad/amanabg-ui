<template>
  <div>
    <!-- Global loading indicator for page transitions -->
    <NuxtLoadingIndicator color="#3B82F6" />
    <NuxtPage />
  </div>
</template>

<script setup>
  const isAuthChecking = ref(true);

  onMounted(() => {
    // Set auth check to false after a short delay
    // This gives the middleware time to redirect if needed
    setTimeout(() => {
      isAuthChecking.value = false;
    }, 100);
  });
</script>

<style>
  .auth-loading {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #f5f5f5;
    z-index: 9999;
  }

  .loader {
    border: 5px solid #f3f3f3;
    border-top: 5px solid #3b82f6;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>
