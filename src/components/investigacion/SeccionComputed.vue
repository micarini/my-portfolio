<script setup>
import DemoComputed from './DemoComputed.vue'
</script>

<template>
  <section class="inv-seccion">
    <div class="container">
      <div class="inv-seccion-grid">
        <div class="inv-seccion-num" aria-hidden="true">02</div>

        <div class="inv-seccion-contenido">
          <div class="inv-seccion-header">
            <span class="inv-seccion-subtitulo">Valores derivados, memorización y caché</span>
            <h2 class="inv-seccion-titulo">
              Computed y el grafo<br>de dependencias
            </h2>
          </div>

          <div class="inv-texto-col">
            <p>
              Mové los sliders y el toggle. Después apretá el botón que lee el total diez veces
              seguidas y mirá si los contadores de recálculo se mueven.
            </p>
          </div>

          <div class="inv-demo-bloque">
            <div class="inv-demo-etiqueta">
              <span>DEMO — 02</span>
              <span>COMPUTED Y GRAFO DE DEPENDENCIAS</span>
            </div>
            <div class="inv-demo-playground">
              <div class="inv-panel inv-panel--izq">
                <pre class="inv-demo-codigo"><span class="syntax-keyword">const</span> precio = <span class="syntax-function">ref</span>(<span class="syntax-number">100</span>)
<span class="syntax-keyword">const</span> cantidad = <span class="syntax-function">ref</span>(<span class="syntax-number">2</span>)
<span class="syntax-keyword">const</span> envioGratis = <span class="syntax-function">ref</span>(<span class="syntax-keyword">false</span>)

<span class="syntax-comment">// memoriza; solo recalcula si cambia</span>
<span class="syntax-comment">// alguna de sus dependencias</span>
<span class="syntax-keyword">const</span> subtotal = <span class="syntax-function">computed</span>(
  () =&gt; precio.value * cantidad.value
)

<span class="syntax-keyword">const</span> total = <span class="syntax-function">computed</span>(() =&gt;
  envioGratis.value
    ? subtotal.value
    : subtotal.value + <span class="syntax-number">500</span>
)</pre>
              </div>
              <div class="inv-panel inv-panel--der">
                <div class="inv-demo-resultado">
                  <DemoComputed />
                </div>
              </div>
            </div>
          </div>

          <div class="inv-texto-col">
            <p>
              Un <code>computed</code> memoriza su resultado. La primera vez que algo lo lee,
              Vue ejecuta la función y registra qué refs usó — eso es el grafo de dependencias.
              Las siguientes lecturas no ejecutan nada: si ninguna dependencia cambió, Vue devuelve
              el valor de la caché.
            </p>
            <p>
              Por eso el botón de las diez lecturas no movió los contadores. Y cambiar
              <code>envioGratis</code> recalcula <code>total</code> pero no <code>subtotal</code>,
              porque <code>subtotal</code> no tiene <code>envioGratis</code> entre sus dependencias.
              La diferencia con un método: el método corre en cada render; el computed, solo cuando
              algo en su mundo cambió.
            </p>
          </div>

        </div>
      </div>
    </div>
  </section>
</template>
