<script setup>
import { ref } from 'vue'

import LoginForm from '../components/admin/LoginForm.vue'
import PantallaBloqueo from '../components/admin/PantallaBloqueo.vue'
import TablaUsuarios from '../components/admin/TablaUsuarios.vue'
import TablaContenido from '../components/admin/TablaContenido.vue'
import RegistroAuditoria from '../components/admin/RegistroAuditoria.vue'

// ─── Estado de sesión ──────────────────────────────────────────────────────

/**
 * Estado de la pantalla actual:
 *   'login'      → formulario de autenticación
 *   'bloqueado'  → usuario sin isAdmin (pantalla negra de acceso restringido)
 *   'panel'      → admin autenticado, panel completo
 */
const pantalla = ref('login')

/** Usuario autenticado o usuario sin permisos (para mostrar en PantallaBloqueo). */
const usuarioActual = ref(null)

// ─── Datos del panel ───────────────────────────────────────────────────────

/**
 * Ref reactivo para los usuarios: cargado desde /usuarios.json al entrar al panel.
 * Al ser un Proxy de Vue (ref/reactive), cualquier mutación directa del array
 * desencadena re-render automático, sin necesidad de setState como en React.
 */
const usuarios = ref([])

/**
 * Ref reactivo para el contenido: cargado desde /contenido.json al entrar al panel.
 * La reactividad por Proxy de Vue permite hacer contenido.value.push(item) o
 * .splice() directamente y la UI se actualiza sola — a diferencia de React donde
 * habría que llamar setContenido([...prev, item]) para disparar un nuevo render.
 */
const contenido = ref([])

const cargandoPanel = ref(false)
const errorPanel = ref('')

// ─── Pestañas ─────────────────────────────────────────────────────────────

/** Pestaña activa: 'usuarios' | 'contenido' */
const tabActiva = ref('usuarios')

// ─── Historial de auditoría (AdminRequest[]) ───────────────────────────────

const historialAuditoria = ref([])

// ─── Handlers de autenticación ────────────────────────────────────────────

/**
 * LoginForm emite 'login-exitoso' con el objeto usuario admin.
 * Cargamos usuarios y contenido antes de mostrar el panel.
 */
async function onLoginExitoso(usuario) {
  usuarioActual.value = usuario
  cargandoPanel.value = true
  errorPanel.value = ''

  try {
    const [resUsuarios, resContenido] = await Promise.all([
      fetch('/usuarios.json'),
      fetch('/contenido.json')
    ])

    if (!resUsuarios.ok || !resContenido.ok) {
      throw new Error('No se pudieron cargar los datos del panel.')
    }

    usuarios.value = await resUsuarios.json()
    contenido.value = await resContenido.json()

    pantalla.value = 'panel'
  } catch (e) {
    errorPanel.value = e.message
  } finally {
    cargandoPanel.value = false
  }
}

/**
 * LoginForm emite 'acceso-restringido' con el usuario sin permisos.
 * Mostramos la pantalla de bloqueo dramática.
 */
function onAccesoRestringido(usuario) {
  usuarioActual.value = usuario
  pantalla.value = 'bloqueado'
}

/**
 * PantallaBloqueo emite 'reintentar': volvemos al formulario de login.
 */
function onReintentar() {
  usuarioActual.value = null
  pantalla.value = 'login'
}

/**
 * Cierre de sesión: resetea todo el estado y vuelve al login.
 */
function logout() {
  usuarioActual.value = null
  usuarios.value = []
  contenido.value = []
  historialAuditoria.value = []
  tabActiva.value = 'usuarios'
  pantalla.value = 'login'
}

// ─── Handlers CRUD de contenido ───────────────────────────────────────────

/**
 * TablaContenido emite 'crear' con el nuevo objeto.
 * Mutación directa del ref — Vue detecta el cambio por Proxy y re-renderiza.
 */
function onCrearContenido(nuevoItem) {
  contenido.value.push(nuevoItem)
}

