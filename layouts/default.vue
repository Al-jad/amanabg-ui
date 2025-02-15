<template>
  <div class="flex min-h-screen flex-col">
    <header class="w-full bg-DarkBlue text-white">
      <div class="container mx-auto py-6 sm:py-3">
        <Menubar :pt="{ root: { class: '!bg-DarkBlue !border-none' } }">
          <template #start>
            <NuxtLink
              href="/"
              class="flex items-center transition-opacity duration-300 hover:opacity-60"
            >
              <div class="mr-6">
                <img
                  src="/assets/img/Amanat-Logo.png"
                  class="h-14 w-14 scale-125 rounded-full object-cover"
                  alt="Baghdad Municipality Logo"
                />
              </div>
              <div class="text-white">
                <h1 class="text-xl font-semibold sm:text-base">
                  Water Monitoring System
                </h1>
                <p class="text-sm sm:block">Baghdad Mayoralty</p>
              </div>
            </NuxtLink>
          </template>
          <template #end>
            <NuxtLink
              to="/"
              class="flex items-center text-white transition-opacity duration-300 hover:opacity-80 sm:hidden"
            >
              <div class="mr-4 text-right">
                <p class="font-semibold">Minister's Council</p>
                <p class="text-sm">Republic of Iraq</p>
              </div>
              <div>
                <img
                  src="/assets/img/MinisterLogo.png"
                  class="h-14 w-14 scale-125 object-cover"
                  alt="Minister's Council Logo"
                />
              </div>
            </NuxtLink>
          </template>
        </Menubar>
      </div>
    </header>
    <main>
      <slot />
    </main>
    <!-- <PreFooter/> -->
    <Footer />
  </div>
</template>
