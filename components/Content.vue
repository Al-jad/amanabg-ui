<template>
  <div>
    <div class="sm:hidden">
      <div
        class="mx-auto flex transform flex-col items-center justify-between gap-8 rounded-lg bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:w-[90%] md:flex-row"
      >
        <div class="animate-fade-in flex-1 md:pr-8">
          <h2 class="animate-slide-down mb-4 text-xl  font-bold text-gray-800">
            {{ title }}
          </h2>
          <p class="animate-slide-up text-base leading-relaxed text-gray-600">
            {{ showFullDescription ? description : description.slice(0, 100) + '...' }}
          </p>
          <button @click="toggleDescription" class="mt-2 text-sm text-blue-500 hover:text-blue-700">
            {{ showFullDescription ? 'less...' : 'more...' }}
          </button>
        </div>
        <div class="animate-fade-in mt-0 flex-shrink-0 md:mt-0">
          <img
            :src="image"
            :alt="title"
            class="h-auto w-full rounded-lg object-cover shadow-lg transition-all duration-300 hover:scale-105 md:w-96"
            loading="lazy"
          />
        </div>
      </div>
    </div>
    <div class="hidden sm:block">
      <div
        class="mx-auto flex transform flex-col items-start justify-between gap-4 rounded-lg bg-white p-4 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:w-[90%] sm:flex-row"
      >
        <div class="animate-fade-in flex-1 sm:pr-4">
          <h2 class="animate-slide-down mb-2  text-sm font-bold text-gray-800">
            {{ title }}
          </h2>
          <p class="animate-slide-up text-xs leading-relaxed text-gray-600">
            {{ showFullDescription ? description : description.slice(0, 50) + '...' }}
          </p>
          <button @click="toggleDescription" class="mt-2 text-sm text-blue-500 hover:text-blue-700">
            {{ showFullDescription ? 'less..' : 'more...' }}
          </button>
        </div>
        <div class="animate-fade-in mt-3 flex-shrink-0 sm:ml-auto">
          <img
            :src="image"
            :alt="title"
            class="h-auto w-32 rounded-lg object-cover shadow-lg transition-all duration-300 hover:scale-105"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  }
});

const showFullDescription = ref(false);

const toggleDescription = () => {
  showFullDescription.value = !showFullDescription.value;
};
</script>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideDown {
  from {
    transform: translateY(-20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.animate-fade-in {
  animation: fadeIn 0.5s ease-out;
}

.animate-slide-down {
  animation: slideDown 0.5s ease-out;
}

.animate-slide-up {
  animation: slideUp 0.5s ease-out;
}
</style>
