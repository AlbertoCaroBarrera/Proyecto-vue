<template>
  <div>
    <nav class="navbar navbar-expand-lg fixed-top">
      <div class="container-fluid">
        <router-link to="/" class="navbar-brand">El mejor cine</router-link>

        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <router-link to="/" class="nav-link">Inicio</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/watchlist" class="nav-link">Películas Pendientes</router-link>
            </li>
          </ul>

          <form class="d-flex" @submit.prevent="$router.push('/buscador?cadena=' + productID)">
            <input class="form-control me-2" type="search" placeholder="Buscar" aria-label="Buscar" v-model="productID"
              @keyup.enter="$router.push('/buscador?cadena=' + productID)">
            <button class="btn btn-outline-light" type="submit">
              Buscar
            </button>
          </form>

        </div>
      </div>
    </nav>

    <main class="mt-5">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { RouterLink, RouterView } from "vue-router";

const productID = ref("");
</script>

<style lang="scss" scoped>

@import "@/assets/scss/_variables.scss";

.navbar {
  background-color: $color-primary;

  .navbar-brand {
    color: $color-secondary;
    font-weight: bold;
  }

  .nav-link {
    color: $color-secondary;
  }

  @media (max-width: 991px) {
    .navbar-nav {
      margin-left: auto;
    }

    .navbar-toggler {
      color: $color-secondary;
      border-color: $color-secondary;
    }
  }
}
</style>
