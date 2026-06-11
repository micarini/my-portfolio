<script setup>
import { ref, computed, onMounted } from 'vue';
import './Home.css';
import ProjectCard from '../components/ProjectCard.vue';

// ── Estado reactivo ─────────────────────────────────────────────────────────
const loading  = ref(true);
const error    = ref(null);
const proyectos = ref([]);

// ── Filtro activo ────────────────────────────────────────────────────────────
const filtroActivo = ref('Todos');

// ── Computed: categorías únicas extraídas de los datos ──────────────────────
const categorias = computed(() => {
  const unicas = [...new Set(proyectos.value.map((p) => p.categoria))];
  return ['Todos', ...unicas];
});

// ── Computed: proyectos filtrados según categoría seleccionada ───────────────
const proyectosFiltrados = computed(() => {
  if (filtroActivo.value === 'Todos') return proyectos.value;
  return proyectos.value.filter((p) => p.categoria === filtroActivo.value);
});

// ── Fecha editorial ──────────────────────────────────────────────────────────
const fechaActual = new Date().toLocaleDateString('es-AR', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});

// ── Carga asincrónica en onMounted ───────────────────────────────────────────
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
  <!-- ── Estado: CARGANDO ─────────────────────────────────────────────── -->
  <div
    v-if="loading"
    class="home-loading"
  >
    <p class="home-loading__texto">
      CARGANDO
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

  <!-- ── Estado: ERROR ────────────────────────────────────────────────── -->
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

  <!-- ── Estado: GALERÍA ──────────────────────────────────────────────── -->
  <div
    v-else
    class="home"
  >
    <!-- HERO EDITORIAL ──────────────────────────────────────────────────── -->
    <section class="home-hero">
      <div class="container">
        <div class="home-hero__inner">
          <!-- Fila de metadatos tipo encabezado de diario -->
          <div class="home-hero__meta">
            <span class="home-hero__issue">Portfolio Vol. 01</span>
            <div
              class="home-hero__linea"
              aria-hidden="true"
            />
            <span class="home-hero__fecha">{{ fechaActual }}</span>
          </div>

          <!-- Nombre gigantesco -->
          <h1 class="home-hero__nombre">
            Mia<br>Carini<br>Rojo
          </h1>

          <!-- Subtítulo descriptivo -->
          <p class="home-hero__subtitulo">
            Diseño editorial<br>+ código
          </p>

          <!-- Bio -->
          <p class="home-hero__bio">
            Estudiante de Tecnología Multimedial en UMAI. Trabajo en la
            intersección entre diseño gráfico de fuerte raíz tipográfica
            y desarrollo web con énfasis en experiencias editoriales.
            Este portfolio es tanto proceso como resultado.
          </p>

          <!-- Ficha técnica -->
          <dl class="home-hero__ficha">
            <div class="home-hero__ficha-fila">
              <dt>Carrera</dt>
              <dd>Tecnología Multimedial</dd>
            </div>
            <div class="home-hero__ficha-fila">
              <dt>Institución</dt>
              <dd>UMAI</dd>
            </div>
            <div class="home-hero__ficha-fila">
              <dt>Materia</dt>
              <dd>Prog. Multimedial III</dd>
            </div>
            <div class="home-hero__ficha-fila">
              <dt>Stack</dt>
              <dd>Vue 3 / Vite / CSS Puro</dd>
            </div>
            <div class="home-hero__ficha-fila">
              <dt>Proyectos</dt>
              <dd>{{ proyectos.length }} en archivo</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>

    <!-- SEPARADOR EDITORIAL ─────────────────────────────────────────────── -->
    <div
      class="home-separador"
      aria-hidden="true"
    >
      <div class="container">
        Trabajos seleccionados &mdash; {{ proyectos.length }} proyectos &mdash; {{ fechaActual }}
      </div>
    </div>

    <!-- FILTROS + GALERÍA ──────────────────────────────────────────────── -->
    <div class="container">
      <!-- Botones de filtro -->
      <nav
        class="home-filtros"
        aria-label="Filtrar por categoría"
      >
        <button
          v-for="cat in categorias"
          :key="cat"
          class="btn-brutal home-filtros__btn"
          :class="{ 'home-filtros__btn--activo': filtroActivo === cat }"
          :aria-pressed="filtroActivo === cat"
          @click="filtroActivo = cat"
        >
          {{ cat }}
        </button>
      </nav>

      <!-- Galería de proyectos -->
      <section
        class="home-galeria"
        aria-label="Galería de proyectos"
      >
        <div
          v-if="proyectosFiltrados.length > 0"
          class="home-galeria__grid"
        >
          <ProjectCard
            v-for="proyecto in proyectosFiltrados"
            :key="proyecto.id"
            :proyecto="proyecto"
          />
        </div>

        <p
          v-else
          class="home-galeria__vacio"
        >
          No hay proyectos en la categoría "{{ filtroActivo }}".
        </p>
      </section>

      <!-- Pie de sección -->
      <footer class="home-pie">
        <span>{{ proyectosFiltrados.length }} / {{ proyectos.length }} proyectos</span>
        <div
          class="home-pie__linea"
          aria-hidden="true"
        />
        <span>Mia Carini Rojo &mdash; {{ new Date().getFullYear() }}</span>
      </footer>
    </div>
  </div>
</template>
