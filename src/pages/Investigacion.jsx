import "./Investigacion.css";
import SesgosAlgoritmo from "../components/investigacion/SesgosAlgoritmo.jsx";
import DistorsionMorfologica from "../components/investigacion/DistorsionMorfologica.jsx";
import HomogeneizacionEstetica from "../components/investigacion/HomogeneizacionEstetica.jsx";

export default function Investigacion() {
  return (
    <article className="inv-page">

      {/* ========================================================
          ENCABEZADO DEL ENSAYO
      ======================================================== */}
      <header className="inv-header">
        <div className="container">
          <div className="inv-header-inner">
            <div className="inv-header-meta">
              <span className="tag-brutal">Investigación</span>
              <span className="tag-brutal">Tecnología Multimedial III — 2026</span>
              <span className="tag-brutal">UMAI</span>
            </div>

            <h1 className="inv-titulo-giant">
              <span className="inv-titulo-line1">La arquitectura</span>
              <span className="inv-titulo-line2">del canon</span>
            </h1>

            <div className="inv-bajada-grid">
              <div className="inv-bajada-col">
                <p className="inv-bajada">
                  Filtros de Realidad Aumentada, sesgos algorítmicos en redes
                  sociales y estándares de belleza eurocéntricos.
                  Un ensayo visual interactivo.
                </p>
              </div>
              <div className="inv-bajada-datos">
                <p className="inv-dato">
                  <strong>+2.000M</strong>
                  <small>usuarios de filtros AR en Instagram, 2024</small>
                </p>
                <p className="inv-dato">
                  <strong>73%</strong>
                  <small>de los efectos más usados aclaran el tono de piel</small>
                </p>
                <p className="inv-dato">
                  <strong>1 rostro</strong>
                  <small>hacia el que converge el "Instagram Face" global</small>
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Separador horizontal */}
      <div className="inv-separador" aria-hidden="true" />

      {/* ========================================================
          INTRODUCCIÓN — bloque editorial
      ======================================================== */}
      <section className="inv-intro">
        <div className="container">
          <div className="inv-intro-grid">
            <p className="inv-intro-text">
              Los algoritmos de recomendación no actúan con neutralidad: amplifican
              aquello que ya fue validado, reforzando estándares pre-existentes.
              En el contexto de las redes sociales, eso significa que los rostros que
              se ajustan al canon eurocéntrico —nariz fina, ojos grandes, piel clara,
              mandíbula pequeña— circulan más, son más visibles, generan más interacción.
            </p>
            <p className="inv-intro-text">
              Los filtros de Realidad Aumentada de Instagram, TikTok y Snapchat operan
              en la misma dirección: modifican morfología facial en tiempo real, aplicando
              las mismas transformaciones que el algoritmo ya premia. El resultado es una
              doble presión: la del sistema de recomendación y la del filtro estético,
              ambos convergiendo hacia un único "ideal".
            </p>
            <p className="inv-intro-text">
              Este ensayo descompone ese mecanismo en tres fenómenos interactivos.
              Manipulá los controles: los datos responden.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================
          SECCIÓN 01 — EL SESGO DEL ALGORITMO
      ======================================================== */}
      <section className="inv-seccion" id="sesgo-algoritmo">
        <div className="container">
          <div className="inv-seccion-grid">

            {/* Número de sección en el margen */}
            <div className="inv-seccion-num" aria-hidden="true">01</div>

            <div className="inv-seccion-contenido">
              <header className="inv-seccion-header">
                <h2 className="inv-seccion-titulo">
                  El sesgo<br />del algoritmo
                </h2>
                <p className="inv-seccion-subtitulo">
                  Cómo la amplificación algorítmica construye un canon invisible
                </p>
              </header>

              <div className="inv-texto-col">
                <p>
                  Los sistemas de recomendación (EdgeRank de Facebook, el algoritmo de
                  Instagram, el For You de TikTok) usan señales de interacción
                  —likes, guardados, tiempo de visualización, comentarios— para decidir
                  qué contenido distribuir. El problema no es el mecanismo sino el sesgo
                  de los datos: si los usuarios históricamente interactuaron más con
                  ciertos tipos de rostros, el algoritmo amplificará exactamente esos rostros.
                </p>
                <p>
                  Un estudio de la Universidad de Edinburgh (2021) mostró que los modelos
                  de visión computacional asocian atributos como "atractivo" o "profesional"
                  con rasgos europeos con una frecuencia estadísticamente significativa.
                  Estos modelos alimentan los sistemas de moderación y recomendación de contenido.
                </p>
                <div className="inv-dato-destacado">
                  <span className="inv-dato-num">63%</span>
                  <span className="inv-dato-desc">
                    de las imágenes que aparecen en la primera página de búsqueda de "beautiful face"
                    en Google corresponden a rasgos caucásicos o asiáticos normativos.
                    <small>(Social Media + Society, 2022)</small>
                  </span>
                </div>
                <p>
                  Manipulá el slider de "presión algorítmica" en la demo: observá cómo
                  los rostros que se alejan del canon pierden visibilidad progresivamente.
                  No hay censura explícita. Solo recomendación del estándar.
                </p>
              </div>

              {/* Demo interactiva 01 */}
              <div className="inv-demo-bloque">
                <div className="inv-demo-etiqueta">
                  <span>DEMO INTERACTIVA</span>
                  <span>01 / FEED SIMULADO</span>
                </div>
                <SesgosAlgoritmo />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          SECCIÓN 02 — LA DISTORSIÓN MORFOLÓGICA
      ======================================================== */}
      <section className="inv-seccion inv-seccion--alt" id="distorsion-morfologica">
        <div className="container">
          <div className="inv-seccion-grid">

            <div className="inv-seccion-num" aria-hidden="true">02</div>

            <div className="inv-seccion-contenido">
              <header className="inv-seccion-header">
                <h2 className="inv-seccion-titulo">
                  La distorsión<br />morfológica
                </h2>
                <p className="inv-seccion-subtitulo">
                  Qué le hacen los filtros AR a un rostro en tiempo real
                </p>
              </header>

              <div className="inv-texto-col">
                <p>
                  FaceTune, los filtros "Beauty Mode" de TikTok, Snapchat y los efectos
                  de Instagram son aplicaciones de Realidad Aumentada que modifican la
                  morfología facial en tiempo real. No son simples filtros de color:
                  usan modelos de puntos de referencia facial (facial landmark detection)
                  para identificar y deformar partes específicas del rostro.
                </p>
                <p>
                  Las transformaciones más frecuentes siguen un patrón consistente:
                  afinado de nariz, agrandamiento de ojos, reducción de mandíbula y
                  aclaramiento de piel. Ese patrón no es arbitrario: replica el canon
                  eurocéntrico de belleza que el mercado de la moda y la publicidad
                  occidental estableció durante el siglo XX.
                </p>
                <div className="inv-dato-destacado">
                  <span className="inv-dato-num">82%</span>
                  <span className="inv-dato-desc">
                    de los filtros de "embellecimiento" en Instagram aclaran el tono de piel
                    en al menos un punto en la escala colorimétrica Fitzpatrick.
                    <small>(Beauty Filter Report, Dove — 2023)</small>
                  </span>
                </div>
                <p>
                  En la demo, los sliders aplican exactamente esas transformaciones sobre
                  un rostro construido con CSS. Presioná "APLICAR FILTRO CANON" para ver
                  cómo convergen todos los valores al mismo tiempo, como lo hace el filtro.
                </p>
              </div>

              {/* Demo interactiva 02 */}
              <div className="inv-demo-bloque">
                <div className="inv-demo-etiqueta">
                  <span>DEMO INTERACTIVA</span>
                  <span>02 / ROSTRO CSS + FILTROS</span>
                </div>
                <DistorsionMorfologica />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          SECCIÓN 03 — LA HOMOGENEIZACIÓN ESTÉTICA
      ======================================================== */}
      <section className="inv-seccion" id="homogeneizacion-estetica">
        <div className="container">
          <div className="inv-seccion-grid">

            <div className="inv-seccion-num" aria-hidden="true">03</div>

            <div className="inv-seccion-contenido">
              <header className="inv-seccion-header">
                <h2 className="inv-seccion-titulo">
                  La homogeneización<br />estética
                </h2>
                <p className="inv-seccion-subtitulo">
                  El "Instagram Face" y el efecto de convergencia global
                </p>
              </header>

              <div className="inv-texto-col">
                <p>
                  Cuando millones de personas aplican los mismos filtros, cuya lógica
                  converge hacia el mismo canon, el resultado es la homogeneización:
                  rostros radicalmente distintos comienzan a parecerse entre sí.
                  La escritora y crítica cultural Jia Tolentino denominó este fenómeno
                  "Instagram Face" en un artículo de 2019 en The New Yorker.
                </p>
                <p>
                  El efecto no es solo estético: tiene consecuencias en la percepción
                  de la propia imagen, especialmente en adolescentes. La Asociación
                  Americana de Psicología (APA, 2023) identificó el uso intensivo de
                  filtros faciales como un factor de riesgo para la dismorfia corporal,
                  la dismorfofobia por filtros (Filter Dysmorphia) y los trastornos
                  alimentarios en jóvenes de 13 a 17 años.
                </p>
                <div className="inv-dato-destacado">
                  <span className="inv-dato-num">47%</span>
                  <span className="inv-dato-desc">
                    de los adolescentes que usan filtros de belleza diariamente reportan
                    insatisfacción con su apariencia sin filtros.
                    <small>(Journal of Eating Disorders, 2022)</small>
                  </span>
                </div>
              </div>

              {/* Demo interactiva 03 */}
              <div className="inv-demo-bloque">
                <div className="inv-demo-etiqueta">
                  <span>DEMO INTERACTIVA</span>
                  <span>03 / CONVERGENCIA DE ROSTROS</span>
                </div>
                <HomogeneizacionEstetica />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          CONCLUSIÓN CRÍTICA
      ======================================================== */}
      <section className="inv-conclusion">
        <div className="container">
          <div className="inv-conclusion-grid">
            <div className="inv-conclusion-header">
              <span className="inv-conclusion-label">CONCLUSIÓN</span>
              <h2 className="inv-conclusion-titulo">
                El canon<br />no es natural
              </h2>
            </div>

            <div className="inv-conclusion-texto">
              <p>
                Los filtros de Realidad Aumentada y los algoritmos de recomendación
                no inventaron el canon eurocéntrico de belleza: lo heredaron de siglos
                de colonialismo cultural, industria cinematográfica blanca y publicidad
                occidental. Lo que sí hicieron fue escalar ese canon a nivel global,
                en tiempo real, aplicado sobre cada selfie, en cada pantalla, con cada
                apertura de la cámara. La norma dejó de ser aspiracional para volverse
                operativa: el filtro la aplica antes de que puedas elegir no hacerlo.
              </p>
              <p>
                El problema no es tecnológico sino político. Los modelos de visión
                computacional que detectan "belleza" fueron entrenados sobre datasets
                sesgados. Los equipos que diseñaron los filtros de Instagram y TikTok
                operan mayoritariamente desde Silicon Valley y Seoul, con criterios
                estéticos que no representan la diversidad morfológica humana.
                La solución técnica existe: diversificación de datasets, auditorías
                de sesgo, prohibición de modificaciones de tono de piel por defecto.
                Lo que falta es voluntad regulatoria.
              </p>
              <p>
                La arquitectura del canon no es inevitable. Es una elección de diseño.
                Y como toda elección de diseño, puede ser revisada, cuestionada,
                y rehecha desde criterios distintos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          BIBLIOGRAFÍA
      ======================================================== */}
      <footer className="inv-biblio">
        <div className="container">
          <p className="inv-biblio-titulo">BIBLIOGRAFÍA Y FUENTES</p>
          <ol className="inv-biblio-lista">
            <li>Tolentino, J. (2019). <em>The Age of Instagram Face.</em> The New Yorker. 12/12/2019.</li>
            <li>American Psychological Association. (2023). <em>Social Media and Youth Mental Health.</em> APA Advisory Committee.</li>
            <li>Dodge, J., et al. (2021). <em>Documenting Large Webtext Corpora: A Case Study on the Colossal Clean Crawled Corpus.</em> Universidad de Edinburgh / Allen AI.</li>
            <li>Cotter, K. (2019). <em>Playing the visibility game: How digital influencers and algorithms negotiate influence on Instagram.</em> New Media & Society.</li>
            <li>Dove. (2023). <em>The Dove Self-Esteem Project: Beauty Filter Report.</em> Unilever.</li>
            <li>Kleemans, M., et al. (2018). <em>Picture Perfect: The direct effect of manipulated Instagram photos on body image in adolescent girls.</em> Cyberpsychology, Behavior, and Social Networking.</li>
            <li>Fardouly, J., et al. (2022). <em>Instagram use, appearance comparisons and eating disturbances in adolescents.</em> Journal of Eating Disorders.</li>
            <li>Eubanks, V. (2018). <em>Automating Inequality: How High-Tech Tools Profile, Police, and Punish the Poor.</em> St. Martin's Press.</li>
            <li>Noble, S. U. (2018). <em>Algorithms of Oppression: How Search Engines Reinforce Racism.</em> NYU Press.</li>
          </ol>
        </div>
      </footer>

    </article>
  );
}
