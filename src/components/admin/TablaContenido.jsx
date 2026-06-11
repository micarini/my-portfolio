/**
 * TablaContenido — CRUD completo sobre el array de contenido.
 * Operaciones: Agregar, Editar (carga en formulario), Borrar (con confirmación inline).
 * Cada acción instancia AdminRequest y registra en historial.
 */
import { useState } from 'react';
import AdminRequest from '../../models/AdminRequest.js';
import './TablaContenido.css';

/* Formulario vacío por defecto */
const FORM_VACIO = {
  titulo: '',
  categoria: '',
  anio: new Date().getFullYear(),
  descripcion: '',
  tags: '',        // se ingresa como string separado por comas
  imagen: '',
  destacado: false,
};

export default function TablaContenido({ contenido, setContenido, adminNombre, onNuevaRequest }) {
  // ID del ítem en edición (null = modo creación)
  const [editandoId, setEditandoId] = useState(null);
  // Datos del formulario
  const [form, setForm] = useState(FORM_VACIO);
  // ID del ítem con confirmación de borrado pendiente
  const [confirmandoBorradoId, setConfirmandoBorradoId] = useState(null);
  // Mostrar/ocultar el formulario
  const [mostrarForm, setMostrarForm] = useState(false);

  /* --- Helpers de formulario --- */

  function handleCampoChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }

  function resetForm() {
    setForm(FORM_VACIO);
    setEditandoId(null);
    setMostrarForm(false);
  }

  /* --- Handlers CRUD --- */

  function handleCrear(e) {
    e.preventDefault();

    // Calcular nuevo ID: max existente + 1
    const nuevoId =
      contenido.length > 0
        ? Math.max(...contenido.map((c) => c.id)) + 1
        : 1;

    const nuevo = {
      ...form,
      id: nuevoId,
      anio: parseInt(form.anio, 10),
      // Convertir el string de tags a array
      tags: form.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      likes: 0,
      destacado: Boolean(form.destacado),
    };

    // POO obligatorio: instanciar y loguear la petición
    const req = new AdminRequest('CREATE', 'contenido', nuevo, adminNombre).log();
    onNuevaRequest(req);

    // Actualizar estado de forma inmutable
    setContenido((prev) => [...prev, nuevo]);
    resetForm();
  }

  function handleCargarEdicion(item) {
    setEditandoId(item.id);
    setForm({
      titulo: item.titulo,
      categoria: item.categoria,
      anio: item.anio,
      descripcion: item.descripcion,
      tags: Array.isArray(item.tags) ? item.tags.join(', ') : item.tags,
      imagen: item.imagen,
      destacado: Boolean(item.destacado),
    });
    setMostrarForm(true);
    // Scroll al formulario
    setTimeout(() => {
      document.getElementById('form-contenido')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 50);
  }

  function handleEditar(e) {
    e.preventDefault();

    const actualizado = {
      ...contenido.find((c) => c.id === editandoId),
      ...form,
      anio: parseInt(form.anio, 10),
      tags: form.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      destacado: Boolean(form.destacado),
    };

    // POO obligatorio
    const req = new AdminRequest('UPDATE', 'contenido', actualizado, adminNombre).log();
    onNuevaRequest(req);

    // Actualizar con .map() inmutable
    setContenido((prev) =>
      prev.map((c) => (c.id === editandoId ? actualizado : c))
    );
    resetForm();
  }

  function handleSolicitarBorrado(id) {
    setConfirmandoBorradoId(id);
  }

  function handleCancelarBorrado() {
    setConfirmandoBorradoId(null);
  }

  function handleBorrar(id) {
    const item = contenido.find((c) => c.id === id);

    // POO obligatorio
    const req = new AdminRequest('DELETE', 'contenido', item, adminNombre).log();
    onNuevaRequest(req);

    // Actualizar con .filter() inmutable
    setContenido((prev) => prev.filter((c) => c.id !== id));
    setConfirmandoBorradoId(null);

    // Si se borraba el ítem en edición, limpiar el formulario
    if (editandoId === id) resetForm();
  }

  const modoEdicion = editandoId !== null;

  return (
    <div className="tc-wrapper">
      {/* Botón para abrir el formulario de nuevo ítem */}
      {!mostrarForm && (
        <div className="tc-toolbar">
          <button
            className="btn-brutal btn-brutal--accent"
            onClick={() => { resetForm(); setMostrarForm(true); }}
          >
            + AGREGAR CONTENIDO
          </button>
        </div>
      )}

      {/* Formulario de creación / edición */}
      {mostrarForm && (
        <form
          id="form-contenido"
          className="tc-form"
          onSubmit={modoEdicion ? handleEditar : handleCrear}
          noValidate
        >
          <div className="tc-form-header">
            <span className="tc-form-titulo">
              {modoEdicion ? `EDITANDO: ${form.titulo || '—'}` : 'NUEVO CONTENIDO'}
            </span>
            <button
              type="button"
              className="btn-brutal tc-form-cerrar"
              onClick={resetForm}
            >
              ✕ CANCELAR
            </button>
          </div>

          <div className="tc-form-grid">
            {/* Título */}
            <div className="tc-campo tc-campo--full">
              <label className="tc-label" htmlFor="fc-titulo">TÍTULO</label>
              <input
                id="fc-titulo"
                className="tc-input"
                type="text"
                name="titulo"
                value={form.titulo}
                onChange={handleCampoChange}
                placeholder="Título del proyecto"
                required
              />
            </div>

            {/* Categoría */}
            <div className="tc-campo">
              <label className="tc-label" htmlFor="fc-categoria">CATEGORÍA</label>
              <input
                id="fc-categoria"
                className="tc-input"
                type="text"
                name="categoria"
                value={form.categoria}
                onChange={handleCampoChange}
                placeholder="Ej: Desarrollo Web"
                required
              />
            </div>

            {/* Año */}
            <div className="tc-campo">
              <label className="tc-label" htmlFor="fc-anio">AÑO</label>
              <input
                id="fc-anio"
                className="tc-input"
                type="number"
                name="anio"
                value={form.anio}
                onChange={handleCampoChange}
                min="2000"
                max="2099"
                required
              />
            </div>

            {/* Descripción */}
            <div className="tc-campo tc-campo--full">
              <label className="tc-label" htmlFor="fc-descripcion">DESCRIPCIÓN</label>
              <textarea
                id="fc-descripcion"
                className="tc-input tc-textarea"
                name="descripcion"
                value={form.descripcion}
                onChange={handleCampoChange}
                placeholder="Descripción breve del proyecto..."
                rows={3}
                required
              />
            </div>

            {/* Tags */}
            <div className="tc-campo tc-campo--full">
              <label className="tc-label" htmlFor="fc-tags">
                TAGS <span className="tc-label-hint">(separados por coma)</span>
              </label>
              <input
                id="fc-tags"
                className="tc-input"
                type="text"
                name="tags"
                value={form.tags}
                onChange={handleCampoChange}
                placeholder="React, CSS, API REST"
              />
            </div>

            {/* Imagen */}
            <div className="tc-campo tc-campo--full">
              <label className="tc-label" htmlFor="fc-imagen">URL DE IMAGEN</label>
              <input
                id="fc-imagen"
                className="tc-input"
                type="url"
                name="imagen"
                value={form.imagen}
                onChange={handleCampoChange}
                placeholder="https://..."
              />
            </div>

            {/* Destacado */}
            <div className="tc-campo tc-campo--check">
              <label className="tc-label-check">
                <input
                  className="tc-checkbox"
                  type="checkbox"
                  name="destacado"
                  checked={form.destacado}
                  onChange={handleCampoChange}
                />
                <span>DESTACADO</span>
              </label>
            </div>
          </div>

          <div className="tc-form-actions">
            <button type="submit" className="btn-brutal btn-brutal--accent">
              {modoEdicion ? '✓ GUARDAR CAMBIOS' : '+ CREAR CONTENIDO'}
            </button>
            <button type="button" className="btn-brutal" onClick={resetForm}>
              CANCELAR
            </button>
          </div>
        </form>
      )}

      {/* Tabla de contenido */}
      <div className="tabla-scroll">
        <table className="tabla-brutal">
          <thead>
            <tr>
              <th>ID</th>
              <th>TÍTULO</th>
              <th>CATEGORÍA</th>
              <th>AÑO</th>
              <th>TAGS</th>
              <th>DEST.</th>
              <th>LIKES</th>
              <th>ACCIONES</th>
            </tr>
          </thead>
          <tbody>
            {contenido.length === 0 && (
              <tr>
                <td colSpan={8} className="tc-vacio">
                  No hay contenido registrado.
                </td>
              </tr>
            )}
            {contenido.map((item) => (
              <tr
                key={item.id}
                className={editandoId === item.id ? 'tc-fila-activa' : ''}
              >
                <td className="tabla-mono tc-id">#{item.id}</td>
                <td>
                  <span className="tc-titulo-celda">{item.titulo}</span>
                  <span className="tc-desc-celda">{item.descripcion?.slice(0, 60)}…</span>
                </td>
                <td>
                  <span className="tag-brutal">{item.categoria}</span>
                </td>
                <td className="tabla-mono">{item.anio}</td>
                <td>
                  <div className="tc-tags">
                    {(Array.isArray(item.tags) ? item.tags : []).slice(0, 3).map((t) => (
                      <span key={t} className="tag-brutal tc-tag-item">{t}</span>
                    ))}
                  </div>
                </td>
                <td className="tabla-mono">
                  {item.destacado ? (
                    <span className="tabla-badge tabla-badge--admin">★</span>
                  ) : (
                    <span className="tabla-badge tabla-badge--no">—</span>
                  )}
                </td>
                <td className="tabla-mono tabla-num">{item.likes}</td>

                {/* Celda de acciones */}
                <td className="tc-acciones">
                  {confirmandoBorradoId === item.id ? (
                    /* Confirmación de borrado inline */
                    <div className="tc-confirm">
                      <span className="tc-confirm-texto">¿Borrar?</span>
                      <button
                        className="btn-brutal btn-brutal--danger tc-btn-sm"
                        onClick={() => handleBorrar(item.id)}
                      >
                        SÍ
                      </button>
                      <button
                        className="btn-brutal tc-btn-sm"
                        onClick={handleCancelarBorrado}
                      >
                        NO
                      </button>
                    </div>
                  ) : (
                    <>
                      <button
                        className="btn-brutal tc-btn-sm"
                        onClick={() => handleCargarEdicion(item)}
                        title="Editar ítem"
                      >
                        EDITAR
                      </button>
                      <button
                        className="btn-brutal btn-brutal--danger tc-btn-sm"
                        onClick={() => handleSolicitarBorrado(item.id)}
                        title="Eliminar ítem"
                      >
                        BORRAR
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
