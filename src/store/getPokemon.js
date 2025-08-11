import { defineStore } from "pinia";
import axios from "axios";

export const FetchingPokemonType = defineStore("pokemon", {
    state: () => ({
        pokemonTypeData: null,
        loading: false,
        error: null
    }),
    actions: {
        async fetchPokemonType() {
            this.loading = true;
            this.error = null;
            try {
                const DataPokemon = await axios.get("https://pokeapi.co/api/v2/type");
                this.pokemonTypeData = DataPokemon.data.results;
                console.log(this.pokemonTypeData, 'testing');
            } catch (err) {
                this.error = "Fetching Type Pokemon Failed !!"
            } finally {
                this.loading = false;
            }
        }
    }
})

export const FetchingPokemonDetailType = defineStore("pokemonDetailType", {
    state: () => ({
        pokemonTypeDetailData: null,
        loading: false,
        error: null
    }),
    actions: {
        async fetchPokemonDetailType(typeName) {
            this.loading = true;
            this.error = null;
            try {
                const DataPokemonDetail = await axios.get(`https://pokeapi.co/api/v2/type/${typeName}`);
                const pokemonTypeDetailData = DataPokemonDetail.data.pokemon;

                const basePokemonList = [];
                for (const PokemonItem of pokemonTypeDetailData) {
                    const pokemonId = PokemonItem.pokemon.url.split('/').slice(-2, -1)[0];

                    try {
                        const spesiesPokemonResponse = await axios.get(`https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`);
                        const evolutionPokemonResponse = await axios.get(spesiesPokemonResponse.data.evolution_chain.url);
                        const baseSpesiesName = evolutionPokemonResponse.data.chain.species.name;

                        if (PokemonItem.pokemon.name === baseSpesiesName) {
                            basePokemonList.push(PokemonItem);
                        }
                    } catch (error) {
                        basePokemonList.push(PokemonItem)
                    }
                }
                const detailedPokemonList = [];
                const pokemonToFetch = pokemonTypeDetailData.slice(0, 12);
                for (const pokemonItem of pokemonToFetch) {
                    try {
                        const pokemonResponse = await axios.get(pokemonItem.pokemon.url);
                        const data = pokemonResponse.data;

                        const validMoves = data.moves.filter(move => move.move.name);
                        const moveName = validMoves.length > 0 ? validMoves[0].move.name : 'Unknown Move';

                        const detailedPokemon = {
                            id: data.id,
                            name: data.name,
                            image: data.sprites.other['official-artwork'].front_default || data.sprites.front_default,
                            hp: data.stats.find(stat => stat.stat.name === 'hp').base_stat,
                            types: data.types.map(type => type.type.name),
                            moves: [{ name: moveName }],
                            stats: {
                                attack: data.stats.find(stat => stat.stat.name === 'attack').base_stat,
                                defense: data.stats.find(stat => stat.stat.name === 'defense').base_stat,
                                speed: data.stats.find(stat => stat.stat.name === 'speed').base_stat,
                            },
                            height: data.height,
                            weight: data.weight,
                            base_experience: data.base_experience,
                            abilities: data.abilities.map(a => a.ability.name),
                            isFlipped: false
                        };

                        detailedPokemonList.push(detailedPokemon);
                    } catch (error) {
                        console.error(`Failed to fetch Pokemon details for ${pokemonItem.pokemon.name}:`, error);
                    }
                }
                this.pokemonTypeDetailData = detailedPokemonList;
                console.log(detailedPokemonList, 'detail type data');
            } catch (error) {
                this.error = "Fetching Pokemon Detail Type Failed !!";
            } finally {
                this.loading = false;
            }
        }
    }
})

export const FetchingPokemonDetail = defineStore("pokemonDetail", {
    state: () => ({
        pokemonDetailData: null,
        loading: false,
        error: null
    }),
    actions: {
        async fetchPokemonDetail(url) {
            this.loading = true;
            this.error = null;
            try {
                const DataPokemonDetail = await axios.get(url);
                this.pokemonDetailData = DataPokemonDetail.data;
                console.log(this.pokemonDetailData, 'detail data');
            } catch (error) {
                this.error = "Fetching Pokemon Detail Failed !!";
            } finally {
                this.loading = false;
            }
        }
    }
})

export const FetchingPokemonEvolution = defineStore("pokemonEvolution", {
    state: () => ({
        pokemonEvolution: null,
        loading: false,
        error: null
    }),
    actions: {
        async fetchPokemonEvolution(id) {
            this.loading = true;
            this.error = null;
            try {
                const speciesResponse = await axios.get(`https://pokeapi.co/api/v2/pokemon-species/${id}`);
                const evolutionUrl = speciesResponse.data.evolution_chain.url;
                const evolutionResponse = await axios.get(evolutionUrl);
                this.pokemonEvolution = evolutionResponse.data.chain;
            } catch (error) {
                this.error = "Fetching Pokemon Evolution Failed !!";
            } finally {
                this.loading = false;
            }
        }
    }
})

