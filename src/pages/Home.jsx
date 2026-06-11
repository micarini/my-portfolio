import { useState, useEffect } from "react";
import ProjectCard from "../components/ProjectCard.jsx";
import "./Home.css";

export default function Home() {
  /* --- Estados reactivos (consigna: los tres explícitos) --- */
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [proyectos, setProyectos] = useState([]);

  /* Estado de filtro por categoría */
  const [filtro, setFiltro] = useState("TODOS");

  /* --- Carga asincrónica estricta según consigna --- */
  useEffect(() => {
    async function cargarProyectos() {
      try {
        const res = await fetch("/contenido.json");
        if (!res.ok) {
          throw new Error(`Error HTTP ${res.status}: no se pudo cargar el contenido.`);
        }
        const datos = await res.json();
        setProyectos(datos);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    cargarProyectos();
  }, []);

  /* --- Categorías únicas para el filtro --- */
  const categorias = ["TODOS", ...new Set(proyectos.map((p) => p.categoria))];

  /* Proyectos filtrados según selección */
  const proyectosFiltrados =
    filtro === "TODOS"
      ? proyectos
      : proyectos.filter((p) => p.categoria === filtro);

  /* =====================================================================
     RENDER — estado de carga
  ===================================================================== */
  if (loading) {
    return (
      <div className="home-loading">
        <span className="home-loading__texto">CARGANDO</span>
        <div className="home-loading__barra" aria-hidden="true" />
        <p className="home-loading__sub">// obteniendo proyectos...</p>
      </div>
    );
  }

  /* =====================================================================
     RENDER — estado de error
  ===================================================================== */
  if (error) {
    return (
      <div className="container">
        <div className="home-error" role="alert">
          <span className="home-error__etiqueta">ERROR</span>
          <p className="home-error__mensaje">{error}</p>
          <p className="home-error__hint">
            Revisá la consola o verificá que /contenido.json sea accesible.
          </p>
        </div>
      </div>
    );
  }

  /* =====================================================================
     RENDER — galería
  ===================================================================== */
  return (
    <div className="home">
      {/* ----------------------------------------------------------------
          HERO — carta de presentación editorial
      ---------------------------------------------------------------- */}
      <section className="home-hero">
        <div className="container home-hero__inner">
          {/* Número de edición / issue brutalista */}
          <div className="home-hero__meta">
            <span className="home-hero__issue">N° 001</span>
            <span className="home-hero__linea" aria-hidden="true" />
            <span className="home-hero__fecha">2024 — 2026</span>
          </div>

          {/* Nombre gigantesco */}
          <h1 className="home-hero__nombre">MIA<br />CARINI<br />ROJO</h1>

          {/* Subtítulo descriptivo */}
          <p className="home-hero__subtitulo">
            Estudiante de Tecnología Multimedial — Diseño editorial + código
          </p>

          {/* Ficha técnica en mono */}
          <dl className="home-hero__ficha">
            <div className="home-hero__ficha-fila">
              <dt>CARRERA</dt>
              <dd>Tecnología Multimedial — UMAI</dd>
            </div>
            <div className="home-hero__ficha-fila">
              <dt>ESPECIALIDAD</dt>
              <dd>Diseño editorial &amp; desarrollo web</dd>
            </div>
            <div className="home-hero__ficha-fila">
              <dt>AÑO</dt>
              <dd>2026 / 3° año</dd>
            </div>
            <div className="home-hero__ficha-fila">
              <dt>INTERESES</dt>
              <dd>Brutalismo, tipografía, interfaces críticas</dd>
            </div>
          </dl>

          {/* Columna de texto editorial */}
          <p className="home-hero__bio">
            Este portfolio es un registro de proceso. No una vitrina pulida,
            sino un diario de trabajo: experimentos fallidos y exitosos,
            decisiones de diseño documentadas y código que intenta ser legible.
            Cada proyecto tiene fecha, contexto y razón de ser.
          </p>
        </div>
      </section>

      {/* ----------------------------------------------------------------
          SEPARADOR EDITORIAL
      ---------------------------------------------------------------- */}
      <div className="home-separador" aria-hidden="true">
        <div className="container">
          <span>TRABAJOS &amp; PROYECTOS — {proyectos.length} ENTRADAS</span>
        </div>
      </div>

      {/* ----------------------------------------------------------------
          FILTROS POR CATEGORÍA
      ---------------------------------------------------------------- */}
      <section className="home-filtros container" aria-label="Filtrar por categoría">
        {categorias.map((cat) => (
          <button
            key={cat}
            className={`btn-brutal home-filtros__btn${filtro === cat ? " home-filtros__btn--activo" : ""}`}
            onClick={() => setFiltro(cat)}
            aria-pressed={filtro === cat}
          >
            {cat}
          </button>
        ))}
      </section>

      {/* ----------------------------------------------------------------
          GALERÍA DE PROYECTOS — grilla de periódico rota
      ---------------------------------------------------------------- */}
      <section className="home-galeria container" aria-label="Galería de proyectos">
        {proyectosFiltrados.length === 0 ? (
          <p className="home-galeria__vacio">
            // Sin proyectos en esta categoría.
          </p>
        ) : (
          <div className="home-galeria__grid">
            {proyectosFiltrados.map((proyecto) => (
              <ProjectCard key={proyecto.id} {...proyecto} />
            ))}
          </div>
        )}
      </section>

      {/* ----------------------------------------------------------------
          PIE DE SECCIÓN
      ---------------------------------------------------------------- */}
      <div className="home-pie container" aria-hidden="true">
        <span>FIN DEL ÍNDICE</span>
        <span className="home-pie__linea" />
        <span>// MIA CARINI ROJO — 2026</span>
      </div>
    </div>
  );
}
