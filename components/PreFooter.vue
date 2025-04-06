<template>
  <div class="w-full py-2 bg-LightGray">
    <div class="container flex flex-col mx-auto">
      <div class="flex justify-between pt-2 sm:flex-col">
        <h1 class="text-xl font-bold text-black sm:text-center sm:text-base">
          Login to View Data In Real Time
        </h1>
        <Button
          label="Login"
          class="!border-none !bg-DarkBlue !text-white hover:!bg-opacity-80 sm:m-auto sm:!mt-2 sm:w-[50%]"
          @click="redirect"
        ></Button>
      </div>
    </div>
  </div>
</template>

<script setup>
  const router = useRouter();
  const redirect = () => {
    router.push('/login');
  };
</script>
