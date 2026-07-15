<script setup>
import { ref, reactive } from 'vue'
import AdminRequest from '../../models/AdminRequest.js'

// Recibe el array de usuarios y el nombre del admin logueado (autor de las operaciones)
const props = defineProps({
  usuarios: {
    type: Array,
    required: true
  },
  autorAdmin: {
    type: String,
    required: true
  }
})

// El padre escucha estos eventos para mutar su ref y registrar la auditoría
const emit = defineEmits(['crear', 'editar', 'borrar', 'auditoria'])

// ─── Estado del formulario ────────────────────────────────────────────────
const FORM_VACIO = {
  name: '',
  email: '',
  password: '',
  isAdmin: false,
  isSubscribed: false
}

const mostrarFormCrear = ref(false)
const formCrear = reactive({ ...FORM_VACIO })

// Guardamos el nombre original del usuario en edición (es la clave del registro)
const editandoNombre = ref(null)
const formEditar = reactive({ ...FORM_VACIO })

// Confirmación de borrado inline (no window.confirm)
const confirmandoBorrarNombre = ref(null)

// ─── Helpers ──────────────────────────────────────────────────────────────
function hoyISO() {
  return new Date().toISOString().slice(0, 10) // YYYY-MM-DD
}

function formatFecha(fechaISO) {
  if (!fechaISO) return '—'
  const [anio, mes, dia] = fechaISO.split('-')
  return `${dia}/${mes}/${anio}`
}

// ─── Crear ────────────────────────────────────────────────────────────────
function abrirFormCrear() {
  Object.assign(formCrear, FORM_VACIO)
  mostrarFormCrear.value = true
  editandoNombre.value = null
  confirmandoBorrarNombre.value = null
}

function cancelarCrear() {
  mostrarFormCrear.value = false
}

function submitCrear() {
  const nuevo = {
    name: formCrear.name.trim(),
    password: formCrear.password,
    email: formCrear.email.trim(),
    isSubscribed: formCrear.isSubscribed,
    isAdmin: formCrear.isAdmin,
    registerDate: hoyISO(),
    likedPostIDs: []
  }

  // POO: se instancia AdminRequest ante cada operación (entity 'usuarios')
  const req = new AdminRequest('CREATE', 'usuarios', nuevo, props.autorAdmin).log()

  emit('crear', nuevo)
  emit('auditoria', req)
  mostrarFormCrear.value = false
}

// ─── Editar ───────────────────────────────────────────────────────────────
function abrirEditar(usuario) {
  editandoNombre.value = usuario.name
  Object.assign(formEditar, {
    name: usuario.name,
    email: usuario.email,
    password: usuario.password,
    isAdmin: usuario.isAdmin,
    isSubscribed: usuario.isSubscribed
  })
  mostrarFormCrear.value = false
  confirmandoBorrarNombre.value = null
}

function cancelarEditar() {
  editandoNombre.value = null
}

function submitEditar(usuario) {
  const actualizado = {
    ...usuario,
    name: formEditar.name.trim(),
    email: formEditar.email.trim(),
    password: formEditar.password,
    isAdmin: formEditar.isAdmin,
    isSubscribed: formEditar.isSubscribed
  }

  const req = new AdminRequest('UPDATE', 'usuarios', actualizado, props.autorAdmin).log()

  // Mandamos el nombre original para que el padre encuentre el registro aunque cambie el name
  emit('editar', { original: editandoNombre.value, usuario: actualizado })
  emit('auditoria', req)
  editandoNombre.value = null
}

// ─── Borrar ───────────────────────────────────────────────────────────────
function pedirConfirmacion(name) {
  confirmandoBorrarNombre.value = name
  editandoNombre.value = null
}

function cancelarBorrar() {
  confirmandoBorrarNombre.value = null
}

function confirmarBorrar(usuario) {
  const req = new AdminRequest('DELETE', 'usuarios', { name: usuario.name }, props.autorAdmin).log()

  emit('borrar', usuario.name)
  emit('auditoria', req)
  confirmandoBorrarNombre.value = null
}
</script>

