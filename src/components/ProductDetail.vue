<template>
  <div v-if="product" class="container">
    <div class="d-flex mt-4">
      <img class="img-ind img-fluid" :src="getImageUrl(product.poster_path)" :alt="product.title">
      <div class="p-2">
        <h1 class="card-title">{{ product.title }}</h1>
        <div class="genero d-flex">
          <p v-for="genero in product.genres" :key="genero.id">{{ genero.name }}</p>
        </div>
        <div class="d-flex">
          <button type="button" class="btn btn-primary me-2" data-bs-toggle="modal" data-bs-target="#exampleModal">
            Ver tráiler
          </button>
          <button type="button" class="btn btn-primary" @click="addWatchlist">
            Añadir a Watchlist
          </button>
        </div>
        <h3>Descripción</h3>
        <p class="mb-3">{{ product.overview }}</p>
        <h3 class="">Plataformas</h3>
        <div class="d-flex ms-4" v-if="providersproduct">
          <div v-if="providersproduct.rent">
            <img class="img-plat mb-2 me-2" v-for="proveedor in providersproduct.rent" :key="proveedor.id"
              :src="proveedor.logo_path ? 'https://image.tmdb.org/t/p/w92' + proveedor.logo_path : ''">
          </div>
          <div v-else-if="providersproduct.buy">
            <img class="img-plat mb-2 me-2" v-for="proveedor in providersproduct.buy" :key="proveedor.id"
              :src="proveedor.logo_path ? 'https://image.tmdb.org/t/p/w92' + proveedor.logo_path : ''">
          </div>
        </div>
        <div v-else>
          <p>¡No disponible en España!</p>
        </div>
        <h3 class="mt-3">Reparto</h3>
        <div class="row">
          <div class="col-12 col-md-6 col-lg-3" v-for="actor in castproduct.slice(0, 4)" :key="actor.id">
            <div class="actor-container">
              <img class="img-actor img-fluid mb-2 me-2" :src="getImageUrl(actor.profile_path)" :alt="actor.name">
              <button class="btn btn-primary" @click="$router.push('/actor?id=' + actor.id)">
                Ver detalles
              </button>
              <p class="nombre">{{ actor.name }}</p>
              <p class="personaje">{{ actor.character }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="opiniones mb-5 mt-4">
      <h3>Puntuación y comentarios: </h3>
      <p>{{ product.vote_average.toFixed(1) }}/10</p>
    </div>

    <div>
      <div v-for="(review, index) in reviewsproduct.slice(0, 4)" :key="review.id" class="mb-3">
        <h5>{{ review.author }}</h5>
        <p>{{ review.content }}</p>
      </div>
    </div>


    <h2 class="mt-5 mb-4 text-center">Similares</h2>
    <div class="row ms-4">
      <div class="col-3" v-for="product in recommendationsproduct.slice(0, 8)" :key="product.id">
        <div class="recommendation-container">
          <img class="img-product img-fluid" :src="getImageUrl(product.backdrop_path)" :alt="product.title">
          <button class="btn btn-primary m-1" @click="$router.push('/product/' + product.id)">
            Ver detalles
          </button>

          <p class="text-center">{{ product.title }}</p>
        </div>
      </div>
    </div>

    <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true"
      @hidden.bs.modal="stopVideo">
      <div class="modal-dialog" style="width: 100%; height: 100vh;">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="exampleModalLabel">Official Trailer: {{ product.title }}</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <iframe class="embed-responsive-item" :src="trailerUrl" frameborder="0" style="width: 100%; height: 100%;"
              allowfullscreen></iframe>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
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
import { ref, onMounted, onUpdated } from "vue";
import { useRoute } from "vue-router";

const $route = useRoute();

const product = ref();
const providersproduct = ref([]);
const castproduct = ref([]);
const reviewsproduct = ref([]);
const recommendationsproduct = ref([]);
const trailerUrl = ref('');

onMounted(async () => {
  try {
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2NjVlZGRjMjk1MzZkMWZmYzRlNWZkYWNlNDdhZThjNyIsInN1YiI6IjY1OGFiMzFiYjdiNjlkMDk2MjZkZTczOCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Rufsppd2z4JY3JZaxJZDpC3FBWVswXCeqYoRkFl09ss'
      }
    };

    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${$route.params.id}?api_key=665eddc29536d1ffc4e5fdace47ae8c7&append_to_response=watch/providers,credits,reviews,videos,recommendations`,

      options
    );

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    product.value = data;
    providersproduct.value = data['watch/providers'].results.ES;
    castproduct.value = data.credits.cast
    reviewsproduct.value = data.reviews.results
    recommendationsproduct.value = data.recommendations.results


    const trailerVideo = data.videos.results.find(video => video.type === "Trailer");
    if (trailerVideo) {
      const keytrailer = trailerVideo.key;
      trailerUrl.value = `https://www.youtube.com/embed/${keytrailer}`;
      console.log(trailerUrl.value)

    } else {
      console.error("No se encontró el tráiler de la película.");
    }

  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
  }
});


