<script setup>
// Componente hijo REAL de la Demo 04: se monta y desmonta con v-if desde
// el padre, y reporta cada hook de su ciclo de vida vía emit('hook').
// En onMounted hace un fetch simulado — el mismo patrón que usa Home.vue
// de este portfolio con su fetch real a /contenido.json.
import {
  ref,
  onBeforeMount,
  onMounted,
  onBeforeUnmount,
  onUnmounted,
} from 'vue'

const emit = defineEmits(['hook'])

const loading = ref(true)
const datosCargados = ref(null)
let timerFetch = null

// setup: el cuerpo de <script setup> se ejecuta sincrónicamente,
// antes de que exista cualquier DOM de este componente.
emit('hook', { nombre: 'setup', ts: Date.now() })

onBeforeMount(() => {
  emit('hook', { nombre: 'onBeforeMount', ts: Date.now() })
})

onMounted(() => {
  emit('hook', { nombre: 'onMounted', ts: Date.now() })
  // Fetch simulado: acá va porque el DOM ya existe y el componente
  // está listo para mostrar el estado de carga (igual que en Home.vue).
  loading.value = true
  timerFetch = setTimeout(() => {
    datosCargados.value = { mensaje: 'Datos recibidos (fetch simulado)' }
    loading.value = false
  }, 1200)
})

onBeforeUnmount(() => {
  emit('hook', { nombre: 'onBeforeUnmount', ts: Date.now() })
  // Cleanup: si nos desmontan a mitad del fetch, cancelamos el timer
  clearTimeout(timerFetch)
})

onUnmounted(() => {
  emit('hook', { nombre: 'onUnmounted', ts: Date.now() })
})
</script>

<template>
  <div class="hijo-cv">
    <p class="hijo-cv__titulo">
      &lt;ComponenteHijo /&gt; — montado y vivo
    </p>
    <div
      v-if="loading"
      class="hijo-cv__loading"
    >
      <span
        class="hijo-cv__spinner"
        aria-hidden="true"
      />
      onMounted: simulando fetch de datos…
    </div>
    <div
      v-else
      class="hijo-cv__dato"
    >
      ✓ {{ datosCargados.mensaje }}
    </div>
    <p class="hijo-cv__nota">
      El fetch va en onMounted porque recién ahí el DOM existe.
      Es el mismo patrón que usa Home.vue de este portfolio para
      cargar /contenido.json.
    </p>
  </div>
</template>

<style scoped>
/* ==========================================================================
   HijoCicloVida — componente hijo real de la Demo 04
   Vive y muere con v-if; reporta cada hook al padre vía emit.
   ========================================================================== */

.hijo-cv {
  border: var(--border-thick);
  background: var(--color-sepia);
  padding: var(--space-2);
  box-shadow: var(--shadow-hard);
  width: 100%;
}

.hijo-cv__titulo {
  font-family: var(--font-mono);
  font-size: var(--text-micro);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--color-paper-dark);
  margin-bottom: var(--space-1);
}

.hijo-cv__loading {
  font-family: var(--font-mono);
  font-size: var(--text-small);
  color: var(--color-orange);
  display: flex;
  align-items: center;
  gap: var(--space-1);
}

/* Único radio permitido: el spinner es un círculo por definición */
.hijo-cv__spinner {
  width: 10px;
  height: 10px;
  border: 2px solid var(--color-orange);
  border-top-color: transparent;
  border-radius: 50%;
  animation: gira 600ms linear infinite;
  flex-shrink: 0;
}

@keyframes gira {
  to {
    transform: rotate(360deg);
  }
}

.hijo-cv__dato {
  font-family: var(--font-mono);
  font-size: var(--text-small);
  color: var(--color-electric);
  background: var(--color-paper);
  padding: var(--space-1) var(--space-2);
  border: var(--border-thick);
}

.hijo-cv__nota {
  font-family: var(--font-mono);
  font-size: var(--text-micro);
  color: var(--color-paper-dark);
  margin-top: var(--space-1);
  line-height: 1.5;
}
</style>
