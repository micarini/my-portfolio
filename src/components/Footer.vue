<script setup>
import { reactive, ref, onMounted, onBeforeUnmount, nextTick } from 'vue';

import mangoImg      from '../assets/mango-sticker 1.png';
import starImg       from '../assets/star-sticker 1.png';
import bananaImg     from '../assets/banana-sticker.png';
import catImg        from '../assets/cat-sticker.png';
import orangeImg     from '../assets/orange-sticker 1.png';
import luckyImg      from '../assets/lucky-sticker 1.png';
import startImg      from '../assets/start-sticker.png';
import cocaImg       from '../assets/coca-sticker 1.png';
import mirrorballImg from '../assets/mirrorball-sticker.png';

/*
  ax/ay = fracción del espacio disponible (0–1) para la posición inicial.
  w     = ancho del sticker en px (height se calcula sola por aspect-ratio).
  rot   = inclinación en grados.
*/
const stickers = reactive([
  { img: mangoImg,      alt: 'sticker mango',          ax: 0.02, ay: 0.80, rot: -5,  w: 160, x: 0, y: 0, z: 1 },
  { img: starImg,       alt: 'sticker estrella',        ax: 0.14, ay: 0.70, rot:  4,  w: 170, x: 0, y: 0, z: 2 },
  { img: bananaImg,     alt: 'sticker caught flippin',  ax: 0.26, ay: 0.90, rot: -3,  w: 142, x: 0, y: 0, z: 3 },
  { img: catImg,        alt: 'sticker cool zone',       ax: 0.37, ay: 0.72, rot:  7,  w: 122, x: 0, y: 0, z: 4 },
  { img: orangeImg,     alt: 'sticker naranja',         ax: 0.48, ay: 0.93, rot: -8,  w: 142, x: 0, y: 0, z: 5 },
  { img: mirrorballImg, alt: 'sticker mirrorball',      ax: 0.55, ay: 0.75, rot:  5,  w: 158, x: 0, y: 0, z: 6 },
  { img: startImg,      alt: 'sticker stop',            ax: 0.69, ay: 0.78, rot: -10, w: 130, x: 0, y: 0, z: 7 },
  { img: cocaImg,       alt: 'sticker coca-cola',       ax: 0.80, ay: 0.70, rot:  8,  w: 144, x: 0, y: 0, z: 8 },
  { img: luckyImg,      alt: 'sticker lucky mindset',   ax: 0.95, ay: 0.86, rot: -4,  w: 136, x: 0, y: 0, z: 9 },
]);

const mobileVisibleStickerIndices = [1, 5, 6];

function esStickerVisibleEnMobile(indice) {
  return mobileVisibleStickerIndices.includes(indice);
}

const zoneEl = ref(null);
const activo = ref(null);
let topZ = stickers.length;
let startPX = 0, startPY = 0, startSX = 0, startSY = 0, maxX = 0, maxY = 0;

const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);

function acomodar() {
  const zone = zoneEl.value;
  if (!zone) return;
  const nodos = zone.querySelectorAll('.sticker');
  stickers.forEach((s, i) => {
    const w = s.w;
    const h = nodos[i]?.offsetHeight || w;
    s.x = clamp(s.ax * (zone.clientWidth  - w), 0, zone.clientWidth  - w);
    s.y = clamp(s.ay * (zone.clientHeight - h), 0, zone.clientHeight - h);
  });
}

function reencuadrar() {
  const zone = zoneEl.value;
  if (!zone) return;
  const nodos = zone.querySelectorAll('.sticker');
  stickers.forEach((s, i) => {
    const w = s.w;
    const h = nodos[i]?.offsetHeight || w;
    s.x = clamp(s.x, 0, zone.clientWidth  - w);
    s.y = clamp(s.y, 0, zone.clientHeight - h);
  });
}

