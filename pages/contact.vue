<template>
  <div class="flex min-h-screen w-full flex-col">
    <div class="mt-16 flex flex-col items-center justify-center gap-4">
      <h1 class="text-3xl font-bold text-black">Contact Us</h1>
      <!-- Contact form container -->
      <div
        class="container m-auto mx-auto w-[60%] rounded-xl bg-gray-200 p-12 text-black sm:w-[90%]"
      >
        <form @submit.prevent="submitForm" class="flex w-full flex-col gap-4">
          <!-- Email input field -->
          <div class="mx-auto w-full">
            <label
              for="email"
              class="mb-2 block text-sm font-medium text-gray-900"
            >
              Your Email Address
            </label>
            <InputText id="email" v-model="email" class="w-full !bg-gray-100" />
          </div>
          <!-- Message input field -->
          <div class="mx-auto w-full">
            <label
              for="message"
              class="mb-2 block text-sm font-medium text-gray-900"
            >
              Please Write Your Message
            </label>
            <Textarea
              id="message"
              v-model="message"
              rows="5"
              class="w-full !bg-gray-100"
            />
          </div>
          <!-- Form buttons -->
          <div class="mt-4 flex justify-center gap-4">
            <Button
              label="Cancel"
              severity="danger"
              outlined
              @click="redirectToHome"
            />
            <Button
              label="Send"
              type="submit"
              :loading="isSubmitting"
              class="w-1/2 !border-none !bg-DarkBlue !text-white hover:!bg-opacity-80"
            />
          </div>
          <!-- Error and success messages -->
          <Message v-if="errorMessage" severity="error" :closable="false">{{
            errorMessage
          }}</Message>
          <Message v-if="successMessage" severity="success" :closable="false">{{
            successMessage
          }}</Message>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
// Reactive variables for form inputs and state
const email = ref("");
const message = ref("");
const isSubmitting = ref(false);
const errorMessage = ref("");
const successMessage = ref("");

// Function to handle form submission
const submitForm = async () => {
  isSubmitting.value = true;
  errorMessage.value = "";
  successMessage.value = "";

  try {
    // Prepare email content
    const emailTitle = "New Email From MOEN";
    const emailBody = encodeURIComponent(
      `From: ${email.value}\n\n${message.value}`,
    );
    // Create mailto link
    const mailtoLink = `mailto:Sales@alfakharco.com?subject=${emailTitle}&body=${emailBody}`;
    // Open default email client
    window.open(mailtoLink);
    successMessage.value = "Email client opened successfully!";
    resetForm();
  } catch (err) {
    errorMessage.value =
      "Failed to open email client. Please check your input and try again.";
  } finally {
    isSubmitting.value = false;
  }
};

// Function to reset form fields and messages
const resetForm = () => {
  email.value = "";
  message.value = "";
  errorMessage.value = "";
  successMessage.value = "";
};

// Router setup for navigation
const router = useRouter();

// Function to redirect to home page
const redirectToHome = () => {
  router.push("/");
};
</script>