<template>
  <div class="tabla-wrapper">
    <!-- Botón para abrir el formulario de nuevo usuario -->
    <div class="tu-acciones-top">
      <button
        v-if="!mostrarFormCrear"
        class="btn-brutal btn-brutal--accent"
        @click="abrirFormCrear"
      >
        + Agregar usuario
      </button>
    </div>

    <!-- ── Formulario de creación ─────────────────────────── -->
    <div
      v-if="mostrarFormCrear"
      class="tu-form-panel"
    >
      <div class="tu-form-cabecera">
        <span class="tu-form-titulo">Nuevo usuario</span>
        <button
          class="btn-brutal tu-btn-cancelar"
          @click="cancelarCrear"
        >
          ✕ Cancelar
        </button>
      </div>

      <form
        class="tu-form"
        @submit.prevent="submitCrear"
      >
        <div class="tu-form-fila tu-form-fila--2">
          <div class="tu-form-campo">
            <label class="tu-form-label">Nombre *</label>
            <input
              v-model="formCrear.name"
              class="tu-form-input"
              type="text"
              required
              placeholder="nombre de usuario"
            >
          </div>
          <div class="tu-form-campo">
            <label class="tu-form-label">Email *</label>
            <input
              v-model="formCrear.email"
              class="tu-form-input"
              type="email"
              required
              placeholder="mail@ejemplo.com"
            >
          </div>
        </div>

        <div class="tu-form-campo">
          <label class="tu-form-label">Contraseña *</label>
          <input
            v-model="formCrear.password"
            class="tu-form-input"
            type="text"
            required
            placeholder="contraseña"
          >
        </div>

        <div class="tu-form-checks">
          <label class="tu-form-check-label">
            <input
              v-model="formCrear.isAdmin"
              type="checkbox"
              class="tu-form-checkbox"
            >
            Administrador
          </label>
          <label class="tu-form-check-label">
            <input
              v-model="formCrear.isSubscribed"
              type="checkbox"
              class="tu-form-checkbox"
            >
            Suscrito
          </label>
        </div>

        <div class="tu-form-submit">
          <button
            type="submit"
            class="btn-brutal btn-brutal--accent"
          >
            Crear usuario
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

    <!-- ── Tabla de usuarios ──────────────────────────────── -->
    <div class="tabla-overflow">
      <table class="tabla-brutal">
        <thead>
          <tr>
            <th>Usuario</th>
            <th>Email</th>
            <th>Admin</th>
            <th>Suscrito</th>
            <th>Registro</th>
            <th>Likes</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <template
            v-for="usuario in props.usuarios"
            :key="usuario.name"
          >
            <!-- Fila normal -->
            <tr
              v-if="editandoNombre !== usuario.name"
              :class="{ 'tabla-fila--admin': usuario.isAdmin }"
            >
              <td class="tabla-celda--nombre">
                <span class="tabla-nombre">{{ usuario.name }}</span>
                <span
                  v-if="usuario.isAdmin"
                  class="tabla-badge tabla-badge--admin"
                >admin</span>
              </td>
              <td class="tabla-celda--email">
                {{ usuario.email }}
              </td>
              <td class="tabla-celda--bool">
                <span
                  class="tabla-status"
                  :class="usuario.isAdmin ? 'tabla-status--si' : 'tabla-status--no'"
                >
                  {{ usuario.isAdmin ? 'SÍ' : 'NO' }}
                </span>
              </td>
              <td class="tabla-celda--bool">
                <span
                  class="tabla-status"
                  :class="usuario.isSubscribed ? 'tabla-status--si' : 'tabla-status--no'"
                >
                  {{ usuario.isSubscribed ? 'SÍ' : 'NO' }}
                </span>
              </td>
              <td class="tabla-celda--fecha">
                {{ formatFecha(usuario.registerDate) }}
              </td>
              <td class="tabla-celda--num">
                {{ usuario.likedPostIDs?.length ?? 0 }}
              </td>
              <td class="tu-celda--acciones">
                <!-- Confirmar borrado inline -->
                <div
                  v-if="confirmandoBorrarNombre === usuario.name"
                  class="tu-confirmar"
                >
                  <span class="tu-confirmar-texto">¿Borrar?</span>
                  <button
                    class="btn-brutal btn-brutal--danger tu-btn-accion"
                    @click="confirmarBorrar(usuario)"
                  >
                    Sí
                  </button>
                  <button
                    class="btn-brutal tu-btn-accion"
                    @click="cancelarBorrar"
                  >
                    No
                  </button>
                </div>
                <div
                  v-else
                  class="tu-acciones-fila"
                >
                  <button
                    class="btn-brutal tu-btn-accion"
                    @click="abrirEditar(usuario)"
                  >
                    Editar
                  </button>
                  <button
                    class="btn-brutal btn-brutal--danger tu-btn-accion"
                    @click="pedirConfirmacion(usuario.name)"
                  >
                    Borrar
                  </button>
                </div>
              </td>
            </tr>

            <!-- Fila en modo edición (inline) -->
            <tr
              v-else
              class="tabla-fila--editando"
            >
              <td
                colspan="7"
                class="tu-celda--form-editar"
              >
                <div class="tu-form-panel tu-form-panel--inline">
                  <div class="tu-form-cabecera">
                    <span class="tu-form-titulo">Editando: {{ usuario.name }}</span>
                    <button
                      class="btn-brutal tu-btn-cancelar"
                      @click="cancelarEditar"
                    >
                      ✕ Cancelar
                    </button>
                  </div>
                  <form
                    class="tu-form"
                    @submit.prevent="submitEditar(usuario)"
                  >
                    <div class="tu-form-fila tu-form-fila--2">
                      <div class="tu-form-campo">
                        <label class="tu-form-label">Nombre *</label>
                        <input
                          v-model="formEditar.name"
                          class="tu-form-input"
                          type="text"
                          required
                        >
                      </div>
                      <div class="tu-form-campo">
                        <label class="tu-form-label">Email *</label>
                        <input
                          v-model="formEditar.email"
                          class="tu-form-input"
                          type="email"
                          required
                        >
                      </div>
                    </div>
                    <div class="tu-form-campo">
                      <label class="tu-form-label">Contraseña *</label>
                      <input
                        v-model="formEditar.password"
                        class="tu-form-input"
                        type="text"
                        required
                      >
                    </div>
                    <div class="tu-form-checks">
                      <label class="tu-form-check-label">
                        <input
                          v-model="formEditar.isAdmin"
                          type="checkbox"
                          class="tu-form-checkbox"
                        >
                        Administrador
                      </label>
                      <label class="tu-form-check-label">
                        <input
                          v-model="formEditar.isSubscribed"
                          type="checkbox"
                          class="tu-form-checkbox"
                        >
                        Suscrito
                      </label>
                    </div>
                    <div class="tu-form-submit">
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
      v-if="props.usuarios.length === 0"
      class="tabla-vacia"
    >
      No hay usuarios registrados.
    </p>
  </div>