function agarrar(e, s) {
  activo.value = s;
  s.z = ++topZ;
  startPX = e.clientX; startPY = e.clientY;
  startSX = s.x;       startSY = s.y;
  const el = e.currentTarget;
  maxX = zoneEl.value.clientWidth  - el.offsetWidth;
  maxY = zoneEl.value.clientHeight - el.offsetHeight;
  el.setPointerCapture?.(e.pointerId);
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

function empujar(e, s) {
  const paso = e.shiftKey ? 24 : 8;
  const delta = { ArrowLeft: [-paso, 0], ArrowRight: [paso, 0], ArrowUp: [0, -paso], ArrowDown: [0, paso] }[e.key];
  if (!delta) return;
  e.preventDefault();
  const el = e.currentTarget;
  s.z = ++topZ;
  s.x = clamp(s.x + delta[0], 0, zoneEl.value.clientWidth  - el.offsetWidth);
  s.y = clamp(s.y + delta[1], 0, zoneEl.value.clientHeight - el.offsetHeight);
}

function scrollTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

onMounted(async () => {
  await nextTick();
  acomodar();
  window.addEventListener('resize', reencuadrar);
  window.addEventListener('load', acomodar);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', reencuadrar);
  window.removeEventListener('load', acomodar);
});
</script>

<template>
  <footer class="footer">
    <div ref="zoneEl" class="footer__inner">

      <h2 class="footer__heading">LEt'S talk</h2>

      <div class="footer__row">
        <div class="footer__contact">
          <p class="footer__kicker">ESCRIBIME</p>
          <a class="footer__email" href="mailto:miacarinirojo@gmail.com">
            miacarinirojo@gmail.com
          </a>
          <p class="footer__bio">
            Disponible para proyectos freelance y<br>
            colaboraciones a partir de septiembre 2026.
          </p>
        </div>

        <ul class="footer__socials">
          <li class="footer__social-item">
            <a
              href="https://www.instagram.com/mc_______studio/"
              class="footer__social-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span class="footer__social-name">INSTAGRAM</span>
              <span class="footer__social-handle">@MC_______STUDIO ↗</span>
            </a>
          </li>
          <li class="footer__social-item">
            <a
              href="https://www.behance.net/miacarinirojo"
              class="footer__social-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span class="footer__social-name">BEHANCE</span>
              <span class="footer__social-handle">BEHANCE.NET/MIACARINIROJO ↗</span>
            </a>
          </li>
          <li class="footer__social-item">
            <a
              href="https://www.linkedin.com/in/mia-carini-rojo/"
              class="footer__social-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span class="footer__social-name">LINKEDIN</span>
              <span class="footer__social-handle">IN/MIA-CARINI-ROJO ↗</span>
            </a>
          </li>
          <li class="footer__social-item">
            <a
              href="https://github.com/micarini"
              class="footer__social-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span class="footer__social-name">GITHUB</span>
              <span class="footer__social-handle">GITHUB.COM/MICARINI ↗</span>
            </a>
          </li>
        </ul>
      </div>

      <button
        v-for="(s, i) in stickers"
        :key="i"
        type="button"
        class="sticker"
        :class="{
          'sticker--grabbed': activo === s,
          'sticker--mobile-hidden': !esStickerVisibleEnMobile(i),
        }"
        :style="{
          '--sticker-left': s.x + 'px',
          '--sticker-top': s.y + 'px',
          zIndex:  s.z,
          width:   s.w + 'px',
          '--rot': s.rot + 'deg',
        }"
        aria-label="Sticker. Arrastralo o usá las flechas para moverlo."
        @pointerdown="agarrar($event, s)"
        @pointermove="mover($event, s)"
        @pointerup="soltar($event, s)"
        @pointercancel="soltar($event, s)"
        @keydown="empujar($event, s)"
      >
        <img
          :src="s.img"
          :alt="s.alt"
          class="sticker__img"
          draggable="false"
        />
      </button>

    </div>

    <div class="footer__meta">
      <span>MIA CARINI ROJO © 2026</span>
      <button
        type="button"
        class="footer__top"
        aria-label="Volver arriba"
        title="Volver arriba"
        @click="scrollTop"
      >
        <span class="footer__top-arrow" aria-hidden="true"></span>
      </button>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background: #0a0a0a;
  color: #e2e4eb;
  border-top: 1px solid rgba(217, 222, 236, 0.12);
  margin-top: var(--space-5);
}

.footer__inner {
  position: relative;
  overflow: hidden;
  max-width: var(--max-width);
  margin-inline: auto;
  padding: var(--space-5) var(--space-3) 280px;
}

.footer__heading {
  font-family: 'Barlow', sans-serif;
  font-weight: 900;
  text-transform: none; /* el reset global fuerza uppercase en h2 */
  font-size: clamp(3.5rem, 12vw, 9.5rem);
  line-height: 0.9;
  letter-spacing: -0.02em;
  color: #f7f8fc;
  margin-bottom: var(--space-4);
}

.footer__row {
  display: grid;
  grid-template-columns: 1fr 1.4fr;
  gap: var(--space-4);
}

.footer__kicker {
  font-family: var(--font-mono);
  font-size: var(--text-micro);
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: rgba(153, 158, 171, 0.6);
  margin-bottom: var(--space-2);
}

