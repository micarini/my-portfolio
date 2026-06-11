<script setup>
import { ref, computed } from 'vue'
import './SesgosAlgoritmo.css'

// --- Estado reactivo ---------------------------------------------------------
// presion: 0 = sin filtro algorítmico, 100 = filtro máximo
const presion = ref(0)

// Definición de los 12 rostros abstractos: tono de piel, ¿es canon?
// Canon = piel clara + rasgos eurocéntricos (en el modelo simplificado del algoritmo)
const rostros = [
  { id: 1, nombre: 'Usuario A',  tono: '#f5cba7', canon: true,  forma: 'ovalada'     },
  { id: 2, nombre: 'Usuario B',  tono: '#8d5524', canon: false, forma: 'redonda'      },
  { id: 3, nombre: 'Usuario C',  tono: '#d4956a', canon: true,  forma: 'angular'      },
  { id: 4, nombre: 'Usuario D',  tono: '#4a2c0a', canon: false, forma: 'cuadrada'     },
  { id: 5, nombre: 'Usuario E',  tono: '#f9e4c8', canon: true,  forma: 'corazón'      },
  { id: 6, nombre: 'Usuario F',  tono: '#7b4226', canon: false, forma: 'romboidal'    },
  { id: 7, nombre: 'Usuario G',  tono: '#e8b896', canon: true,  forma: 'ovalada'      },
  { id: 8, nombre: 'Usuario H',  tono: '#3b1c08', canon: false, forma: 'redonda'      },
  { id: 9, nombre: 'Usuario I',  tono: '#c47d4e', canon: false, forma: 'angular'      },
  { id: 10, nombre: 'Usuario J', tono: '#fce8d5', canon: true,  forma: 'corazón'      },
  { id: 11, nombre: 'Usuario K', tono: '#5c3317', canon: false, forma: 'cuadrada'     },
  { id: 12, nombre: 'Usuario L', tono: '#b06030', canon: false, forma: 'ovalada'      },
]

// --- Computed ----------------------------------------------------------------

// Decide si un rostro es "suprimido" según la presión actual
// El umbral baja linealmente: a presión 0 nadie es suprimido;
// a presión 100 todos los no-canon son suprimidos.
function estaSuprimido(rostro) {
  if (rostro.canon) return false
  // Los no-canon empiezan a desaparecer a partir de presion 10
  const umbral = 10 + (presion.value * 0.6)
  // Usamos el índice implícito de la lista para variar cuándo desaparece cada uno
  const indice = rostros.indexOf(rostro)
  return presion.value > umbral - (indice * 2)
}

// Opacidad y escala reactivas para cada rostro
function estiloTarjeta(rostro) {
  if (estaSuprimido(rostro)) {
    const reduccion = Math.min(1, (presion.value - 10) / 70)
    return {
      opacity: Math.max(0.08, 1 - reduccion * 0.92),
      transform: `scale(${Math.max(0.72, 1 - reduccion * 0.28)})`,
    }
  }
  return { opacity: 1, transform: 'scale(1)' }
}

const cantPromovidos = computed(() =>
  rostros.filter(r => !estaSuprimido(r)).length
)

const cantSuprimidos = computed(() =>
  rostros.filter(r => estaSuprimido(r)).length
)

// % de diversidad = proporción de rostros no-canon aún visibles
const porcentajeDiversidad = computed(() => {
  const noCanon = rostros.filter(r => !r.canon)
  const visibles = noCanon.filter(r => !estaSuprimido(r)).length
  return Math.round((visibles / noCanon.length) * 100)
})

const alertaCensura = computed(() => presion.value >= 80)
</script>

<template>
  <div>
    <!-- Controles -->
    <div class="sesgos-controles">
      <div class="sesgos-slider-label">
        <span>PRESIÓN ALGORÍTMICA</span>
        <strong>{{ presion }}%</strong>
      </div>
      <input
        v-model.number="presion"
        type="range"
        min="0"
        max="100"
        class="sesgos-slider"
        aria-label="Presión algorítmica"
      >

      <!-- Métricas reactivas -->
      <div class="sesgos-metricas">
        <div class="sesgos-metrica">
          <span
            class="sesgos-metrica__num"
            :class="porcentajeDiversidad < 40 ? 'sesgos-metrica__num--peligro' : 'sesgos-metrica__num--ok'"
          >{{ porcentajeDiversidad }}%</span>
          <span class="sesgos-metrica__label">Diversidad visible</span>
        </div>
        <div class="sesgos-metrica">
          <span class="sesgos-metrica__num sesgos-metrica__num--ok">{{ cantPromovidos }}</span>
          <span class="sesgos-metrica__label">Promovidos</span>
        </div>
        <div class="sesgos-metrica">
          <span
            class="sesgos-metrica__num"
            :class="cantSuprimidos > 0 ? 'sesgos-metrica__num--peligro' : ''"
          >{{ cantSuprimidos }}</span>
          <span class="sesgos-metrica__label">Suprimidos</span>
        </div>
      </div>

      <!-- Alerta: se muestra con v-if cuando presión ≥ 80 -->
      <div
        v-if="alertaCensura"
        class="sesgos-alerta"
        role="alert"
      >
        ⚠ ALERTA — CENSURA ALGORÍTMICA MASIVA: más del 80% del feed responde a un único estándar racial
      </div>
    </div>

    <!-- Feed de tarjetas -->
    <div
      class="sesgos-feed"
      role="list"
    >
      <div
        v-for="rostro in rostros"
        :key="rostro.id"
        class="sesgos-tarjeta"
        :class="{ 'sesgos-tarjeta--suprimido': estaSuprimido(rostro) }"
        :style="estiloTarjeta(rostro)"
        role="listitem"
      >
        <!-- Cara abstracta 100% CSS -->
        <div
          class="cara-css"
          :aria-label="`Rostro abstracto: ${rostro.nombre}`"
        >
          <div
            class="cara-css__base"
            :style="{ background: rostro.tono }"
          />
          <div class="cara-css__ojo cara-css__ojo--izq" />
          <div class="cara-css__ojo cara-css__ojo--der" />
          <div class="cara-css__detalle" />
          <div class="cara-css__boca" />
        </div>
        <span class="sesgos-tarjeta__etiqueta">{{ rostro.nombre }}</span>
        <span
          class="sesgos-tarjeta__estado"
          :class="estaSuprimido(rostro) ? 'estado--suprimido' : 'estado--promovido'"
        >
          {{ estaSuprimido(rostro) ? 'SUPRIMIDO' : 'ACTIVO' }}
        </span>
      </div>
    </div>
  </div>
</template>
