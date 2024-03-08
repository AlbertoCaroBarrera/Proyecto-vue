<template>
  <div class="container-fluid p-0">
    <div id="movieCarousel" class="carousel slide" data-bs-ride="carousel" data-bs-interval="5000">
      <!-- Intervalo de 5 segundos -->
      <div class="carousel-inner">
        <div class="carousel-item" v-for="(pelicula, index) in peliculasDestacadas" :key="pelicula.id"
          :class="{ 'active': index === 0 }">
          <router-link :to="{ name: 'product', params: { id: pelicula.id } }">
            <img :src="'https://image.tmdb.org/t/p/w1920_and_h800_multi_faces/' + pelicula.backdrop_path"
              class="d-block w-100" alt="Slide de Película">
          </router-link>
          <div class="carousel-caption">
            <h5>{{ pelicula.title }}</h5>
            <p>{{ resumen(pelicula.overview) }}</p>
          </div>
        </div>
      </div>
      <button class="carousel-control-prev" type="button" data-bs-target="#movieCarousel" data-bs-slide="prev">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Anterior</span>
      </button>
      <button class="carousel-control-next" type="button" data-bs-target="#movieCarousel" data-bs-slide="next">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Siguiente</span>
      </button>
    </div>
  </div>

  <div class="container mt-5">
    <div class="row">
      <div class="col-md-12">
        <h2 class="mb-4 text-center">Películas Mejor Valoradas</h2>
        <hr class="w-25 mx-auto border border-danger">
      </div>
    </div>
    <div class="row justify-content-center">
      <div class="col-lg-3 col-md-4 col-sm-6 mb-4" v-for="pelicula in peliculasMejorValoradas" :key="pelicula.id">
        <div class="card h-100 border-0">
          <router-link :to="{ name: 'product', params: { id: pelicula.id } }">
            <img :src="'https://image.tmdb.org/t/p/w500' + pelicula.poster_path" class="card-img-top rounded-3"
              :alt="pelicula.title">
          </router-link>
          <div class="card-body">
            <h5 class="card-title">{{ pelicula.title }}</h5>
            <p class="card-text">{{ resumen(pelicula.overview) }}</p>
            <div class="text-center">
              <router-link :to="{ name: 'product', params: { id: pelicula.id } }"
                class="btn btn-primary">Detalles</router-link>
            </div>
          </div>
          <div class="card-footer bg-transparent border-0">
            <p class="text-center mb-0" :class="{ 'text-success': pelicula.vote_average > 8.55 }">Puntuación: {{
              pelicula.vote_average }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const peliculasDestacadas = ref([]);
const peliculasMejorValoradas = ref([]);
const apiKey = '665eddc29536d1ffc4e5fdace47ae8c7';

const cargarPeliculasDestacadas = async () => {
  try {
    const respuesta = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}`);
    const datos = await respuesta.json();
    peliculasDestacadas.value = datos.results.slice(0, 3);
  } catch (error) {
    console.error('Error al cargar las películas:', error);
  }
};

const cargarPeliculasMejorValoradas = async () => {
  try {
    const respuesta = await fetch(`https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}`);
    const datos = await respuesta.json();
    peliculasMejorValoradas.value = datos.results;
  } catch (error) {
    console.error('Error al cargar las películas:', error);
  }
};

onMounted(() => {
  cargarPeliculasDestacadas();
  cargarPeliculasMejorValoradas();
});

const resumen = (texto) => {
  if (texto.length > 90) {
    return texto.slice(0, 90) + '...';
  }
  return texto;
};
</script>

<style lang="scss">
@import "@/assets/scss/_variables.scss";


.carousel-caption {
  background-color: rgba(0, 0, 0, 0.5);
  padding: 20px;

  h5 {
    color: #fff;
    font-size: 1.5rem;
  }

  p {
    color: #fff;
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

.btn-primary {
  background-color: color-primario;
  border: none;

  &:hover {
    background-color: $color-primario-hover;
  }
}

.text-success {
  color: $color-success;
}
.card-text {
  font-size: 1.2rem;
  height: 120px; 
  overflow: hidden;
}
.card-title {
  font-size: 1.5rem;
  height: 60px; 
  overflow: hidden;
}
</style>
