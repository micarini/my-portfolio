<script setup>
import './ProjectCard.css';

defineProps({
  proyecto: {
    type: Object,
    required: true,
  },
});
</script>

<template>
  <article
    class="project-card"
    :class="{ 'project-card--destacado': proyecto.destacado }"
  >
    <!-- Imagen -->
    <div class="project-card__imagen-wrap">
      <img
        :src="proyecto.imagen"
        :alt="proyecto.titulo"
        class="project-card__imagen"
        loading="lazy"
      >
      <span class="project-card__anio">{{ proyecto.anio }}</span>
    </div>

    <!-- Cuerpo -->
    <div class="project-card__cuerpo">
      <span class="project-card__categoria tag-brutal">{{ proyecto.categoria }}</span>

      <h2 class="project-card__titulo">
        {{ proyecto.titulo }}
      </h2>

      <p class="project-card__descripcion">
        {{ proyecto.descripcion }}
      </p>

      <ul class="project-card__tags">
        <li
          v-for="tag in proyecto.tags"
          :key="tag"
          class="project-card__tag-item tag-brutal"
        >
          {{ tag }}
        </li>
      </ul>

      <!-- Footer -->
      <div class="project-card__footer">
        <span class="project-card__likes">♥ {{ proyecto.likes }}</span>
        <span
          v-if="proyecto.destacado"
          class="project-card__badge"
        >Destacado</span>
      </div>
    </div>
  </article>
</template>
