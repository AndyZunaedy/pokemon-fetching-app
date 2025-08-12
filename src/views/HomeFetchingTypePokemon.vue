<template>
    <Header/>

    <main>
        <section class="pokemon-jumbotron">
            <div v-for="(image, index) in jumbotronImages" :key="index"
                 class="jumbotron-slide"
                 :style="{ 'background-image': 'url(' + image + ')' }"
                 :class="{ 'active': index === currentImageIndex }">
            </div>
        </section>

        <section class="container py-5">
            <div class="col-12 mt-5">
                <h2 class="pokemon-title text-start">{{pageTitle}}</h2>
                <hr class="my-4 border-2 border-primary">
            </div>

            <div class="row mb-4" v-if="selectedType">
                <div class="col-md-6 mx-auto">
                    <div class="input-group">
                        <span class="input-group-text">
                            <i class="fas fa-search"></i>
                        </span>
                        <input 
                            type="text" 
                            class="form-control" 
                            placeholder="Search Pokemon by name..."
                            v-model="searchQuery"
                            @input="onSearchInput">
                    </div>
                </div>
            </div>

             <div class="row mb-3" v-if="selectedType && !displayLoading">
                <div class="col-12">
                    <p class="text-muted">
                        <span v-if="searchQuery">
                            Found {{ filteredPokemonData.length }} results for "{{ searchQuery }}"
                        </span>
                        <span v-else>
                            Showing {{ paginatedPokemonData.length }} of {{ pokemonDataType.length }} Pokemon
                        </span>
                        (Page {{ currentPage }} of {{ totalPages }})
                    </p>
                </div>
            </div>

            <div class="row row-cols-1 row-cols-md-3 g-4">
                <template v-if="!displayLoading && paginatedPokemonData.length > 0">
                    <div v-for="pokemon in paginatedPokemonData" :key="pokemon.id" class="col">
                        <div class="pokemon-tcg-card h-100" :class="{ 'is-flipped': pokemon.isFlipped }">
                            <div class="card-inner">
                                <div class="card-front">
                                    <div class="card-header-tcg">
                                        <div class="card-name-hp">
                                            <span class="fw-bold">{{ pokemon.name.toUpperCase() }}</span>
                                            <span class="hp-label"> HP</span> <span class="hp fw-bold">{{ pokemon.hp }}</span>
                                        </div>
                                        <div class="card-type">
                                            <svg v-if="pokemon.types && pokemon.types[0] === 'grass'" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-leaf"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 4c1.5 0 3 0.5 3 2 0 1.5-2 2.44-3.5 4-1.5 1.56-2 2-2 4a7 7 0 0 1-2 4"/><path d="M7.9 20A7 7 0 0 0 16 6.1C10.3 5 8.8 4.48 6.8 4c-1.5 0-3 0.5-3 2 0 1.5 2 2.44 3.5 4 1.5 1.56 2 2 2 4a7 7 0 0 0 2 4"/></svg>
                                            <svg v-else-if="pokemon.types && pokemon.types[0] === 'fire'" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-flame"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.3-.8-2.3-2-3-.5-.7-1-1.5-1.5-2-.2-.2-.5-.4-.7-.6-.8-.8-1.5-1.2-2.5-1.2a2 2 0 0 0-2 2c0 .9-.5 1.7-1 2.5C2.5 11.5 2 13 2 14.5a3.5 3.5 0 1 0 7 0Z"/><path d="M15.5 14.5A2.5 2.5 0 0 0 18 12c0-1.3-.8-2.3-2-3-.5-.7-1-1.5-1.5-2-.2-.2-.5-.4-.7-.6-.8-.8-1.5-1.2-2.5-1.2a2 2 0 0 0-2 2c0 .9-.5 1.7-1 2.5C9.5 11.5 9 13 9 14.5a3.5 3.5 0 1 0 7 0Z"/><path d="M18.5 10.5c1.4-1.4 2-3.2 2-4.5a3.5 3.5 0 0 0-5.5-2.6c-.6.5-1.2 1.3-1.8 2.2-.4.6-.8 1.1-1.2 1.7-.5.7-1 1.4-1.5 2.2-.5.8-.8 1.3-1.2 2-1.2 1.9-2 4.2-2 6a4 4 0 0 0 8 0c0-1.8-.8-4.1-2-6"/></svg>
                                            <svg v-else-if="pokemon.types && pokemon.types[0] === 'water'" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-droplet"><path d="M12 2a8 8 0 0 0-8 8c0 2.5 2 5 4 7.5s4 5.5 4 5.5s4-3 4-5.5c2-2.5 4-5 4-7.5a8 8 0 0 0-8-8z"></path><path d="M12 4.417a7.6 7.6 0 0 0-5 5.583c0 2.25 2 4 4 6.5s4 4 4 4c2-2.5 4-4.25 4-6.5s-2-4.25-4-5.583z" fill="white"></path></svg>
                                            <svg v-else-if="pokemon.types && pokemon.types[0] === 'electric'" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="white" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-zap"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                                            <svg v-else-if="pokemon.types && pokemon.types[0] === 'bug'" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="white" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bug"><path d="M19 8a2 2 0 0 1 1 2v4a2 2 0 0 1-1 2"/><path d="M5 8a2 2 0 0 0-1 2v4a2 2 0 0 0 1 2"/><path d="M7 21a2.5 2.5 0 0 1-2.5-2.5V16h15v2.5A2.5 2.5 0 0 1 17 21Z"/><path d="M12 16V3"/><path d="M12 3a4 4 0 0 1 4 4"/><path d="M12 3a4 4 0 0 0-4 4"/></svg>
                                            <svg v-else-if="pokemon.types && pokemon.types[0] === 'poison'" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="white" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-skull"><circle cx="12" cy="12" r="10"/><path d="M12 12a4 4 0 0 0 0 8"/><path d="M12 4a4 4 0 0 0 0 8"/><path d="M16 12a4 4 0 0 0-4 4"/><path d="M8 12a4 4 0 0 0 4 4"/></svg>
                                            <svg v-else-if="pokemon.types && pokemon.types[0] === 'flying'" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-feather"><path d="M20.24 12.24l-7.07 7.07a4.5 4.5 0 0 1-6.36-6.36l7.07-7.07a4.5 4.5 0 0 1 6.36 6.36z"/><path d="M14.54 11.46l-3.08 3.08"/><path d="M22 22L11 11"/></svg>
                                            <svg v-else-if="pokemon.types && pokemon.types[0] === 'normal'" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="white" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle"><circle cx="12" cy="12" r="10"/></svg>
                                            <i v-else class="fas fa-question"></i>
                                        </div>
                                    </div>
                                    <div class="card-image-container">
                                        <img v-if="pokemon.image" :src="pokemon.image" :alt="'Image of ' + pokemon.name" class="card-image">
                                        <div v-else class="text-center p-5">Image not available.</div>
                                    </div>
                                    <p class="card-description text-secondary">ID: #{{ pokemon.id }} - Type: {{ pokemon.types ? pokemon.types.join(', ') : 'Unknown' }}</p>

                                    <div class="attack-box">
                                        <div class="attack-header">
                                            <div class="d-flex align-items-center">
                                                <div class="card-type me-2">
                                                    <i class="fas fa-star"></i>
                                                </div>
                                                <span class="attack-name">
                                                    {{ pokemon.moves && pokemon.moves[0] && pokemon.moves[0].name ? 
                                                       pokemon.moves[0].name.toUpperCase() : 'TACKLE' }}
                                                </span>
                                            </div>
                                            <span class="attack-damage">{{ pokemon.stats?.attack || 50 }}</span>
                                        </div>
                                    </div>

                                    <div class="card-stats">
                                        <div>
                                            <span class="fw-bold">Attack</span>
                                            <br> {{ pokemon.stats?.attack || 50 }}
                                        </div>
                                        <div>
                                            <span class="fw-bold">Defense</span>
                                            <br> {{ pokemon.stats?.defense || 50 }}
                                        </div>
                                        <div>
                                            <span class="fw-bold">Speed</span>
                                            <br> {{ pokemon.stats?.speed || 50 }}
                                        </div>
                                    </div>

                                    <div class="d-flex justify-content-center mt-3">
                                        <button @click.stop="toggleFlip(pokemon)" class="btn btn-primary btn-sm">Details</button>
                                    </div>
                                </div>

                                <div class="card-back">
                                    <h4>{{ pokemon.name ? pokemon.name.toUpperCase() : 'UNKNOWN' }}</h4>
                                    <p class="mb-3">ID: #{{ pokemon.id || 'Unknown' }}</p>
                                    <ul>
                                        <li><span class="fw-bold">Height:</span> {{ pokemon.height ? (pokemon.height / 10) : 'Unknown' }} m</li>
                                        <li><span class="fw-bold">Weight:</span> {{ pokemon.weight ? (pokemon.weight / 10) : 'Unknown' }} kg</li>
                                        <li><span class="fw-bold">Base Experience:</span> {{ pokemon.base_experience || 'Unknown' }}</li>
                                        <li><span class="fw-bold">Abilities:</span> {{ pokemon.abilities ? pokemon.abilities.join(', ') : 'Unknown' }}</li>
                                    </ul>
                                    <button @click.stop="toggleFlip(pokemon)" class="btn btn-primary btn-back">Back</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
                <template v-else-if="displayLoading">
                     <div v-for="n in 3" :key="n" class="col">
                        <div class="d-flex justify-content-center align-items-center h-100 feature-card rounded-3">
                            <svg class="pokeball-spinner" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                                <path fill="#D72828" d="M 100, 100 m 0, -80 a 80, 80 0 1 1 0, 160 a 80, 80 0 1 1 0, -160 M 100, 100 m 0, -80 a 80, 80 0 0 0 0, 160 a 80, 80 0 0 0 0, -160 L 100, 20 L 100, 100 Z" stroke-width="0"></path>
                                <path fill="#FFFFFF" d="M 100, 100 m 0, 80 a 80, 80 0 1 1 0, -160 a 80, 80 0 1 1 0, 160 Z" stroke-width="0" transform="rotate(180 100 100)"></path>
                                <path fill="#000000" d="M 100, 100 m -20, 0 a 20, 20 0 1 0 40, 0 a 20, 20 0 1 0 -40, 0 Z" stroke-width="0"></path>
                                <rect fill="#000000" x="20" y="90" width="160" height="20"></rect>
                            </svg>
                        </div>
                    </div>
                </template>

                 <template v-else-if="searchQuery && filteredPokemonData.length === 0">
                    <div class="col-12">
                        <div class="alert alert-info text-center">
                            <i class="fas fa-search fa-2x mb-3"></i>
                            <h5>No Pokemon found</h5>
                            <p>No Pokemon matching "{{ searchQuery }}" in {{ selectedType }} type.</p>
                        </div>
                    </div>
                </template>

                 <template v-else-if="!selectedType">
                    <div class="col-12">
                        <div class="alert alert-warning text-center">
                            <i class="fas fa-info-circle fa-2x mb-3"></i>
                            <h5>Select a Pokemon Type</h5>
                            <p>Please select a Pokemon type from the navigation menu.</p>
                        </div>
                    </div>
                </template>
            </div>
            <div class="row mt-4" v-if="selectedType && !displayLoading && totalPages > 1">
                <div class="col-12">
                    <nav aria-label="Pokemon pagination">
                        <ul class="pagination justify-content-center">
                            <li class="page-item" :class="{ disabled: currentPage === 1 }">
                                <button class="page-link" @click="goToPage(currentPage - 1)" :disabled="currentPage === 1">
                                    <i class="fas fa-chevron-left"></i> Previous
                                </button>
                            </li>

                            <li v-for="page in visiblePages" :key="page" class="page-item" :class="{ active: page === currentPage }">
                                <button class="page-link" @click="goToPage(page)">{{ page }}</button>
                            </li>

                            <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                                <button class="page-link" @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages">
                                    Next <i class="fas fa-chevron-right"></i>
                                </button>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>

            <div class="row mt-3" v-if="selectedType && !displayLoading && pokemonDataType.length > 0">
                <div class="col-12 text-center">
                    <div class="d-inline-flex align-items-center">
                        <label class="me-2">Items per page:</label>
                        <select class="form-select form-select-sm" style="width: auto;" v-model="itemsPerPage" @change="onItemsPerPageChange">
                            <option value="6">6</option>
                            <option value="9">9</option>
                            <option value="12">12</option>
                            <option value="18">18</option>
                        </select>
                    </div>
                </div>
            </div>
        </section>
    </main>
    <Footer company-name="Pokemon Explorer" />
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import '../styles/homePokemon.css';
import { FetchingPokemonDetailType } from '@/store/getPokemon.js';
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';

