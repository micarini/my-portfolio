<script setup>
// Demo 03 — v-model, desarmado.
// Dos inputs sobre el MISMO ref: uno con v-model (azúcar) y otro con
// :value + @input (sintaxis expandida). Las flechas se iluminan según
// la dirección del flujo: input → estado en cada tecla, estado → DOM
// cuando Vue termina de actualizar (nextTick).
import { ref, watch, nextTick } from 'vue'

const texto = ref('Hola')
const mostrarAzucar = ref(true)

const flechaEntrada = ref(false)
const flechaSalida = ref(false)

function encenderEntrada() {
  flechaEntrada.value = true
  setTimeout(() => {
    flechaEntrada.value = false
  }, 400)
}

watch(texto, () => {
  // nextTick: la flecha de salida se enciende recién cuando el DOM
  // ya refleja el nuevo valor — ese es el "estado → vista" real.
  nextTick(() => {
    flechaSalida.value = true
    setTimeout(() => {
      flechaSalida.value = false
    }, 400)
  })
})
</script>

<template>
  <div class="demo-vm">
    <p class="demo-vm__hint">
      Escribí en cualquiera de los dos: son el mismo ref visto desde dos sintaxis.
    </p>

    <!-- Inputs sincronizados + estado central con flechas -->
    <div class="demo-vm__inputs">
      <!-- Con azúcar -->
      <div class="demo-vm__input-bloque">
        <span class="demo-vm__input-rotulo">v-model="texto"</span>
        <input
          v-model="texto"
          class="demo-vm__input"
          type="text"
          aria-label="Input con v-model"
          @input="encenderEntrada"
        >
      </div>

      <!-- Flujo -->
      <div class="demo-vm__flujo">
        <span
          class="demo-vm__flecha"
          :class="{ 'demo-vm__flecha--activa': flechaEntrada }"
          aria-hidden="true"
        >→ estado</span>
        <div class="demo-vm__estado">
          ref texto
          <span class="demo-vm__estado-valor">{{ texto }}</span>
        </div>
        <span
          class="demo-vm__flecha"
          :class="{ 'demo-vm__flecha--activa': flechaSalida }"
          aria-hidden="true"
        >estado →</span>
      </div>

      <!-- Sin azúcar -->
      <div class="demo-vm__input-bloque">
        <span class="demo-vm__input-rotulo">:value="texto" @input="…"</span>
        <input
          :value="texto"
          class="demo-vm__input"
          type="text"
          aria-label="Input con :value y @input"
          @input="texto = $event.target.value; encenderEntrada()"
        >
      </div>
    </div>

    <!-- Toggle + snippet -->
    <div class="demo-vm__codigo-zona">
      <div class="demo-vm__toggle-row">
        <input
          id="azucar-toggle"
          v-model="mostrarAzucar"
          class="demo-vm__toggle"
          type="checkbox"
          aria-label="Ver el azúcar sintáctico"
        >
        <label
          class="demo-vm__toggle-label"
          for="azucar-toggle"
        >
          VER EL AZÚCAR: {{ mostrarAzucar ? 'v-model (azúcar)' : 'sintaxis expandida' }}
        </label>
      </div>

      <!-- Snippet: v-model -->
      <pre
        v-if="mostrarAzucar"
        class="demo-vm__pre"
        aria-label="Código con v-model"
      ><span class="syn-cmnt">&lt;!-- azúcar sintáctico --&gt;</span>
<span class="syn-tag">&lt;input</span>
  <span class="syn-attr">v-model</span>=<span class="syn-val">"texto"</span>
<span class="syn-tag">/&gt;</span></pre>

      <!-- Snippet: expandido -->
      <pre
        v-else
        class="demo-vm__pre"
        aria-label="Código expandido equivalente"
      ><span class="syn-cmnt">&lt;!-- equivalente, sin azúcar --&gt;</span>
<span class="syn-tag">&lt;input</span>
  <span class="syn-attr">:value</span>=<span class="syn-val">"texto"</span>
  <span class="syn-attr">@input</span>=<span class="syn-val">"texto = $event.target.value"</span>
<span class="syn-tag">/&gt;</span>

<span class="syn-cmnt">&lt;!-- v-model = binding (:value) + evento (@input).
     El "two-way" es azúcar: el flujo real siempre es
     input → estado → DOM, unidireccional. --&gt;</span></pre>
    </div>
  </div>