export const FetchingRandomPokemon = defineStore("randomPokemon", {
    state: () => ({
        pokemonData: [],
        loading: false,
        error: null
    }),
    actions: {
        async fetchRandomPokemon() {
            this.loading = true;
            this.pokemonData = [];
            this.error = null;

            try {
                const pokemonPromises = [];
                for (let i = 0; i < 3; i++) {
                    const randomId = Math.floor(Math.random() * 151) + 1;
                    pokemonPromises.push(
                        axios.get(`https://pokeapi.co/api/v2/pokemon/${randomId}`)
                    );
                }

                const allPokemonData = await Promise.all(pokemonPromises);

                this.pokemonData = allPokemonData.map(response => {
                    const data = response.data;
                    const validMoves = data.moves.filter(move => move.move.name);
                    const moveName = validMoves.length > 0 ? validMoves[0].move.name : 'Unknown Move';
                    return {
                        id: data.id,
                        name: data.name,
                        image: data.sprites.other['official-artwork'].front_default || data.sprites.front_default,
                        hp: data.stats.find(stat => stat.stat.name === 'hp').base_stat,
                        types: data.types.map(type => type.type.name),
                        moves: [{ name: moveName }],
                        stats: {
                            attack: data.stats.find(stat => stat.stat.name === 'attack').base_stat,
                            defense: data.stats.find(stat => stat.stat.name === 'defense').base_stat,
                            speed: data.stats.find(stat => stat.stat.name === 'speed').base_stat,
                        },
                        height: data.height,
                        weight: data.weight,
                        base_experience: data.base_experience,
                        abilities: data.abilities.map(a => a.ability.name),
                        isFlipped: false
                    };
                });
            } catch (error) {
                console.error('Failed to fetch random Pokemon:', error);
                this.error = "Failed to fetch random Pokemon";
                this.pokemonData = [];
            } finally {
                this.loading = false;
            }
        }
    }
})

export const FetchingAllPokemon = defineStore("allPokemon", {
    state: () => ({
        pokemonAllData: null,
        loading: false,
        error: null
    }),
    actions: {
        async fetchAllPokemon(limit = 12) {
            this.loading = true;
            this.error = null;
            try {
                const countResponse = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=1');
                const totalAvailable = countResponse.data.count;
                this.totalCount = totalAvailable;
                const DataPokemonDetail = await axios.get(`https://pokeapi.co/api/v2/pokemon?limit=${totalAvailable}&offset=0`);
                const pokemonAllData = DataPokemonDetail.data.results;
                const batchSize = 50;
                const detailedPokemonList = [];
                for (let i = 0; i < pokemonAllData.length; i += batchSize) {
                    const batch = pokemonAllData.slice(i, i + batchSize);

                    const batchPromises = batch.map(async (pokemonItem) => {
                        try {
                            const pokemonResponse = await axios.get(pokemonItem.url);
                            const data = pokemonResponse.data;

                            const validMoves = data.moves.filter(move => move.move.name);
                            const moveName = validMoves.length > 0 ? validMoves[0].move.name : 'Unknown Move';

                            return {
                                id: data.id,
                                name: data.name,
                                image: data.sprites.other['official-artwork'].front_default || data.sprites.front_default,
                                hp: data.stats.find(stat => stat.stat.name === 'hp').base_stat,
                                types: data.types.map(type => type.type.name),
                                moves: [{ name: moveName }],
                                stats: {
                                    attack: data.stats.find(stat => stat.stat.name === 'attack').base_stat,
                                    defense: data.stats.find(stat => stat.stat.name === 'defense').base_stat,
                                    speed: data.stats.find(stat => stat.stat.name === 'speed').base_stat,
                                },
                                height: data.height,
                                weight: data.weight,
                                base_experience: data.base_experience,
                                abilities: data.abilities.map(a => a.ability.name),
                                isFlipped: false
                            };
                        } catch (error) {
                            console.error(`Failed to fetch Pokemon details for ${pokemonItem.name}:`, error);
                            return null;
                        }
                    });

                    const batchResults = await Promise.all(batchPromises);
                    const validResults = batchResults.filter(pokemon => pokemon !== null);
                    detailedPokemonList.push(...validResults);

                    // Update data secara real-time
                    this.pokemonAllData = [...detailedPokemonList].sort((a, b) => a.id - b.id);

                    console.log(`Processed ${detailedPokemonList.length}/${pokemonAllData.length} Pokemon`);
                }

                console.log(`Successfully fetched ${this.pokemonAllData.length} Pokemon`);
            } catch (error) {
                this.error = "Fetching All Pokemon Failed !!";
            } finally {
                this.loading = false;
            }
        }
    }
})