<script setup>
// Demo 03 — v-model, desarmado.
// Dos inputs sobre el MISMO ref: uno con v-model (azúcar) y otro con
// :value + @input (sintaxis expandida). Las flechas se iluminan según
// la dirección del flujo: input → estado en cada tecla, estado → DOM
// cuando Vue termina de actualizar (nextTick).
import { ref, watch, nextTick } from 'vue'
import './DemoVModel.css'

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
