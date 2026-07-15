<script setup>
// VUE POR DENTRO — ensayo visual interactivo sobre el funcionamiento
// interno de Vue.js. Detalle meta: cada widget que explica Vue está
// construido con Vue. La página se demuestra a sí misma.
import DemoReactividad from '../components/investigacion/DemoReactividad.vue'
import DemoComputed from '../components/investigacion/DemoComputed.vue'
import DemoVModel from '../components/investigacion/DemoVModel.vue'
import DemoCicloVida from '../components/investigacion/DemoCicloVida.vue'
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
          Anatomía de un framework reactivo. Los widgets que explican Vue
          están construidos con Vue.
        </p>
      </div>
    </div>
  </header>

  <section class="inv-intro">
    <div class="container">
      <div class="inv-intro-grid">
        <p class="inv-intro-text">
          Vue nació de una apuesta: si el estado es la única fuente de
          verdad, la vista es solo su consecuencia. Evan You sacó esa idea
          de Angular en 2014 y construyó un framework alrededor de ella.
        </p>
        <p class="inv-intro-text">
          El mecanismo clave es invisible: Proxies de JavaScript que
          interceptan cada lectura y escritura del estado. Cuando algo lee
          un valor, queda suscripto. Cuando cambia, Vue notifica —y nadie
          más.
        </p>
        <p class="inv-intro-text">
          El giro meta: <em>cada widget está construido con Vue</em>.
          Vue explicando Vue sobre sí mismo.
          Interactuá primero, leé después.
        </p>
      </div>
    </div>
  </section>

  <!-- SECCIÓN 01 — LA REACTIVIDAD POR PROXY-->
  <section class="inv-seccion">
    <div class="container">
      <div class="inv-seccion-grid">
        <div
          class="inv-seccion-num"
          aria-hidden="true"
        >
          01
        </div>

        <div class="inv-seccion-contenido">
          <div class="inv-seccion-header">
            <span class="inv-seccion-subtitulo">Cómo sabe Vue que algo cambió</span>
            <h2 class="inv-seccion-titulo">
              La reactividad<br>por Proxy
            </h2>
          </div>

          <!-- Intro breve ANTES del widget -->
          <div class="inv-texto-col">
            <p>
              Antes de la teoría, el experimento. Escribí algo en el input
              de abajo y mirá el diagrama: el estado central pulsa, las ondas
              viajan a las tres cajas suscriptoras, y la terminal registra
              cada operación. Prestale atención a los dos contadores del pie.
            </p>
          </div>

          <!-- DEMO 01 -->
          <div class="inv-demo-bloque">
            <div class="inv-demo-etiqueta">
              <span>DEMO — 01</span>
              <span>LA REACTIVIDAD POR PROXY</span>
            </div>
            <div class="inv-demo-playground">
              <div class="inv-panel inv-panel--izq">
                <pre class="inv-demo-codigo"><span class="hl-cmnt">// ref() envuelve el valor en un Proxy</span>
<span class="hl-kw">const</span> nombre = <span class="hl-fn">ref</span>(<span class="hl-str">'Vue'</span>)

<span class="hl-cmnt">// GET → registra suscriptores</span>
<span class="hl-cmnt">// SET → notifica suscriptores</span>
<span class="hl-fn">watch</span>(nombre, (nuevo) =&gt; {
  <span class="hl-fn">registrar</span>(nuevo)
})

