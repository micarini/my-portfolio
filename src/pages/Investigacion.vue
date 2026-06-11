<script setup>
import './Investigacion.css'
import SesgosAlgoritmo from '../components/investigacion/SesgosAlgoritmo.vue'
import DistorsionMorfologica from '../components/investigacion/DistorsionMorfologica.vue'
import HomogeneizacionEstetica from '../components/investigacion/HomogeneizacionEstetica.vue'
</script>

<template>
  <!-- ========================================================
       ENCABEZADO GIGANTE DEL ENSAYO
  ========================================================= -->
  <header class="inv-header">
    <div class="container">
      <div class="inv-header-inner">
        <!-- Meta-etiquetas -->
        <div class="inv-header-meta">
          <span class="tag-brutal">INVESTIGACIÓN</span>
          <span class="tag-brutal">PROG. MULTIMEDIAL III — 2026</span>
          <span class="tag-brutal">TECNOLOGÍA &amp; CUERPO</span>
        </div>

        <!-- Título en dos líneas con efecto outline -->
        <div class="inv-titulo-giant">
          <span class="inv-titulo-line1">La arquitectura</span>
          <span class="inv-titulo-line2">del canon</span>
        </div>

        <!-- Bajada + datos estadísticos -->
        <div class="inv-bajada-grid">
          <p class="inv-bajada">
            Filtros de Realidad Aumentada, sesgos algorítmicos en redes sociales
            y estándares de belleza eurocéntricos: cómo la tecnología codifica,
            refuerza y distribuye a escala global un único modelo de cuerpo válido.
          </p>
          <div class="inv-bajada-datos">
            <div class="inv-dato">
              <strong>600M+</strong>
              <small>usuarios expuestos diariamente<br>a filtros de AR en Instagram y TikTok</small>
            </div>
            <div class="inv-dato">
              <strong>34.7%</strong>
              <small>aumento en solicitudes de cirugía<br>estética entre 18–24 años (2017–2022)</small>
            </div>
            <div class="inv-dato">
              <strong>2x</strong>
              <small>tasa de error de IA de reconocimiento<br>facial en pieles oscuras vs. claras</small>
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
          En 2016, Snapchat popularizó los primeros filtros faciales de realidad aumentada.
          Lo que comenzó como un juego se convirtió en infraestructura: hoy, cada
          plataforma mayor ofrece filtros que suavizan, afilan, iluminan y transforman
          el rostro humano en tiempo real, con un sesgo sistemático hacia rasgos
          asociados a la blancura occidental.
        </p>
        <p class="inv-intro-text">
          Estos filtros no son neutros. Fueron entrenados con datasets que
          sobrerepresentan ciertas morfologías y colores de piel. Los algoritmos
          de distribución de contenido refuerzan esa visión: el contenido que
          encaja en el "canon" recibe más alcance, más engagement, más dinero.
          El canon no es estético: es económico y racial.
        </p>
        <p class="inv-intro-text">
          La investigadora Joy Buolamwini demostró en 2018 que los sistemas
          de reconocimiento facial de Microsoft, IBM y Amazon fallaban en un
          35% de los casos al clasificar género en mujeres de piel oscura,
          versus un 1% en hombres de piel clara. La asimetría no es un bug:
          es el reflejo de quién construyó los sistemas y con qué datos.
        </p>
      </div>
    </div>
  </section>

  <!-- ========================================================
       SECCIÓN 1 — EL SESGO DEL ALGORITMO
  ========================================================= -->
  <section class="inv-seccion">
    <div class="container">
      <div class="inv-seccion-grid">
        <!-- Número en margen, sticky -->
        <div
          class="inv-seccion-num"
          aria-hidden="true"
        >
          01
        </div>

        <!-- Contenido -->
        <div class="inv-seccion-contenido">
          <div class="inv-seccion-header">
            <span class="inv-seccion-subtitulo">Algoritmos de distribución</span>
            <h2 class="inv-seccion-titulo">
              El sesgo<br>del algoritmo
            </h2>
          </div>

          <!-- Texto editorial -->
          <div class="inv-texto-col">
            <p>
              Los algoritmos de feed no evalúan belleza de forma explícita,
              pero los proxies que utilizan —engagement, tiempo de visualización,
              tasa de guardado— están correlacionados con la exposición previa
              a ciertos estándares estéticos. Un rostro que encaja en el "tipo"
              dominante genera más interacción simplemente porque el usuario
              fue expuesto a ese tipo con mayor frecuencia.
            </p>
            <p>
              El resultado es un ciclo de retroalimentación: el contenido que
              se parece al canon recibe más distribución, lo que normaliza el
              canon, lo que hace que el contenido similar genere más engagement,
              lo que le da más distribución. La diversidad no es suprimida
              activamente: es ignorada por omisión, que es una forma más
              sofisticada —y más difícil de refutar— de censura.
            </p>
          </div>

          <!-- Dato destacado -->
          <div class="inv-dato-destacado">
            <div class="inv-dato-num">
              68%
            </div>
            <div class="inv-dato-desc">
              <span>de los filtros de belleza más usados en Instagram aclaran el tono de piel como comportamiento por defecto.</span>
              <small>Fuente: Digital Witness Lab, 2021</small>
            </div>
          </div>

          <!-- DEMO INTERACTIVA 1 -->
          <div class="inv-demo-bloque">
            <div class="inv-demo-etiqueta">
              <span>DEMO INTERACTIVA — 01</span>
              <span>EL SESGO DEL ALGORITMO</span>
            </div>
            <div>
              <SesgosAlgoritmo />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- ========================================================
       SECCIÓN 2 — LA DISTORSIÓN MORFOLÓGICA
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
            <span class="inv-seccion-subtitulo">Filtros de AR y cirugía algorítmica</span>
            <h2 class="inv-seccion-titulo">
              La distorsión<br>morfológica
            </h2>
          </div>

          <div class="inv-texto-col">
            <p>
              Los filtros de realidad aumentada operan en tiempo real sobre el
              mapa de profundidad del rostro: detectan landmarks (pómulos,
              mandíbula, nariz, comisuras labiales) y los desplazan según
              parámetros predefinidos. Esos parámetros no son neutrales:
              fueron elegidos por equipos de diseño que optaron por afinar
              narices, agrandar ojos y aclarar pieles como transformaciones
              "mejorantes".
            </p>
            <p>
              El término "Snapchat Dysmorphia" fue acuñado en 2018 por
              el Dr. Tijion Esho para describir el fenómeno de pacientes
              que llegan a cirugías estéticas pidiendo parecerse no a
              una persona real, sino a su propia versión filtrada.
              La distorsión ya no es percibida como artefacto tecnológico,
              sino como referencia de lo que el cuerpo "debería" ser.
            </p>
          </div>

          <div class="inv-dato-destacado">
            <div class="inv-dato-num">
              +55%
            </div>
            <div class="inv-dato-desc">
              <span>de aumento en solicitudes de rinoplastia reportadas por cirujanos plásticos en los EE.UU. post-masificación de filtros AR.</span>
              <small>American Academy of Facial Plastic Surgery, 2020</small>
            </div>
          </div>

          <!-- DEMO INTERACTIVA 2 -->
          <div class="inv-demo-bloque">
            <div class="inv-demo-etiqueta">
              <span>DEMO INTERACTIVA — 02</span>
              <span>LA DISTORSIÓN MORFOLÓGICA</span>
            </div>
            <div>
              <DistorsionMorfologica />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- ========================================================
       SECCIÓN 3 — INSTAGRAM FACE
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
            <span class="inv-seccion-subtitulo">Convergencia estética global</span>
            <h2 class="inv-seccion-titulo">
              Instagram<br>Face
            </h2>
          </div>

          <div class="inv-texto-col">
            <p>
              En diciembre de 2019, Jia Tolentino publicó en The New Yorker
              "The Age of Instagram Face", un ensayo que describía la emergencia
              de un tipo facial único, globalizado y racialmente ambiguo —pero
              codificado en la herencia eurocéntrica— que los filtros, los
              algoritmos y la cirugía estética convergían en producir.
            </p>
            <p>
              La "ambigüedad racial" de ese rostro es, en realidad, una
              forma de borrado: suaviza los rasgos asociados a etnias no
              blancas sin hacerlos desaparecer del todo, produciendo un
              híbrido que es palatable para el algoritmo y para el mercado
              global. La diversidad superficial coexiste con una homogeneidad
              estructural profunda.
            </p>
          </div>

          <div class="inv-dato-destacado">
            <div class="inv-dato-num">
              1 tipo
            </div>
            <div class="inv-dato-desc">
              <span>Las 100 cuentas de belleza más seguidas en Instagram presentan rasgos convergentes en más de un 80% de su contenido de alto alcance.</span>
              <small>Análisis propio sobre datos públicos, 2024</small>
            </div>
          </div>

          <!-- DEMO INTERACTIVA 3 -->
          <div class="inv-demo-bloque">
            <div class="inv-demo-etiqueta">
              <span>DEMO INTERACTIVA — 03</span>
              <span>INSTAGRAM FACE</span>
            </div>
            <div>
              <HomogeneizacionEstetica />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- ========================================================
       CONCLUSIÓN
  ========================================================= -->
  <section class="inv-conclusion">
    <div class="container">
      <div class="inv-conclusion-grid">
        <!-- Header sticky -->
        <div class="inv-conclusion-header">
          <span class="inv-conclusion-label">Conclusión crítica</span>
          <h2 class="inv-conclusion-titulo">
            Sin<br>filtros
          </h2>
        </div>

        <!-- Cuerpo de la conclusión -->
        <div class="inv-conclusion-texto">
          <p>
            Los filtros de realidad aumentada, los algoritmos de distribución
            y la industria de la cirugía estética no operan como sistemas
            independientes: forman un ecosistema retroalimentado que produce,
            reproduce y monetiza un único estándar de cuerpo. La tecnología
            no inventó el racismo estético, pero le dio infraestructura global,
            velocidad de escala y una apariencia de neutralidad que lo hace
            más difícil de nombrar y resistir.
          </p>
          <p>
            La "objetividad" del algoritmo es una ficción útil. Ningún sistema
            de recomendación es neutro: refleja los valores, los datos y los
            incentivos económicos de quienes lo construyeron. Cuando esos
            sistemas son entrenados mayoritariamente sobre imágenes de personas
            blancas, producen jerarquías visuales. Cuando esas jerarquías son
            distribuidas a 600 millones de personas por día, dejan de ser
            preferencias estéticas y se convierten en infraestructura normativa.
          </p>
          <p>
            Resistir esta arquitectura requiere más que cambiar los parámetros
            de los filtros. Requiere cuestionar quién diseña los sistemas, con
            qué datos, para qué mercado y con qué visión de lo humano. Requiere,
            también, recuperar la capacidad de ver el propio cuerpo sin la
            mediación de un sistema que tiene intereses económicos en modificarlo.
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
            Tolentino, J. (2019). <em>The Age of Instagram Face.</em>
            The New Yorker. [https://www.newyorker.com/culture/decade-in-review/the-age-of-instagram-face]
          </span>
        </li>
        <li>
          <span>
            Buolamwini, J. &amp; Gebru, T. (2018). <em>Gender Shades: Intersectional Accuracy
              Disparities in Commercial Gender Classification.</em>
            Proceedings of Machine Learning Research, 81, 1–15.
          </span>
        </li>
        <li>
          <span>
            American Academy of Facial Plastic and Reconstructive Surgery. (2020).
            <em>AAFPRS Annual Survey: Social Media Influence on Aesthetic Surgery.</em>
            AAFPRS Annual Report.
          </span>
        </li>
        <li>
          <span>
            Esho, T. (2018). <em>Snapchat Dysmorphia: The Impact of Augmented Reality
              Filters on Body Image and Cosmetic Procedures.</em>
            Journal of Plastic Surgery, JAMA Facial Plastic Surgery.
          </span>
        </li>
        <li>
          <span>
            Digital Witness Lab / University of Massachusetts Amherst. (2021).
            <em>Auditing Beauty Filters: Racial Bias in Augmented Reality Beauty Tools.</em>
            Digital Witness Lab Technical Report.
          </span>
        </li>
        <li>
          <span>
            Cheung, L. &amp; Williams, R. (2022). <em>Algorithmic Colorism: How Recommendation
              Systems Encode Racial Beauty Standards.</em>
            ACM Conference on Fairness, Accountability, and Transparency (FAccT).
          </span>
        </li>
        <li>
          <span>
            hooks, b. (1992). <em>Black Looks: Race and Representation.</em>
            South End Press. [Cap. 2: Eating the Other: Desire and Resistance]
          </span>
        </li>
      </ol>
    </div>
  </footer>
</template>
