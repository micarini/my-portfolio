<script setup>
import { ref, reactive } from 'vue'
import AdminRequest from '../../models/AdminRequest.js'

// Props y emits
const props = defineProps({
  contenido: {
    type: Array,
    required: true
  },
  autorAdmin: {
    type: String,
    required: true
  }
})

// El padre escucha estos eventos para mantener su ref actualizado
// y para agregar cada AdminRequest al historial de auditoría
const emit = defineEmits(['crear', 'editar', 'borrar', 'auditoria'])

// ─── Estado del formulario de creación / edición ───────────────────────────

const FORM_VACIO = {
  titulo: '',
  categoria: '',
  anio: new Date().getFullYear(),
  imagen: '',
  destacado: false
}

const mostrarFormCrear = ref(false)
const formCrear = reactive({ ...FORM_VACIO })

// Para edición guardamos el id original
const editandoId = ref(null)
const formEditar = reactive({ ...FORM_VACIO })

// Confirmación de borrado inline (no window.confirm)
const confirmandoBorrarId = ref(null)

// ─── Helpers ──────────────────────────────────────────────────────────────

function idNuevo(lista) {
  if (lista.length === 0) return 1
  return Math.max(...lista.map((i) => i.id)) + 1
}

// ─── Crear ────────────────────────────────────────────────────────────────

function abrirFormCrear() {
  Object.assign(formCrear, FORM_VACIO)
  mostrarFormCrear.value = true
  editandoId.value = null
  confirmandoBorrarId.value = null
}

function cancelarCrear() {
  mostrarFormCrear.value = false
}

function submitCrear() {
  const nuevoItem = {
    id: idNuevo(props.contenido),
    titulo: formCrear.titulo.trim(),
    categoria: formCrear.categoria.trim(),
    anio: Number(formCrear.anio),
    imagen: formCrear.imagen.trim() || `https://picsum.photos/seed/${Date.now()}/800/600`,
    destacado: formCrear.destacado,
  }

  /*
   * POO OBLIGATORIO: se instancia AdminRequest ante cada operación.
   * .log() es encadenable y devuelve la misma instancia, que queda
   * disponible para el registro de auditoría.
   */
  const req = new AdminRequest('CREATE', 'contenido', nuevoItem, props.autorAdmin).log()

  emit('crear', nuevoItem)
  emit('auditoria', req)
  mostrarFormCrear.value = false
}

// ─── Editar ───────────────────────────────────────────────────────────────

function abrirEditar(item) {
  editandoId.value = item.id
  Object.assign(formEditar, {
    titulo: item.titulo,
    categoria: item.categoria,
    anio: item.anio,
    imagen: item.imagen,
    destacado: item.destacado
  })
  mostrarFormCrear.value = false
  confirmandoBorrarId.value = null
}

function cancelarEditar() {
  editandoId.value = null
}

function submitEditar(item) {
  const actualizado = {
    ...item,
    titulo: formEditar.titulo.trim(),
    categoria: formEditar.categoria.trim(),
    anio: Number(formEditar.anio),
    imagen: formEditar.imagen.trim(),
    destacado: formEditar.destacado
  }

  const req = new AdminRequest('UPDATE', 'contenido', actualizado, props.autorAdmin).log()

  emit('editar', actualizado)
  emit('auditoria', req)
  editandoId.value = null
}

// ─── Borrar ───────────────────────────────────────────────────────────────

function pedirConfirmacion(id) {
  confirmandoBorrarId.value = id
  editandoId.value = null
}

function cancelarBorrar() {
  confirmandoBorrarId.value = null
}

function confirmarBorrar(item) {
  const req = new AdminRequest('DELETE', 'contenido', { id: item.id, titulo: item.titulo }, props.autorAdmin).log()

  emit('borrar', item.id)
  emit('auditoria', req)
  confirmandoBorrarId.value = null
}
</script>

