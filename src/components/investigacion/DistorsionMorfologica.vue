<script setup>
import { ref, computed } from 'vue'
import './DistorsionMorfologica.css'

// --- Estado reactivo: 4 sliders de modificación facial -----------------------
// Cada slider: 0 = natural, 100 = máximo filtro canon
const nariz    = ref(0)   // 0 = nariz natural, 100 = nariz afinada al máximo
const ojos     = ref(0)   // 0 = ojos naturales, 100 = ojos agrandados al máximo
const mandibula = ref(0)  // 0 = mandíbula natural, 100 = mandíbula reducida al máximo
const pielVal  = ref(0)   // 0 = tono oscuro, 100 = tono claro (blanqueamiento)

// Valores "canon" para el botón de aplicar filtro
const CANON = { nariz: 100, ojos: 100, mandibula: 100, pielVal: 100 }

// --- Computed: color de piel interpolado RGB ---------------------------------
// oscuro: rgb(74, 44, 10) → claro: rgb(252, 232, 213)
const colorPiel = computed(() => {
  const t = pielVal.value / 100
  const r = Math.round(74  + (252 - 74)  * t)
  const g = Math.round(44  + (232 - 44)  * t)
  const b = Math.round(10  + (213 - 10)  * t)
  return `rgb(${r}, ${g}, ${b})`
})

// Hex del color de piel para mostrar en ficha
const colorPielHex = computed(() => {
  const t = pielVal.value / 100
  const r = Math.round(74  + (252 - 74)  * t)
  const g = Math.round(44  + (232 - 44)  * t)
  const b = Math.round(10  + (213 - 10)  * t)
  const hex = v => v.toString(16).padStart(2, '0').toUpperCase()
  return `#${hex(r)}${hex(g)}${hex(b)}`
})

// % de deformación total: promedio de los 4 sliders
const porcentajeDeformacion = computed(() =>
  Math.round((nariz.value + ojos.value + mandibula.value + pielVal.value) / 4)
)

const alertaDeformacion = computed(() => porcentajeDeformacion.value > 50)

// Custom properties CSS inyectadas en el rostro
const estilosRostro = computed(() => ({
  '--nariz':     nariz.value,
  '--ojos':      ojos.value,
  '--mandibula': mandibula.value,
  '--piel':      colorPiel.value,
}))

// --- Acciones ----------------------------------------------------------------
function aplicarFiltroCanon() {
  nariz.value     = CANON.nariz
  ojos.value      = CANON.ojos
  mandibula.value = CANON.mandibula
  pielVal.value   = CANON.pielVal
}

function restablecer() {
  nariz.value     = 0
  ojos.value      = 0
  mandibula.value = 0
  pielVal.value   = 0
}
</script>

<template>
  <div class="distorsion-layout">
    <!-- Panel de controles -->
    <div class="distorsion-panel">
      <!-- Slider: afinar nariz -->
      <div class="distorsion-slider-grupo">
        <div class="distorsion-slider-encabezado">
          <span>AFINAR NARIZ</span>
          <strong>{{ nariz }}%</strong>
        </div>
        <input
          v-model.number="nariz"
          type="range"
          min="0"
          max="100"
          class="distorsion-slider"
          aria-label="Afinar nariz"
        >
      </div>

      <!-- Slider: agrandar ojos -->
      <div class="distorsion-slider-grupo">
        <div class="distorsion-slider-encabezado">
          <span>AGRANDAR OJOS</span>
          <strong>{{ ojos }}%</strong>
        </div>
        <input
          v-model.number="ojos"
          type="range"
          min="0"
          max="100"
          class="distorsion-slider"
          aria-label="Agrandar ojos"
        >
      </div>

      <!-- Slider: reducir mandíbula -->
      <div class="distorsion-slider-grupo">
        <div class="distorsion-slider-encabezado">
          <span>REDUCIR MANDÍBULA</span>
          <strong>{{ mandibula }}%</strong>
        </div>
        <input
          v-model.number="mandibula"
          type="range"
          min="0"
          max="100"
          class="distorsion-slider"
          aria-label="Reducir mandíbula"
        >
      </div>

      <!-- Slider: aclarar piel -->
      <div class="distorsion-slider-grupo">
        <div class="distorsion-slider-encabezado">
          <span>ACLARAR PIEL</span>
          <strong>{{ pielVal }}%</strong>
        </div>
        <input
          v-model.number="pielVal"
          type="range"
          min="0"
          max="100"
          class="distorsion-slider"
          aria-label="Aclarar piel"
        >
      </div>

      <!-- Botones -->
      <div class="distorsion-botones">
        <button
          class="btn-brutal btn-brutal--accent"
          @click="aplicarFiltroCanon"
        >
          APLICAR FILTRO CANON
        </button>
        <button
          class="btn-brutal"
          @click="restablecer"
        >
          RESTABLECER
        </button>
      </div>

      <!-- Ficha técnica -->
      <div class="distorsion-ficha">
        <p class="distorsion-ficha__titulo">
          FICHA TÉCNICA DE INTERVENCIÓN
        </p>
        <div class="distorsion-ficha__fila">
          <span>Afin. nariz</span>
          <span :class="nariz > 50 ? 'peligro' : ''">{{ nariz }}%</span>
        </div>
        <div class="distorsion-ficha__fila">
          <span>Amp. ojos</span>
          <span :class="ojos > 50 ? 'peligro' : ''">{{ ojos }}%</span>
        </div>
        <div class="distorsion-ficha__fila">
          <span>Red. mandíbula</span>
          <span :class="mandibula > 50 ? 'peligro' : ''">{{ mandibula }}%</span>
        </div>
        <div class="distorsion-ficha__fila">
          <span>Blanqueam. piel</span>
          <span :class="pielVal > 50 ? 'peligro' : ''">{{ pielVal }}%</span>
        </div>
        <div class="distorsion-ficha__fila">
          <span>DEFORMACIÓN TOTAL</span>
          <span :class="alertaDeformacion ? 'peligro' : ''">{{ porcentajeDeformacion }}%</span>
        </div>

        <!-- Alerta v-if deformación > 50% -->
        <div
          v-if="alertaDeformacion"
          class="distorsion-alerta"
          role="alert"
        >
          NIVEL CRÍTICO: DISTORSIÓN MORFOLÓGICA SUPERIOR AL 50%
        </div>
      </div>
    </div>

    <!-- Rostro interactivo CSS -->
    <div class="distorsion-rostro-wrapper">
      <!--
        :style inyecta las custom properties CSS definidas en computed estilosRostro.
        Las propiedades --nariz, --ojos, --mandibula, --piel son consumidas
        por el CSS interno de .rostro__* con calc() y var().
      -->
      <div
        class="distorsion-rostro"
        :style="estilosRostro"
      >
        <div class="rostro__pelo" />
        <div class="rostro__cara" />
        <div class="rostro__ceja rostro__ceja--izq" />
        <div class="rostro__ceja rostro__ceja--der" />
        <div class="rostro__ojo rostro__ojo--izq" />
        <div class="rostro__ojo rostro__ojo--der" />
        <div class="rostro__nariz" />
        <div class="rostro__labios" />
      </div>

      <!-- Muestra del color de piel actual -->
      <div class="distorsion-piel-muestra">
        <div
          class="distorsion-piel-muestra__color"
          :style="{ background: colorPiel }"
        />
        <div class="distorsion-piel-muestra__info">
          <span class="distorsion-piel-muestra__label">Tono de piel</span>
          <span class="distorsion-piel-muestra__valor">{{ colorPielHex }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
