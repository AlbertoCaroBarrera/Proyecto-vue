<template>
  <div class="container mt-5">
    <div>
      <h2 class="mb-5">Películas Pendientes</h2>
    </div>
    <div class="row">
      <div class="col-4 mb-4" v-for="movie in pendingMovies" :key="movie.id">
        <div class="card">
          <div>
            <img :src="'https://image.tmdb.org/t/p/w500' + movie.poster_path" class="card-img-top mx-auto img-fluid" :alt="movie.title">
            <button class="btn btn-danger details-btn " @click="$router.push('/product/' + movie.id)"></button>
          </div>
          <div class="card-body">
            <h2>{{ movie.title }}</h2>
            <p>{{ truncateOverview(movie.overview) }}</p>
          </div>
          <div class="buttons text-center mt-auto">
            <button type="button" class="btn btn-danger remove-btn" @click="removeFromPending(movie.id)">Eliminar</button>
          </div>
          <div class="card-footer ">
            <p class="text-center mb-0" :class="{ 'text-success': movie.vote_average > 8.55 }">Puntuación: {{
              movie.vote_average }}</p>
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
import { ref, onMounted } from 'vue';
import { RouterLink, RouterView, useRoute } from 'vue-router';

const productId = ref('');
const pendingMovies = ref([]);

const fetchPendingMovies = async () => {
  try {
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2NjVlZGRjMjk1MzZkMWZmYzRlNWZkYWNlNDdhZThjNyIsInN1YiI6IjY1OGFiMzFiYjdiNjlkMDk2MjZkZTczOCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Rufsppd2z4JY3JZaxJZDpC3FBWVswXCeqYoRkFl09ss'
      }
    };

    const response = await fetch('https://api.themoviedb.org/3/account/20862103/watchlist/movies?language=en-US&page=1&sort_by=created_at.asc', options);
    const data = await response.json();
    pendingMovies.value = data.results;
  } catch (error) {
    console.error('Error fetching movie:', error);
  }
};

const removeFromPending = async (movieId) => {
  try {
    const options = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2NjVlZGRjMjk1MzZkMWZmYzRlNWZkYWNlNDdhZThjNyIsInN1YiI6IjY1OGFiMzFiYjdiNjlkMDk2MjZkZTczOCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Rufsppd2z4JY3JZaxJZDpC3FBWVswXCeqYoRkFl09ss'
      },
      body: JSON.stringify({ media_type: 'movie', media_id: movieId, watchlist: false })
    };

    const response = await fetch(`https://api.themoviedb.org/3/account/20862103/watchlist`, options);
    if (response.ok) {
      await fetchPendingMovies();
    } else {
      alert('No se pudo eliminar la película de tu lista de seguimiento');
    }
  } catch (error) {
    console.error('Error fetching movie:', error);
  }
};

onMounted(() => {
  fetchPendingMovies();
});

const truncateOverview = (text) => {
  if (text.length > 90) {
    return text.slice(0, 90) + '...';
  }
  return text;
};
</script>

<style scoped>
.card {
  position: relative;
  height: 55em;
  background-color: #f9f9f9;
  color: black;
}

.details-btn {
  position: absolute;
  background-color: transparent;
  cursor: pointer;
  width: 27em;
  height: 39em;
  top: 0;
  left: -0.5em;
  border: none;
  z-index: 1;
}

.remove-btn {
  margin-bottom: 1rem;
}

.remove-btn:hover {
  background-color: #ff6666;
  color: black;
}
</style>