<template>
  <div class="tc-wrapper">
    <!-- Botón para abrir el formulario de nuevo contenido -->
    <div class="tc-acciones-top">
      <button
        v-if="!mostrarFormCrear"
        class="btn-brutal btn-brutal--accent tc-btn-nuevo"
        @click="abrirFormCrear"
      >
        + Agregar contenido
      </button>
    </div>

    <!-- ── Formulario de creación ─────────────────────────── -->
    <div
      v-if="mostrarFormCrear"
      class="tc-form-panel"
    >
      <div class="tc-form-cabecera">
        <span class="tc-form-titulo">Nuevo contenido</span>
        <button
          class="btn-brutal tc-btn-cancelar"
          @click="cancelarCrear"
        >
          ✕ Cancelar
        </button>
      </div>

      <form
        class="tc-form"
        @submit.prevent="submitCrear"
      >
        <div class="tc-form-fila tc-form-fila--2">
          <div class="tc-form-campo">
            <label class="tc-form-label">Título *</label>
            <input
              v-model="formCrear.titulo"
              class="tc-form-input"
              type="text"
              required
              placeholder="Ej: Mi proyecto"
            >
          </div>
          <div class="tc-form-campo">
            <label class="tc-form-label">Categoría *</label>
            <input
              v-model="formCrear.categoria"
              class="tc-form-input"
              type="text"
              required
              placeholder="Ej: Desarrollo Web"
            >
          </div>
        </div>

        <div class="tc-form-fila tc-form-fila--2">
          <div class="tc-form-campo">
            <label class="tc-form-label">Año *</label>
            <input
              v-model="formCrear.anio"
              class="tc-form-input"
              type="number"
              required
              min="2000"
              max="2099"
            >
          </div>
        </div>

        <div class="tc-form-campo">
          <label class="tc-form-label">Imagen (ruta o URL)</label>
          <input
            v-model="formCrear.imagen"
            class="tc-form-input"
            type="text"
            placeholder="/proyectos/foto.png o https://..."
          >
        </div>

        <div class="tc-form-check">
          <label class="tc-form-check-label">
            <input
              v-model="formCrear.destacado"
              type="checkbox"
              class="tc-form-checkbox"
            >
            Marcar como destacado
          </label>
        </div>

        <div class="tc-form-submit">
          <button
            type="submit"
            class="btn-brutal btn-brutal--accent"
          >
            Crear contenido
          </button>
          <button
            type="button"
            class="btn-brutal"
            @click="cancelarCrear"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>

    <!-- ── Tabla de contenido ─────────────────────────────── -->
    <div class="tabla-overflow">
      <table class="tabla-brutal tc-tabla">
        <thead>
          <tr>
            <th>ID</th>
            <th>Título</th>
            <th>Categoría</th>
            <th>Año</th>
            <th>Dest.</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <template
            v-for="item in props.contenido"
            :key="item.id"
          >
            <!-- Fila normal -->
            <tr
              v-if="editandoId !== item.id"
              :class="{ 'tc-fila--destacado': item.destacado }"
            >
              <td class="tc-celda--id">
                {{ item.id }}
              </td>
              <td class="tc-celda--titulo">
                {{ item.titulo }}
              </td>
              <td class="tc-celda--cat">
                <span class="tag-brutal">{{ item.categoria }}</span>
              </td>
              <td class="tc-celda--anio">
                {{ item.anio }}
              </td>
              <td class="tc-celda--bool">
                <span :class="item.destacado ? 'tc-star--si' : 'tc-star--no'">
                  {{ item.destacado ? '★' : '☆' }}
                </span>
              </td>
              <td class="tc-celda--acciones">
                <!-- Confirmar borrado inline -->
                <div
                  v-if="confirmandoBorrarId === item.id"
                  class="tc-confirmar-borrar"
                >
                  <span class="tc-confirmar-texto">¿Borrar?</span>
                  <button
                    class="btn-brutal btn-brutal--danger tc-btn-accion"
                    @click="confirmarBorrar(item)"
                  >
                    Sí
                  </button>
                  <button
                    class="btn-brutal tc-btn-accion"
                    @click="cancelarBorrar"
                  >
                    No
                  </button>
                </div>
                <div
                  v-else
                  class="tc-acciones-fila"
                >
                  <button
                    class="btn-brutal tc-btn-accion"
                    @click="abrirEditar(item)"
                  >
                    Editar
                  </button>
                  <button
                    class="btn-brutal btn-brutal--danger tc-btn-accion"
                    @click="pedirConfirmacion(item.id)"
                  >
                    Borrar
                  </button>
                </div>
              </td>
            </tr>

            <!-- Fila en modo edición (inline) -->
            <tr
              v-else
              class="tc-fila--editando"
            >
              <td
                colspan="6"
                class="tc-celda--form-editar"
              >
                <div class="tc-form-panel tc-form-panel--inline">
                  <div class="tc-form-cabecera">
                    <span class="tc-form-titulo">Editando: {{ item.titulo }}</span>
                    <button
                      class="btn-brutal tc-btn-cancelar"
                      @click="cancelarEditar"
                    >
                      ✕ Cancelar
                    </button>
                  </div>
                  <form
                    class="tc-form"
                    @submit.prevent="submitEditar(item)"
                  >
                    <div class="tc-form-fila tc-form-fila--2">
                      <div class="tc-form-campo">
                        <label class="tc-form-label">Título *</label>
                        <input
                          v-model="formEditar.titulo"
                          class="tc-form-input"
                          type="text"
                          required
                        >
                      </div>
                      <div class="tc-form-campo">
                        <label class="tc-form-label">Categoría *</label>
                        <input
                          v-model="formEditar.categoria"
                          class="tc-form-input"
                          type="text"
                          required
                        >
                      </div>
                    </div>
                    <div class="tc-form-fila tc-form-fila--2">
                      <div class="tc-form-campo">
                        <label class="tc-form-label">Año *</label>
                        <input
                          v-model="formEditar.anio"
                          class="tc-form-input"
                          type="number"
                          required
                          min="2000"
                          max="2099"
                        >
                      </div>
                    </div>
                    <div class="tc-form-campo">
                      <label class="tc-form-label">Imagen (ruta o URL)</label>
                      <input
                        v-model="formEditar.imagen"
                        class="tc-form-input"
                        type="text"
                      >
                    </div>
                    <div class="tc-form-check">
                      <label class="tc-form-check-label">
                        <input
                          v-model="formEditar.destacado"
                          type="checkbox"
                          class="tc-form-checkbox"
                        >
                        Destacado
                      </label>
                    </div>
                    <div class="tc-form-submit">
                      <button
                        type="submit"
                        class="btn-brutal btn-brutal--accent"
                      >
                        Guardar cambios
                      </button>
                      <button
                        type="button"
                        class="btn-brutal"
                        @click="cancelarEditar"
                      >
                        Cancelar
                      </button>
                    </div>
                  </form>
                </div>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>

    <p
      v-if="props.contenido.length === 0"
      class="tabla-vacia"
    >
      No hay contenido registrado.
    </p>
  </div>
