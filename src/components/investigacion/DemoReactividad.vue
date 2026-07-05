<script setup>
// Demo 01 — La reactividad por Proxy.
// Un ref central ("nombre") con tres suscriptores reales: la interpolación
// del template, un computed derivado y un watcher. El watch registra cada
// SET en un log estilo terminal y dispara las animaciones de notificación.
import { ref, computed, watch, nextTick } from 'vue'
import './DemoReactividad.css'

const nombre = ref('Vue')

// Rótulo con las llaves de interpolación, definido acá porque
// escribir "{{" literal dentro del template rompe el parser
const rotuloInterp = 'Interpolación {{ nombre }}'

// Cambiar esta clave fuerza a Vue a recrear el nodo del estado,
// lo que reinicia la animación CSS de pulso en cada tecla.
const pulseClave = ref(0)

const contadorTeclas = ref(0)
const contadorDOM = ref(0)
const log = ref([])
const logEl = ref(null)

// Suscriptor 2: computed derivado (saludo en mayúsculas)
const computedValor = computed(() => nombre.value.toUpperCase())

// Suscriptor 3: watcher que guarda el último valor observado
const watcherValor = ref(nombre.value)

// Flags de flash por suscriptor (reactivan la animación CSS)
const flashInterp = ref(false)
const flashComputed = ref(false)
const flashWatcher = ref(false)

function dispararFlash(refFlash) {
  refFlash.value = false
  // Forzar reflow para que el navegador reinicie la animación
  void document.body.offsetHeight
  refFlash.value = true
  setTimeout(() => {
    refFlash.value = false
  }, 400)
}

watch(nombre, (nuevo) => {
  pulseClave.value++
  contadorTeclas.value++
  contadorDOM.value++
  watcherValor.value = nuevo
  const entrada = `set nombre = "${nuevo}" → notificando 3 suscriptores`
  log.value = [...log.value.slice(-4), entrada]
  dispararFlash(flashInterp)
  dispararFlash(flashComputed)
  dispararFlash(flashWatcher)
  nextTick(() => {
    if (logEl.value) logEl.value.scrollTop = logEl.value.scrollHeight
  })
})
</script>

<template>
  <div class="demo-rx">
    <p class="demo-rx__hint">
      Escribí acá y mirá la columna de al lado: cada tecla es un SET que el Proxy intercepta.
    </p>

    <div class="demo-rx__input-row">
      <span class="demo-rx__label">nombre =</span>
      <input
        v-model="nombre"
        class="demo-rx__input"
        type="text"
        aria-label="Nombre reactivo"
        placeholder="Escribí algo…"
      >
    </div>

    <div class="demo-rx__grafo">
      <!-- Estado central: el :key cambia en cada SET y reinicia el pulso -->
      <div
        :key="pulseClave"
        class="demo-rx__estado demo-rx__estado--pulso"
      >
        <span class="demo-rx__estado-label">Estado (Proxy)</span>
        <span class="demo-rx__estado-valor">{{ nombre }}</span>
      </div>

      <!-- Conectores hacia los suscriptores -->
      <div class="demo-rx__conectores">
        <span
          class="demo-rx__flecha"
          aria-hidden="true"
        >→</span>
        <span
          class="demo-rx__flecha"
          aria-hidden="true"
        >→</span>
        <span
          class="demo-rx__flecha"
          aria-hidden="true"
        >→</span>
      </div>

      <!-- Los tres suscriptores -->
      <div class="demo-rx__suscriptores">
        <div
          class="demo-rx__suscriptor"
          :class="{ 'demo-rx__suscriptor--flash': flashInterp }"
        >
          <span class="demo-rx__suscriptor-tipo">{{ rotuloInterp }}</span>
          <span class="demo-rx__suscriptor-valor">{{ nombre }}</span>
        </div>
        <div
          class="demo-rx__suscriptor"
          :class="{ 'demo-rx__suscriptor--flash': flashComputed }"
        >
          <span class="demo-rx__suscriptor-tipo">Computed (mayúsculas)</span>
          <span class="demo-rx__suscriptor-valor">{{ computedValor }}</span>
        </div>
        <div
          class="demo-rx__suscriptor"
          :class="{ 'demo-rx__suscriptor--flash': flashWatcher }"
        >
          <span class="demo-rx__suscriptor-tipo">Watcher (último valor)</span>
          <span class="demo-rx__suscriptor-valor">{{ watcherValor }}</span>
        </div>
      </div>
    </div>

    <!-- Log estilo terminal -->
    <div
      ref="logEl"
      class="demo-rx__log"
      aria-label="Log de actualizaciones reactivas"
      aria-live="polite"
    >
      <span
        v-if="log.length === 0"
        class="demo-rx__log-linea"
      >$ esperando input…</span>
      <span
        v-for="(linea, i) in log"
        :key="i"
        class="demo-rx__log-linea demo-rx__log-linea--nueva"
      >$ {{ linea }}</span>
    </div>

    <!-- Contadores comparativos -->
    <div class="demo-rx__contadores">
      <div class="demo-rx__contador">
        <span class="demo-rx__contador-label">Teclas presionadas</span>
        <span class="demo-rx__contador-valor">{{ contadorTeclas }}</span>
      </div>
      <div class="demo-rx__contador">
        <span class="demo-rx__contador-label">Actualizaciones del DOM</span>
        <span class="demo-rx__contador-valor">{{ contadorDOM }}</span>
      </div>
    </div>
    <p class="demo-rx__nota">
      ¿Iguales? Eso es actualización quirúrgica: Vue solo re-renderiza lo que cambió, ni un nodo más.
    </p>
  </div>
</template>
