<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import gsap from 'gsap';
// El ASCII se importa como texto crudo (Vite ?raw) para no romper los caracteres.
import handArt from '../assets/hand-ascii.txt?raw';

const emit = defineEmits(['entered']);

const rootEl = ref(null);
const handsEl = ref(null);
const folderEl = ref(null);

const lines = handArt.replace(/\n+$/, '').split('\n').map((l) => (l.length ? l : ' '));

let enterTl = null;      // timeline del zoom portal (pausado, se scrubea 0→1)
let ready = false;       // true cuando la mano terminó de dibujarse
let enteredOnce = false;
let open = false;        // true cuando Home queda libre (loader "abierto")

// --- Scrub suavizado ---
const scrub = { value: 0 }; // 0 = loader completo · 1 = entrado (Home libre)
let smooth = 0;
let rafId = null;
const THRESH = 1200;

function lock() { document.body.style.overflow = 'hidden'; }
function unlock() { document.body.style.overflow = ''; }

// Alterna entre "loader activo" (captura el scroll) y "Home libre".
function setOpen(v) {
  if (v === open) return;
  open = v;
  if (open) {
    unlock();
    rootEl.value.style.pointerEvents = 'none';
    if (!enteredOnce) { enteredOnce = true; emit('entered'); }
  } else {
    lock();
    rootEl.value.style.pointerEvents = '';
  }
}

function loop() {
  smooth += (scrub.value - smooth) * 0.12;
  const p = Math.min(Math.max(smooth, 0), 1);
  if (enterTl) enterTl.progress(p);

  if (smooth >= 0.999) { smooth = 1; enterTl.progress(1); setOpen(true); rafId = null; return; }
  if (smooth <= 0.001 && scrub.value <= 0) { smooth = 0; enterTl.progress(0); setOpen(false); rafId = null; return; }
  setOpen(false);
  rafId = requestAnimationFrame(loop);
}
function startLoop() { if (!rafId) rafId = requestAnimationFrame(loop); }
function nudge(px) {
  scrub.value = Math.min(Math.max(scrub.value + px / THRESH, 0), 1);
  startLoop();
}

// --- Interacción (scroll-jack reversible) ---
let touchY = 0;
function onWheel(e) {
  if (!ready) return;
  if (open) {
    // Home libre: sólo re-enganchar el loader si estás arriba de todo y scrolleás hacia arriba.
    if (window.scrollY <= 0 && e.deltaY < 0) { e.preventDefault(); nudge(e.deltaY); }
    return; // si no, scroll normal de la página
  }
  e.preventDefault();
  nudge(e.deltaY);
}
function onTouchStart(e) { touchY = e.touches[0].clientY; }
function onTouchMove(e) {
  if (!ready) return;
  const y = e.touches[0].clientY;
  const dy = touchY - y;
  touchY = y;
  if (open) {
    if (window.scrollY <= 0 && dy < 0) { e.preventDefault(); nudge(dy); }
    return;
  }
  e.preventDefault();
  nudge(dy);
}
// Click en la carpeta → entra automáticamente.
function enterNow() {
  gsap.to(scrub, { value: 1, duration: 1.1, ease: 'power3.inOut', onUpdate: startLoop });
}

function attach() {
  window.addEventListener('wheel', onWheel, { passive: false });
  window.addEventListener('touchstart', onTouchStart, { passive: true });
  window.addEventListener('touchmove', onTouchMove, { passive: false });
}
function cleanup() {
  window.removeEventListener('wheel', onWheel);
  window.removeEventListener('touchstart', onTouchStart);
  window.removeEventListener('touchmove', onTouchMove);
  if (rafId) cancelAnimationFrame(rafId);
}

