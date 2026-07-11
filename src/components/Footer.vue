<script setup>
import { reactive, ref, onMounted, onBeforeUnmount, nextTick } from 'vue';
import './Footer.css';

/* ---------------------------------------------------------------------------
   STICKERS — editá acá el contenido. Cada objeto es un sticker de la bandeja.
   - label / sub / glyph: lo que se ve en el sticker.
   - color / ink: el "pop of color" del sticker y el color de su texto.
   - ax / ay: posición inicial como fracción (0–1) del alto/ancho de la bandeja,
     así entran bien en cualquier tamaño de pantalla. rot: inclinación en grados.
   x / y / z se calculan solos (posición en px y orden de apilado).
--------------------------------------------------------------------------- */
const stickers = reactive([
  { label: 'VUE', sub: 'reactivo', glyph: '△', color: '#42D392', ink: '#06281B', ax: 0.02, ay: 0.06, rot: -8, x: 0, y: 0, z: 1 },
  { label: 'UMAI', sub: "'26", glyph: '★', color: '#7C5CFF', ink: '#F4EEFF', ax: 0.55, ay: 0.05, rot: 6, x: 0, y: 0, z: 2 },
  { label: 'MCR®', sub: 'a mano', glyph: '✳', color: '#FF6B5C', ink: '#300A06', ax: 0.33, ay: 0.50, rot: -4, x: 0, y: 0, z: 3 },
  { label: 'CSS', sub: 'puro', glyph: '{ }', color: '#56D8FF', ink: '#052733', ax: 0.03, ay: 0.62, rot: 10, x: 0, y: 0, z: 4 },
  { label: 'HELLO', sub: 'contactame', glyph: '✌', color: '#FFD84D', ink: '#2E2600', ax: 0.85, ay: 0.55, rot: -12, x: 0, y: 0, z: 5 },
]);

const trayEl = ref(null);
const activo = ref(null); // sticker que se está arrastrando
let topZ = stickers.length; // el más alto queda al frente al agarrarlo

// Estado del arrastre en curso (no necesita ser reactivo: no se renderiza)
let startPX = 0, startPY = 0, startSX = 0, startSY = 0, maxX = 0, maxY = 0;

const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

/* Reparte los stickers dentro de la bandeja según sus anclas ax/ay.
   Se llama al montar (cuando la bandeja ya tiene tamaño real) y al redimensionar. */
function acomodar() {
  const tray = trayEl.value;
  if (!tray) return;
  const pad = 16;
  const nodos = tray.querySelectorAll('.sticker');
  stickers.forEach((s, i) => {
    const size = nodos[i]?.offsetWidth || 120;
    s.x = clamp(s.ax * (tray.clientWidth - size), pad, tray.clientWidth - size - pad);
    s.y = clamp(s.ay * (tray.clientHeight - size), pad, tray.clientHeight - size - pad);
  });
}

// Al redimensionar, reencerramos cada sticker en los nuevos límites (sin reordenarlos)
function reencuadrar() {
  const tray = trayEl.value;
  if (!tray) return;
  const nodos = tray.querySelectorAll('.sticker');
  stickers.forEach((s, i) => {
    const size = nodos[i]?.offsetWidth || 120;
    s.x = clamp(s.x, 0, tray.clientWidth - size);
    s.y = clamp(s.y, 0, tray.clientHeight - size);
  });
}

function agarrar(e, s) {
  activo.value = s;
  s.z = ++topZ; // traer al frente
  startPX = e.clientX;
  startPY = e.clientY;
  startSX = s.x;
  startSY = s.y;
  const size = e.currentTarget.offsetWidth;
  maxX = trayEl.value.clientWidth - size;
  maxY = trayEl.value.clientHeight - size;
  // pointer capture: aunque el cursor salga del sticker, los eventos siguen llegando acá
  e.currentTarget.setPointerCapture?.(e.pointerId);
}

function mover(e, s) {
  if (activo.value !== s) return;
  s.x = clamp(startSX + (e.clientX - startPX), 0, maxX);
  s.y = clamp(startSY + (e.clientY - startPY), 0, maxY);
}

function soltar(e, s) {
  if (activo.value !== s) return;
  activo.value = null;
  e.currentTarget.releasePointerCapture?.(e.pointerId);
}

