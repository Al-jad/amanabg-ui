<template>
  <div class="container flex flex-col gap-6 py-8 ">
    <Content v-for="content in contents" :key="content.id" :title="content.title" :description="content.description" :image="content.image" />
  </div>
</template>

<script setup>

const contents = [
  {
    id: 1,
    title: "Water Quality",
    description: "Water quality is a critical environmental determinant that affects human health and ecosystems. It encompasses various parameters such as pH, dissolved oxygen, nutrients, and contaminants.",
    image: "/assets/img/water.jpg"
  },
  {
    id: 2,
    title: "Environmental Monitoring",
    description: "Environmental monitoring involves the systematic sampling of air, water, and soil to assess the state of the environment. It helps in identifying trends, potential risks, and the effectiveness of environmental policies.",
    image: "/assets/img/water.jpg"
  },
  {
    id: 3,
    title: "Water Conservation",
    description: "Water conservation refers to reducing water usage and improving water management practices. It's crucial for preserving this vital resource for future generations and maintaining ecological balance.",
    image: "/assets/img/water.jpg"
  },
  {
    id: 4,
    title: "Sustainable Development",
    description: "Sustainable development aims to meet present needs without compromising future generations' ability to meet their own needs. It balances economic growth, environmental protection, and social well-being.",
    image: "/assets/img/water.jpg"
  }
];

</script>