</template>

<style scoped>
/* TablaUsuarios — CRUD de usuarios, look alineado con las demos */

.tabla-wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.tu-acciones-top {
  display: flex;
  justify-content: flex-end;
}

/* Contenedor redondeado con borde fino; scroll horizontal en mobile */
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
  min-width: 720px;
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
  padding: 0.7rem 1rem;
  vertical-align: middle;
  color: var(--color-paper);
  border-bottom: 1px solid var(--glass-border);
}

.tabla-brutal tbody tr:last-child td {
  border-bottom: none;
}

.tabla-fila--admin td {
  background: color-mix(in srgb, var(--color-primary) 8%, transparent);
}

.tabla-brutal tbody tr:hover td {
  background: rgba(255, 255, 255, 0.03);
}

.tabla-fila--editando td {
  background: var(--color-sepia) !important;
  padding: 0;
}

.tabla-celda--nombre {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 700;
  font-size: var(--text-body);
  min-width: 120px;
}

.tabla-nombre {
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.tabla-celda--email {
  font-size: var(--text-small);
  color: color-mix(in srgb, var(--color-paper) 55%, transparent);
  min-width: 180px;
}

.tabla-celda--bool {
  text-align: center;
  width: 80px;
}

.tabla-celda--fecha {
  white-space: nowrap;
  color: color-mix(in srgb, var(--color-paper) 55%, transparent);
}

.tabla-celda--num {
  text-align: center;
  font-weight: 700;
  font-size: var(--text-body);
  width: 60px;
}

/* Badge admin: pill celeste */
.tabla-badge {
  font-family: var(--font-mono);
  font-size: var(--text-micro);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  padding: 0.1rem 0.5rem;
  border-radius: 999px;
  line-height: 1.5;
}

.tabla-badge--admin {
  background: color-mix(in srgb, var(--color-primary) 20%, transparent);
  color: var(--color-primary);
}

/* Estado sí/no: pills */
.tabla-status {
  display: inline-block;
  font-family: var(--font-mono);
  font-size: var(--text-micro);
  font-weight: 700;
  letter-spacing: 0.08em;
  padding: 0.12rem 0.55rem;
  border-radius: 999px;
}

.tabla-status--si {
  color: #4ade80;
  background: color-mix(in srgb, #4ade80 15%, transparent);
}

.tabla-status--no {
  color: color-mix(in srgb, var(--color-paper) 45%, transparent);
  background: rgba(255, 255, 255, 0.05);
}

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

/* ── Acciones por fila ── */
.tu-celda--acciones {
  white-space: nowrap;
  width: 150px;
}

.tu-acciones-fila {
  display: flex;
  gap: 0.4rem;
}

.tu-btn-accion {
  font-size: var(--text-micro);
  padding: 0.35rem 0.8rem;
  letter-spacing: 0.06em;
}

.tu-confirmar {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.tu-confirmar-texto {
  font-family: var(--font-mono);
  font-size: var(--text-micro);
  font-weight: 700;
  text-transform: uppercase;
  color: var(--color-surreal);
  letter-spacing: 0.08em;
}

.tu-celda--form-editar {
  padding: 0 !important;
}

/* ── Panel de formulario ── */
.tu-form-panel {
  border: 1px solid var(--glass-border);
  border-radius: 14px;
  background: var(--color-sepia);
  padding: var(--space-3);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.35);
}

.tu-form-panel--inline {
  border: none;
  border-radius: 0;
  box-shadow: none;
  background: transparent;
  padding: var(--space-2) var(--space-3);
}

.tu-form-cabecera {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-2);
  padding-bottom: var(--space-1);
  border-bottom: 1px solid var(--glass-border);
}

.tu-form-titulo {
  font-family: var(--font-display);
  font-size: var(--text-body);
  letter-spacing: 0.02em;
  color: var(--color-paper);
}

.tu-btn-cancelar {
  font-size: var(--text-micro);
  padding: 0.35rem 0.8rem;
  letter-spacing: 0.06em;
}

/* ── Campos ── */
.tu-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.tu-form-fila {
  display: flex;
  gap: var(--space-2);
  flex-wrap: wrap;
}

.tu-form-fila--2 > .tu-form-campo {
  flex: 1 1 200px;
}

.tu-form-campo {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.tu-form-label {
  font-family: var(--font-mono);
  font-size: var(--text-micro);
  text-transform: uppercase;
  letter-spacing: 0.14em;
  font-weight: 700;
  color: color-mix(in srgb, var(--color-paper) 55%, transparent);
}

.tu-form-input {
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
}

.tu-form-input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-primary) 25%, transparent);
}

/* ── Checkboxes ── */
.tu-form-checks {
  display: flex;
  gap: var(--space-3);
  flex-wrap: wrap;
}

.tu-form-check-label {
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

.tu-form-checkbox {
  width: 1rem;
  height: 1rem;
  accent-color: var(--color-primary);
  cursor: pointer;
}

/* ── Submit ── */
.tu-form-submit {
  display: flex;
  gap: var(--space-2);
  flex-wrap: wrap;
  padding-top: var(--space-2);
  border-top: 1px solid var(--glass-border);
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