onMounted(() => {
  lock();
  const lineEls = handsEl.value.querySelectorAll('.loader__line');

  // Fase 1: la mano se "compila" línea por línea.
  const intro = gsap.timeline();
  intro.to(lineEls, { opacity: 1, clipPath: 'inset(0 0% 0 0)', duration: 0.05, stagger: 0.026, ease: 'none' });
  // Fase 2: la carpeta aparece en el hueco central.
  intro.fromTo(
    folderEl.value,
    { opacity: 0, scale: 0.5, y: 14 },
    { opacity: 1, scale: 1, y: 0, duration: 0.55, ease: 'back.out(1.7)' },
    '+=0.15',
  );
  intro.to('.loader__label', { opacity: 1, duration: 0.4 }, '<');
  intro.add(() => {
    ready = true;
    // Fase 3: timeline del zoom (reversible). Se scrubea con la rueda / touch.
    enterTl = gsap.timeline({ paused: true });
    enterTl
      .to(handsEl.value, { opacity: 0, duration: 0.4, ease: 'power2.in' }, 0)
      .to('.loader__label', { opacity: 0, duration: 0.25 }, 0)
      .to(folderEl.value, { scale: 62, duration: 1, ease: 'power3.in' }, 0)
      .to(rootEl.value, { opacity: 0, duration: 0.35, ease: 'power2.in' }, 0.7);
    attach();
  });
});

onBeforeUnmount(() => {
  cleanup();
  unlock();
});
</script>

<template>
  <div
    ref="rootEl"
    class="loader"
    role="dialog"
    aria-label="Intro del portfolio"
  >
    <pre
      ref="handsEl"
      class="loader__hands"
      aria-hidden="true"
    ><span
      v-for="(l, i) in lines"
      :key="i"
      class="loader__line"
    >{{ l }}
</span></pre>

    <div class="loader__center">
      <button
        ref="folderEl"
        type="button"
        class="loader__folder"
        aria-label="Entrar a proyectos"
        @click="enterNow"
      >
        <span class="folder">
          <span class="folder__tab" />
          <span class="folder__back" />
          <span class="folder__paper" />
          <span class="folder__front" />
        </span>
      </button>
      <span class="loader__label">projects</span>
    </div>
  </div>
</template>

<style scoped>
.loader {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: #000;
  overflow: hidden;
  display: grid;
  place-items: center;
  will-change: opacity;
}

/* --- Mano ASCII --- */
.loader__hands {
  margin: 0;
  font-family: 'Martian Mono', monospace;
  font-size: clamp(3px, 0.82vw, 9px);
  line-height: 1;
  letter-spacing: 0;
  color: #fff;
  white-space: pre;
  user-select: none;
  -webkit-mask-image: radial-gradient(108% 66% at 50% 50%, #000 40%, transparent 92%);
  mask-image: radial-gradient(108% 66% at 50% 50%, #000 40%, transparent 92%);
}

.loader__line {
  display: block;
  opacity: 0;
  clip-path: inset(0 100% 0 0);
  will-change: clip-path, opacity;
}

.loader__center {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.55rem;
  pointer-events: none;
}

.loader__folder {
  pointer-events: auto;
  background: none;
  border: 0;
  padding: 0;
  cursor: pointer;
  transform-origin: center center;
  will-change: transform;
}

.folder {
  position: relative;
  display: block;
  width: 150px;
  height: 116px;
}

/* pestaña superior izquierda */
.folder__tab {
  position: absolute;
  top: 0;
  left: 0;
  width: 50px;
  height: 20px;
  background: #6fb9e4;
  border-radius: 6px 5px 0 0;
}

/* panel trasero azul */
.folder__back {
  position: absolute;
  left: 0;
  right: 0;
  top: 10px;
  bottom: 0;
  background: #6fb9e4;
  border-radius: 8px;
}

/* papel blanco asomando entre el fondo y el frente */
.folder__paper {
  position: absolute;
  left: 5px;
  right: 5px;
  top: 18px;
  bottom: 9px;
  background: #f5f8fa;
  border-radius: 8px;
  box-shadow: 0 -1px 2px rgba(0, 0, 0, 0.06);
}

/* frente azul, con degradé suave */
.folder__front {
  position: absolute;
  left: 0;
  right: 0;
  top: 25px;
  bottom: 0;
  background: linear-gradient(#a4d9f6 0%, #7cc4ef 58%, #62b6ea 100%);
  border-radius: 10px;
  box-shadow: inset 0 2px 1px rgba(255, 255, 255, 0.55);
}

/* Label "projects"  */
.loader__label {
  opacity: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text',
    'Helvetica Neue', Arial, sans-serif;
  font-size: 0.82rem;
  font-weight: 500;
  letter-spacing: 0;
  color: #fff;
}
</style>
