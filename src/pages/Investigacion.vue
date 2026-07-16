<script setup>
import SeccionReactividad from '../components/investigacion/SeccionReactividad.vue'
import SeccionComputed from '../components/investigacion/SeccionComputed.vue'
import SeccionVModel from '../components/investigacion/SeccionVModel.vue'
import SeccionCicloVida from '../components/investigacion/SeccionCicloVida.vue'
</script>

<template>
  <header class="inv-header">
    <div class="container">
      <div class="inv-header-inner">
        <div class="inv-titulo-giant">
          <span class="inv-titulo-line1">El interior</span>
          <span class="inv-titulo-line2">de Vue</span>
        </div>

        <p class="inv-bajada">
          Anatomía de un framework reactivo. 
        </p>
      </div>
    </div>
  </header>

  <section class="inv-intro">
    <div class="container">
      <div class="inv-intro-grid">
        <p class="inv-intro-text">
          Vue es un framework frontend, funciona como una capa sobre JavaScript que da estructura para hacer interfaces. Nos permite crear aplicaciones de forma rápida, agradable, sencilla y muy práctica.
        </p>
        <p class="inv-intro-text">
          Lo más interesante pasa debajo de todo: Proxies de JavaScript que
          interceptan lecturas y escrituras del estado. Un Proxy es un envoltorio (wrapper) alrededor de un objeto que redirige las operaciones en el hacia el objeto, Cuando algo lee un
          valor, Vue lo registra. Cuando ese valor cambia, avisa exactamente
          a quienes lo usaban. 
        </p>
      </div>
    </div>
  </section>

  <SeccionReactividad />
  <SeccionComputed />
  <SeccionVModel />
  <SeccionCicloVida />

  <footer class="inv-biblio">
    <div class="container">
      <p class="inv-biblio-titulo">
        — BIBLIOGRAFÍA / REFERENCIAS
      </p>
      <ol class="inv-biblio-lista">
        <li>
          <span>
            Vue.js Core Team. <em>Reactivity in Depth.</em>
            Documentación oficial de Vue 3.
            [https://vuejs.org/guide/extras/reactivity-in-depth]
          </span>
        </li>
        <li>
          <span>
            Vue.js Core Team. <em>Computed Properties.</em>
            Documentación oficial de Vue 3.
            [https://vuejs.org/guide/essentials/computed]
          </span>
        </li>
        <li>
          <span>
            Vue.js Core Team. <em>Lifecycle Hooks.</em>
            Documentación oficial de Vue 3.
            [https://vuejs.org/guide/essentials/lifecycle]
          </span>
        </li>
        <li>
          <span>
            You, E. <em>Blog de Evan You.</em> Notas de diseño del framework
            y anuncios de releases de Vue. [https://blog.evanyou.me]
          </span>
        </li>
        <li>
          <span>
            Comeau, J. W. <em>joshwcomeau.com.</em> Referencia metodológica
            de este ensayo: explicaciones interactivas donde el lector
            manipula widgets y entiende el concepto de forma empírica antes
            de leer la teoría. Inspiración pedagógica, no fuente sobre Vue.
          </span>
        </li>
        <li>
          <span>
            Moure, M. <em>¿Qué es Vue.js?</em> lenguajejs.com — introducción
            al framework: qué es, para qué sirve y cómo se integra con el
            ecosistema JavaScript moderno.
            [https://lenguajejs.com/vuejs/introduccion/que-es-vue/]
          </span>
        </li>
      </ol>
    </div>
  </footer>
</template>

<style scoped>
.inv-header {
  padding-top: var(--space-5);
  padding-bottom: var(--space-5);
  border-bottom: var(--border-heavy);
  background: var(--color-ink);
}

.inv-header-inner {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.inv-header-meta {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-1);
}

.inv-titulo-giant {
  display: flex;
  flex-direction: column;
  gap: 0;
  line-height: 0.9;
}

.inv-titulo-line1 {
  font-family: 'Bodoni Moda', serif;
  font-weight: 300;
  font-style: italic;
  font-size: clamp(2rem, 4.5vw, 3.5rem);
  letter-spacing: 0.01em;
  color: var(--color-paper-dark);
  display: block;
}

.inv-titulo-line2 {
  font-family: 'Bodoni Moda', serif;
  font-weight: 900;
  font-size: var(--text-giant);
  letter-spacing: -0.03em;
  color: var(--color-paper);
  display: block;
  line-height: 0.85;
}
.inv-bajada-grid {
  display: grid;
  grid-template-columns: 1.6fr 1fr;
  gap: var(--space-4);
  align-items: start;
  margin-top: var(--space-2);
}

.inv-bajada {
  font-family: 'DM Sans', sans-serif;
  font-size: clamp(1.1rem, 2.2vw, 1.5rem);
  line-height: 1.45;
  letter-spacing: -0.01em;
  max-width: 56ch;
}

.inv-bajada-datos {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  border-left: var(--border-heavy);
  padding-left: var(--space-3);
}

.inv-dato {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.inv-dato strong {
  font-family: var(--font-display);
  font-size: var(--text-h2);
  line-height: 1;
  color: var(--color-orange);
}

.inv-dato small {
  font-family: var(--font-mono);
  font-size: var(--text-micro);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-paper-dark);
  line-height: 1.4;
}

.inv-intro {
  padding: var(--space-5) 0;
  background: var(--color-paper);
}

.inv-intro-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-4);
}

.inv-intro-text {
  font-family: 'DM Sans', sans-serif;
  font-size: 1.1rem;
  line-height: 1.7;
  color: var(--color-sepia);
}

.inv-intro-text em {
  color: var(--color-electric);
  font-style: normal;
}

</style>

<style>
.inv-seccion {
  padding: var(--space-5) 0;
  border-bottom: var(--border-thick);
}

.inv-seccion-grid {
  display: grid;
  grid-template-columns: 100px 1fr;
  gap: var(--space-4);
  align-items: start;
}

.inv-seccion-num {
  font-family: 'Barlow', sans-serif;
  font-weight: 900;
  font-size: clamp(5rem, 8vw, 7rem);
  line-height: 0.85;
  color: transparent;
  -webkit-text-stroke: 3px var(--color-paper);
  letter-spacing: -0.04em;
  align-self: start;
  user-select: none;
}

.inv-seccion-contenido {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.inv-seccion-header {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  border-bottom: var(--border-thick);
  padding-bottom: var(--space-3);
}

.inv-seccion-titulo {
  font-family: 'Syne', sans-serif;
  font-weight: 700;
  font-size: var(--text-h1);
  text-transform: uppercase;
  letter-spacing: -0.03em;
  line-height: 0.9;
}

.inv-seccion-subtitulo {
  font-family: var(--font-mono);
  font-size: var(--text-small);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--color-paper-dark);
  margin-top: var(--space-1);
}

.inv-texto-col {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.inv-texto-col p {
  font-family: 'DM Sans', sans-serif;
  font-size: 1.05rem;
  line-height: 1.75;
}

.inv-texto-col code {
  font-family: var(--font-mono);
  font-size: 0.84em;
  background: #141521;
  border-radius: 3px;
  padding: 0.1em 0.45em;
  color: #d9deec;
}

.inv-dato-destacado {
  display: flex;
  gap: var(--space-3);
  align-items: baseline;
  padding: var(--space-2) var(--space-3);
  border: 2px solid var(--color-paper);
  border-radius: 8px;
  background: var(--color-paper);
  color: var(--color-ink);
  margin: var(--space-1) 0;
}

.inv-dato-num {
  font-family: var(--font-display);
  font-size: var(--text-h1);
  line-height: 1;
  color: var(--color-orange);
  white-space: nowrap;
  flex-shrink: 0;
}

.inv-dato-desc {
  font-family: 'DM Sans', sans-serif;
  font-size: var(--text-small);
  line-height: 1.55;
  color: var(--color-sepia);
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.inv-dato-desc small {
  font-family: var(--font-mono);
  font-size: var(--text-micro);
  color: rgba(243, 236, 220, 0.5);
  letter-spacing: 0.08em;
}

.inv-demo-bloque {
  border: 1px solid rgba(193, 196, 203, 0.3);
  border-radius: 10px;
  overflow: hidden;
  background: var(--color-ink);
}

.inv-demo-etiqueta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-1) var(--space-2);
  background: #1A1F23;
  color: var(--color-paper);
  font-family: var(--font-mono);
  font-size: var(--text-micro);
  text-transform: uppercase;
  letter-spacing: 0.12em;
}

.inv-demo-etiqueta span:last-child {
  color: var(--color-orange);
}

.inv-demo-playground {
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 220px;
}

.inv-panel {
  display: flex;
  flex-direction: column;
}

.inv-panel::before {
  display: block;
  font-family: var(--font-mono);
  font-size: 0.62rem;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  padding: 0.7rem var(--space-3);
  border-bottom: 1px solid rgba(217, 222, 236, 0.1);
}

.inv-panel--izq {
  background: #000001;
  border-right: 1px solid rgba(217, 222, 236, 0.1);
}

.inv-panel--izq::before {
  content: 'CÓDIGO';
  background: #000000;
  color: #56585e;
}

.inv-panel--der {
  background: var(--color-ink);
}

.inv-panel--der::before {
  content: 'RESULTADO';
  background: #000000;
  color: #56585e;
}

.inv-demo-codigo {
  flex: 1;
  font-family: var(--font-mono);
  font-size: 0.78rem;
  line-height: 1.85;
  color: #adb1bb;
  padding: var(--space-3);
  overflow-x: auto;
  overflow-y: auto;
  white-space: pre;
  margin: 0;
}

.inv-demo-resultado {
  flex: 1;
  padding: var(--space-3);
  overflow: auto;
}

.syntax-keyword   { color: #7195ff; }
.syntax-function  { color: #00d6ee; }
.syntax-string    { color: #61d46a; }
.syntax-number    { color: #f6b84d; }
.syntax-comment   { color: #616369; font-style: italic; }
.syntax-tag       { color: #ff578a; }
.syntax-attribute { color: #00c2f8; }

.btn-brutal {
  border-radius: 6px;
  border: 1.5px solid var(--color-paper);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
}

.btn-brutal:active {
  transform: none;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.15);
}

@media (max-width: 720px) {
  .inv-seccion-grid {
    grid-template-columns: 1fr;
    gap: var(--space-2);
  }

  .inv-seccion-num {
    font-size: clamp(3rem, 12vw, 5rem);
    position: static;
    border-bottom: var(--border-thick);
    padding-bottom: var(--space-1);
  }

  .inv-demo-playground {
    grid-template-columns: 1fr;
  }

  .inv-panel--izq {
    border-right: none;
    border-bottom: 1px solid rgba(217, 222, 236, 0.1);
  }

  .inv-dato-destacado {
    flex-direction: column;
    gap: var(--space-1);
  }
}

@media (max-width: 480px) {
  .inv-demo-codigo,
  .inv-demo-resultado {
    padding: var(--space-2) var(--space-1);
  }
}
</style>

<style scoped>
.inv-biblio {
  padding: var(--space-5) 0;
  border-top: var(--border-heavy);
  color: var(--color-paper);
}

.inv-biblio-titulo {
  font-family: 'Syne', sans-serif;
  font-weight: 700;
  font-size: var(--text-small);
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: var(--color-primary);
  margin-bottom: var(--space-4);
  padding-bottom: var(--space-2);
  border-bottom: 1px solid rgba(217, 222, 236, 0.12);
}

.inv-biblio-lista {
  list-style: none;
  counter-reset: biblio-counter;
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.inv-biblio-lista li {
  counter-increment: biblio-counter;
  display: grid;
  grid-template-columns: 40px 1fr;
  gap: var(--space-3);
  font-family: 'DM Sans', sans-serif;
  font-size: 0.95rem;
  line-height: 1.65;
  color: #abaeb4;
}

.inv-biblio-lista li::before {
  content: counter(biblio-counter, decimal-leading-zero);
  font-family: var(--font-mono);
  font-size: var(--text-small);
  font-weight: 700;
  color: var(--color-primary);
  letter-spacing: 0.05em;
  padding-top: 0.18rem;
}

.inv-biblio-lista em {
  font-style: italic;
  color: #e2e4eb;
}

@media (max-width: 720px) {
  .inv-titulo-line2 {
    -webkit-text-stroke: 2px var(--color-paper);
  }

  .inv-intro-grid {
    grid-template-columns: 1fr;
    gap: var(--space-3);
  }

  .inv-biblio-lista li {
    grid-template-columns: 32px 1fr;
    gap: var(--space-2);
  }
}
</style>
