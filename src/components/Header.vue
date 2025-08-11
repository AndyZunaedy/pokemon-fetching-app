<template>
    <header class="fixed-header">
        <nav class="navbar navbar-expand-lg navbar-light pokemon-navbar shadow-sm fixed-navbar">
            <div class="container">
                <a class="navbar-brand pokemon-font fs-4" href="#">
                    <span class="pokemon-title">PokemonDex</span>
                </a>
                <button @click="toggleNav" class="navbar-toggler" type="button" aria-controls="navbarNav" :aria-expanded="isNavOpen" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="navbar-collapse" :class="{ 'collapse': !isNavOpen }">
                    <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
                        <li class="nav-item">
                            <a class="nav-link" :class="{ 'active': isHomeActive }" aria-current="page" @click="GoHome">Home</a>
                        </li>
                        <li class="nav-item dropdown" ref="dropdownRef">
                            <a class="nav-link dropdown-toggle" 
                               :class="{ 'active': isPokemonTypeActive }" 
                               href="#" 
                               role="button" 
                               @click.prevent="toggleDropdown"
                               :aria-expanded="isDropdownOpen">
                                Pokemon Type
                            </a>
                            <ul class="dropdown-menu dropdown-scrollable" 
                                :class="{ 'show': isDropdownOpen }"
                                @click.stop>
                                <li v-for="type in pokemonTypes" :key="type.name">
                                    <a class="dropdown-item" @click="selectPokemonType(type.name)">
                                        {{ capitalizeFirst(type.name) }}
                                    </a>
                                </li>
                                <li v-if="pokemonTypes.length === 0" class="dropdown-item-text">
                                    Loading types... ({{ pokemonStore.loading ? 'Loading' : 'No data' }})
                                </li>
                                <li v-if="pokemonTypes.length > 0" class="dropdown-item-text">
                                    Total: {{ pokemonTypes.length }} types
                                </li>
                            </ul>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" :class="{ 'active': isPokemonActive }" @click="GoPokemon">Pokemon</a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { FetchingPokemonType } from '@/store/getPokemon.js';

const router = useRouter();
const route = useRoute();
const isNavOpen = ref(false);
const isScrolled = ref(false);
const isDropdownOpen = ref(false); 
const dropdownRef = ref(null); 
const pokemonStore = FetchingPokemonType();

const capitalizeFirst = (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

const isHomeActive = computed(() => {
    const isActive = route.name === 'Home' || route.path === '/';
    return isActive;
});

const isPokemonTypeActive = computed(() => {
    const isActive = route.name === 'HomePokemonFetchType' || (route.path.startsWith('/pokemontype/') && route.path.includes('/pokemontype/'));
    return isActive;
});


const isPokemonActive = computed(() => {
    const isActive = route.name === 'AllPokemon' || 
                    (route.path.includes('/allpokemon') && 
                     !route.path.includes('/pokemontype') && 
                     !route.path.startsWith('/pokemontype'));
    return isActive;
});

const handleScroll = () => {
    isScrolled.value = window.scrollY > 50;
    const navbar = document.querySelector('.fixed-navbar');
    if (navbar) {
        if (isScrolled.value) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
};

onMounted(() => {
    pokemonStore.fetchPokemonType();
    setTimeout(() => {
    }, 2000);
    window.addEventListener('scroll', handleScroll);
    document.addEventListener('click', handleClickOutside);
    handleScroll();
});

watch(() => route.path, (newPath, oldPath) => {
});

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
    document.removeEventListener('click', handleClickOutside);
});

const pokemonTypes = computed(() => {
    if (pokemonStore.pokemonTypeData && Array.isArray(pokemonStore.pokemonTypeData)) {
        return pokemonStore.pokemonTypeData;
    }
    return [];
});

const toggleDropdown = () => {
    isDropdownOpen.value = !isDropdownOpen.value;
};

const handleClickOutside = (event) => {
    if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
        isDropdownOpen.value = false;
    }
};

const selectPokemonType = (typeName) => {
    router.push({ name: 'HomePokemonFetchType', params: { type: typeName } });
    isDropdownOpen.value = false; 
    isNavOpen.value = false; 
    emit('type-selected', typeName);
};

const toggleNav = () => {
    isNavOpen.value = !isNavOpen.value;
    isDropdownOpen.value = false;
};


const GoHome = () => {
    router.push({ name: 'Home' });
    isNavOpen.value = false;
    isDropdownOpen.value = false;
};


const GoPokemon = () => {
    router.push({ name: 'AllPokemon' });
    isNavOpen.value = false;
    isDropdownOpen.value = false;
};

const emit = defineEmits(['type-selected']);
</script>


