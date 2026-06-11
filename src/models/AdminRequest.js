/**
 * AdminRequest — clase nativa de JS que modela cada operación del panel admin
 * como un objeto de petición estructurado (como lo haría una API real).
 *
 * Requisito de la consigna: ante cada Crear / Editar / Borrar se instancia
 * esta clase y el objeto resultante se loguea en consola.
 */
export default class AdminRequest {
  /**
   * @param {'CREATE'|'UPDATE'|'DELETE'} action - verbo de la operación
   * @param {'contenido'|'usuarios'} entity - colección afectada
   * @param {object} payload - los datos involucrados en la operación
   * @param {string} author - nombre del admin que ejecuta la acción
   */
  constructor(action, entity, payload, author) {
    this.id = crypto.randomUUID();
    this.action = action;
    this.entity = entity;
    this.payload = payload;
    this.author = author;
    this.timestamp = new Date().toISOString();
  }

  /** Resumen legible de la petición, útil para auditoría. */
  describe() {
    return `[${this.timestamp}] ${this.action} sobre "${this.entity}" por ${this.author}`;
  }

  /** Loguea la petición en consola y se devuelve a sí misma (encadenable). */
  log() {
    console.log(
      `%c ADMIN REQUEST %c ${this.describe()}`,
      'background:#111111;color:#00e05a;font-weight:bold;padding:2px 6px;',
      'color:#3c2e1e;',
    );
    console.log(this);
    return this;
  }
}
