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
    title: "Drinking Water Projects",
    link: "/data/pipes-water",
    external: false,
    image: "/assets/img/water-pipe.jpg",
    icon: "mdi:water-pump"
  },
  {
    id: 2,
    title: "Water Storage Tanks",
    link: "/tanks",
    external: false,
    image: "/assets/img/underground-water-tank.jpg",
    icon: "ion:water"
  },
  {
    id: 3,
    title: "Map",
    link: "/data/pipes-water?view=map",
    external: false,
    image: "/assets/img/Map.png\",
    icon: "material-symbols:location-on"
  },
  {
    id: 4,
    title: "Tolling and Statistics",
    link: "/tolling-system",
    external: false,
    image: "/assets/img/water-quality.jpg",
    icon: "stash:billing-info-solid"
  },
];
</script>
