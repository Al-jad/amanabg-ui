<template>
  <div class="w-full bg-LightGray py-2">
    <div class="container mx-auto flex flex-col">
      <div class="flex justify-between pt-2 sm:flex-col">
        <h1 class="text-xl font-bold text-black sm:text-center sm:text-base">
          Manage Remote Level Stations Online by Dashboard..
        </h1>
        <Button
          label="Control Panel" disabled
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
  router.push("/dashboard/add-data");
};
</script>
