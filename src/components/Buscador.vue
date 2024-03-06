<template>
  <div class="filters">
    <input type="range" id="volume" name="volume" min="0" max="10" v-model="min_vote" class="range-input" />
    <label for="volume" class="range-label">Calificación mínima de la película: {{ min_vote }}</label>

    <div class="order-buttons">
      <button class="order-btn" @click="toggleOrder(0)" :class="{ 'active': orden === 0 }">Orden Fecha Creciente</button>
      <button class="order-btn" @click="toggleOrder(1)" :class="{ 'active': orden === 1 }">Orden Fecha Decreciente</button>
      <button class="order-btn" @click="toggleOrder(2)" :class="{ 'active': orden === 2 }">Sin orden</button>
    </div>
  </div>


  <div class="row justify-content-center">
    <div class="card col-3 m-3" v-for="(movie, index) in filteredMovies" :key="index">
      <img v-if="movie.poster_path" :src="getMovieImageUrl(movie.poster_path)" class="card-img-top" alt="Movie Poster">
      <img v-else src="../assets/notFound.png" class="card-img-top" alt="Movie Poster">

      <div class="card-body">
        <h5 class="card-title">{{ movie.title }}</h5>
        <p class="card-text">{{ truncateOverview(movie.overview) }}</p>
        <p class="card-text">Fecha de Salida: {{ movie.release_date }}</p>


        <p class="card-text" :class="{ 'text-success': movie.vote_average > 8.55 }">Puntuación: {{ movie.vote_average }}
        </p>
        <div class="text-center">
              <router-link :to="{ name: 'product', params: { id: movie.id } }"
                class="btn btn-primary">Detalles</router-link>
            </div>
      </div>
    </div>
  </div>
</template>
  
<script setup>

import { ref, onMounted, onUpdated, computed } from 'vue'

import { RouterLink, RouterView, useRoute } from "vue-router";
const route = useRoute();
const min_vote = ref(0);
const movies = ref([])
const orden = ref(0);
const toggleOrder = (newOrder) => {
  orden.value = (newOrder === orden.value) ? (orden.value + 1) % 3 : newOrder;
};
const truncateOverview = (overview) => {
  if (overview.length > 100) {
    return overview.slice(0, 100) + '...';
  }
  return overview;
}


const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0NDMxZmVkODM5MGIwMmQ2YzI4NjU1ZmViNTM2MTU2YSIsInN1YiI6IjY1YThmOTNlYzRmNTUyMDEyNzhlNjU2OSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.nArKWLxihtW5aycNC-GAqUwF7JGeo_Rj13o_5ZA7K3w'
  }
};
const getMoviesUrlApi = () => {
  fetch(`https://api.themoviedb.org/3/search/movie?query=${route.query.cadena}&include_adult=false`, options)
    .then(response => response.json())
    .then(data => movies.value = data.results)
}
const getMovieImageUrl = (posterPath) => {
  if (posterPath) {
    return 'https://image.tmdb.org/t/p/w500/' + posterPath;
  }
}
const ordenar = computed(() => {

if (orden.value == 0){
  return movies.value

} else if (orden.value == 1){  
  return [...movies.value].sort((a, b) => new Date(b.release_date) - new Date(a.release_date));

} else{
  return [...movies.value].sort((a, b) => new Date(a.release_date) - new Date(b.release_date));

}


});
const filteredMovies = computed(() => {
  return ordenar.value.filter(movie => movie.vote_average >= min_vote.value);
});



onUpdated(() => {
  getMoviesUrlApi()

})
onMounted(() => {
  getMoviesUrlApi()

})

</script>
  
  
<style lang="scss" scoped>
@import "@/assets/scss/variables";

.filters {
  display: flex;
  flex-direction: column;
  align-items: center;

  .range-input {
    width: 200px;
    margin-bottom: 10px;
  }

  .range-label {
    font-weight: bold;
  }

  .order-buttons {
    display: flex;
    justify-content: space-around;

    .order-btn {
      margin: 10px;
      padding: 8px 16px;
      border-radius: 5px;
      background-color: $color-main;
      color: #fff;
      border: none;
      cursor: pointer;
      transition: background-color 0.3s ease;

      &:hover {
        background-color: $color-main-hover;
      }

      &.active {
        background-color: $color-main-hover;
      }
    }
  }
}

.card {
  transition: all 0.3s;

  &:hover {
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
}

.text-success {
  color: $color-success;
}
</style>