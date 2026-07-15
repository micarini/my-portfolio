<script setup>
// Demo 04 — El ciclo de vida.
// El padre monta/desmonta con v-if un componente hijo REAL (HijoCicloVida).
// El hijo reporta cada hook vía emit('hook', { nombre, ts }) y acá se
// pintan en una línea de tiempo vertical con timestamps relativos al setup.
import { ref } from 'vue'
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

<style scoped>
/* ==========================================================================
   DemoCicloVida — Demo 04: El ciclo de vida
   Botón montar/desmontar + línea de tiempo vertical de hooks con timestamps.
   ========================================================================== */

.demo-cl {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.demo-cl__hint {
  font-family: 'DM Sans', sans-serif;
  font-size: 0.9rem;
  line-height: 1.5;
  color: #8a8f9c;
}

.demo-cl__controles {
  display: flex;
  gap: var(--space-2);
  align-items: center;
}

/* Área donde vive (o no) el componente hijo */
.demo-cl__area {
  min-height: 120px;
  border: var(--border-thick);
  background: var(--color-sepia);
  padding: var(--space-2);
  display: flex;
  align-items: center;
  justify-content: center;
}

.demo-cl__vacio {
  font-family: var(--font-mono);
  font-size: var(--text-small);
  color: var(--color-paper-dark);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

/* --------------------------------------------------------
   Línea de tiempo vertical de hooks
-------------------------------------------------------- */
.demo-cl__timeline {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.demo-cl__hook {
  display: grid;
  grid-template-columns: 24px 1fr;
  gap: var(--space-2);
  align-items: stretch;
  position: relative;
}

.demo-cl__hook-linea {
  position: relative;
  display: flex;
  align-items: flex-start;
  padding-top: 4px;
}

/* Conector vertical entre círculos */
.demo-cl__hook:not(:last-child) .demo-cl__hook-linea::after {
  content: '';
  position: absolute;
  top: 24px;
  left: 7px;
  width: 2px;
  height: calc(100% - 24px);
  background: var(--color-paper);
  opacity: 0.2;
}

/* Círculo del hook: es un punto de una línea de tiempo, círculo por definición */
.demo-cl__hook-circulo {
  width: 16px;
  height: 16px;
  border: 2px solid var(--color-paper);
  border-radius: 50%;
  background: var(--color-ink);
  flex-shrink: 0;
  transition:
    background 300ms ease,
    border-color 300ms ease,
    box-shadow 300ms ease;
}

.demo-cl__hook-circulo--activo {
  background: var(--color-orange);
  border-color: var(--color-paper);
  box-shadow: 0 0 0 3px rgba(134, 128, 255, 0.3);
}

.demo-cl__hook-body {
  padding-bottom: var(--space-2);
}

.demo-cl__hook-nombre {
  font-family: var(--font-mono);
  font-size: var(--text-small);
  font-weight: 700;
  color: var(--color-paper);
}

.demo-cl__hook-nombre--activo {
  color: var(--color-orange);
}

.demo-cl__hook-ts {
  font-family: var(--font-mono);
  font-size: var(--text-micro);
  color: var(--color-electric);
  background: var(--color-paper);
  padding: 1px 6px;
  margin-left: 6px;
}

.demo-cl__hook-desc {
  font-family: 'DM Sans', sans-serif;
  font-size: 0.9rem;
  color: var(--color-paper-dark);
  line-height: 1.5;
  margin-top: 2px;
  max-width: 60ch;
}
</style>