.footer__email {
  display: block;
  font-family: var(--font-mono);
  font-size: clamp(0.9rem, 2vw, 1.25rem);
  text-decoration: none;
  color: #f7f8fc;
  margin-bottom: var(--space-2);
  transition: opacity 180ms var(--ease-out-expo);
}

.footer__email:hover { opacity: 0.6; }

.footer__bio {
  font-family: var(--font-mono);
  font-size: var(--text-small);
  line-height: 1.7;
  color: rgba(159, 164, 178, 0.75);
}

.footer__socials {
  list-style: none;
  align-self: end;
}

.footer__social-item {
  border-top: 1px solid rgba(217, 222, 236, 0.15);
}

.footer__social-item:last-child {
  border-bottom: 1px solid rgba(217, 222, 236, 0.15);
}

.footer__social-link {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-2) 0;
  text-decoration: none;
  color: #e2e4eb;
  transition: opacity 180ms var(--ease-out-expo);
}

.footer__social-link:hover { opacity: 0.6; }

.footer__social-name,
.footer__social-handle {
  font-family: var(--font-mono);
  font-size: var(--text-small);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.footer__social-handle { color: rgba(159, 164, 178, 0.75); }

/* Stickers */

.sticker {
  position: absolute;
  left: var(--sticker-left, 0);
  top: calc(var(--sticker-top, 0) + var(--sticker-mobile-offset, 0px));
  padding: 0;
  border: none;
  background: none;
  cursor: grab;
  touch-action: none;
  user-select: none;
}

.sticker:active,
.sticker--grabbed { cursor: grabbing; }

.sticker:focus-visible {
  outline: 3px solid var(--color-primary);
  outline-offset: 4px;
  border-radius: 4px;
}

.sticker__img {
  width: 100%;
  height: auto;
  display: block;
  transform: rotate(var(--rot, 0deg));
  filter: drop-shadow(0 4px 16px rgba(0, 0, 0, 0.55));
  transition: transform 220ms var(--ease-out-expo), filter 220ms var(--ease-out-expo);
  pointer-events: none;
}

.sticker:hover .sticker__img {
  transform: rotate(var(--rot, 0deg)) scale(1.05);
  filter: drop-shadow(0 14px 26px rgba(0, 0, 0, 0.65));
}

.sticker--grabbed .sticker__img {
  transform: rotate(var(--rot, 0deg)) scale(1.1);
  filter: drop-shadow(0 26px 42px rgba(0, 0, 0, 0.75));
}

/* Barra inferior */

.footer__meta {
  max-width: var(--max-width);
  margin-inline: auto;
  padding: var(--space-3);
  border-top: 1px solid rgba(217, 222, 236, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: var(--font-mono);
  font-size: var(--text-micro);
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: rgba(141, 146, 159, 0.6);
}

/*
  Botón scroll-to-top:
  - underline que se dibuja de derecha→izquierda en rest y left→right en hover
  - flecha animada con swap: la visible sale por arriba, entra una desde abajo
*/
.footer__top {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.12);
  cursor: pointer;
  font-family: var(--font-mono);
  font-size: 1rem;
  line-height: 1;
  width: 2rem;
  height: 2rem;
  border-radius: 999px;
  color: #ffffff;
  padding: 0;
  transition:
    color 200ms var(--ease-out-expo),
    transform 200ms var(--ease-out-expo),
    background-color 200ms var(--ease-out-expo),
    border-color 200ms var(--ease-out-expo);
}

.footer__top:hover {
  color: var(--color-primary);
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(111, 185, 228, 0.32);
  transform: translateY(-1px);
}

.footer__top-arrow {
  display: inline-block;
  width: 1em;
  height: 1em;
  position: relative;
}

.footer__top-arrow::before {
  content: '↑';
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  font-size: 1.05rem;
  font-weight: 700;
  line-height: 1;
}

@media (max-width: 720px) {
  .footer__inner { padding-bottom: 120px; }
  .footer__row { grid-template-columns: 1fr; gap: var(--space-3); }

  .sticker--mobile-hidden {
    display: none;
  }

  .sticker:not(.sticker--mobile-hidden) {
    --sticker-mobile-offset: 150px;
  }

  .footer__meta {
    align-items: center;
  }

  .footer__top {
    width: 2.25rem;
    height: 2.25rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .sticker__img,
  .footer__social-link,
  .footer__email,
  .footer__top,
  .footer__top-arrow,
  .footer__top-arrow::before {
    transition: none;
  }

  .sticker:hover .sticker__img,
  .sticker--grabbed .sticker__img {
    transform: rotate(var(--rot, 0deg));
  }
}
</style>
