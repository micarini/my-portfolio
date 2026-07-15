<script setup>
import { ref, computed, onMounted } from 'vue';
import ProjectCard from '../components/ProjectCard.vue';
import AsciiPortrait from '../components/AsciiPortrait.vue';

// ── Estado reactivo 
const loading  = ref(true);
const error    = ref(null);
const proyectos = ref([]);

// ── Filtro activo 
const filtroActivo = ref('Todos');

// ── Computed: categorías únicas extraídas de los datos 
const categorias = computed(() => {
  const unicas = [...new Set(proyectos.value.map((p) => p.categoria))];
  return ['Todos', ...unicas];
});

// ── Computed: proyectos filtrados según categoría seleccionada 
const proyectosFiltrados = computed(() => {
  if (filtroActivo.value === 'Todos') return proyectos.value;
  return proyectos.value.filter((p) => p.categoria === filtroActivo.value);
});

// ── Retraso de entrada escalonado para la galería (con tope) 
function retrasoEntrada(indice) {
  return `${Math.min(indice * 70, 560)}ms`;
}

// ── Carga asincrónica en onMounted 
onMounted(async () => {
  try {
    const res = await fetch('/contenido.json');
    if (!res.ok) throw new Error(`Error HTTP ${res.status}: ${res.statusText}`);
    const datos = await res.json();
    proyectos.value = datos;
  } catch (e) {
    error.value = e.message || 'Error desconocido al cargar los proyectos.';
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="home-page">
    <div
      v-if="loading"
      class="home-loading"
    >
      <p class="home-loading__texto">
        Cargando
      </p>
      <div
        class="home-loading__barra"
        role="progressbar"
        aria-label="Cargando proyectos"
      />
      <p class="home-loading__sub">
        Recuperando proyectos del servidor…
      </p>
    </div>

    <div
      v-else-if="error"
      class="container"
    >
      <div
        class="home-error"
        role="alert"
      >
        <p class="home-error__etiqueta">
          Error de carga
        </p>
        <p class="home-error__mensaje">
          {{ error }}
        </p>
        <p class="home-error__hint">
          Verificá que el servidor esté activo y el archivo /contenido.json exista.
        </p>
      </div>
    </div>

    <div
      v-else
      class="home"
    >
      <section class="home-hero" aria-label="Welcome to my portfolio website">
        <AsciiPortrait class="home-hero__backdrop" />

        <div class="hero-typo">
          <div class="hero-row hero-row--welcome">WELC<span class="f-ayu">O</span>ME</div>
          <div class="hero-row hero-row--tomy">
            <span>T<span class="f-beth">O</span></span>
            <span>MY</span>
          </div>
          <div class="hero-row hero-row--portfolio">PORTFO<span class="f-ballet">L</span>IO</div>
          <div class="hero-row hero-row--website">WE<span class="f-bitcount">B</span>SITE</div>
        </div>
      </section>

      <div
        id="galeria"
        class="container"
      >
        <nav
          class="home-filtros"
          aria-label="Filtrar por categoría"
        >
          <button
            v-for="cat in categorias"
            :key="cat"
            class="btn-glass home-filtros__btn"
            :class="{ 'btn-glass--active': filtroActivo === cat }"
            :aria-pressed="filtroActivo === cat"
            @click="filtroActivo = cat"
          >
            {{ cat }}
          </button>
        </nav>

        <section
          class="home-galeria"
          aria-label="Galería de proyectos"
        >
          <div
            v-if="proyectosFiltrados.length > 0"
            class="home-galeria__grid"
          >
            <ProjectCard
              v-for="(proyecto, indice) in proyectosFiltrados"
              :key="proyecto.id"
              :proyecto="proyecto"
              :style="{ '--enter-delay': retrasoEntrada(indice) }"
            />
          </div>

          <p
            v-else
            class="home-galeria__vacio"
          >
            No hay proyectos en la categoría "{{ filtroActivo }}".
          </p>
        </section>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-page {
  min-height: 100vh;
}

.home-loading {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-3);
  padding: var(--space-5);
}

.home-loading__texto {
  font-family: var(--font-display);
  font-size: var(--text-giant);
  line-height: 0.9;
  text-transform: uppercase;
  letter-spacing: -0.02em;
  color: var(--color-paper);
  animation: parpadeo-brutal 0.7s step-end infinite;
}

@keyframes parpadeo-brutal {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0; }
}

.home-loading__barra {
  width: min(400px, 80vw);
  height: 12px;
  border: 1px solid var(--glass-border);
  background: var(--color-sepia);
  position: relative;
  overflow: hidden;
}

.home-loading__barra::after {
  content: "";
  position: absolute;
  inset-block: 0;
  left: -60%;
  width: 60%;
  background: var(--color-primary);
  animation: barra-dura 1s ease-in-out infinite;
}

@keyframes barra-dura {
  0%   { left: -60%; }
  100% { left: 100%; }
}

.home-loading__sub {
  font-family: var(--font-mono);
  font-size: var(--text-small);
  color: var(--color-paper-dark);
  letter-spacing: 0.05em;
}

.home-error {
  margin-block: var(--space-5);
  padding: var(--space-4);
  background: var(--color-danger);
  border: var(--border-heavy);
  box-shadow: var(--shadow-hard-lg);
  color: var(--color-ink);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.home-error__etiqueta {
  font-family: var(--font-display);
  font-size: var(--text-h2);
  line-height: 0.9;
  text-transform: uppercase;
  letter-spacing: -0.02em;
  border-bottom: 2px solid var(--color-ink);
  padding-bottom: var(--space-2);
}

.home-error__mensaje {
  font-family: var(--font-mono);
  font-size: var(--text-body);
}

.home-error__hint {
  font-family: var(--font-mono);
  font-size: var(--text-small);
  opacity: 0.8;
}

.home {
  width: 100%;
}
.home-hero {
  position: relative;
  min-height: calc(100vh - 52px);
  overflow: hidden;
  background: var(--color-ink);
  isolation: isolate;
}

.home-hero::before {
  content: '';
  position: absolute;
  inset: -8% -6%;
  background:
    radial-gradient(circle at 20% 22%, rgba(255, 255, 255, 0.12) 0 8%, transparent 34%),
    radial-gradient(circle at 72% 28%, rgba(111, 185, 228, 0.12) 0 10%, transparent 38%),
    radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.06) 0 18%, transparent 54%);
  mix-blend-mode: screen;
  opacity: 0.45;
  pointer-events: none;
}

