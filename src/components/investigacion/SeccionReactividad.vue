<script setup>
import DemoReactividad from './DemoReactividad.vue'
</script>

<template>
  <section class="inv-seccion">
    <div class="container">
      <div class="inv-seccion-grid">
        <div class="inv-seccion-num" aria-hidden="true">01</div>

        <div class="inv-seccion-contenido">
          <div class="inv-seccion-header">
            <span class="inv-seccion-subtitulo">Cómo sabe Vue que algo cambió</span>
            <h2 class="inv-seccion-titulo">
              La reactividad<br>por Proxy
            </h2>
          </div>

          <div class="inv-texto-col">
            <p>
              Escribí algo en el input y mirá el diagrama. Los contadores del pie muestran cuántas veces se actualizó el estado y cuántas veces el DOM.
            </p>
          </div>

          <div class="inv-demo-bloque">
            <div class="inv-demo-etiqueta">
              <span>DEMO — 01</span>
              <span>LA REACTIVIDAD POR PROXY</span>
            </div>
            <div class="inv-demo-playground">
              <div class="inv-panel inv-panel--izq">
                <pre class="inv-demo-codigo"><span class="syntax-comment">// ref() envuelve el valor en un Proxy</span>
<span class="syntax-keyword">const</span> nombre = <span class="syntax-function">ref</span>(<span class="syntax-string">'Vue'</span>)

<span class="syntax-comment">// GET → registra suscriptores</span>
<span class="syntax-comment">// SET → notifica suscriptores</span>
<span class="syntax-function">watch</span>(nombre, (nuevo) =&gt; {
  <span class="syntax-function">registrar</span>(nuevo)
})

<span class="syntax-comment">// template: suscriptor automático</span>
<span class="syntax-comment">// interpolaciones leen el ref</span></pre>
              </div>
              <div class="inv-panel inv-panel--der">
                <div class="inv-demo-resultado">
                  <DemoReactividad />
                </div>
              </div>
            </div>
          </div>

          <div class="inv-texto-col">
            <p>
              Cuando escribís <code>const nombre = ref('Vue')</code>, Vue no guarda un string:
              envuelve el valor en un <code>Proxy</code> que intercepta dos operaciones.
              En el <strong>GET</strong> — alguien lee el valor — Vue anota qué cosas lo están leyendo:
              esa interpolación del template, ese computed, ese watcher quedan registrados como dependencias.
              En el <strong>SET</strong> — alguien escribe — Vue recorre esa lista y los notifica.
            </p>
            <p>
              Por eso los dos contadores siempre son iguales: cada tecla produjo exactamente
              una actualización del DOM. Vue no re-renderiza el componente completo —
              actualiza los tres nodos de texto que dependen de <code>nombre</code> y nada más.
              La suscripción se armó sola la primera vez que cada caja leyó el valor.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
