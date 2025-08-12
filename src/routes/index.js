import { createRouter, createWebHashHistory } from 'vue-router'
import HomePokemonFetch from '../views/HomeFetchingPokemon.vue'
import HomePokemonFetchType from '../views/HomeFetchingTypePokemon.vue'
import HomeAllPokemon from '../views/HomeAllPokemon.vue'

const Routes = [
    {
        path: '/',
        name: 'Home',
        component: HomePokemonFetch
    },
    {
        path: '/pokemontype/:type',
        name: 'HomePokemonFetchType',
        component: HomePokemonFetchType
    },
    {
        path: '/allpokemon',
        name: 'AllPokemon',
        component: HomeAllPokemon
    },
]

const Router = createRouter({
    history: createWebHashHistory(),
    routes: Routes
})

export default Router