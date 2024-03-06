<template>
    <div class="container">
        <div class="d-flex mt-4">
            <img class="img-ind" :src="'https://image.tmdb.org/t/p/w500' + infoActor.profile_path">
            <div class="p-2 ms-4">
                <h1 class="card-title">{{ infoActor.name }}</h1>
                <div class="fechas d-flex">
                    <p>Fecha de nacimiento: {{ infoActor.birthday }}</p>
                    <p class="ms-4" v-if="infoActor.deathday">Fecha de fallecimiento: {{ infoActor.deathday }}</p>
                </div>

                <h3>Lugar de nacimiento</h3>
                <p class="mb-3">{{ infoActor.place_of_birth }}</p>
            </div>
        </div>
        <h3 class="mt-4 mb-3 text-center">Películas</h3>
        <div class="row ms-4">
            <div class="col-4" v-for="movie in moviesActor.slice(0, 6)" :key="movie.id">
                <div class="card mb-3">
                    <img class="card-img-top" :src="'https://image.tmdb.org/t/p/w500' + movie.poster_path"
                        alt="Card image cap">
                    <div class="card-body">
                        <h5 class="card-title">{{ movie.title }}</h5>
                        <p class="card-text">{{ movie.character }}</p>
                        <button class="btn btn-primary" @click="$router.push('/product/' + movie.id)">Ver
                            detalles</button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <main>
        <RouterView />
    </main>
</template>
  
<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router';
const infoActor = ref([]);
const moviesActor = ref([]);
const route = useRoute();


const fetchMovieDetail = async () => {
    try {
        const idActor = route.query.id
        const respuesta = await fetch('https://api.themoviedb.org/3/person/' + idActor + '?api_key=665eddc29536d1ffc4e5fdace47ae8c7&append_to_response=movie_credits');
        const data = await respuesta.json();
        infoActor.value = data;
        moviesActor.value = data.movie_credits.cast


    } catch (error) {
        console.error('Error fetching movie:', error)
    }
};

onMounted(() => {

    fetchMovieDetail();

});

</script>
  
<style lang="scss">
@import "@/assets/scss/_variables.scss";

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

.img-ind {
    width: 200px;
    height: auto;
    object-fit: cover;
    border-radius: 10px;
}

.card {
    transition: all 0.3s;
}

.card:hover {
    transform: translateY(-5px);
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
}

.card-img-top {
    border-radius: 10px;
}

.card-title {
    font-size: 1.5rem;
    font-weight: bold;
}

.card-text {
    font-size: 1.2rem;
}

.btn-primary {
    background-color: $color-primario;
    border: none;
    transition: background-color 0.3s;
}

.btn-primary:hover {
    background-color: $color-primario-hover;
}

.text-center {
    text-align: center;
}
</style>
  