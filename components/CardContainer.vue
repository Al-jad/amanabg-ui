<template>
  <div class="grid container grid-cols-1 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 justify-items-center p-4 sm:p-6 sm:mb-0 sm:pb-0 md:p-8">
    <MyCard
      v-for="item in cardItems"
      :key="item.id"
      :title="item.title"
      :link="item.link"
      :external="item.external"
      :image="item.image"
      :icon="item.icon"
      class="w-full max-w-sm m-2"
    />
  </div>
</template>

<script setup>
const cardItems = [
  {
    id: 1,
    title: "Pipes Water",
    link: "/pipes-water",
    external: false,
    image: "/assets/img/water-pipe.jpg",
    icon: "fluent:pipeline-32-filled"
  },
  {
    id: 2,
    title: "Water Tanks",
    link: "/",
    external: false,
    image: "/assets/img/water-tank.jpg",
    icon: "material-symbols-light:water-damage-rounded"
  },
  {
    id: 3,
    title: "Water Quality",
    link: "/",
    external: false,
    image: "/assets/img/water-quality.jpg",
    icon: "material-symbols:water-full"
  },
  {
    id: 4,
    title: "Map",
    link: "/",
    external: false,
    image: "/assets/img/Map.png",
    icon: "material-symbols:location-on"
  },
];
</script>
