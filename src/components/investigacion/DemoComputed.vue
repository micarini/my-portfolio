<script setup>
// Demo 02 — Computed y el grafo de dependencias.
// precio y cantidad → subtotal (computed) → total (computed + envioGratis).
// Los computed son puros; los contadores de recálculo se llevan en watchers
// paralelos sobre las mismas dependencias, para no ensuciar el computed
// con side effects. El botón de caché lee total.value en un loop y
// demuestra que los contadores no se mueven.
import { ref, computed, watch } from 'vue'

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
  // Leer offsetHeight fuerza un reflow del navegador, reiniciando la animación CSS.
  // Sin esto, si la clase ya estaba aplicada, el browser omite el reflow y no se re-anima.
  void document.body.offsetHeight
  r.value = true
  setTimeout(() => {
    r.value = false
  }, 400)
}

// computed: función pura que Vue memoriza. Solo recalcula cuando alguna de sus
// dependencias (refs que lee) cambia. Las lecturas repetidas devuelven la caché.
const subtotal = computed(() => precio.value * cantidad.value)
// total depende de subtotal Y de envioGratis. El operador ternario (? :) es
// "si envioGratis es true, sumar 0; si no, sumar 9.99"
const total = computed(() => subtotal.value + (envioGratis.value ? 0 : 9.99))

// Los watchers van separados del computed a propósito: un computed no debería
// tener side effects (modificar estado externo). Los contadores los llevamos acá.
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
  for (let i = 0; i < 10; i++) {
    // void descarta el valor — solo nos importa que Vue registre la lectura.
    // Como ninguna dependencia cambió, las 10 lecturas devuelven la caché.
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

<style scoped>
/* ==========================================================================
   DemoComputed — Demo 02: Computed y el grafo de dependencias
   Sliders custom brutalistas + grafo de nodos + demostración de caché.
   ========================================================================== */

.demo-cp {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.demo-cp__hint {
  font-family: 'DM Sans', sans-serif;
  font-size: 0.9rem;
  line-height: 1.5;
  color: #8a8f9c;
}

/* --------------------------------------------------------
   Inputs: sliders custom y toggle
-------------------------------------------------------- */
.demo-cp__inputs {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.demo-cp__slider-row {
  display: grid;
  grid-template-columns: 120px 1fr 60px;
  gap: var(--space-2);
  align-items: center;
}

.demo-cp__slider-label {
  font-family: 'DM Sans', sans-serif;
  font-size: 0.9rem;
}

/* Slider suavizado */
.demo-cp__slider {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 5px;
  background: var(--color-sepia);
  border: 1px solid rgba(156, 158, 165, 0.3);
  border-radius: 4px;
  outline: none;
}

.demo-cp__slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  background: var(--color-orange);
  border: 2px solid var(--color-paper);
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
}

.demo-cp__slider::-moz-range-thumb {
  width: 18px;
  height: 18px;
  background: var(--color-orange);
  border: 2px solid var(--color-paper);
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
}

.demo-cp__slider-valor {
  font-family: var(--font-display);
  font-size: var(--text-body);
  text-align: right;
}

/* Toggle cuadrado de envío gratis */
.demo-cp__toggle-row {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.demo-cp__toggle-label {
  font-family: 'DM Sans', sans-serif;
  font-size: 0.9rem;
  cursor: pointer;
  user-select: none;
}

.demo-cp__toggle {
  width: 2.4rem;
  height: 1.3rem;
  background: var(--color-sepia);
  border: 1.5px solid var(--color-paper);
  border-radius: 999px;
  cursor: pointer;
  position: relative;
  flex-shrink: 0;
  appearance: none;
  -webkit-appearance: none;
}

.demo-cp__toggle::after {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  width: calc(1.3rem - 8px);
  height: calc(1.3rem - 8px);
  background: var(--color-paper);
  transition: transform 200ms ease;
}

.demo-cp__toggle:checked {
  background: var(--color-electric);
}

.demo-cp__toggle:checked::after {
  transform: translateX(1.1rem);
}

/* --------------------------------------------------------
   Grafo visual de dependencias
-------------------------------------------------------- */
.demo-cp__grafo {
  display: grid;
  grid-template-columns: 1fr auto 1fr auto 1fr;
  gap: var(--space-1);
  align-items: center;
}

.demo-cp__col-izq {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.demo-cp__col-der {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.demo-cp__nodo {
  border: 1.5px solid var(--color-paper);
  border-radius: 6px;
  background: var(--color-ink);
  padding: var(--space-1) var(--space-2);
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.demo-cp__nodo--computed {
  border: 2px solid var(--color-paper);
  border-radius: 6px;
  background: var(--color-sepia);
}

.demo-cp__nodo--flash {
  animation: nodo-flash 350ms ease-out;
}

@keyframes nodo-flash {
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

.demo-cp__nodo-tipo {
  font-family: var(--font-mono);
  font-size: var(--text-micro);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--color-paper-dark);
}

.demo-cp__nodo-valor {
  font-family: var(--font-display);
  font-size: var(--text-h2);
  line-height: 1;
  color: var(--color-paper);
}

.demo-cp__nodo-cont {
  font-family: var(--font-mono);
  font-size: var(--text-micro);
  color: var(--color-orange);
}

.demo-cp__flecha {
  font-family: var(--font-mono);
  font-size: 1.4rem;
  color: var(--color-orange);
  user-select: none;
  text-align: center;
}

/* --------------------------------------------------------
   Zona de caché: botón + mensaje
-------------------------------------------------------- */
.demo-cp__cache-zona {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  align-items: flex-start;
}

.demo-cp__cache-msg {
  font-family: var(--font-mono);
  font-size: var(--text-small);
  color: var(--color-electric);
  background: var(--color-paper);
  padding: var(--space-1) var(--space-2);
  border: 1px solid rgba(32, 33, 39, 0.5);
  border-radius: 6px;
  opacity: 0;
  transition: opacity 300ms ease;
}

.demo-cp__cache-msg--visible {
  opacity: 1;
}

/* --------------------------------------------------------
   Responsive
-------------------------------------------------------- */
@media (max-width: 720px) {
  .demo-cp__grafo {
    grid-template-columns: 1fr;
  }

  .demo-cp__flecha {
    transform: rotate(90deg);
  }

  .demo-cp__slider-row {
    grid-template-columns: 90px 1fr 40px;
  }
}
</style>