</template>

<style scoped>
/* TablaContenido — CRUD, look alineado con las demos (redondeado, suave, celeste) */

.tc-wrapper {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.tc-acciones-top {
  display: flex;
  justify-content: flex-end;
}

.tc-btn-nuevo {
  letter-spacing: 0.1em;
}

/* ── Tabla (contenedor redondeado, separadores finos) ── */
.tabla-overflow {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  border: 1px solid var(--glass-border);
  border-radius: 12px;
}

.tabla-brutal {
  width: 100%;
  border-collapse: collapse;
  font-family: var(--font-mono);
  font-size: var(--text-small);
  min-width: 560px;
}

.tabla-brutal thead tr {
  background: var(--color-sepia);
}

.tabla-brutal thead th {
  padding: 0.7rem 1rem;
  font-family: var(--font-mono);
  font-size: var(--text-micro);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  text-align: left;
  white-space: nowrap;
  color: color-mix(in srgb, var(--color-paper) 60%, transparent);
  border-bottom: 1px solid var(--glass-border);
}

.tabla-brutal tbody td {
  padding: 0.65rem 1rem;
  vertical-align: middle;
  color: var(--color-paper);
  border-bottom: 1px solid var(--glass-border);
}

.tabla-brutal tbody tr:last-child td {
  border-bottom: none;
}

.tc-fila--destacado td {
  background: color-mix(in srgb, var(--color-primary) 8%, transparent);
}

.tabla-brutal tbody tr:hover td {
  background: rgba(255, 255, 255, 0.03);
}

.tc-fila--editando td {
  background: var(--color-sepia) !important;
  padding: 0;
}

/* ── Tipos de celda ──────────────────────────────── */

.tc-celda--id {
  font-size: var(--text-micro);
  color: color-mix(in srgb, var(--color-paper) 45%, transparent);
  width: 40px;
  text-align: center;
}

.tc-celda--titulo {
  font-weight: 700;
  font-size: var(--text-small);
  min-width: 140px;
  max-width: 220px;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.tc-celda--cat {
  white-space: nowrap;
}

.tc-celda--anio {
  text-align: center;
  white-space: nowrap;
  width: 60px;
}

.tc-celda--bool {
  text-align: center;
  width: 50px;
}

.tc-star--si {
  color: var(--color-primary);
  font-size: 1.1rem;
}

.tc-star--no {
  color: color-mix(in srgb, var(--color-paper) 30%, transparent);
  font-size: 1.1rem;
}

.tc-celda--num {
  text-align: center;
  font-weight: 700;
  width: 55px;
}

.tc-celda--acciones {
  white-space: nowrap;
  width: 160px;
}

.tc-celda--form-editar {
  padding: 0 !important;
}

/* Categoría como pill (override del .tag-brutal global) */
.tag-brutal {
  border: none;
  border-radius: 999px;
  background: color-mix(in srgb, var(--color-paper) 10%, transparent);
  color: color-mix(in srgb, var(--color-paper) 75%, transparent);
  padding: 0.12rem 0.6rem;
}

/* ── Acciones por fila ───────────────────────────── */

.tc-acciones-fila {
  display: flex;
  gap: 0.4rem;
}

.tc-btn-accion {
  font-size: var(--text-micro);
  padding: 0.35rem 0.8rem;
  letter-spacing: 0.06em;
}

/* ── Confirmación inline de borrado ─────────────── */

.tc-confirmar-borrar {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.tc-confirmar-texto {
  font-family: var(--font-mono);
  font-size: var(--text-micro);
  font-weight: 700;
  text-transform: uppercase;
  color: var(--color-surreal);
  letter-spacing: 0.08em;
}

/* ── Panel de formulario (crear / editar inline) ── */

.tc-form-panel {
  border: 1px solid var(--glass-border);
  border-radius: 14px;
  background: var(--color-sepia);
  padding: var(--space-3);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.35);
}

.tc-form-panel--inline {
  border: none;
  border-radius: 0;
  box-shadow: none;
  background: transparent;
  padding: var(--space-2) var(--space-3);
}

.tc-form-cabecera {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-2);
  padding-bottom: var(--space-1);
  border-bottom: 1px solid var(--glass-border);
}

.tc-form-titulo {
  font-family: var(--font-display);
  font-size: var(--text-body);
  letter-spacing: 0.02em;
  color: var(--color-paper);
}

.tc-btn-cancelar {
  font-size: var(--text-micro);
  padding: 0.35rem 0.8rem;
  letter-spacing: 0.06em;
}

/* ── Campos del formulario ───────────────────────── */

.tc-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.tc-form-fila {
  display: flex;
  gap: var(--space-2);
  flex-wrap: wrap;
}

.tc-form-fila--2 > .tc-form-campo {
  flex: 1 1 200px;
}

.tc-form-campo {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.tc-form-label {
  font-family: var(--font-mono);
  font-size: var(--text-micro);
  text-transform: uppercase;
  letter-spacing: 0.14em;
  font-weight: 700;
  color: color-mix(in srgb, var(--color-paper) 55%, transparent);
}

.tc-form-input {
  font-family: var(--font-mono);
  font-size: var(--text-small);
  color: var(--color-paper);
  background: var(--color-ink);
  border: 1px solid var(--glass-border);
  border-radius: 8px;
  padding: 0.6rem 0.8rem;
  outline: none;
  width: 100%;
  transition: border-color 160ms ease, box-shadow 160ms ease;
  resize: vertical;
}

.tc-form-input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-primary) 25%, transparent);
}

