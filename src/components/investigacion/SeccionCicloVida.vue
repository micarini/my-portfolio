<script setup>
import DemoCicloVida from './DemoCicloVida.vue'
</script>

<template>
  <section class="inv-seccion">
    <div class="container">
      <div class="inv-seccion-grid">
        <div class="inv-seccion-num" aria-hidden="true">04</div>

        <div class="inv-seccion-contenido">
          <div class="inv-seccion-header">
            <span class="inv-seccion-subtitulo">Hooks, garantías y el momento del fetch</span>
            <h2 class="inv-seccion-titulo">
              El ciclo<br>de vida
            </h2>
          </div>

          <div class="inv-texto-col">
            <p>
              Apretá MONTAR COMPONENTE. El hijo que aparece reporta sus propios
              hooks con timestamps reales — no es una simulación. Después desmontalo
              y mirá los dos últimos.
            </p>
          </div>

          <div class="inv-demo-bloque">
            <div class="inv-demo-etiqueta">
              <span>DEMO — 04</span>
              <span>EL CICLO DE VIDA</span>
            </div>
            <div class="inv-demo-playground">
              <div class="inv-panel inv-panel--izq">
                <pre class="inv-demo-codigo"><span class="syntax-comment">// setup → onBeforeMount → onMounted</span>
<span class="syntax-comment">// onBeforeUnmount → onUnmounted</span>

<span class="syntax-function">onMounted</span>(<span class="syntax-keyword">async</span> () =&gt; {
  <span class="syntax-comment">// DOM garantizado: fetch seguro</span>
  datos.value = <span class="syntax-keyword">await</span> <span class="syntax-function">fetch</span>(<span class="syntax-string">'/api.json'</span>)
    .<span class="syntax-function">then</span>(r =&gt; r.<span class="syntax-function">json</span>())
})

<span class="syntax-function">onUnmounted</span>(() =&gt; {
  <span class="syntax-comment">// cleanup: timers, listeners, subs</span>
})</pre>
              </div>
              <div class="inv-panel inv-panel--der">
                <div class="inv-demo-resultado">
                  <DemoCicloVida />
                </div>
              </div>
            </div>
          </div>

          <div class="inv-texto-col">
            <p>
              La secuencia es siempre la misma: <code>setup</code> corre primero — los refs nacen, el DOM todavía no existe. <code>onBeforeMount</code> avisa que el montaje viene. <code>onMounted</code> garantiza que el DOM ya está en la página. Al final, <code>onBeforeUnmount</code> y <code>onUnmounted</code> son el momento para limpiar timers, listeners y suscripciones.
            </p>
            <p>
              El fetch va en <code>onMounted</code> porque es la primera garantía de que hay un DOM donde mostrar algo — el spinner necesita un elemento donde renderizarse. La demo usa <code>setTimeout</code> para simularlo, pero es el mismo patrón que usa la página Home de este portfolio: <code>fetch('/contenido.json')</code> real, con estado de carga y error.
            </p>
            <p>
              El hijo le reporta cada hook al padre con <code>emit('hook')</code> y el  padre pinta la línea de tiempo. Props bajan, eventos suben — el mismo modelo de las cuatro secciones.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
