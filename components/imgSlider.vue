<template>
  <div>
    <Galleria
      :value="images"
      :circular="true"
      :showIndicators="true"
      :autoPlay="true"
      :transitionInterval="2500"
      :showIndicatorsOnItem="true"
      :showItemNavigators="true"
      :showThumbnails="false"
      :responsiveOptions="responsiveOptions"
    >
      <template #item="slotProps">
        <div class="w-full">
          <img
            class="h-96 min-w-full object-cover sm:max-h-44 sm:!min-h-44"
            :src="slotProps.item.itemImageSrc"
            :alt="slotProps.item.alt"
          />
          <!-- <div
                        class="absolute bottom-0 left-0 right-0 top-0 h-full w-full overflow-hidden bg-black bg-fixed opacity-20">
                    </div>
                    <div class="grid sm:mx-4 grid-flow-row container sm:p-0 mx-auto">
                        <p
                            class="absolute top-16 w-[50%] !text-4xl font-bold text-white text-left ml-12 sm:text-pretty sm:!text-sm sm:top-6 md:!text-2xl">
                            Instant Data display for remote stations
                            for Water Resources all Over Iraq
                        </p>
                    </div> -->
        </div>
      </template>
    </Galleria>
  </div>
</template>

<script setup>
const images = ref([
  {
    itemImageSrc: "/assets/img/water-hand.jpg",
    alt: "Image 1",
  },
  {
    itemImageSrc: "/assets/img/baghdad-stations.png",
    alt: "Image 2",
  },
  {
    itemImageSrc: "/assets/img/baghdad-1.jpg",
    alt: "Image 3",
  },
]);
const responsiveOptions = ref([
  {
    breakpoint: "1300px",
    numVisible: 4,
  },
  {
    breakpoint: "575px",
    numVisible: 1,
  },
]);
</script>