/**
 * TablaContenido emite 'editar' con el objeto actualizado.
 * Reemplazamos el ítem en el array por índice.
 */
function onEditarContenido(itemActualizado) {
  const idx = contenido.value.findIndex((c) => c.id === itemActualizado.id)
  if (idx !== -1) {
    // Asignación directa al índice: Vue 3 la detecta gracias al Proxy del array
    contenido.value[idx] = itemActualizado
  }
}

/**
 * TablaContenido emite 'borrar' con el id a eliminar.
 */
function onBorrarContenido(id) {
  const idx = contenido.value.findIndex((c) => c.id === id)
  if (idx !== -1) {
    contenido.value.splice(idx, 1)
  }
}

/**
 * TablaContenido emite 'auditoria' con la instancia de AdminRequest ya logueada.
 * La agregamos al historial que renderiza RegistroAuditoria.
 */
function onAuditoria(req) {
  historialAuditoria.value.push(req)
}

// ─── Handlers CRUD de usuarios ─────────────────────────────────────────────
// Misma mecánica que contenido: mutación directa del ref (Vue lo detecta por Proxy).

function onCrearUsuario(nuevo) {
  usuarios.value.push(nuevo)
}

function onEditarUsuario({ original, usuario }) {
  // Buscamos por el nombre ORIGINAL (la clave), por si el admin cambió el name
  const idx = usuarios.value.findIndex((u) => u.name === original)
  if (idx !== -1) {
    usuarios.value[idx] = usuario
  }
}

function onBorrarUsuario(name) {
  const idx = usuarios.value.findIndex((u) => u.name === name)
  if (idx !== -1) {
    usuarios.value.splice(idx, 1)
  }
}
</script>

<template>
  <!-- ── Pantalla de login ───────────────────────────────────── -->
  <div v-if="pantalla === 'login'">
    <LoginForm
      @login-exitoso="onLoginExitoso"
      @acceso-restringido="onAccesoRestringido"
    />

    <!-- Error al cargar los datos del panel (tras login válido) -->
    <div
      v-if="errorPanel"
      class="container admin-error-panel"
      role="alert"
    >
      Error al cargar datos del panel: {{ errorPanel }}
    </div>

    <!-- Indicador de carga del panel -->
    <div
      v-if="cargandoPanel"
      class="container admin-cargando"
    >
      <span class="admin-cargando-texto">Cargando panel...</span>
    </div>
  </div>

  <!-- ── Pantalla de bloqueo ────────────────────────────────── -->
  <div v-else-if="pantalla === 'bloqueado'">
    <PantallaBloqueo
      :usuario="usuarioActual"
      @reintentar="onReintentar"
    />
  </div>

  <!-- ── Panel de administración ───────────────────────────── -->
  <div
    v-else-if="pantalla === 'panel'"
    class="admin-panel"
  >
    <div class="container">
      <!-- Encabezado con info de sesión y logout -->
      <header class="admin-encabezado">
        <div class="admin-encabezado-izq">
          <span class="admin-stamp">Sistema de gestión — sesión activa</span>
          <h1 class="admin-titulo">
            Panel<br>Admin
          </h1>
        </div>

        <div class="admin-encabezado-der">
          <div class="admin-sesion">
            <span class="admin-sesion-label">Conectado como</span>
            <span class="admin-sesion-usuario">{{ usuarioActual?.name }}</span>
            <span class="admin-sesion-email">{{ usuarioActual?.email }}</span>
          </div>
          <button
            class="admin-logout"
            @click="logout"
          >
            Cerrar sesión
          </button>
        </div>
      </header>

      <!-- Pestañas brutalistas -->
      <nav
        class="admin-tabs"
        role="tablist"
      >
        <button
          role="tab"
          :aria-selected="tabActiva === 'usuarios'"
          class="admin-tab"
          :class="{ 'admin-tab--activa': tabActiva === 'usuarios' }"
          @click="tabActiva = 'usuarios'"
        >
          Usuarios
          <span class="admin-tab-count">{{ usuarios.length }}</span>
        </button>

        <button
          role="tab"
          :aria-selected="tabActiva === 'contenido'"
          class="admin-tab"
          :class="{ 'admin-tab--activa': tabActiva === 'contenido' }"
          @click="tabActiva = 'contenido'"
        >
          Contenido
          <span class="admin-tab-count">{{ contenido.length }}</span>
        </button>
      </nav>

      <!-- ── Tab: Usuarios ─────────────────────────────────── -->
      <section
        v-if="tabActiva === 'usuarios'"
        class="admin-seccion"
        role="tabpanel"
      >
        <div class="admin-seccion-header">
          <h2 class="admin-seccion-titulo">
            Usuarios registrados
          </h2>
        </div>
        <TablaUsuarios
          :usuarios="usuarios"
          :autor-admin="usuarioActual?.name ?? ''"
          @crear="onCrearUsuario"
          @editar="onEditarUsuario"
          @borrar="onBorrarUsuario"
          @auditoria="onAuditoria"
        />
      </section>

      <!-- ── Tab: Contenido ────────────────────────────────── -->
      <section
        v-else-if="tabActiva === 'contenido'"
        class="admin-seccion"
        role="tabpanel"
      >
        <div class="admin-seccion-header">
          <h2 class="admin-seccion-titulo">
            Gestión de contenido
          </h2>
        </div>
        <TablaContenido
          :contenido="contenido"
          :autor-admin="usuarioActual?.name ?? ''"
          @crear="onCrearContenido"
          @editar="onEditarContenido"
          @borrar="onBorrarContenido"
          @auditoria="onAuditoria"
        />
      </section>

      <!-- ── Registro de auditoría (siempre visible en el panel) ── -->
      <div class="admin-auditoria">
        <RegistroAuditoria :historial="historialAuditoria" />
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Admin.css — estilos del panel admin principal */
/* Las tablas y formularios tienen sus propios .css en src/components/admin/ */

