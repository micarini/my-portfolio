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
import './HijoCicloVida.css'

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
