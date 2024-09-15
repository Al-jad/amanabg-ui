<template>
  <div class="flex min-h-screen w-full flex-col">
    <div class="mt-16 flex flex-col items-center justify-center gap-4">
      <h1 class="text-3xl font-bold text-black">Contact Us</h1>
      <div
        class="container m-auto mx-auto w-[60%] rounded-xl bg-gray-200 p-12 text-black sm:w-[90%]"
      >
        <form @submit.prevent="submitForm" class="flex w-full flex-col gap-4">
          <div class="mx-auto w-full">
            <label
              for="email"
              class="mb-2 block text-sm font-medium text-gray-900"
            >
              Your Email Address
            </label>
            <InputText id="email" v-model="email" class="w-full !bg-gray-100" />
          </div>
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
import { ref } from "vue";

const email = ref("");
const message = ref("");
const isSubmitting = ref(false);
const errorMessage = ref("");
const successMessage = ref("");

const submitForm = async () => {
  isSubmitting.value = true;
  errorMessage.value = "";
  successMessage.value = "";

  try {
    const emailTitle = "New Email From MOEN";
    const emailBody = encodeURIComponent(
      `From: ${email.value}\n\n${message.value}`,
    );
    const mailtoLink = `mailto:Sales@alfakharco.com?subject=${emailTitle}&body=${emailBody}`;
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

const resetForm = () => {
  email.value = "";
  message.value = "";
  errorMessage.value = "";
  successMessage.value = "";
};
const router = useRouter();
const redirectToHome = () => {
  router.push("/");
};
</script>