/* ── Panel general ───────────────────────────────── */

.admin-panel {
  padding: var(--space-3) 0 var(--space-5);
  min-height: calc(100vh - 120px);
}

/* ── Encabezado del panel ─────────────────────────── */

.admin-encabezado {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: var(--space-3);
  padding: var(--space-4) 0 var(--space-3);
  border-bottom: 1px solid var(--glass-border);
  margin-bottom: var(--space-4);
  flex-wrap: wrap;
}

.admin-encabezado-izq {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.admin-stamp {
  display: block;
  font-family: var(--font-mono);
  font-size: var(--text-micro);
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--color-orange);
  font-weight: 700;
}

.admin-titulo {
  font-family: 'Syne', var(--font-display);
  font-weight: 800;
  font-size: var(--text-h1);
  line-height: 0.9;
  letter-spacing: -0.02em;
  color: var(--color-paper);
}

/* Bloque de información de sesión */
.admin-encabezado-der {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: var(--space-1);
}

.admin-sesion {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.1rem;
}

.admin-sesion-label {
  font-family: var(--font-mono);
  font-size: var(--text-micro);
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: var(--color-paper-dark);
  opacity: 0.6;
}

.admin-sesion-usuario {
  font-family: 'Syne', var(--font-display);
  font-weight: 800;
  font-size: var(--text-h2);
  text-transform: uppercase;
  line-height: 1;
  color: var(--color-paper);
}

.admin-sesion-email {
  font-family: var(--font-mono);
  font-size: var(--text-small);
  color: var(--color-paper-dark);
}

.admin-logout {
  margin-top: var(--space-1);
  font-family: var(--font-mono);
  font-size: var(--text-small);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-paper);
  background: var(--color-sepia);
  border: 1px solid var(--glass-border);
  border-radius: 8px;
  padding: 0.55rem 1.2rem;
  cursor: pointer;
  transition: color 160ms ease, border-color 160ms ease, background 160ms ease;
}

