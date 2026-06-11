<script setup>
import './PantallaBloqueo.css'

// Props: recibe el objeto usuario que intentó acceder
const props = defineProps({
  usuario: {
    type: Object,
    required: true
  }
})

// Evento para que el padre vuelva al formulario de login
const emit = defineEmits(['reintentar'])
</script>

<template>
  <div class="bloqueo-wrapper">
    <div class="bloqueo-bloque">
      <!-- Marca de agua gigante de fondo -->
      <span
        class="bloqueo-bg-text"
        aria-hidden="true"
      >NO</span>

      <div class="bloqueo-contenido">
        <p class="bloqueo-codigo">
          ERROR 403
        </p>

        <h1 class="bloqueo-titulo">
          Acceso<br>Restringido
        </h1>

        <hr class="bloqueo-divisor">

        <p class="bloqueo-usuario">
          Usuario <span>{{ props.usuario.name }}</span> no tiene permisos de administrador.
        </p>

        <p class="bloqueo-mensaje">
          Esta sección está reservada para administradores del sistema.
          Si creés que esto es un error, contactá al responsable del sitio.
        </p>

        <button
          class="btn-brutal bloqueo-btn"
          @click="emit('reintentar')"
        >
          ← Reintentar con otra cuenta
        </button>
      </div>
    </div>
  </div>
</template>
