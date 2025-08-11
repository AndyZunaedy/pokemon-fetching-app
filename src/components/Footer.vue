<template>
    <footer class="pokemon-footer py-4 text-center">
        <div class="container">
            <p class="mb-0">&copy; {{ currentYear }} {{ companyName }}. All rights reserved.</p>
        </div>
    </footer>
</template>

<script setup>
import { computed } from 'vue';
const props = defineProps({
    companyName: {
        type: String,
        default: 'Pokemon Explorer'
    }
});
const currentYear = computed(() => {
    return new Date().getFullYear();
});
</script>