.tc-form-textarea {
  min-height: 80px;
}

/* ── Checkbox destacado ──────────────────────────── */

.tc-form-check {
  display: flex;
  align-items: center;
}

.tc-form-check-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: var(--font-mono);
  font-size: var(--text-small);
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: color-mix(in srgb, var(--color-paper) 80%, transparent);
}

.tc-form-checkbox {
  width: 1rem;
  height: 1rem;
  accent-color: var(--color-primary);
  cursor: pointer;
}

/* ── Submit del formulario ───────────────────────── */

.tc-form-submit {
  display: flex;
  gap: var(--space-2);
  flex-wrap: wrap;
  padding-top: var(--space-2);
  border-top: 1px solid var(--glass-border);
}

/* ── Estado vacío ────────────────────────────────── */

.tabla-vacia {
  font-family: var(--font-mono);
  font-size: var(--text-small);
  color: color-mix(in srgb, var(--color-paper) 55%, transparent);
  padding: var(--space-3);
  border: 1px solid var(--glass-border);
  border-radius: 12px;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

/* ── Botones (override del .btn-brutal global → look limpio) ── */

.btn-brutal {
  font-family: var(--font-mono);
  font-weight: 700;
  font-size: var(--text-small);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-paper);
  background: color-mix(in srgb, var(--color-paper) 8%, transparent);
  border: 1px solid var(--glass-border);
  border-radius: 8px;
  padding: 0.5rem 1rem;
  box-shadow: none;
  transition: background 160ms ease, color 160ms ease, border-color 160ms ease;
}

.btn-brutal:hover {
  background: color-mix(in srgb, var(--color-paper) 14%, transparent);
  border-color: color-mix(in srgb, var(--color-paper) 25%, transparent);
}

.btn-brutal:active {
  transform: none;
  box-shadow: none;
}

.btn-brutal--accent {
  background: var(--color-primary);
  color: var(--color-ink);
  border-color: transparent;
}

.btn-brutal--accent:hover {
  background: color-mix(in srgb, var(--color-primary) 88%, white);
  color: var(--color-ink);
}

.btn-brutal--danger {
  background: transparent;
  color: var(--color-surreal);
  border-color: color-mix(in srgb, var(--color-surreal) 45%, transparent);
}

.btn-brutal--danger:hover {
  background: color-mix(in srgb, var(--color-surreal) 12%, transparent);
  color: var(--color-surreal);
}
</style>
