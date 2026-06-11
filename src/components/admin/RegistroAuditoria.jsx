/**
 * RegistroAuditoria — historial de AdminRequests ejecutadas en la sesión.
 * Estilo terminal: fondo negro, texto verde eléctrico monoespaciado.
 * Refuerza la defensa oral demostrando el uso de la clase AdminRequest.
 */
import './RegistroAuditoria.css';

export default function RegistroAuditoria({ historial }) {
  return (
    <div className="auditoria-wrapper">
      <div className="auditoria-header">
        <span className="auditoria-prompt">$</span>
        <span className="auditoria-titulo">REGISTRO DE AUDITORÍA</span>
        <span className="auditoria-count">{historial.length} OPERACIONES</span>
      </div>

      <div className="auditoria-terminal" aria-live="polite">
        {historial.length === 0 ? (
          <p className="auditoria-vacio">
            <span className="auditoria-cursor">_</span>
            Sin operaciones registradas en esta sesión.
          </p>
        ) : (
          /* Mostrar más reciente primero */
          [...historial].reverse().map((req) => (
            <div key={req.id} className="auditoria-linea">
              <span className="auditoria-ts">[{req.timestamp}]</span>
              {' '}
              <span className={`auditoria-action auditoria-action--${req.action.toLowerCase()}`}>
                {req.action}
              </span>
              {' '}
              <span className="auditoria-entity">/{req.entity}</span>
              {' '}
              <span className="auditoria-author">by {req.author}</span>
              {req.action !== 'DELETE' && req.payload?.titulo && (
                <span className="auditoria-payload"> → "{req.payload.titulo}"</span>
              )}
              {req.action === 'DELETE' && req.payload?.titulo && (
                <span className="auditoria-payload auditoria-payload--del"> ✕ "{req.payload.titulo}"</span>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
