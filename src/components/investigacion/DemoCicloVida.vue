<script setup>
// Demo 04 — El ciclo de vida.
// El padre monta/desmonta con v-if un componente hijo REAL (HijoCicloVida).
// El hijo reporta cada hook vía emit('hook', { nombre, ts }) y acá se
// pintan en una línea de tiempo vertical con timestamps relativos al setup.
import { ref } from 'vue'
import './DemoCicloVida.css'
import HijoCicloVida from './HijoCicloVida.vue'

const montado = ref(false)
const eventos = ref([])
let tsSetup = null

const HOOKS_INFO = {
  setup: 'El script se ejecuta. Los refs y computeds se inicializan. Todavía no hay DOM.',
  onBeforeMount: 'El template está compilado, pero el DOM del componente aún no existe.',
  onMounted: 'El DOM existe. Acá van los fetch, los event listeners externos y las mediciones de layout.',
  onBeforeUnmount: 'El componente está por irse. Último momento para hacer cleanup (timers, listeners).',
  onUnmounted: 'El DOM fue eliminado. El componente ya no existe.',
}
const HOOKS_ORDEN = ['setup', 'onBeforeMount', 'onMounted', 'onBeforeUnmount', 'onUnmounted']

function recibirHook({ nombre, ts }) {
  if (nombre === 'setup') tsSetup = ts
  const relativo = tsSetup !== null ? ts - tsSetup : 0
  eventos.value.push({ nombre, relativo })
}

function alternar() {
  if (montado.value) {
    // Al desmontar NO limpiamos los eventos: así se ven los 5 hooks juntos
    montado.value = false
  } else {
    // Al montar de nuevo arranca un ciclo de vida fresco
    eventos.value = []
    tsSetup = null
    montado.value = true
  }
}

function hookActivo(nombre) {
  return eventos.value.some((e) => e.nombre === nombre)
}

function hookTs(nombre) {
  const e = eventos.value.find((ev) => ev.nombre === nombre)
  return e ? `+${e.relativo}ms` : ''
}
</script>

<template>
  <div class="demo-cl">
    <p class="demo-cl__hint">
      Montá el componente y mirá la línea de tiempo encenderse en orden. Después desmontalo.
    </p>

    <!-- Control -->
    <div class="demo-cl__controles">
      <button
        class="btn-brutal btn-brutal--accent"
        type="button"
        @click="alternar"
      >
        {{ montado ? 'DESMONTAR COMPONENTE' : 'MONTAR COMPONENTE' }}
      </button>
    </div>

    <!-- Área del hijo: v-if real, el componente nace y muere de verdad -->
    <div class="demo-cl__area">
      <HijoCicloVida
        v-if="montado"
        @hook="recibirHook"
      />
      <span
        v-else
        class="demo-cl__vacio"
      >El componente no está montado</span>
    </div>

    <!-- Línea de tiempo de hooks -->
    <div
      class="demo-cl__timeline"
      aria-label="Línea de tiempo del ciclo de vida"
    >
      <div
        v-for="nombre in HOOKS_ORDEN"
        :key="nombre"
        class="demo-cl__hook"
      >
        <div class="demo-cl__hook-linea">
          <div
            class="demo-cl__hook-circulo"
            :class="{ 'demo-cl__hook-circulo--activo': hookActivo(nombre) }"
            :aria-label="hookActivo(nombre) ? `${nombre}: ejecutado` : `${nombre}: pendiente`"
          />
        </div>
        <div class="demo-cl__hook-body">
          <div>
            <span
              class="demo-cl__hook-nombre"
              :class="{ 'demo-cl__hook-nombre--activo': hookActivo(nombre) }"
            >{{ nombre }}</span>
            <span
              v-if="hookActivo(nombre)"
              class="demo-cl__hook-ts"
            >{{ hookTs(nombre) }}</span>
          </div>
          <p class="demo-cl__hook-desc">
            {{ HOOKS_INFO[nombre] }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