const route = useRoute();
const pokemonTypeStore = FetchingPokemonDetailType();

const searchQuery = ref('');
const currentPage = ref(1);
const itemsPerPage = ref(6);

const selectedType = computed(() => route.params.type || null);
const pageTitle = computed(() => {
    if (selectedType.value) {
        return `Pokemon Type : ${selectedType.value.toUpperCase()}`;
    }
    return 'Pokemon Types';
});

const pokemonDataType = computed(() => pokemonTypeStore.pokemonTypeDetailData || []);
const isLoadingType = computed(() => pokemonTypeStore.loading);

const filteredPokemonData = computed(() => {
    if (!searchQuery.value) {
        return pokemonDataType.value;
    }
    
    const query = searchQuery.value.toLowerCase();
    return pokemonDataType.value.filter(pokemon => 
        pokemon.name.toLowerCase().includes(query) ||
        pokemon.id.toString().includes(query) ||
        (pokemon.types && pokemon.types.some(type => type.toLowerCase().includes(query)))
    );
});

const totalPages = computed(() => {
    return Math.ceil(filteredPokemonData.value.length / itemsPerPage.value);
});

const paginatedPokemonData = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value;
    const end = start + itemsPerPage.value;
    return filteredPokemonData.value.slice(start, end);
});

const visiblePages = computed(() => {
    const total = totalPages.value;
    const current = currentPage.value;
    const delta = 2; 
    
    let start = Math.max(1, current - delta);
    let end = Math.min(total, current + delta);
    
    if (end - start < delta * 2) {
        if (start === 1) {
            end = Math.min(total, start + delta * 2);
        } else {
            start = Math.max(1, end - delta * 2);
        }
    }
    
    const pages = [];
    for (let i = start; i <= end; i++) {
        pages.push(i);
    }
    return pages;
});