// Accesibilidad: con foco en un sticker, las flechas lo empujan (Shift = más lejos)
function empujar(e, s) {
  const paso = e.shiftKey ? 24 : 8;
  const delta = {
    ArrowLeft: [-paso, 0], ArrowRight: [paso, 0],
    ArrowUp: [0, -paso], ArrowDown: [0, paso],
  }[e.key];
  if (!delta) return;
  e.preventDefault();
  const size = e.currentTarget.offsetWidth;
  s.z = ++topZ;
  s.x = clamp(s.x + delta[0], 0, trayEl.value.clientWidth - size);
  s.y = clamp(s.y + delta[1], 0, trayEl.value.clientHeight - size);
}

onMounted(async () => {
  await nextTick(); // esperar a que la bandeja tenga tamaño antes de acomodar
  acomodar();
  window.addEventListener('resize', reencuadrar);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', reencuadrar);
});
</script>

<template>
  <footer class="footer">
    <div class="footer__inner">
      <!-- Bloque de contacto -->
      <div class="footer__contact">
        <p class="footer__kicker">
          © 2026 — MCR®
        </p>
        <h2 class="footer__title">
          Pongámonos<br>en contacto
        </h2>

        <a
          class="footer__email"
          href="mailto:hola@miacarini.com"
        >
          hola@miacarini.com
        </a>

        <ul class="footer__socials">
          <li>
            <a
              href="#"
              aria-label="Instagram"
              class="footer__social"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <rect
                  x="3"
                  y="3"
                  width="18"
                  height="18"
                  rx="5"
                />
                <circle
                  cx="12"
                  cy="12"
                  r="4"
                />
                <circle
                  cx="17"
                  cy="7"
                  r="1.3"
                  fill="currentColor"
                  stroke="none"
                />
              </svg>
            </a>
          </li>
          <li>
            <a
              href="#"
              aria-label="LinkedIn"
              class="footer__social"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
              >
                <path d="M5 9v10" />
                <circle
                  cx="5"
                  cy="5"
                  r="1.3"
                  fill="currentColor"
                  stroke="none"
                />
                <path d="M10 19v-6a3 3 0 0 1 6 0v6" />
                <path d="M10 13v6" />
              </svg>
            </a>
          </li>
          <li>
            <a
              href="#"
              aria-label="GitHub"
              class="footer__social"
            >
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49 0-.24-.01-.87-.01-1.71-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.49-1.11-1.49-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05a9.36 9.36 0 0 1 5 0c1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.81-4.57 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.6.69.49A10.26 10.26 0 0 0 22 12.25C22 6.58 17.52 2 12 2z" />
              </svg>
            </a>
          </li>
        </ul>

        <p class="footer__hint">
          <span aria-hidden="true">✦</span> Arrastrá los stickers por la bandeja
        </p>
      </div>

      <!-- Bandeja con stickers arrastrables -->
      <div
        ref="trayEl"
        class="footer__tray"
      >
        <span
          class="footer__tray-label"
          aria-hidden="true"
        >MCR® STICKER CLUB</span>
        <button
          v-for="(s, i) in stickers"
          :key="i"
          type="button"
          class="sticker"
          :style="{ transform: `translate(${s.x}px, ${s.y}px)`, zIndex: s.z }"
          :aria-label="`Sticker ${s.label}. Arrastrá o usá las flechas para moverlo.`"
          @pointerdown="agarrar($event, s)"
          @pointermove="mover($event, s)"
          @pointerup="soltar($event, s)"
          @pointercancel="soltar($event, s)"
          @keydown="empujar($event, s)"
        >
          <span
            class="sticker__body"
            :class="{ 'is-grabbed': activo === s }"
            :style="{ '--c': s.color, '--ink': s.ink, '--rot': `${s.rot}deg` }"
          >
            <span
              class="sticker__glyph"
              aria-hidden="true"
            >{{ s.glyph }}</span>
            <span class="sticker__label">{{ s.label }}</span>
            <span class="sticker__sub">{{ s.sub }}</span>
          </span>
        </button>
      </div>
    </div>

    <div class="footer__meta">
      <p>UMAI — Tecnología Multimedial</p>
      <p>Programación Multimedial III · 2026</p>
      <p>Vue 3 + Vite + CSS puro · sin frameworks, sin plantillas, sin imágenes</p>
    </div>
  </footer>
</template>