/* El scrim del AsciiPortrait no aplica aquí: necesitamos ver la cara entera */
.home-hero :deep(.ascii-portrait__scrim) {
  background: transparent;
}

.home-hero :deep(.ascii-portrait) {
  transform: scale(1.08);
  transform-origin: center;
}

.home-hero :deep(.ascii-portrait__art) {
  font-size: clamp(4.4px, 0.8vw, 11px);
  text-shadow: 0 0 28px rgba(146, 165, 203, 0.26);
}

.hero-typo {
  position: relative;
  z-index: 2;
  min-height: calc(100vh - 52px);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: clamp(0.2rem, 0.7vw, 0.8rem) 0 0.5rem;
  margin-left: clamp(-1.8vw, -0.8vw, -0.25rem);
}

.hero-row {
  font-family: 'Syne', sans-serif;
  font-weight: 800;
  font-size: clamp(2.1rem, 10.2vw, 11rem);
  line-height: 0.82;
  color: #ffffff;
  text-transform: uppercase;
  letter-spacing: -0.06em;
  display: flex;
  align-items: baseline;
  width: 100%;
  white-space: nowrap;
  text-shadow: 0 0 16px rgba(0, 0, 0, 0.16);
}

.hero-row--tomy {
  justify-content: space-between;
  padding-inline: 4vw 0;
}

.hero-row--portfolio {
  letter-spacing: -0.08em;
  margin-left: -0.8vw;
}

.f-ayu    { font-family: 'Are You Serious', cursive; font-weight: normal; margin-inline: 0.12em; }
.f-beth   { font-family: 'Beth Ellen', cursive;      font-weight: normal; margin-inline: 0.12em; }
.f-ballet {
  font-family: 'Ballet', cursive;
  font-weight: normal;
  font-optical-sizing: none;
  font-variation-settings: 'opsz' 16;
  font-size: 1.2em;
  margin-inline: 0.1em;
}
.f-bitcount { font-family: 'Bitcount Grid Double', monospace; font-size: 1.15em; margin-inline: 0.1em; }

.hero-row--website {
  justify-content: flex-end;
  margin-right: -0.5vw;
}

/* Entrada escalonada por fila */
@media (prefers-reduced-motion: no-preference) {
  .hero-row {
    animation: hero-row-in 900ms var(--ease-out-expo) both;
  }
  .hero-row:nth-child(1) { animation-delay: 0ms; }
  .hero-row:nth-child(2) { animation-delay: 100ms; }
  .hero-row:nth-child(3) { animation-delay: 200ms; }
  .hero-row:nth-child(4) { animation-delay: 300ms; }

  @keyframes hero-row-in {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: none; }
  }
}

