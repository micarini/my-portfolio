/**
 * AccesoRestringido — pantalla de bloqueo para usuarios sin rol admin.
 * Composición tipográfica gigante + franja diagonal + botón de reintento.
 */
import './AccesoRestringido.css';

export default function AccesoRestringido({ usuario, onReintentar }) {
  return (
    <div className="restringido-wrapper">
      {/* Franja diagonal negra */}
      <div className="restringido-franja" aria-hidden="true">
        <span className="restringido-franja-texto">
          ACCESO RESTRINGIDO &nbsp;&nbsp;· &nbsp;&nbsp;ACCESO RESTRINGIDO
          &nbsp;&nbsp;· &nbsp;&nbsp;ACCESO RESTRINGIDO &nbsp;&nbsp;·
        </span>
      </div>

      {/* Cuerpo central */}
      <div className="restringido-cuerpo">
        {/* Tipografía gigante */}
        <p className="restringido-giant" aria-label="Sin permiso">NO</p>
        <p className="restringido-giant restringido-giant--stroke">AUTH</p>

        <div className="restringido-bloque">
          <p className="restringido-mensaje">
            El usuario <strong>{usuario?.name}</strong> no tiene permisos de
            administrador para acceder a este panel.
          </p>
          <p className="restringido-sub">
            Código de estado: <span className="restringido-codigo">403 FORBIDDEN</span>
          </p>
        </div>

        <button
          className="btn-brutal btn-brutal--accent restringido-btn"
          onClick={onReintentar}
        >
          ← VOLVER A INTENTAR
        </button>
      </div>
    </div>
  );
}