</template>

<style scoped>
/* ==========================================================================
   DemoVModel — Demo 03: v-model, desarmado
   Dos inputs sobre el mismo ref + flechas de flujo + snippet con toggle.
   ========================================================================== */

.demo-vm {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  overflow: hidden;
}

.demo-vm__hint {
  font-family: 'DM Sans', sans-serif;
  font-size: 0.9rem;
  line-height: 1.5;
  color: #8a8f9c;
}

/* --------------------------------------------------------
   Los dos inputs sincronizados con el estado central
-------------------------------------------------------- */
.demo-vm__inputs {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: var(--space-2);
  align-items: center;
}

.demo-vm__input-bloque {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  min-width: 0;
}

.demo-vm__input-rotulo {
  font-family: var(--font-mono);
  font-size: var(--text-micro);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-paper-dark);
}

.demo-vm__input {
  font-family: var(--font-mono);
  font-size: var(--text-body);
  color: var(--color-paper);
  background: var(--color-ink);
  border: 1.5px solid var(--color-paper);
  border-radius: 6px;
  padding: 0.5rem 0.75rem;
  outline: none;
  width: 100%;
}

.demo-vm__input:focus {
  border-color: var(--color-orange);
  box-shadow: 0 0 0 3px rgba(134, 128, 255, 0.2);
}

/* Columna central: flechas que se iluminan según la dirección del flujo */
.demo-vm__flujo {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-1);
}

.demo-vm__flecha {
  font-family: var(--font-mono);
  font-size: var(--text-small);
  font-weight: 700;
  padding: 2px 8px;
  border: 1.5px solid var(--color-paper);
  border-radius: 4px;
  background: var(--color-sepia);
  color: var(--color-paper);
  transition:
    background 200ms ease,
    color 200ms ease,
    border-color 200ms ease;
  user-select: none;
  white-space: nowrap;
}

.demo-vm__flecha--activa {
  background: var(--color-orange);
  color: var(--color-ink);
  border-color: var(--color-orange);
}

/* Estado central visible entre las flechas */
.demo-vm__estado {
  text-align: center;
  font-family: var(--font-mono);
  font-size: var(--text-micro);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-paper-dark);
}

.demo-vm__estado-valor {
  font-family: var(--font-display);
  font-size: var(--text-h2);
  color: var(--color-paper);
  display: block;
  margin-top: 2px;
  word-break: break-all;
  max-width: 16ch;
}

/* --------------------------------------------------------
   Zona del snippet de código con toggle
-------------------------------------------------------- */
.demo-vm__codigo-zona {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.demo-vm__toggle-row {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.demo-vm__toggle-label {
  font-family: 'DM Sans', sans-serif;
  font-size: 0.9rem;
  cursor: pointer;
  user-select: none;
}

.demo-vm__toggle {
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

.demo-vm__toggle::after {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  width: calc(1.3rem - 8px);
  height: calc(1.3rem - 8px);
  background: var(--color-paper);
  transition: transform 200ms ease;
}

.demo-vm__toggle:checked {
  background: var(--color-electric);
}

.demo-vm__toggle:checked::after {
  transform: translateX(1.1rem);
}

/* Bloque <pre> estilizado, highlighting con spans manuales */
.demo-vm__pre {
  font-family: var(--font-mono);
  font-size: var(--text-small);
  line-height: 1.7;
  background: var(--color-sepia);
  color: var(--color-paper);
  border: 1px solid rgba(217, 222, 236, 0.1);
  border-radius: 8px;
  padding: var(--space-2) var(--space-3);
  overflow-x: auto;
  white-space: pre;
  max-width: 100%;
}

/* Paleta del syntax highlighting manual */
.syn-tag {
  color: #88c0d0;
}

.syn-attr {
  color: var(--color-primary);
}

.syn-val {
  color: #ebcb8b;
}

.syn-cmnt {
  color: rgba(255, 255, 255, 0.4);
  font-style: italic;
}

/* --------------------------------------------------------
   Responsive
-------------------------------------------------------- */
@media (max-width: 720px) {
  .demo-vm__inputs {
    grid-template-columns: 1fr;
  }

  .demo-vm__flujo {
    flex-direction: row;
    justify-content: center;
    flex-wrap: wrap;
  }
}
</style>