.admin-logout:hover {
  color: var(--color-surreal);
  border-color: color-mix(in srgb, var(--color-surreal) 55%, transparent);
  background: color-mix(in srgb, var(--color-surreal) 12%, var(--color-sepia));
}

/* ── Pestañas ────────────────────────────────────── */

.admin-tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: var(--space-4);
  flex-wrap: wrap;
}

.admin-tab {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-family: var(--font-mono);
  font-size: var(--text-small);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: color-mix(in srgb, var(--color-paper) 60%, transparent);
  background: var(--color-sepia);
  border: 1px solid var(--glass-border);
  border-radius: 10px;
  padding: 0.6rem 1.4rem;
  cursor: pointer;
  transition: color 160ms ease, background 160ms ease, border-color 160ms ease;
}

.admin-tab:hover {
  color: var(--color-paper);
  border-color: color-mix(in srgb, var(--color-paper) 25%, transparent);
}

/* Pestaña activa: fondo acento (celeste), texto oscuro */
.admin-tab--activa {
  color: var(--color-ink);
  background: var(--color-primary);
  border-color: transparent;
  box-shadow: 0 6px 18px color-mix(in srgb, var(--color-primary) 35%, transparent);
}

.admin-tab--activa:hover {
  color: var(--color-ink);
}

/* Contador de ítems en la pestaña */
.admin-tab-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1.4rem;
  height: 1.4rem;
  padding: 0 0.4rem;
  border-radius: 999px;
  background: color-mix(in srgb, var(--color-paper) 14%, transparent);
  color: var(--color-paper);
  font-family: var(--font-mono);
  font-size: var(--text-micro);
  font-weight: 700;
}

.admin-tab--activa .admin-tab-count {
  background: color-mix(in srgb, var(--color-ink) 22%, transparent);
  color: var(--color-ink);
}

/* ── Secciones ────────────────────────────────────── */

.admin-seccion {
  margin-bottom: var(--space-4);
}

.admin-seccion-header {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin-bottom: var(--space-2);
}

.admin-seccion-titulo {
  font-family: 'Syne', var(--font-display);
  font-weight: 800;
  font-size: var(--text-h2);
  text-transform: uppercase;
  letter-spacing: -0.02em;
  color: var(--color-paper);
}

/* ── Auditoría ────────────────────────────────────── */

.admin-auditoria {
  margin-top: var(--space-4);
  padding-top: var(--space-3);
  border-top: 1px solid var(--glass-border);
}

/* ── Estados de carga / error del panel ──────────── */

.admin-error-panel {
  margin-top: var(--space-2);
  background: color-mix(in srgb, var(--color-surreal) 12%, transparent);
  color: var(--color-surreal);
  font-family: var(--font-mono);
  font-size: var(--text-small);
  letter-spacing: 0.04em;
  padding: 0.8rem 1rem;
  border: 1px solid color-mix(in srgb, var(--color-surreal) 35%, transparent);
  border-radius: 8px;
}

.admin-cargando {
  display: flex;
  justify-content: center;
  padding: var(--space-4) 0;
}

.admin-cargando-texto {
  font-family: var(--font-mono);
  font-size: var(--text-small);
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: var(--color-paper-dark);
  animation: parpadeo 1s step-start infinite;
}

@keyframes parpadeo {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.2; }
}

/* ── Responsive ───────────────────────────────────── */

@media (max-width: 768px) {
  .admin-encabezado {
    flex-direction: column;
    align-items: flex-start;
  }

  .admin-encabezado-der {
    align-items: flex-start;
  }

  .admin-sesion {
    align-items: flex-start;
  }

  .admin-tabs {
    flex-wrap: wrap;
  }

  .admin-tab {
    flex: 1;
    justify-content: center;
    padding: 0.6rem 1rem;
  }
}
</style>
