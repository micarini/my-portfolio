<script setup>
// Demo 02 — Computed y el grafo de dependencias.
// precio y cantidad → subtotal (computed) → total (computed + envioGratis).
// Los computed son puros; los contadores de recálculo se llevan en watchers
// paralelos sobre las mismas dependencias, para no ensuciar el computed
// con side effects. El botón de caché lee total.value en un loop y
// demuestra que los contadores no se mueven.
import { ref, computed, watch } from 'vue'
import './DemoComputed.css'

const precio = ref(50)
const cantidad = ref(3)
const envioGratis = ref(false)

const contRecalcSubtotal = ref(0)
const contRecalcTotal = ref(0)

const flashPrecio = ref(false)
const flashCantidad = ref(false)
const flashSubtotal = ref(false)
const flashTotal = ref(false)
const flashEnvio = ref(false)

function flash(r) {
  r.value = false
  // Forzar reflow para reiniciar la animación CSS
  void document.body.offsetHeight
  r.value = true
  setTimeout(() => {
    r.value = false
  }, 400)
}

// Los computed reales: puros, memorizados, con caché
const subtotal = computed(() => precio.value * cantidad.value)
const total = computed(() => subtotal.value + (envioGratis.value ? 0 : 9.99))

// Contadores de recálculo: espejan exactamente cuándo Vue invalida la caché
watch(precio, () => {
  contRecalcSubtotal.value++
  contRecalcTotal.value++
  flash(flashPrecio)
  flash(flashSubtotal)
  flash(flashTotal)
})

watch(cantidad, () => {
  contRecalcSubtotal.value++
  contRecalcTotal.value++
  flash(flashCantidad)
  flash(flashSubtotal)
  flash(flashTotal)
})

watch(envioGratis, () => {
  contRecalcTotal.value++
  flash(flashEnvio)
  flash(flashTotal)
})

const lecturasMostradas = ref(false)

function leerTotal10Veces() {
  // Diez accesos consecutivos al computed sin tocar sus dependencias:
  // Vue devuelve el valor cacheado las diez veces, sin recalcular nada.
  for (let i = 0; i < 10; i++) {
    void total.value
  }
  lecturasMostradas.value = true
  setTimeout(() => {
    lecturasMostradas.value = false
  }, 2500)
}
</script>

<template>
  <div class="demo-cp">
    <p class="demo-cp__hint">
      Mové los sliders y mirá qué nodos flashean. Después probá el botón de abajo.
    </p>

    <!-- Inputs -->
    <div class="demo-cp__inputs">
      <div class="demo-cp__slider-row">
        <span class="demo-cp__slider-label">Precio ($)</span>
        <input
          v-model.number="precio"
          class="demo-cp__slider"
          type="range"
          min="0"
          max="100"
          aria-label="Precio"
        >
        <span class="demo-cp__slider-valor">{{ precio }}</span>
      </div>
      <div class="demo-cp__slider-row">
        <span class="demo-cp__slider-label">Cantidad</span>
        <input
          v-model.number="cantidad"
          class="demo-cp__slider"
          type="range"
          min="0"
          max="10"
          aria-label="Cantidad"
        >
        <span class="demo-cp__slider-valor">{{ cantidad }}</span>
      </div>
      <div class="demo-cp__toggle-row">
        <input
          id="envio-toggle"
          v-model="envioGratis"
          class="demo-cp__toggle"
          type="checkbox"
          aria-label="Envío gratis"
        >
        <label
          class="demo-cp__toggle-label"
          for="envio-toggle"
        >
          Envío gratis: {{ envioGratis ? 'SÍ' : 'NO (+$9.99)' }}
        </label>
      </div>
    </div>

    <!-- Grafo de dependencias -->
    <div class="demo-cp__grafo">
      <!-- Fuentes: refs -->
      <div class="demo-cp__col-izq">
        <div
          class="demo-cp__nodo"
          :class="{ 'demo-cp__nodo--flash': flashPrecio }"
        >
          <span class="demo-cp__nodo-tipo">ref precio</span>
          <span class="demo-cp__nodo-valor">${{ precio }}</span>
        </div>
        <div
          class="demo-cp__nodo"
          :class="{ 'demo-cp__nodo--flash': flashCantidad }"
        >
          <span class="demo-cp__nodo-tipo">ref cantidad</span>
          <span class="demo-cp__nodo-valor">× {{ cantidad }}</span>
        </div>
      </div>

      <span
        class="demo-cp__flecha"
        aria-hidden="true"
      >→</span>

      <!-- Computed intermedio -->
      <div
        class="demo-cp__nodo demo-cp__nodo--computed"
        :class="{ 'demo-cp__nodo--flash': flashSubtotal }"
      >
        <span class="demo-cp__nodo-tipo">computed subtotal</span>
        <span class="demo-cp__nodo-valor">${{ subtotal.toFixed(2) }}</span>
        <span class="demo-cp__nodo-cont">recálculos: {{ contRecalcSubtotal }}</span>
      </div>

      <span
        class="demo-cp__flecha"
        aria-hidden="true"
      >→</span>

      <!-- Computed final + su otra dependencia -->
      <div class="demo-cp__col-der">
        <div
          class="demo-cp__nodo demo-cp__nodo--computed"
          :class="{ 'demo-cp__nodo--flash': flashTotal }"
        >
          <span class="demo-cp__nodo-tipo">computed total</span>
          <span class="demo-cp__nodo-valor">${{ total.toFixed(2) }}</span>
          <span class="demo-cp__nodo-cont">recálculos: {{ contRecalcTotal }}</span>
        </div>
        <div
          class="demo-cp__nodo"
          :class="{ 'demo-cp__nodo--flash': flashEnvio }"
        >
          <span class="demo-cp__nodo-tipo">ref envioGratis</span>
          <span class="demo-cp__nodo-valor">{{ envioGratis ? 'SÍ' : 'NO' }}</span>
        </div>
      </div>
    </div>

    <!-- Demostración de caché -->
    <div class="demo-cp__cache-zona">
      <button
        class="btn-brutal"
        type="button"
        @click="leerTotal10Veces"
      >
        LEER total 10 VECES
      </button>
      <div
        class="demo-cp__cache-msg"
        :class="{ 'demo-cp__cache-msg--visible': lecturasMostradas }"
        role="status"
      >
        ¿Viste que el contador no subió? Eso es la caché: nada cambió, nada se recalcula.
      </div>
    </div>
  </div>
</template>
