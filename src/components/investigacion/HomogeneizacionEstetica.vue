<script setup>
import { ref, computed } from 'vue'
import './HomogeneizacionEstetica.css'

// --- Estado reactivo ---------------------------------------------------------
// iteraciones: 0 = diversidad total, 100 = homogeneización total
const iteraciones = ref(0)

// Lerp lineal entre dos valores
function lerp(a, b, t) {
  return a + (b - a) * t
}

// Lerp de canal de color (un solo canal)
function lerpColor(a, b, t) {
  return Math.round(lerp(a, b, t))
}

// Interpola entre dos colores RGB dados como arrays [r, g, b]
function interpolarColor(colorA, colorB, t) {
  const r = lerpColor(colorA[0], colorB[0], t)
  const g = lerpColor(colorA[1], colorB[1], t)
  const b = lerpColor(colorA[2], colorB[2], t)
  return `rgb(${r}, ${g}, ${b})`
}

// --- Definición de los 6 rostros ---------------------------------------------
// Cada rostro tiene: nombre, color de piel inicial, tamaño de ojos, ancho de nariz
// TARGET: el "Instagram Face" (piel clara, ojos grandes, nariz fina)
const TARGET = {
  piel: [249, 228, 200],
  ojoW: 14,
  ojoH: 13,
  narizW: 8,
}

const rostrосInicial = [
  { id: 1, nombre: 'Cara A', piel: [74,  44, 10], ojoW: 9,  ojoH: 8,  narizW: 20 },
  { id: 2, nombre: 'Cara B', piel: [180, 120, 60], ojoW: 10, ojoH: 9,  narizW: 18 },
  { id: 3, nombre: 'Cara C', piel: [240, 190, 150], ojoW: 8, ojoH: 7,  narizW: 16 },
  { id: 4, nombre: 'Cara D', piel: [120, 70, 30],  ojoW: 11, ojoH: 10, narizW: 22 },
  { id: 5, nombre: 'Cara E', piel: [210, 160, 110], ojoW: 9, ojoH: 8,  narizW: 14 },
  { id: 6, nombre: 'Cara F', piel: [50,  28, 8],   ojoW: 10, ojoH: 9,  narizW: 24 },
]

// --- Computed: rostros con valores interpolados al target --------------------
const t = computed(() => iteraciones.value / 100)

const rostros = computed(() =>
  rostrосInicial.map(r => {
    const colorInterpolado = interpolarColor(r.piel, TARGET.piel, t.value)
    const ojoW = lerp(r.ojoW, TARGET.ojoW, t.value).toFixed(1)
    const ojoH = lerp(r.ojoH, TARGET.ojoH, t.value).toFixed(1)
    const narizW = lerp(r.narizW, TARGET.narizW, t.value).toFixed(1)

    // % similitud al target: promedio de tres métricas normalizadas
    const simPiel  = 1 - (Math.abs(r.piel[0] - TARGET.piel[0]) / 255) * (1 - t.value)
    const simOjos  = 1 - (Math.abs(r.ojoW - TARGET.ojoW) / 15) * (1 - t.value)
    const simNariz = 1 - (Math.abs(r.narizW - TARGET.narizW) / 20) * (1 - t.value)
    const similitud = Math.round(((simPiel + simOjos + simNariz) / 3) * 100)

    return {
      ...r,
      colorInterpolado,
      ojoW: `${ojoW}px`,
      ojoH: `${ojoH}px`,
      narizW: `${narizW}px`,
      similitud,
    }
  })
)

// % de diversidad restante: inversamente proporcional a la convergencia
const diversidadRestante = computed(() =>
  Math.round(100 - (iteraciones.value * 0.9))
)

// Promedio de similitud al target entre todos los rostros
const convergenciaPromedio = computed(() => {
  const suma = rostros.value.reduce((acc, r) => acc + r.similitud, 0)
  return Math.round(suma / rostros.value.length)
})

