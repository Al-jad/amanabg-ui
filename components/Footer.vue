<template>
  <footer>
    <div>
      <PreFooter />
      <Panel class="!rounded-none !bg-DarkBlue">
        <div
          class="container grid grid-cols-1 gap-20 p-0 sm:gap-8 lg:grid-cols-3 lg:gap-32"
        >
          <div class="flex flex-col items-center justify-start">
            <div class="flex flex-col">
              <p
                class="mb-8 text-2xl font-bold text-left sm:text-center sm:text-base"
              >
                Baghdad Mayoralty Water Monitoring System
              </p>
              <p class="w-[90%] text-left sm:text-center sm:text-sm">
                Real-time monitoring and management of drinking water projects
                in Baghdad. It offers comprehensive data on drinking water
                projects, water tanks, pipes, pumping stations and other
                critical infrastructure. Our platform enables efficient
                decision-making for water distribution, quality control, and
                resource planning.
              </p>
            </div>
          </div>
          <div class="flex flex-col items-center justify-start">
            <p
              class="mb-8 text-2xl font-bold text-left sm:text-center sm:text-base"
            >
              Mobile Application
            </p>
            <div
              class="flex flex-col items-center justify-center py-4 sm:scale-75 sm:py-0"
            >
              <div class="flex flex-row gap-4 sm:flex-col">
                <div
                  class="!h-16 !w-56 rounded-md border border-white border-opacity-80 bg-DarkBlue p-2 hover:bg-HoverDarkBlue"
                >
                  <a
                    href="https://play.google.com"
                    target="_blank"
                  >
                    <div class="flex flex-row items-center">
                      <div class="w-8">
                        <img
                          src="/assets/img/playLogo.svg"
                          class="object-cover w-full h-full"
                          alt="Google Play Logo"
                        />
                      </div>
                      <div class="pl-2">
                        <p>Download from</p>
                        <p class="text-sm">Google Play</p>
                      </div>
                    </div>
                  </a>
                </div>
                <div
                  class="!h-16 !w-56 rounded-md border border-white border-opacity-80 p-2 hover:bg-HoverDarkBlue"
                >
                  <a
                    href="https://www.apple.com/app-store/"
                    target="_blank"
                  >
                    <div class="flex flex-row items-center">
                      <div class="w-6">
                        <img
                          src="/assets/img/appleLogo.svg"
                          class="object-cover w-full h-full"
                          alt="Apple Store Logo"
                        />
                      </div>
                      <div class="pl-2">
                        <p>Download from</p>
                        <p class="text-sm">Apple Store</p>
                      </div>
                    </div>
                  </a>
                </div>
              </div>
              <div class="mt-6">
                <!-- <p class="mb-4 text-2xl font-bold text-center">
                  Social Channels
                </p> -->
                <div class="flex flex-row items-center gap-8">
                  <a href="https://www.facebook.com/mayoralty.baghdad/">
                    <i
                      class="pi pi-facebook hover:opacity-50"
                      style="font-size: 1.8rem"
                    ></i>
                  </a>
                  <a href="/">
                    <i
                      class="pi pi-instagram hover:opacity-50"
                      style="font-size: 1.8rem"
                    ></i>
                  </a>
                  <a href="/">
                    <i
                      class="pi pi-linkedin hover:opacity-50"
                      style="font-size: 1.8rem"
                    ></i>
                  </a>
                  <a href="/">
                    <i
                      class="pi pi-twitter hover:opacity-50"
                      style="font-size: 1.8rem"
                    ></i>
                  </a>
                  <a href="https://www.youtube.com/@audaytalip">
                    <i
                      class="pi pi-youtube hover:opacity-50"
                      style="font-size: 1.8rem"
                    ></i>
                  </a>
                </div>
              </div>
              <div></div>
            </div>
          </div>
          <div class="flex flex-col justify-start sm:items-center">
            <div>
              <p
                class="mb-8 text-2xl font-bold text-left sm:text-center sm:text-base"
              >
                Contact
              </p>
            </div>
            <div
              class="flex flex-col items-start justify-center gap-4 text-sm sm:items-start sm:gap-6"
            >
              <div class="flex flex-row gap-4">
                <i class="pi pi-home"></i>
                <span>Baghdad Municipality</span>
              </div>
              <div class="flex flex-row gap-4">
                <i class="pi pi-map-marker"></i>
                <span>Iraq, Baghdad</span>
              </div>
              <div class="flex flex-row gap-4">
                <i class="pi pi-phone"></i>
                <a href="tel:+964 1 442 2183">+964 1 442 2183</a>
              </div>
              <div class="flex flex-row gap-4">
                <i class="pi pi-envelope"></i>
                <a href="mailto:info@amanatbaghdad.gov.iq">
                  info@amanatbaghdad.gov.iq
                </a>
              </div>
              <div class="flex flex-row gap-4">
                <i class="pi pi-globe"></i>
                <a
                  href="https://amanatbaghdad.gov.iq/ar"
                  target="_blank"
                >
                  https://amanatbaghdad.gov.iq
                </a>
              </div>
              <div class="flex flex-row gap-4">
                <i class="pi pi-send"></i>
                <NuxtLink href="/contact">Contact us</NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </Panel>
    </div>
    <div class="w-full bg-DarkNavy sm:text-nowrap">
      <div class="container flex flex-row justify-between p-4 mx-auto">
        <div class="flex flex-row items-center gap-4">
          <p class="text-[0.5rem] opacity-50">Powered by Al-Fakhar Co.</p>
          <img
            src="/assets/img/GrayFakhar.png"
            class="w-5 sm:w-2"
            alt="Fakhar co. logo"
          />
        </div>
        <div
          class="flex flex-row gap-10 text-sm underline sm:flex-col sm:items-center sm:gap-1 sm:text-[0.5rem]"
        >
          <NuxtLink
            class="cursor-pointer"
            href="/privacy"
          >
            <p>Privacy Policy</p>
          </NuxtLink>
          <NuxtLink
            class="cursor-pointer"
            href="/terms"
          >
            <p>Terms of Service</p>
          </NuxtLink>
        </div>
        <div class="flex flex-row items-center gap-4">
          <p class="text-xs opacity-50 sm:text-[0.5rem]">
            All Rights Reserved 2024
          </p>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
  p,
  h1,
  h2,
  h3,
  h4,
  span,
  a,
  i {
    @apply text-white;
  }
</style>