onUpdated(async () => {
  try {
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2NjVlZGRjMjk1MzZkMWZmYzRlNWZkYWNlNDdhZThjNyIsInN1YiI6IjY1OGFiMzFiYjdiNjlkMDk2MjZkZTczOCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Rufsppd2z4JY3JZaxJZDpC3FBWVswXCeqYoRkFl09ss'
      }
    };

    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${$route.params.id}?api_key=665eddc29536d1ffc4e5fdace47ae8c7&append_to_response=watch/providers,credits,reviews,videos,recommendations`,

      options
    );

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    product.value = data;
    providersproduct.value = data['watch/providers'].results.ES;
    castproduct.value = data.credits.cast
    reviewsproduct.value = data.reviews.results
    recommendationsproduct.value = data.recommendations.results


    const trailerVideo = data.videos.results.find(video => video.type === "Trailer");
    if (trailerVideo) {
      const keytrailer = trailerVideo.key;
      trailerUrl.value = `https://www.youtube.com/embed/${keytrailer}`;
      console.log(trailerUrl.value)

    } else {
      console.error("No se encontró el tráiler de la película.");
    }

  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
  }
});

const addWatchlist = async () => {
  try {
    const options = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2NjVlZGRjMjk1MzZkMWZmYzRlNWZkYWNlNDdhZThjNyIsInN1YiI6IjY1OGFiMzFiYjdiNjlkMDk2MjZkZTczOCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Rufsppd2z4JY3JZaxJZDpC3FBWVswXCeqYoRkFl09ss'
      },
      body: JSON.stringify({ media_type: 'movie', media_id: product.value.id, watchlist: true })
    };

    const respuesta = await fetch('https://api.themoviedb.org/3/account/20862103/watchlist', options);

    if (!respuesta.ok) {
      throw new Error('Failed to add to watchlist');
    }

    alert(`¡${product.value.title} ha sido añadida a su watchlist!`);
  } catch (error) {
    console.error('Error al agregar a la watchlist:', error)
  }
};


const stopVideo = () => {
  const iframe = document.querySelector('#exampleModal iframe');
  const player = new Vimeo.Player(iframe);
  player.pause();
};





function getImageUrl(posterPath) {
  if (!posterPath) {
    return 'https://via.placeholder.com/300';
  }
  return `https://image.tmdb.org/t/p/w300${posterPath}`;
}
</script>

<style scoped>
.actor-container {
  text-align: center;
}

.img-actor {
  width: 100px;
  height: 150px;
  object-fit: cover;
  border-radius: 5px;
}

.nombre {
  font-weight: bold;
}

.personaje {
  font-style: italic;
}

.mb-3 {
  margin-bottom: 3rem;
}

.mb-5 {
  margin-bottom: 5rem;
}

.mt-3 {
  margin-top: 3rem;
}

.mt-4 {
  margin-top: 4rem;
}

.mb-4 {
  margin-bottom: 4rem;
}

.mt-5 {
  margin-top: 5rem;
}

.img-ind {
  width: 100%;
  height: auto;
  object-fit: cover;
  border-radius: 5px;
}

.img-product {
  width: 100%;
  height: auto;
  object-fit: cover;
  border-radius: 5px;
}

.img-plat {
  width: 50px;
  height: auto;
  border-radius: 5px;
}

.recommendation-container {
  text-align: center;
}

.recommendation-container img {
  max-width: 100%;
  height: auto;
  border-radius: 5px;
}

.accordion-item {
  border-bottom: 1px solid black;
}

.accordion-button {
  background-color: #fff;
  color: black;
}
</style>
