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
                <h2 class="pokemon-title text-start">Random Pokedex</h2>
                <hr class="my-4 border-2 border-primary">
            </div>
            <div class="row row-cols-1 row-cols-md-3 g-4">
                <template v-if="!isLoading && pokemonData.length > 0">
                    <div v-for="pokemon in pokemonData" :key="pokemon.id" class="col">
                        <div class="pokemon-tcg-card h-100" :class="{ 'is-flipped': pokemon.isFlipped }">
                            <div class="card-inner">
                                <div class="card-front">
                                    <div class="card-header-tcg">
                                        <div class="card-name-hp">
                                            <span class="fw-bold">{{ pokemon.name.toUpperCase() }}</span>
                                            <span class="hp-label"> HP</span> <span class="hp fw-bold">{{ pokemon.hp }}</span>
                                        </div>
                                        <div class="card-type">
                                            <svg v-if="pokemon.types[0] === 'grass'" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-leaf"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 4c1.5 0 3 0.5 3 2 0 1.5-2 2.44-3.5 4-1.5 1.56-2 2-2 4a7 7 0 0 1-2 4"/><path d="M7.9 20A7 7 0 0 0 16 6.1C10.3 5 8.8 4.48 6.8 4c-1.5 0-3 0.5-3 2 0 1.5 2 2.44 3.5 4 1.5 1.56 2 2 2 4a7 7 0 0 0 2 4"/></svg>
                                            <svg v-else-if="pokemon.types[0] === 'fire'" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-flame"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.3-.8-2.3-2-3-.5-.7-1-1.5-1.5-2-.2-.2-.5-.4-.7-.6-.8-.8-1.5-1.2-2.5-1.2a2 2 0 0 0-2 2c0 .9-.5 1.7-1 2.5C2.5 11.5 2 13 2 14.5a3.5 3.5 0 1 0 7 0Z"/><path d="M15.5 14.5A2.5 2.5 0 0 0 18 12c0-1.3-.8-2.3-2-3-.5-.7-1-1.5-1.5-2-.2-.2-.5-.4-.7-.6-.8-.8-1.5-1.2-2.5-1.2a2 2 0 0 0-2 2c0 .9-.5 1.7-1 2.5C9.5 11.5 9 13 9 14.5a3.5 3.5 0 1 0 7 0Z"/><path d="M18.5 10.5c1.4-1.4 2-3.2 2-4.5a3.5 3.5 0 0 0-5.5-2.6c-.6.5-1.2 1.3-1.8 2.2-.4.6-.8 1.1-1.2 1.7-.5.7-1 1.4-1.5 2.2-.5.8-.8 1.3-1.2 2-1.2 1.9-2 4.2-2 6a4 4 0 0 0 8 0c0-1.8-.8-4.1-2-6"/></svg>
                                            <svg v-else-if="pokemon.types[0] === 'water'" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-droplet"><path d="M12 2a8 8 0 0 0-8 8c0 2.5 2 5 4 7.5s4 5.5 4 5.5s4-3 4-5.5c2-2.5 4-5 4-7.5a8 8 0 0 0-8-8z"></path><path d="M12 4.417a7.6 7.6 0 0 0-5 5.583c0 2.25 2 4 4 6.5s4 4 4 4c2-2.5 4-4.25 4-6.5s-2-4.25-4-5.583z" fill="white"></path></svg>
                                            <svg v-else-if="pokemon.types[0] === 'electric'" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="white" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-zap"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                                            <svg v-else-if="pokemon.types[0] === 'bug'" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="white" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bug"><path d="M19 8a2 2 0 0 1 1 2v4a2 2 0 0 1-1 2"/><path d="M5 8a2 2 0 0 0-1 2v4a2 2 0 0 0 1 2"/><path d="M7 21a2.5 2.5 0 0 1-2.5-2.5V16h15v2.5A2.5 2.5 0 0 1 17 21Z"/><path d="M12 16V3"/><path d="M12 3a4 4 0 0 1 4 4"/><path d="M12 3a4 4 0 0 0-4 4"/></svg>
                                            <svg v-else-if="pokemon.types[0] === 'poison'" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="white" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-skull"><circle cx="12" cy="12" r="10"/><path d="M12 12a4 4 0 0 0 0 8"/><path d="M12 4a4 4 0 0 0 0 8"/><path d="M16 12a4 4 0 0 0-4 4"/><path d="M8 12a4 4 0 0 0 4 4"/></svg>
                                            <svg v-else-if="pokemon.types[0] === 'flying'" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-feather"><path d="M20.24 12.24l-7.07 7.07a4.5 4.5 0 0 1-6.36-6.36l7.07-7.07a4.5 4.5 0 0 1 6.36 6.36z"/><path d="M14.54 11.46l-3.08 3.08"/><path d="M22 22L11 11"/></svg>
                                            <svg v-else-if="pokemon.types[0] === 'normal'" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="white" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle"><circle cx="12" cy="12" r="10"/></svg>
                                            <i v-else class="fas fa-question"></i>
                                        </div>
                                    </div>
                                    <div class="card-image-container">
                                        <img v-if="pokemon.image" :src="pokemon.image" :alt="'Image of ' + pokemon.name" class="card-image">
                                        <div v-else class="text-center p-5">Image not available.</div>
                                    </div>
                                    <p class="card-description text-secondary">ID: #{{ pokemon.id }} - Type: {{ pokemon.types.join(', ') }}</p>

                                    <div class="attack-box">
                                        <div class="attack-header">
                                            <div class="d-flex align-items-center">
                                                <div class="card-type me-2">
                                                    <i class="fas fa-star"></i>
                                                </div>
                                                <span class="attack-name">{{ pokemon.moves[0].name.toUpperCase() }}</span>
                                            </div>
                                            <span class="attack-damage">{{ pokemon.stats.attack }}</span>
                                        </div>
                                    </div>

                                    <div class="card-stats">
                                        <div>
                                            <span class="fw-bold">Attack</span>
                                            <br> {{ pokemon.stats.attack }}
                                        </div>
                                        <div>
                                            <span class="fw-bold">Defense</span>
                                            <br> {{ pokemon.stats.defense }}
                                        </div>
                                        <div>
                                            <span class="fw-bold">Speed</span>
                                            <br> {{ pokemon.stats.speed }}
                                        </div>
                                    </div>

                                    <div class="d-flex justify-content-center mt-3">
                                        <button @click.stop="toggleFlip(pokemon)" class="btn btn-primary btn-sm">Details</button>
                                    </div>
                                </div>

                                <div class="card-back">
                                    <h4>{{ pokemon.name.toUpperCase() }}</h4>
                                    <p class="mb-3">ID: #{{ pokemon.id }}</p>
                                    <ul>
                                        <li><span class="fw-bold">Height:</span> {{ pokemon.height / 10 }} m</li>
                                        <li><span class="fw-bold">Weight:</span> {{ pokemon.weight / 10 }} kg</li>
                                        <li><span class="fw-bold">Base Experience:</span> {{ pokemon.base_experience }}</li>
                                        <li><span class="fw-bold">Abilities:</span> {{ pokemon.abilities.join(', ') }}</li>
                                    </ul>
                                    <button @click.stop="toggleFlip(pokemon)" class="btn btn-primary btn-back">Back</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
                <template v-else>
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
            </div>
            <div class="text-center mt-5">
                <button @click="fetchRandomPokemon" class="btn btn-primary fw-bold">Find Random Pokemon</button>
            </div>
        </section>
    </main>
    <Footer company-name="Pokemon Explorer" />
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import '../styles/homePokemon.css';
import { FetchingRandomPokemon } from '@/store/getPokemon.js';
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';

