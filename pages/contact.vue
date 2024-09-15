<template>
    <div class="w-full min-h-screen flex flex-col">
        <div class="flex flex-col gap-4 items-center justify-center mt-16">
            <h1 class="text-black font-bold text-3xl">
                Contact Us
            </h1>
            <div class="bg-gray-200 m-auto sm:w-[90%] w-[60%] p-12 rounded-xl container mx-auto text-black">
                <form @submit.prevent="submitForm" class="flex flex-col w-full gap-4">
                    <div class="w-full mx-auto">
                        <label for="email" class="block mb-2 text-sm font-medium text-gray-900">
                            Your Email Address
                        </label>
                        <InputText id="email" v-model="email" class="w-full !bg-gray-100" />
                    </div>
                    <div class="w-full mx-auto">
                        <label for="message" class="block mb-2 text-sm font-medium text-gray-900">
                            Please Write Your Message
                        </label>
                        <Textarea id="message" v-model="message" rows="5" class="w-full !bg-gray-100" />
                    </div>
                    <div class="flex justify-center gap-4 mt-4">
                        <Button label="Cancel" severity="danger" outlined @click="redirectToHome"  />
                        <Button label="Send" type="submit" :loading="isSubmitting" class="!bg-DarkBlue !border-none !text-white hover:!bg-opacity-80 w-1/2" />
                    </div>
                    <Message v-if="errorMessage" severity="error" :closable="false">{{ errorMessage }}</Message>
                    <Message v-if="successMessage" severity="success" :closable="false">{{ successMessage }}</Message>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const email = ref('');
const message = ref('');
const isSubmitting = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

const submitForm = async () => {
    isSubmitting.value = true;
    errorMessage.value = '';
    successMessage.value = '';

    try {
        const emailTitle = "New Email From MOEN";
        const emailBody = encodeURIComponent(`From: ${email.value}\n\n${message.value}`);
        const mailtoLink = `mailto:Sales@alfakharco.com?subject=${emailTitle}&body=${emailBody}`;
        window.open(mailtoLink);
        successMessage.value = 'Email client opened successfully!';
        resetForm();
    } catch (err) {
        errorMessage.value = 'Failed to open email client. Please check your input and try again.';
    } finally {
        isSubmitting.value = false;
    }
};

const resetForm = () => {
    email.value = '';
    message.value = '';
    errorMessage.value = '';
    successMessage.value = '';
};
const router = useRouter();
const redirectToHome = () => {
    router.push('/');
};
</script>