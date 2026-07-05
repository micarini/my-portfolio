<script setup>
// VUE POR DENTRO — ensayo visual interactivo sobre el funcionamiento
// interno de Vue.js. Detalle meta: cada widget que explica Vue está
// construido con Vue. La página se demuestra a sí misma.
import './Investigacion.css'
import DemoReactividad from '../components/investigacion/DemoReactividad.vue'
import DemoComputed from '../components/investigacion/DemoComputed.vue'
import DemoVModel from '../components/investigacion/DemoVModel.vue'
import DemoCicloVida from '../components/investigacion/DemoCicloVida.vue'
</script>

<template>
  <!-- ========================================================
       ENCABEZADO GIGANTE DEL ENSAYO
  ========================================================= -->
  <header class="inv-header">
    <div class="container">
      <div class="inv-header-inner">
        <!-- Sellos meta -->
        <div class="inv-header-meta">
          <span class="tag-brutal">INVESTIGACIÓN</span>
          <span class="tag-brutal">PROG. MULTIMEDIAL III — 2026</span>
          <span class="tag-brutal">VUE.JS — EL FRAMEWORK</span>
        </div>

        <!-- Título en dos líneas con efecto outline -->
        <div class="inv-titulo-giant">
          <span class="inv-titulo-line1">Vue</span>
          <span class="inv-titulo-line2">por dentro</span>
        </div>

        <!-- Bajada + datos duros -->
        <div class="inv-bajada-grid">
          <p class="inv-bajada">
            Anatomía de un framework reactivo: qué pasa exactamente entre
            que un dato cambia y la pantalla se actualiza. Con un detalle
            meta: los widgets que explican Vue están construidos con Vue.
          </p>
          <div class="inv-bajada-datos">
            <div class="inv-dato">
              <strong>2014</strong>
              <small>Evan You lanza la primera<br>versión pública de Vue</small>
            </div>
            <div class="inv-dato">
              <strong>~34 kB</strong>
              <small>pesa el runtime de Vue 3<br>(minificado + gzip)</small>
            </div>
            <div class="inv-dato">
              <strong>2020</strong>
              <small>Vue 3 introduce la<br>Composition API</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>

  <!-- ========================================================
       INTRO — 3 columnas sobre fondo negro
  ========================================================= -->
  <section class="inv-intro">
    <div class="container">
      <div class="inv-intro-grid">
        <p class="inv-intro-text">
          Vue.js es un framework progresivo para construir interfaces.
          Fue creado en 2014 por Evan You, que venía de trabajar en Google
          con Angular y quería quedarse solo con la parte que le gustaba:
          declarar la vista en función del estado y que el framework se
          ocupe del resto. Esa idea —describir el "qué" y delegar el
          "cómo"— sigue siendo el corazón de Vue una década después.
        </p>
        <p class="inv-intro-text">
          Lo interesante de Vue no es lo que se ve, sino lo que no se ve:
          un sistema de reactividad construido sobre Proxies de JavaScript
          que intercepta cada lectura y cada escritura del estado. Cuando
          algo lee un valor, queda suscripto. Cuando el valor cambia, Vue
          notifica exactamente a esos suscriptores y a nadie más. Este
          ensayo desarma ese mecanismo pieza por pieza.
        </p>
        <p class="inv-intro-text">
          Y acá viene el giro meta: <em>cada widget interactivo de esta
            página está construido con Vue</em>. Cuando muevas un slider y
          veas flashear un nodo, eso es Vue actualizando el DOM de Vue para
          explicarte cómo Vue actualiza el DOM. La página no ilustra el
          framework: lo demuestra en vivo, sobre sí misma. Tocá primero,
          leé después.
        </p>
      </div>
    </div>
  </section>

  <!-- ========================================================
       SECCIÓN 01 — LA REACTIVIDAD POR PROXY
  ========================================================= -->
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
              <span>DEMO INTERACTIVA — 01</span>
              <span>LA REACTIVIDAD POR PROXY</span>
            </div>
            <div>
              <DemoReactividad />
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

          <blockquote class="inv-cita">
            "En Vue 3, la reactividad se implementa interceptando las
            operaciones de lectura y escritura de propiedades mediante
            Proxies de ES2015."
            <cite>— Vue.js, "Reactivity in Depth" (vuejs.org/guide)</cite>
          </blockquote>
        </div>
      </div>
    </div>
  </section>

  <!-- ========================================================
       SECCIÓN 02 — COMPUTED Y EL GRAFO DE DEPENDENCIAS
  ========================================================= -->
  <section class="inv-seccion inv-seccion--alt">
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
              <span>DEMO INTERACTIVA — 02</span>
              <span>COMPUTED Y GRAFO DE DEPENDENCIAS</span>
            </div>
            <div>
              <DemoComputed />
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

  <!-- ========================================================
       SECCIÓN 03 — V-MODEL, DESARMADO
  ========================================================= -->
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
              <span>DEMO INTERACTIVA — 03</span>
              <span>V-MODEL, DESARMADO</span>
            </div>
            <div>
              <DemoVModel />
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

  <!-- ========================================================
       SECCIÓN 04 — EL CICLO DE VIDA
  ========================================================= -->
  <section class="inv-seccion inv-seccion--alt">
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
              <span>DEMO INTERACTIVA — 04</span>
              <span>EL CICLO DE VIDA</span>
            </div>
            <div>
              <DemoCicloVida />
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