const randomPokemonStore = FetchingRandomPokemon();



const pokemonData = computed(() => randomPokemonStore.pokemonData);
const isLoading = computed(() => randomPokemonStore.loading);

const jumbotronImages = ref([
    'https://i.pinimg.com/736x/e7/5d/f9/e75df9da48863517bf6a86cca48bc05e.jpg',
    'https://i.pinimg.com/1200x/51/91/42/5191422a000db2f6f1ab604f4e34b9bb.jpg',
    'https://i.pinimg.com/1200x/f2/82/aa/f282aa53ca63e968f95d158fa138ef10.jpg',
    'https://i.pinimg.com/1200x/e3/3e/a1/e33ea126464eb8c01b347636b337cc00.jpg'
]);

const currentImageIndex = ref(0);
let intervalId = null;

const startSlider = () => {
    intervalId = setInterval(() => {
        currentImageIndex.value = (currentImageIndex.value + 1) % jumbotronImages.value.length;
    }, 3000);
};

const fetchRandomPokemon = () => {
    randomPokemonStore.fetchRandomPokemon();
};

function toggleFlip(pokemon) {
    pokemon.isFlipped = !pokemon.isFlipped;
}

onMounted(() => {
    startSlider();
    fetchRandomPokemon();
});

onUnmounted(() => {
    clearInterval(intervalId);
});

</script>

