<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import Header from './components/Header.vue';
import Footer from './components/Footer.vue';
import Loader from './components/Loader.vue';

// El intro se muestra una vez por sesión, y nunca si el usuario prefiere menos movimiento.
// Queda montado toda la sesión: al entrar, Home queda libre, pero desde el tope de
// la página podés scrollear hacia arriba para volver al loader (zoom en reversa).
const prefiereMenosMovimiento =
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const mostrarLoader = ref(
  !sessionStorage.getItem('introVisto') && !prefiereMenosMovimiento,
);

function alEntrar() {
  // Marca la sesión como vista (si recargás, el intro no vuelve a autoreproducirse).
  sessionStorage.setItem('introVisto', '1');
}

// Se usa como key de la transición: al cambiar de ruta, la página entra/sale animada.
const route = useRoute();
</script>

<template>
  <Loader
    v-if="mostrarLoader"
    @entered="alEntrar"
  />

  <div class="app-shell">
    <Header />
    <main class="app-main">
      <RouterView v-slot="{ Component }">
        <Transition
          name="page"
          mode="out-in"
        >
          <!-- El div envoltorio es el único hijo de la transición: así las páginas
               pueden tener varios elementos raíz sin trabar la animación. -->
          <div
            :key="route.path"
            class="route-view"
          >
            <component :is="Component" />
          </div>
        </Transition>
      </RouterView>
    </main>
    <Footer />
  </div>
</template>
