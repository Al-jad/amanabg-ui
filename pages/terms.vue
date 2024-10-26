<template>
  <!-- Main container with responsive padding and background -->
  <div class="min-h-screen bg-gray-100 px-4 py-8 sm:px-6 lg:px-8">
    <!-- Content container with max width, background, and shadow -->
    <div class="mx-auto max-w-4xl bg-white p-8 shadow sm:rounded-lg">
      <!-- Page title -->
      <h1 class="mb-6 text-3xl font-bold text-gray-900">Terms of Service</h1>

      <!-- Terms of Service sections -->
      <!-- Each section is wrapped in a <section> tag for semantic structure -->

      <!-- 1. Introduction -->
      <section class="mb-8">
        <h2 class="mb-4 text-2xl font-semibold text-gray-800">
          1. Introduction
        </h2>
        <p class="text-gray-700">
          Welcome to <strong>(env.alfakharco.com)</strong>. These Terms of
          Service govern your access to and use of our website and services. By
          accessing or using our services, you agree to comply with and be bound
          by these Terms. If you do not agree to these Terms, please do not use
          our site.
        </p>
      </section>

      <!-- 2. Use of the Site -->
      <section class="mb-8">
        <h2 class="mb-4 text-2xl font-semibold text-gray-800">
          2. Use of the Site
        </h2>
        <p class="mb-4 text-gray-700">
          You agree to use the Site only for lawful purposes and in a way that
          does not infringe the rights of, restrict, or inhibit anyone else's
          use and enjoyment of the Site. Prohibited behavior includes harassing
          or causing distress or inconvenience to any other user, transmitting
          obscene or offensive content, or disrupting the normal flow of
          dialogue within our Site.
        </p>
      </section>

      <!-- 3. User Accounts -->
      <section class="mb-8">
        <h2 class="mb-4 text-2xl font-semibold text-gray-800">
          3. User Accounts
        </h2>
        <p class="text-gray-700">
          To access certain features of our Site, you may be required to create
          an account. You agree to provide accurate, current, and complete
          information during the registration process and to update such
          information to keep it accurate, current, and complete. You are
          responsible for safeguarding your password and for all activities that
          occur under your account. You agree to notify us immediately of any
          unauthorized use of your account or any other breach of security.
        </p>
      </section>

      <!-- 4. Intellectual Property -->
      <section class="mb-8">
        <h2 class="mb-4 text-2xl font-semibold text-gray-800">
          4. Intellectual Property
        </h2>
        <p class="text-gray-700">
          All content on the Site, including text, graphics, logos, images, and
          software, is the property of (env.alfakharco.com) or its content
          suppliers and is protected by intellectual property laws. You may not
          use, reproduce, distribute, or create derivative works from any
          content on the Site without our express written permission.
        </p>
      </section>

      <!-- 5. Termination -->
      <section class="mb-8">
        <h2 class="mb-4 text-2xl font-semibold text-gray-800">
          5. Termination
        </h2>
        <p class="text-gray-700">
          We may terminate or suspend your access to the Site immediately,
          without prior notice or liability, for any reason whatsoever,
          including, without limitation, if you breach the Terms. Upon
          termination, your right to use the Site will immediately cease.
        </p>
      </section>

      <!-- 6. Limitation of Liability -->
      <section class="mb-8">
        <h2 class="mb-4 text-2xl font-semibold text-gray-800">
          6. Limitation of Liability
        </h2>
        <p class="text-gray-700">
          In no event shall (env.alfakharco.com), its directors, employees,
          partners, agents, suppliers, or affiliates, be liable for any
          indirect, incidental, special, consequential, or punitive damages,
          including without limitation, loss of profits, data, use, goodwill, or
          other intangible losses, resulting from (i) your use or inability to
          use the Site; (ii) any unauthorized access to or use of our servers
          and/or any personal information stored therein; and (iii) any bugs,
          viruses, trojan horses, or the like that may be transmitted to or
          through our Site by any third party.
        </p>
      </section>

      <!-- 7. Governing Law -->
      <section class="mb-8">
        <h2 class="mb-4 text-2xl font-semibold text-gray-800">
          7. Governing Law
        </h2>
        <p class="text-gray-700">
          These Terms shall be governed and construed in accordance with the
          laws of [Your Country/State], without regard to its conflict of law
          provisions. Our failure to enforce any right or provision of these
          Terms will not be considered a waiver of those rights.
        </p>
      </section>

      <!-- 8. Changes to the Terms -->
      <section class="mb-8">
        <h2 class="mb-4 text-2xl font-semibold text-gray-800">
          8. Changes to the Terms
        </h2>
        <p class="text-gray-700">
          We reserve the right, at our sole discretion, to modify or replace
          these Terms at any time. If a revision is material, we will try to
          provide at least 30 days' notice prior to any new terms taking effect.
          What constitutes a material change will be determined at our sole
          discretion.
        </p>
      </section>

      <!-- 9. Contact Us -->
      <section class="mb-8">
        <h2 class="mb-4 text-2xl font-semibold text-gray-800">9. Contact Us</h2>
        <p class="text-gray-700">
          If you have any questions about these Terms, please
          <!-- Router link to the contact page -->
          <router-link to="/contact" class="inline text-gray-700 underline">
            <span> contact us </span>
          </router-link>
          .
        </p>
      </section>
    </div>
  </div>
</template>
