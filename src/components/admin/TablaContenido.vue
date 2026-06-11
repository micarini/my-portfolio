<script setup>
import './TablaContenido.css'
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
  descripcion: '',
  tags: '',          // string separado por comas; se parseará al emitir
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

function parseTags(tagsStr) {
  return tagsStr
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean)
}

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
    descripcion: formCrear.descripcion.trim(),
    tags: parseTags(formCrear.tags),
    imagen: formCrear.imagen.trim() || `https://picsum.photos/seed/${Date.now()}/800/600`,
    destacado: formCrear.destacado,
    likes: 0
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
    descripcion: item.descripcion,
    tags: item.tags.join(', '),
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
    descripcion: formEditar.descripcion.trim(),
    tags: parseTags(formEditar.tags),
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
          <div class="tc-form-campo">
            <label class="tc-form-label">Tags (separados por coma)</label>
            <input
              v-model="formCrear.tags"
              class="tc-form-input"
              type="text"
              placeholder="Ej: Vue, CSS, Firebase"
            >
          </div>
        </div>

        <div class="tc-form-campo">
          <label class="tc-form-label">Descripción *</label>
          <textarea
            v-model="formCrear.descripcion"
            class="tc-form-input tc-form-textarea"
            required
            rows="3"
            placeholder="Descripción del proyecto..."
          />
        </div>

        <div class="tc-form-campo">
          <label class="tc-form-label">URL de imagen</label>
          <input
            v-model="formCrear.imagen"
            class="tc-form-input"
            type="url"
            placeholder="https://..."
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
            <th>Tags</th>
            <th>Dest.</th>
            <th>Likes</th>
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
              <td class="tc-celda--tags">
                <span
                  v-for="tag in item.tags"
                  :key="tag"
                  class="tag-brutal tc-tag"
                >{{ tag }}</span>
              </td>
              <td class="tc-celda--bool">
                <span :class="item.destacado ? 'tc-star--si' : 'tc-star--no'">
                  {{ item.destacado ? '★' : '☆' }}
                </span>
              </td>
              <td class="tc-celda--num">
                {{ item.likes }}
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
                colspan="8"
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
                      <div class="tc-form-campo">
                        <label class="tc-form-label">Tags (coma)</label>
                        <input
                          v-model="formEditar.tags"
                          class="tc-form-input"
                          type="text"
                        >
                      </div>
                    </div>
                    <div class="tc-form-campo">
                      <label class="tc-form-label">Descripción *</label>
                      <textarea
                        v-model="formEditar.descripcion"
                        class="tc-form-input tc-form-textarea"
                        required
                        rows="2"
                      />
                    </div>
                    <div class="tc-form-campo">
                      <label class="tc-form-label">URL imagen</label>
                      <input
                        v-model="formEditar.imagen"
                        class="tc-form-input"
                        type="url"
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