<span class="hl-cmnt">// template: suscriptor automático</span>
<span class="hl-cmnt">// interpolaciones leen el ref</span></pre>
              </div>
              <div class="inv-panel inv-panel--der">
                <div class="inv-demo-resultado">
                  <DemoReactividad />
                </div>
              </div>
            </div>
          </div>

          <!-- Explicación DESPUÉS del widget -->
          <div class="inv-texto-col">
            <p>
              Lo que acabás de tocar es el sistema de reactividad de Vue.
              Cuando declarás <code>const nombre = ref('Vue')</code>, Vue no
              crea una variable común: envuelve el valor en un
              <code>Proxy</code> de JavaScript que intercepta dos operaciones.
              En el <strong>GET</strong> (alguien lee el valor), Vue anota
              quién está leyendo: esa interpolación del template, ese computed,
              ese watcher quedan registrados como dependencias. En el
              <strong>SET</strong> (alguien escribe), Vue recorre la lista de
              suscriptores registrados y los notifica, uno por uno.
            </p>
            <p>
              Por eso los dos contadores del widget son siempre iguales:
              cada tecla produjo exactamente una actualización del DOM,
              ni una más. Vue no re-renderiza la página ni el componente
              entero: actualiza quirúrgicamente los tres nodos de texto
              que dependen de <code>nombre</code>. La suscripción se armó
              sola, en el primer render, cuando cada caja leyó el valor
              por primera vez.
            </p>
          </div>

        </div>
      </div>
    </div>
  </section>

  <!-- SECCIÓN 02 — COMPUTED Y EL GRAFO DE DEPENDENCIAS -->
  <section class="inv-seccion">
    <div class="container">
      <div class="inv-seccion-grid">
        <div
          class="inv-seccion-num"
          aria-hidden="true"
        >
          02
        </div>

        <div class="inv-seccion-contenido">
          <div class="inv-seccion-header">
            <span class="inv-seccion-subtitulo">Valores derivados, memorización y caché</span>
            <h2 class="inv-seccion-titulo">
              Computed y el grafo<br>de dependencias
            </h2>
          </div>

          <div class="inv-texto-col">
            <p>
              Mové los sliders y el toggle de envío: fijate qué nodos del
              grafo flashean con cada cambio y cuáles quedan quietos.
              Cuando termines, apretá el botón que lee el total diez veces
              seguidas y mirá los contadores de recálculo.
            </p>
          </div>

          <!-- DEMO 02 -->
          <div class="inv-demo-bloque">
            <div class="inv-demo-etiqueta">
              <span>DEMO — 02</span>
              <span>COMPUTED Y GRAFO DE DEPENDENCIAS</span>
            </div>
            <div class="inv-demo-playground">
              <div class="inv-panel inv-panel--izq">
                <pre class="inv-demo-codigo"><span class="hl-kw">const</span> precio = <span class="hl-fn">ref</span>(<span class="hl-num">100</span>)
<span class="hl-kw">const</span> cantidad = <span class="hl-fn">ref</span>(<span class="hl-num">2</span>)
<span class="hl-kw">const</span> envioGratis = <span class="hl-fn">ref</span>(<span class="hl-kw">false</span>)

<span class="hl-cmnt">// memoriza; solo recalcula si cambia</span>
<span class="hl-cmnt">// alguna de sus dependencias</span>
<span class="hl-kw">const</span> subtotal = <span class="hl-fn">computed</span>(
  () =&gt; precio.value * cantidad.value
)

