<script setup>
import './Admin.css'
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
            class="btn-brutal btn-brutal--danger admin-logout"
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
        <TablaUsuarios :usuarios="usuarios" />
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
