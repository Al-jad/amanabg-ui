<template>
  <div class="min-h-screen bg-gray-100 px-4 py-12 sm:px-6 lg:px-8">
    <div
      class="container mx-auto mb-8 max-w-4xl rounded-xl bg-white p-8 shadow-lg"
    >
      <!-- Page title -->
      <h1 class="mb-8 p-4 text-4xl font-bold text-gray-900">Privacy Policy</h1>

      <!-- Dynamic sections of the privacy policy -->
      <section
        v-for="(section, index) in privacySections"
        :key="index"
        class="mb-10 p-6"
      >
        <!-- Section title -->
        <h2 class="mb-4 text-2xl font-semibold text-gray-800">
          {{ section.title }}
        </h2>
        <!-- Section content (if available) -->
        <p v-if="section.content" class="mb-4 text-gray-700">
          {{ section.content }}
        </p>
        <!-- Section list (if available) -->
        <ul
          v-if="section.list"
          class="list-inside list-disc space-y-3 text-gray-700"
        >
          <li v-for="(item, itemIndex) in section.list" :key="itemIndex">
            <span class="font-medium">{{ item.title }}:</span>
            {{ item.description }}
          </li>
        </ul>
      </section>

      <!-- Last updated date -->
      <div class="mt-12 border-t border-gray-200 pt-8">
        <p class="text-center text-sm text-gray-600">
          Last updated: {{ lastUpdated }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
// Reactive reference for the last updated date
const lastUpdated = ref("October 26, 2024");

// Reactive reference for the privacy policy sections
const privacySections = ref([
  // Each object in this array represents a section of the privacy policy
  {
    title: "1. Introduction",
    content:
      "Welcome to (env.alfakharco.com). We value your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services. Please read this policy carefully. If you do not agree with the terms of this Privacy Policy, please do not access the site.",
  },
  {
    title: "2. Information We Collect",
    content:
      "We may collect personal data that you voluntarily provide to us, including but not limited to:",
    list: [
      {
        title: "Personal Identification Information",
        description:
          "Name, email address, phone number, and other contact details.",
      },
      {
        title: "Usage Data",
        description:
          "Information about how you use our site, including IP address, browser type, access times, and pages viewed.",
      },
      {
        title: "Cookies and Tracking Technologies",
        description:
          "We use cookies to track your usage of our site and to improve your experience.",
      },
    ],
  },
  {
    title: "3. How We Use Your Information",
    content: "We use the information we collect in the following ways:",
    list: [
      {
        title: "To Provide and Maintain Our Service",
        description:
          "Including processing transactions, providing customer support, and managing user accounts.",
      },
      {
        title: "To Improve Our Services",
        description:
          "Analyzing user interactions to enhance the functionality and user experience of our site.",
      },
      {
        title: "To Communicate with You",
        description:
          "Sending you updates, newsletters, and other information you may find relevant.",
      },
    ],
  },
  {
    title: "4. Disclosure of Your Information",
    content:
      "We do not sell, trade, or otherwise transfer to outside parties your Personally Identifiable Information unless we provide users with advance notice. This does not include website hosting partners and other parties who assist us in operating our website, conducting our business, or servicing you, so long as those parties agree to keep this information confidential.",
  },
  {
    title: "5. Security of Your Information",
    content:
      "We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide, please be aware that despite our efforts, no security measures are perfect or impenetrable.",
  },
  {
    title: "6. Your Data Protection Rights",
    content:
      "Depending on your location, you may have the following rights regarding your personal data:",
    list: [
      {
        title: "Access",
        description: "Request access to the personal data we hold about you.",
      },
      {
        title: "Rectification",
        description: "Request correction of any inaccurate or incomplete data.",
      },
      {
        title: "Erasure",
        description: "Request the deletion of your personal data.",
      },
      {
        title: "Restriction of Processing",
        description: "Request a restriction on the processing of your data.",
      },
    ],
  },
  {
    title: "7. Changes to This Privacy Policy",
    content:
      "We may update our Privacy Policy from time to time. Any changes will be posted on this page.",
  },
]);
</script>