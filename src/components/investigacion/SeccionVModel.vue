<script setup>
import DemoVModel from './DemoVModel.vue'
</script>

<template>
  <section class="inv-seccion">
    <div class="container">
      <div class="inv-seccion-grid">
        <div class="inv-seccion-num" aria-hidden="true">03</div>

        <div class="inv-seccion-contenido">
          <div class="inv-seccion-header">
            <span class="inv-seccion-subtitulo">Sugar syntax sobre flujo unidireccional</span>
            <h2 class="inv-seccion-titulo">
              v-model,<br>desarmado
            </h2>
          </div>

          <div class="inv-texto-col">
            <p>
              Escribí en cualquiera de los dos inputs. Después apretá el toggle para ver lo que hay debajo de <code>v-model</code>.
            </p>
          </div>

          <div class="inv-demo-bloque">
            <div class="inv-demo-etiqueta">
              <span>DEMO — 03</span>
              <span>V-MODEL, DESARMADO</span>
            </div>
            <div class="inv-demo-playground">
              <div class="inv-panel inv-panel--izq">
                <pre class="inv-demo-codigo"><span class="syntax-comment">&lt;!-- sugar syntax --&gt;</span>
<span class="syntax-tag">&lt;input</span> <span class="syntax-attribute">v-model</span>=<span class="syntax-string">"texto"</span> <span class="syntax-tag">/&gt;</span>

<span class="syntax-comment">&lt;!-- equivale exactamente a: --&gt;</span>
<span class="syntax-tag">&lt;input</span>
  <span class="syntax-attribute">:value</span>=<span class="syntax-string">"texto"</span>
  <span class="syntax-attribute">@input</span>=<span class="syntax-string">"texto = $event.target.value"</span>
<span class="syntax-tag">/&gt;</span></pre>
              </div>
              <div class="inv-panel inv-panel--der">
                <div class="inv-demo-resultado">
                  <DemoVModel />
                </div>
              </div>
            </div>
          </div>

          <div class="inv-texto-col">
            <p>
              <code>v-model="texto"</code> es abreviatura. El compilador la expande
              antes de generar el render: <code>:value="texto"</code> hace que el estado
              fluya hacia el input, y <code>@input="texto = $event.target.value"</code>
              hace que el input actualice el estado. Los dos inputs del widget usan una
              sintaxis cada uno y se comportan igual — porque son lo mismo.
            </p>
            <p>
              Son dos pasos separados que siempre van en un solo sentido cada uno.
              No hay binding real en dos direcciones — hay un evento que sube y un
              binding que baja. React eligió no ocultar eso; Vue eligió hacerlo
              opcional con <code>v-model</code>. Debajo los dos funcionan igual.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
