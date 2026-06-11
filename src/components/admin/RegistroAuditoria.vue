<script setup>
import './RegistroAuditoria.css'

// Recibe el historial de AdminRequest desde el padre
const props = defineProps({
  historial: {
    type: Array,
    required: true
  }
})

/**
 * Formatea el timestamp ISO en formato legible con hora local.
 * @param {string} iso
 * @returns {string}
 */
function formatTimestamp(iso) {
  const d = new Date(iso)
  const fecha = d.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' })
  const hora = d.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  return `${fecha} ${hora}`
}

// Mapa de colores por acción para la terminal
const colorAccion = {
  CREATE: 'auditoria-accion--create',
  UPDATE: 'auditoria-accion--update',
  DELETE: 'auditoria-accion--delete'
}
</script>

<template>
  <section class="auditoria-wrapper">
    <div class="auditoria-cabecera">
      <span class="auditoria-titulo">Registro de auditoría</span>
      <span class="auditoria-count">{{ props.historial.length }} operaciones</span>
    </div>

    <!-- Terminal de log estilo consola -->
    <div
      class="auditoria-terminal"
      role="log"
      aria-live="polite"
    >
      <!-- Línea de bienvenida fija -->
      <div class="auditoria-linea auditoria-linea--sistema">
        <span class="auditoria-prompt">$</span>
        <span>Sistema listo. Esperando operaciones...</span>
      </div>

      <!-- Sin operaciones aún -->
      <div
        v-if="props.historial.length === 0"
        class="auditoria-linea auditoria-linea--vacia"
      >
        <span class="auditoria-prompt">_</span>
        <span>Ninguna operación registrada en esta sesión.</span>
      </div>

      <!-- Una línea por cada AdminRequest -->
      <div
        v-for="req in props.historial"
        :key="req.id"
        class="auditoria-linea"
      >
        <span class="auditoria-ts">{{ formatTimestamp(req.timestamp) }}</span>
        <span class="auditoria-separador">›</span>
        <span
          class="auditoria-accion"
          :class="colorAccion[req.action] || ''"
        >
          {{ req.action }}
        </span>
        <span class="auditoria-separador">›</span>
        <span class="auditoria-entidad">{{ req.entity }}</span>
        <span class="auditoria-separador">›</span>
        <span class="auditoria-payload">
          {{
            req.action === 'DELETE'
              ? `id:${req.payload.id} "${req.payload.titulo}"`
              : `"${req.payload.titulo}"`
          }}
        </span>
        <span class="auditoria-separador">›</span>
        <span class="auditoria-autor">by {{ req.author }}</span>
      </div>
    </div>
  </section>
</template>