// Texto de estado
const estadoTendencia = computed(() =>
  iteraciones.value < 30 ? 'DIVERGENCIA'
  : iteraciones.value < 70 ? 'TRANSICIÓN'
  : 'CONVERGENCIA'
)

const claseTendencia = computed(() =>
  iteraciones.value < 30 ? 'homog-tendencia-badge--divergencia'
  : iteraciones.value < 70 ? ''
  : 'homog-tendencia-badge--convergencia'
)

const claseMetricaDiversidad = computed(() =>
  diversidadRestante.value > 50 ? 'homog-metrica__num--divergencia' : 'homog-metrica__num--convergencia'
)
</script>

<template>
  <div>
    <!-- Controles -->
    <div class="homog-controles">
      <div class="homog-slider-label">
        <span>ITERACIONES DE LA TENDENCIA</span>
        <strong>{{ iteraciones }}</strong>
      </div>
      <input
        v-model.number="iteraciones"
        type="range"
        min="0"
        max="100"
        class="homog-slider"
        aria-label="Iteraciones de la tendencia"
      >

      <!-- Métricas en vivo -->
      <div class="homog-metricas">
        <div class="homog-metrica">
          <span
            class="homog-metrica__num"
            :class="claseMetricaDiversidad"
          >
            {{ diversidadRestante }}%
          </span>
          <span class="homog-metrica__label">Diversidad restante</span>
        </div>
        <div class="homog-metrica">
          <span class="homog-metrica__num homog-metrica__num--convergencia">
            {{ convergenciaPromedio }}%
          </span>
          <span class="homog-metrica__label">Similitud al canon</span>
        </div>
        <div class="homog-metrica">
          <span
            class="homog-tendencia-badge"
            :class="claseTendencia"
          >{{ estadoTendencia }}</span>
          <span class="homog-metrica__label">Estado</span>
        </div>
      </div>
    </div>

    <!-- Grid de los 6 rostros convergentes -->
    <div class="homog-grid">
      <!--
        v-for itera sobre el computed `rostros`, que devuelve los valores
        lerpeados según el slider. Las custom properties CSS se inyectan
        mediante :style para controlar dimensiones de ojos y nariz desde el CSS.
      -->
      <div
        v-for="rostro in rostros"
        :key="rostro.id"
        class="homog-tarjeta"
      >
        <div
          class="homog-cara"
          :style="{
            '--ojo-w': rostro.ojoW,
            '--ojo-h': rostro.ojoH,
            '--nariz-w': rostro.narizW,
          }"
        >
          <div
            class="homog-cara__base"
            :style="{ background: rostro.colorInterpolado }"
          />
          <div class="homog-cara__ojo homog-cara__ojo--izq" />
          <div class="homog-cara__ojo homog-cara__ojo--der" />
          <div class="homog-cara__nariz" />
          <div class="homog-cara__boca" />
        </div>
        <span class="homog-tarjeta__nombre">{{ rostro.nombre }}</span>
        <span
          class="homog-tarjeta__similitud"
          :style="{ color: rostro.similitud > 80 ? 'var(--color-danger)' : 'var(--color-ink)' }"
        >{{ rostro.similitud }}%</span>
      </div>
    </div>

    <!-- Cita de Jia Tolentino — bloque editorial borde grueso -->
    <blockquote class="homog-cita">
      <p class="homog-cita__texto">
        "Instagram Face" es un rostro que existe en la intersección de la cirugía
        plástica, los filtros de realidad aumentada y los algoritmos de visibilidad:
        pómulos altos, nariz pequeña, labios carnosos, ojos grandes y distantes,
        y una piel que parece de otro mundo — sin poros, sin marcas, sin historia.
        Es el rostro que el sistema premia con alcance.
      </p>
      <cite class="homog-cita__fuente">
        Jia Tolentino — "The Age of Instagram Face", The New Yorker, diciembre 2019
      </cite>
    </blockquote>
  </div>
</template>