@media (min-width: 720px) {
  .home-hero {
    min-height: calc(100vh - 52px);
  }

  .hero-typo {
    padding-top: clamp(0.25rem, 0.9vw, 1rem);
    padding-bottom: clamp(0.35rem, 1vw, 1.1rem);
  }
}

@media (min-width: 720px) and (max-width: 1024px) {
  .home-hero {
    min-height: auto;
    padding-block: var(--space-2) var(--space-4);
  }

  .home-hero :deep(.ascii-portrait) {
    inset: -2% -4%;
    transform: translateY(1%) scale(1.08);
  }

  .home-hero :deep(.ascii-portrait__art) {
    font-size: clamp(5.4px, 1.02vw, 12.5px);
  }

  .hero-typo {
    min-height: auto;
    justify-content: flex-start;
    gap: clamp(1.2rem, 3vw, 2rem);
    padding-top: 0.5rem;
    padding-bottom: 0;
  }

  .hero-row {
    font-size: clamp(2rem, 7.6vw, 6.6rem);
    letter-spacing: -0.055em;
  }

  .hero-row--tomy {
    padding-inline: 2vw 0;
  }
}

.home-filtros {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  padding-block: var(--space-4);
}

/* Overrides editoriales sobre .btn-glass para este contexto */
.home-filtros__btn {
  border-radius: 0;
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
  box-shadow: none;
  border-color: rgba(217, 222, 236, 0.18);
}

.home-filtros__btn:hover {
  transform: none;
  box-shadow: none;
  background: rgba(217, 222, 236, 0.1);
}

.btn-glass--active.home-filtros__btn {
  background: var(--color-primary);
  color: #0a0a0a;
  border-color: transparent;
  box-shadow: none;
}

.btn-glass--active.home-filtros__btn:hover {
  transform: none;
  background: var(--color-primary);
}

.home-galeria {
  padding-block: var(--space-4);
}

.home-galeria__grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-1);
  align-items: start;
}

.home-galeria__grid .project-card--destacado {
  grid-column: span 2;
}

@media (prefers-reduced-motion: no-preference) {
  .home-galeria__grid .project-card {
    animation: card-enter 700ms var(--ease-out-expo) both;
    animation-delay: var(--enter-delay, 0ms);
  }

  @keyframes card-enter {
    from {
      opacity: 0;
      transform: translateY(24px) scale(0.98);
      filter: blur(6px);
    }
    to {
      opacity: 1;
      transform: none;
      filter: blur(0);
    }
  }
}

.home-galeria__vacio {
  font-family: var(--font-mono);
  font-size: var(--text-body);
  color: var(--color-paper-dark);
  padding: var(--space-4) 0;
}

@media (max-width: 719px) {
  .home-hero {
    min-height: auto;
    padding-block: var(--space-2) var(--space-3);
  }

  .home-hero :deep(.ascii-portrait) {
    inset: -1.5% -5%;
    transform: translateY(4%) scale(0.95);
  }

  .home-hero :deep(.ascii-portrait__art) {
    font-size: clamp(4.1px, 1.55vw, 7.5px);
  }

  .hero-typo {
    min-height: auto;
    justify-content: flex-start;
    gap: clamp(0.7rem, 3vw, 1.2rem);
    margin-left: 0;
    padding: 0.45rem 0.35rem 0;
  }

  .hero-row {
    font-size: clamp(1.3rem, 8vw, 3rem);
    line-height: 0.9;
    letter-spacing: -0.045em;
  }

  .hero-row--tomy {
    padding-inline: 0;
  }

  .hero-row--portfolio {
    margin-left: 0;
    letter-spacing: -0.06em;
  }

  .hero-row--website {
    margin-right: 0;
  }

  .home-galeria__grid {
    grid-template-columns: 1fr;
  }

  .home-galeria__grid .project-card--destacado {
    grid-column: span 1;
  }

  .home-filtros {
    flex-wrap: nowrap;
    overflow-x: auto;
    overflow-y: hidden;
    gap: 0.6rem;
    padding-block: var(--space-3) var(--space-2);
    scrollbar-width: none;
  }

  .home-filtros::-webkit-scrollbar {
    display: none;
  }

  .home-filtros__btn {
    flex: 0 0 auto;
    white-space: nowrap;
  }

}

</style>