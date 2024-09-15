<template>
    <div class="w-full bg-LightGray py-2">
        <div class="container flex flex-col mx-auto">
            <div class="flex justify-between sm:flex-col pt-2">
            <h1 class="text-xl sm:text-base sm:text-center text-black font-bold">
                Manage Remote Level Stations Online by Dashboard..
            </h1>
            <Button label="Dashboard" class="!bg-DarkBlue sm:!mt-2 sm:m-auto !border-none hover:!bg-opacity-80 sm:w-[50%] !text-white" @click="redirect"></Button>
        </div>
        </div>
    </div>
</template>

<script setup>
const router = useRouter()
const redirect = () => {
    router.push('/dashboard/add-data')
}

</script>