<span class="hl-kw">const</span> total = <span class="hl-fn">computed</span>(() =&gt;
  envioGratis.value
    ? subtotal.value
    : subtotal.value + <span class="hl-num">500</span>
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
              Un <code>computed</code> es una función que Vue memoriza.
              La primera vez que algo accede a su valor, Vue la ejecuta y
              registra qué refs leyó durante esa ejecución: ese conjunto de
              lecturas <em>es</em> el grafo de dependencias, construido
              automáticamente, sin anotaciones. El resultado queda guardado
              en caché junto con la lista de dependencias.
            </p>
            <p>
              Las siguientes lecturas no ejecutan nada: si ninguna dependencia
              cambió desde el último cálculo, Vue devuelve el valor cacheado.
              Por eso el botón de las diez lecturas no movió los contadores:
              leer no invalida la caché, solo escribir una dependencia lo hace.
              Y la invalidación es selectiva — cambiar <code>envioGratis</code>
              recalcula <code>total</code> pero no <code>subtotal</code>,
              porque <code>subtotal</code> no depende del envío. Esa es la
              diferencia entre un computed y un método: el método se ejecuta
              en cada render; el computed, solo cuando su mundo cambió.
            </p>
          </div>

          <div class="inv-dato-destacado">
            <div class="inv-dato-num">
              0
            </div>
            <div class="inv-dato-desc">
              <span>
                recálculos ejecuta un computed cuando se lo lee repetidamente
                sin que cambien sus dependencias. La memorización no es una
                optimización opcional: es el contrato de la API.
              </span>
              <small>Vue.js — "Computed Properties" (vuejs.org/guide)</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- SECCIÓN 03 — V-MODEL, DESARMADO-->
  <section class="inv-seccion">
    <div class="container">
      <div class="inv-seccion-grid">
        <div
          class="inv-seccion-num"
          aria-hidden="true"
        >
          03
        </div>

        <div class="inv-seccion-contenido">
          <div class="inv-seccion-header">
            <span class="inv-seccion-subtitulo">Azúcar sintáctico sobre flujo unidireccional</span>
            <h2 class="inv-seccion-titulo">
              v-model,<br>desarmado
            </h2>
          </div>

          <div class="inv-texto-col">
            <p>
              Dos inputs, un solo estado. Escribí en cualquiera de los dos
              y mirá las flechas del centro: se iluminan según la dirección
              del flujo en cada tecla. Después usá el toggle "VER EL AZÚCAR"
              para comparar las dos sintaxis.
            </p>
          </div>

          <!-- DEMO 03 -->
          <div class="inv-demo-bloque">
            <div class="inv-demo-etiqueta">
              <span>DEMO — 03</span>
              <span>V-MODEL, DESARMADO</span>
            </div>
            <div class="inv-demo-playground">
              <div class="inv-panel inv-panel--izq">
                <pre class="inv-demo-codigo"><span class="hl-cmnt">&lt;!-- azúcar sintáctico --&gt;</span>
<span class="hl-tag">&lt;input</span> <span class="hl-attr">v-model</span>=<span class="hl-str">"texto"</span> <span class="hl-tag">/&gt;</span>

<span class="hl-cmnt">&lt;!-- equivale exactamente a: --&gt;</span>
<span class="hl-tag">&lt;input</span>
  <span class="hl-attr">:value</span>=<span class="hl-str">"texto"</span>
  <span class="hl-attr">@input</span>=<span class="hl-str">"texto = $event.target.value"</span>
<span class="hl-tag">/&gt;</span></pre>
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
              <code>v-model</code> es azúcar sintáctico: una abreviatura que
              el compilador de Vue expande antes de generar el render. Escribir
              <code>v-model="texto"</code> equivale exactamente a escribir
              <code>:value="texto"</code> (el estado fluye hacia el input) más
              <code>@input="texto = $event.target.value"</code> (el evento
              actualiza el estado). Los dos inputs del widget usan una sintaxis
              cada uno, y se comportan idéntico — porque <em>son</em> idénticos.
            </p>
            <p>
              La lección de fondo: en Vue no existe el binding bidireccional
              como mecanismo. Existe un flujo unidireccional (estado → vista)
              más un evento que viaja de vuelta (vista → estado). La
              "bidireccionalidad" es una comodidad de escritura, no una
              ruptura del modelo. React decidió no ofrecer ese azúcar y te
              hace escribir el <code>onChange</code> a mano; Vue decidió
              ofrecerlo. Debajo, los dos hacen lo mismo.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- SECCIÓN 04 — EL CICLO DE VIDA -->
  <section class="inv-seccion">
    <div class="container">
      <div class="inv-seccion-grid">
        <div
          class="inv-seccion-num"
          aria-hidden="true"
        >
          04
        </div>

        <div class="inv-seccion-contenido">
          <div class="inv-seccion-header">
            <span class="inv-seccion-subtitulo">Hooks, garantías y el momento del fetch</span>
            <h2 class="inv-seccion-titulo">
              El ciclo<br>de vida
            </h2>
          </div>

          <div class="inv-texto-col">
            <p>
              Este widget monta un componente hijo de verdad — no una
              simulación. Apretá MONTAR COMPONENTE y mirá la línea de tiempo:
              cada hook se enciende en orden, con su timestamp real, reportado
              por el propio hijo. Después desmontalo y mirá los dos últimos.
            </p>
          </div>

          <!-- DEMO 04 -->
          <div class="inv-demo-bloque">
            <div class="inv-demo-etiqueta">
              <span>DEMO — 04</span>
              <span>EL CICLO DE VIDA</span>
            </div>
            <div class="inv-demo-playground">
              <div class="inv-panel inv-panel--izq">
                <pre class="inv-demo-codigo"><span class="hl-cmnt">// setup → onBeforeMount → onMounted</span>
<span class="hl-cmnt">// onBeforeUnmount → onUnmounted</span>

<span class="hl-fn">onMounted</span>(<span class="hl-kw">async</span> () =&gt; {
  <span class="hl-cmnt">// DOM garantizado: fetch seguro</span>
  datos.value = <span class="hl-kw">await</span> <span class="hl-fn">fetch</span>(<span class="hl-str">'/api.json'</span>)
    .<span class="hl-fn">then</span>(r =&gt; r.<span class="hl-fn">json</span>())
})

<span class="hl-fn">onUnmounted</span>(() =&gt; {
  <span class="hl-cmnt">// cleanup: timers, listeners, subs</span>
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
              Todo componente de Vue atraviesa la misma secuencia: el
              <code>setup</code> corre primero (los refs nacen, el DOM todavía
              no existe), <code>onBeforeMount</code> avisa que el montaje es
              inminente, y <code>onMounted</code> garantiza que el DOM real ya
              está en la página. Al final del camino, <code>onBeforeUnmount</code>
              y <code>onUnmounted</code> marcan la despedida: el momento del
              cleanup de timers, listeners y suscripciones.
            </p>
            <p>
              ¿Por qué el fetch va en <code>onMounted</code>? Porque es la
              primera garantía de que el componente puede mostrar lo que está
              pasando: el spinner de carga necesita un DOM donde renderizarse.
              El hijo de esta demo simula su fetch con un
              <code>setTimeout</code>, pero el patrón es exactamente el que
              usa la página Home de este mismo portfolio: su
              <code>onMounted</code> hace un <code>fetch('/contenido.json')</code>
              real, con estado de carga y de error. Misma coreografía:
              primero montarse, después pedir datos.
            </p>
            <p>
              El detalle técnico elegante: el hijo le reporta cada hook al
              padre con <code>emit('hook')</code>, y el padre pinta la línea
              de tiempo. La comunicación hijo→padre por eventos es, otra vez,
              el mismo flujo unidireccional de la sección 03 — props bajan,
              eventos suben.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- ========================================================
       CONCLUSIÓN CRÍTICA
  ========================================================= -->
  <section class="inv-conclusion">
    <div class="container">
      <div class="inv-conclusion-grid">
        <div class="inv-conclusion-header">
          <span class="inv-conclusion-label">Conclusión crítica</span>
          <h2 class="inv-conclusion-titulo">
            El modelo<br>mental
          </h2>
        </div>

        <div class="inv-conclusion-texto">
          <p>
            Estudiar Vue por dentro cambia la forma de escribir Vue. La
            reactividad deja de ser magia y se vuelve un sistema de
            suscripciones explícito: los componentes no "adivinan" que el
            estado cambió — se registraron como observadores en el momento
            exacto en que leyeron ese valor, y el Proxy los notifica cuando
            alguien escribe. GET registra, SET notifica. Con ese modelo
            mental, cada comportamiento del framework (por qué un computed
            no se recalcula, por qué un watcher no dispara, por qué el DOM
            se actualiza solo donde hace falta) deja de ser un misterio y
            pasa a ser una consecuencia lógica.
          </p>
          <p>
            La comparación honesta con React cabe en una línea: React
            re-renderiza el componente entero y reconcilia después; Vue
            rastrea dependencias finas y actualiza solo a los suscriptores.
            Ninguno es objetivamente mejor — son dos respuestas defendibles
            a la misma pregunta, con trade-offs opuestos: React compra
            simplicidad conceptual al precio de renders redundantes; Vue
            compra precisión quirúrgica al precio de un sistema de
            interceptación más complejo bajo el capó.
          </p>
          <p>
            Lo que queda después de esta investigación es que un framework
            no es magia: es un conjunto de decisiones de diseño con
            consecuencias observables. El Proxy es una decisión. La caché
            de los computed es una decisión. Que el fetch vaya en
            <code>onMounted</code> es una decisión sobre cuándo el framework
            te cede el control. Y la mejor prueba de que estas ideas se
            entendieron es esta misma página: cada widget que explicó Vue
            fue construido con refs, computeds, watchers y hooks de Vue.
            El ensayo es su propia demostración.
          </p>
        </div>
      </div>
    </div>
  </section>

  <!-- ========================================================
       BIBLIOGRAFÍA
  ========================================================= -->
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
      </ol>
    </div>
  </footer>
</template>

<style scoped>
/* ==========================================================================
   INVESTIGACION — Ensayo visual interactivo: VUE POR DENTRO
   Estética: Brutalismo Suizo / Warm Retro — una columna y media editorial
   ========================================================================== */

/* --------------------------------------------------------
   ENCABEZADO DEL ENSAYO
-------------------------------------------------------- */
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

/* Título gigante en dos líneas: display agresivo */
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

/* Grid de bajada: texto + datos en columnas */
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

/* --------------------------------------------------------
   INTRO — fondo negro, 3 columnas
-------------------------------------------------------- */
.inv-intro {
  padding: var(--space-5) 0;
  background: var(--color-paper);
}

.inv-intro-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
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

/* --------------------------------------------------------
   SECCIONES — Layout editorial con número en margen
-------------------------------------------------------- */
.inv-seccion {
  padding: var(--space-5) 0;
  border-bottom: var(--border-thick);
}

.inv-seccion-grid {
  display: grid;
  /* Número gigante en margen izquierdo + contenido */
  grid-template-columns: 100px 1fr;
  gap: var(--space-4);
  align-items: start;
}

/* Número de sección: enorme, en el margen, estático */
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

/* Columna de texto editorial */
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

/* Dato destacado en bloque */
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

.inv-cita {
  padding: var(--space-2) 0;
  border-top: 1px solid rgba(217, 222, 236, 0.18);
  border-bottom: 1px solid rgba(217, 222, 236, 0.18);
  font-family: 'DM Sans', sans-serif;
  font-size: 1.05rem;
  line-height: 1.65;
  color: var(--color-paper-dark);
  font-style: italic;
  margin: var(--space-1) 0;
}

.inv-cita::before {
  content: '"';
  font-family: var(--font-display);
  font-size: 3.5rem;
  line-height: 0.8;
  color: var(--color-primary);
  display: block;
  font-style: normal;
  margin-bottom: var(--space-1);
}

.inv-cita cite {
  display: block;
  margin-top: var(--space-1);
  font-family: var(--font-mono);
  font-size: var(--text-micro);
  font-style: normal;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--color-paper);
}

.inv-demo-bloque {
  border: 1px solid rgba(193, 196, 203, 0.3);
  border-radius: 10px;
  overflow: hidden;
  background: var(--color-ink);
}

/* Etiqueta superior de la demo */
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

/* Syntax highlighting — paneles de código */
.hl-kw   { color: #7195ff; }
.hl-fn   { color: #00d6ee; }
.hl-str  { color: #61d46a; }
.hl-num  { color: #f6b84d; }
.hl-cmnt { color: #616369; font-style: italic; }
.hl-tag  { color: #ff578a; }
.hl-attr { color: #00c2f8; }

/* --------------------------------------------------------
   CONCLUSIÓN
-------------------------------------------------------- */
.inv-conclusion {
  padding: var(--space-5) 0;
  background: var(--color-ink);
  border-top: var(--border-heavy);
}

.inv-conclusion-grid {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: var(--space-5);
  align-items: start;
}

.inv-conclusion-header {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  position: sticky;
  top: 80px;
}

.inv-conclusion-label {
  font-family: var(--font-mono);
  font-size: var(--text-micro);
  text-transform: uppercase;
  letter-spacing: 0.18em;
  color: var(--color-paper-dark);
  border-bottom: var(--border-thick);
  padding-bottom: var(--space-1);
  display: block;
}

.inv-conclusion-titulo {
  font-family: 'Syne', sans-serif;
  font-weight: 700;
  font-size: var(--text-h1);
  text-transform: uppercase;
  letter-spacing: -0.03em;
  line-height: 0.9;
}

.inv-conclusion-texto {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.inv-conclusion-texto p {
  font-family: 'DM Sans', sans-serif;
  font-size: 1.1rem;
  line-height: 1.75;
}

/* --------------------------------------------------------
   BIBLIOGRAFÍA
-------------------------------------------------------- */
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

/* --------------------------------------------------------
   RESPONSIVE — todo colapsa a una columna en < 720px
-------------------------------------------------------- */
@media (max-width: 720px) {
  .inv-titulo-line2 {
    -webkit-text-stroke: 2px var(--color-paper);
  }

  .inv-intro-grid {
    grid-template-columns: 1fr;
    gap: var(--space-3);
  }

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

  .inv-conclusion-grid {
    grid-template-columns: 1fr;
    gap: var(--space-3);
  }

  .inv-conclusion-header {
    position: static;
  }

  .inv-biblio-lista li {
    grid-template-columns: 32px 1fr;
    gap: var(--space-2);
  }
}

@media (max-width: 480px) {
  .inv-demo-bloque > :not(.inv-demo-etiqueta):not(.inv-demo-playground) {
    padding: var(--space-2) var(--space-1);
  }

  .inv-demo-codigo,
  .inv-demo-resultado {
    padding: var(--space-2) var(--space-1);
  }
}

/* Botones más suaves en el contexto del ensayo */
:deep(.btn-brutal) {
  border-radius: 6px;
  border: 1.5px solid var(--color-paper);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
}

:deep(.btn-brutal:active) {
  transform: none;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.15);
}
</style>
