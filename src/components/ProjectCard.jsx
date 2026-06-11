import "./ProjectCard.css";

/* Tarjeta individual de proyecto. Recibe props desestructuradas desde Home. */
export default function ProjectCard({
  titulo,
  categoria,
  anio,
  descripcion,
  tags,
  imagen,
  destacado,
  likes,
}) {
  return (
    <article className={`project-card${destacado ? " project-card--destacado" : ""}`}>
      {/* Imagen con borde inferior sólido */}
      <div className="project-card__imagen-wrap">
        <img
          src={imagen}
          alt={titulo}
          className="project-card__imagen"
          loading="lazy"
        />
        {/* Año superpuesto en esquina inferior derecha */}
        <span className="project-card__anio">{anio}</span>
      </div>

      <div className="project-card__cuerpo">
        {/* Categoría como sello de imprenta */}
        <span className="tag-brutal project-card__categoria">{categoria}</span>

        <h3 className="project-card__titulo">{titulo}</h3>
        <p className="project-card__descripcion">{descripcion}</p>

        {/* Tags secundarios */}
        <ul className="project-card__tags" aria-label="Tecnologías">
          {tags.map((tag) => (
            <li key={tag} className="tag-brutal project-card__tag-item">
              {tag}
            </li>
          ))}
        </ul>

        {/* Likes en mono, al pie */}
        <footer className="project-card__footer">
          <span className="project-card__likes" aria-label="Likes">
            ♥ {likes}
          </span>
          {destacado && (
            <span className="project-card__badge">DESTACADO</span>
          )}
        </footer>
      </div>
    </article>
  );
}
