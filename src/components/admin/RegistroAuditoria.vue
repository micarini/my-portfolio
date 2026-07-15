<script setup>

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
            (req.payload.id != null ? `id:${req.payload.id} ` : '') +
              `"${req.payload.titulo ?? req.payload.name}"`
          }}
        </span>
        <span class="auditoria-separador">›</span>
        <span class="auditoria-autor">by {{ req.author }}</span>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* RegistroAuditoria — terminal de log, look alineado con las demos */

.auditoria-wrapper {
  margin-top: var(--space-4);
}

.auditoria-cabecera {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-2);
  border-bottom: 1px solid var(--glass-border);
  padding-bottom: var(--space-1);
}

.auditoria-titulo {
  font-family: var(--font-display);
  font-size: var(--text-body);
  letter-spacing: 0.02em;
  color: var(--color-paper);
}

.auditoria-count {
  font-family: var(--font-mono);
  font-size: var(--text-micro);
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: color-mix(in srgb, var(--color-paper) 50%, transparent);
}

/* Terminal: oscura, redondeada, borde fino y sombra suave */
.auditoria-terminal {
  background: #0e1117;
  border: 1px solid var(--glass-border);
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
  padding: var(--space-2);
  font-family: var(--font-mono);
  font-size: var(--text-micro);
  color: #86e0a8;
  min-height: 120px;
  max-height: 340px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  scroll-behavior: smooth;
}

.auditoria-linea {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.4rem;
  line-height: 1.5;
  letter-spacing: 0.03em;
}

.auditoria-linea--sistema {
  color: color-mix(in srgb, #86e0a8 55%, transparent);
  padding-bottom: 0.35rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  margin-bottom: 0.2rem;
}

.auditoria-linea--vacia {
  color: rgba(255, 255, 255, 0.35);
  font-style: italic;
}

.auditoria-prompt {
  color: var(--color-primary);
  font-weight: 700;
  flex-shrink: 0;
}

.auditoria-separador {
  color: rgba(255, 255, 255, 0.25);
  flex-shrink: 0;
}

.auditoria-ts {
  color: rgba(255, 255, 255, 0.4);
  white-space: nowrap;
  flex-shrink: 0;
}

/* Verbo de acción coloreado (redondeado) */
.auditoria-accion {
  font-weight: 700;
  letter-spacing: 0.08em;
  padding: 0.05rem 0.45rem;
  border: 1px solid;
  border-radius: 5px;
  flex-shrink: 0;
}

.auditoria-accion--create {
  color: #4ade80;
  border-color: color-mix(in srgb, #4ade80 55%, transparent);
}

.auditoria-accion--update {
  color: var(--color-primary);
  border-color: color-mix(in srgb, var(--color-primary) 55%, transparent);
}

.auditoria-accion--delete {
  color: var(--color-surreal);
  border-color: color-mix(in srgb, var(--color-surreal) 55%, transparent);
}

.auditoria-entidad {
  color: rgba(255, 255, 255, 0.75);
  text-transform: uppercase;
  flex-shrink: 0;
}

.auditoria-payload {
  color: var(--color-paper);
  font-weight: 700;
}

.auditoria-autor {
  color: rgba(255, 255, 255, 0.4);
  font-style: italic;
  flex-shrink: 0;
}

.auditoria-terminal::-webkit-scrollbar {
  width: 6px;
}

.auditoria-terminal::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.04);
}

.auditoria-terminal::-webkit-scrollbar-thumb {
  background: color-mix(in srgb, var(--color-primary) 60%, transparent);
  border-radius: 999px;
}
</style>
