<script setup>
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
    <div class="project-card__imagen-wrap">
      <img
        :src="proyecto.imagen"
        :alt="proyecto.titulo"
        class="project-card__imagen"
        loading="lazy"
      >
    </div>
    <div class="project-card__info">
      <h2 class="project-card__titulo">{{ proyecto.titulo }}</h2>
      <span class="project-card__categoria">{{ proyecto.categoria }}</span>
    </div>
  </article>
</template>

<style scoped>
.project-card {
  display: flex;
  flex-direction: column;
}

.project-card__imagen-wrap {
  overflow: hidden;
  flex-shrink: 0;
}

.project-card__imagen {
  width: 100%;
  aspect-ratio: 3 / 2;
  object-fit: cover;
  display: block;
  filter: saturate(0.9);
  transition:
    transform 500ms var(--ease-out-expo),
    filter 400ms ease;
}

.project-card--destacado .project-card__imagen {
  aspect-ratio: 16 / 7;
}

.project-card:hover .project-card__imagen {
  transform: scale(1.03);
  filter: saturate(1.05) brightness(0.95);
}

.project-card__info {
  padding: var(--space-1) 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.project-card__titulo {
  font-family: 'DM Sans', sans-serif;
  font-weight: 500;
  font-size: var(--text-body);
  line-height: 1.3;
  letter-spacing: -0.01em;
  color: var(--color-paper);
  transition: color 240ms ease;
}

.project-card:hover .project-card__titulo {
  color: var(--color-primary);
}

.project-card__categoria {
  font-family: var(--font-mono);
  font-size: var(--text-micro);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--color-paper-dark);
}
</style>