const displayPokemonData = computed(() => pokemonDataType.value);
const displayLoading = computed(() => isLoadingType.value || (selectedType.value && pokemonDataType.value.length === 0));

const onSearchInput = () => {
    currentPage.value = 1; 
};

const goToPage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page;
    }
};

const onItemsPerPageChange = () => {
    currentPage.value = 1; 
};

const jumbotronImages = ref([
    '/images/background1.jpg',
    '/images/background2.jpg',
    '/images/background3.jpg',
    '/images/background4.jpg'
]);

const currentImageIndex = ref(0);
let intervalId = null;

const startSlider = () => {
    intervalId = setInterval(() => {
        currentImageIndex.value = (currentImageIndex.value + 1) % jumbotronImages.value.length;
    }, 3000);
};

const fetchPokemonType = () => {
    if (selectedType.value) {
        console.log('Fetching Pokemon type:', selectedType.value);
        pokemonTypeStore.fetchPokemonDetailType(selectedType.value);
    }
};

function toggleFlip(pokemon) {
    pokemon.isFlipped = !pokemon.isFlipped;
}

onMounted(() => {
    startSlider();
    fetchPokemonType();
});

watch(() => route.params.type, (newType, oldType) => {
    if (newType && newType !== oldType) {
        console.log('Type changed from', oldType, 'to', newType);
        searchQuery.value = '';
        currentPage.value = 1;
        pokemonTypeStore.pokemonTypeDetailData = [];
     
        fetchPokemonType();
    }
});

onUnmounted(() => {
    clearInterval(intervalId);
});

</script>

