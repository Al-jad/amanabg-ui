<template>
  <div
    class="bg-base-100 relative h-56 w-96 overflow-hidden rounded-xl shadow-lg transition-all duration-300 ease-in-out sm:h-48 hover:-translate-y-2 hover:scale-105 hover:shadow-xl"
  >
    <NuxtLink :href="link" :target="external ? '_blank' : '_self'" class="block h-full">
      <img
        :src="image"
        :alt="title"
        class="h-48 w-full object-cover transition-transform duration-300 hover:scale-110"
      />

      <div
        class="absolute inset-x-0 bottom-0 flex h-10 items-center justify-between bg-DarkBlue px-4"
      >
        <h2
          class="truncate text-base font-bold text-white transition-all duration-300 group-hover:text-lg sm:text-sm"
        >
          {{ title }}
        </h2>
        <Icon name="heroicons:arrow-top-right-on-square-20-solid" class="h-5 w-5 text-white" />
      </div>

      <div
        class="absolute right-4 top-4 flex h-12 w-12 items-center justify-center rounded-full bg-DarkBlue shadow-md transition-all duration-300 hover:scale-110"
      >
        <Icon
          :name="icon"
          class="text-white text-2xl transition-transform duration-300 hover:rotate-12"
        ></Icon>
      </div>
    </NuxtLink>
  </div>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true
  },
  external: {
    type: Boolean,
    default: false
  },
  image: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    default: 'fluent:water-16-filled'
  }
});
</script>
