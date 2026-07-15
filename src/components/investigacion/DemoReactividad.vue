<script setup>
// Demo 01 — La reactividad por Proxy.
// Un ref central ("nombre") con tres suscriptores reales: la interpolación
// del template, un computed derivado y un watcher. El watch registra cada
// SET en un log estilo terminal y dispara las animaciones de notificación.
import { ref, computed, watch, nextTick } from 'vue'

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
        <span class="demo-rx__flecha" aria-hidden="true"></span>
        <span class="demo-rx__flecha" aria-hidden="true"></span>
        <span class="demo-rx__flecha" aria-hidden="true"></span>
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

<style scoped>
/* ==========================================================================
   DemoReactividad — Demo 01: La reactividad por Proxy
   Un input alimenta un estado central que notifica a tres suscriptores.
   ========================================================================== */

.demo-rx {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.demo-rx__hint {
  font-family: 'DM Sans', sans-serif;
  font-size: 0.9rem;
  line-height: 1.5;
  color: #8a8f9c;
}

.demo-rx__input-row {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.demo-rx__label {
  font-family: var(--font-mono);
  font-size: var(--text-small);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  flex-shrink: 0;
}

.demo-rx__input {
  flex: 1;
  min-width: 0;
  font-family: var(--font-mono);
  font-size: var(--text-body);
  color: var(--color-paper);
  background: var(--color-ink);
  border: 1.5px solid var(--color-paper);
  border-radius: 6px;
  padding: 0.5rem 0.75rem;
  outline: none;
}

.demo-rx__input:focus {
  border-color: var(--color-orange);
  box-shadow: 0 0 0 3px rgba(134, 128, 255, 0.2);
}

/* --------------------------------------------------------
   Diagrama vivo: estado central → suscriptores
-------------------------------------------------------- */
.demo-rx__grafo {
  display: grid;
  grid-template-columns: 1fr auto 1.2fr;
  gap: var(--space-2);
  align-items: center;
}

.demo-rx__estado {
  border: 2px solid var(--color-paper);
  border-radius: 8px;
  background: var(--color-paper);
  color: var(--color-ink);
  padding: var(--space-2);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.18);
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.demo-rx__estado-label {
  font-family: var(--font-mono);
  font-size: var(--text-micro);
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--color-electric);
}

.demo-rx__estado-valor {
  font-family: var(--font-display);
  font-size: var(--text-h2);
  color: var(--color-ink);
  word-break: break-all;
}

/* Pulso del estado en cada SET: se reactiva cambiando el :key del nodo */
@keyframes pulso {
  0% {
    box-shadow: var(--shadow-hard);
  }

  40% {
    box-shadow:
      0 0 0 4px var(--color-electric),
      var(--shadow-hard);
  }

  100% {
    box-shadow: var(--shadow-hard);
  }
}

.demo-rx__estado--pulso {
  animation: pulso 300ms ease-out;
}

/* Conectores centrales: ondas que viajan hacia los suscriptores */
.demo-rx__conectores {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  align-self: stretch;
  gap: var(--space-2);
}

.demo-rx__flecha {
  font-family: var(--font-mono);
  font-size: 1.2rem;
  color: var(--color-orange);
  user-select: none;
}

/* Columna de suscriptores */
.demo-rx__suscriptores {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.demo-rx__suscriptor {
  border: 1.5px solid var(--color-paper);
  border-radius: 6px;
  background: var(--color-ink);
  padding: var(--space-1) var(--space-2);
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.demo-rx__suscriptor-tipo {
  font-family: var(--font-mono);
  font-size: var(--text-micro);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--color-paper-dark);
}

.demo-rx__suscriptor-valor {
  font-family: var(--font-display);
  font-size: 1.1rem;
  color: var(--color-paper);
  word-break: break-all;
}

/* Flash del suscriptor al recibir la notificación del Proxy */
@keyframes flash-suscriptor {
  0% {
    background: var(--color-ink);
  }

  30% {
    background: var(--color-electric);
  }

  100% {
    background: var(--color-ink);
  }
}

.demo-rx__suscriptor--flash {
  animation: flash-suscriptor 350ms ease-out;
}

/* --------------------------------------------------------
   Log estilo terminal
-------------------------------------------------------- */
.demo-rx__log {
  background: var(--color-paper);
  border: 1px solid rgba(32, 33, 39, 0.5);
  border-radius: 8px;
  padding: var(--space-2);
  min-height: 7rem;
  max-height: 7rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.demo-rx__log-linea {
  font-family: var(--font-mono);
  font-size: var(--text-micro);
  color: var(--color-electric);
  letter-spacing: 0.04em;
  white-space: pre-wrap;
  word-break: break-all;
}

.demo-rx__log-linea--nueva {
  animation: aparece-linea 200ms ease-out;
}

@keyframes aparece-linea {
  from {
    opacity: 0;
    transform: translateY(4px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* --------------------------------------------------------
   Contadores comparativos: teclas vs. actualizaciones del DOM
-------------------------------------------------------- */
.demo-rx__contadores {
  display: grid;
  grid-template-columns: 1fr 1fr;
  border: 1.5px solid var(--color-paper);
  border-radius: 8px;
  overflow: hidden;
}

.demo-rx__contador {
  padding: var(--space-1) var(--space-2);
  display: flex;
  flex-direction: column;
  gap: 2px;
  background: var(--color-sepia);
}

.demo-rx__contador:first-child {
  border-right: 1.5px solid var(--color-paper);
}

.demo-rx__contador-label {
  font-family: var(--font-mono);
  font-size: var(--text-micro);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-paper-dark);
}

.demo-rx__contador-valor {
  font-family: var(--font-display);
  font-size: var(--text-h2);
  line-height: 1;
  color: var(--color-orange);
}

.demo-rx__nota {
  font-family: 'DM Sans', sans-serif;
  font-size: 0.85rem;
  font-style: italic;
  line-height: 1.5;
  color: #7b808d;
}

/* --------------------------------------------------------
   Responsive
-------------------------------------------------------- */
@media (max-width: 720px) {
  .demo-rx__grafo {
    grid-template-columns: 1fr;
  }

  .demo-rx__conectores {
    flex-direction: row;
    justify-content: center;
  }

  .demo-rx__flecha {
    transform: rotate(90deg);
  }

  .demo-rx__contadores {
    grid-template-columns: 1fr;
  }

  .demo-rx__contador:first-child {
    border-right: none;
    border-bottom: var(--border-thick);
  }
}
</style>
