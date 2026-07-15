<script setup>

// Props: recibe el objeto usuario que intentó acceder
const props = defineProps({
  usuario: {
    type: Object,
    required: true
  }
})

// Evento para que el padre vuelva al formulario de login
const emit = defineEmits(['reintentar'])
</script>

<template>
  <div class="bloqueo-wrapper">
    <div class="bloqueo-bloque">
      <!-- Marca de agua gigante de fondo -->
      <span
        class="bloqueo-bg-text"
        aria-hidden="true"
      >NO</span>

      <div class="bloqueo-contenido">
        <p class="bloqueo-codigo">
          ERROR 403
        </p>

        <h1 class="bloqueo-titulo">
          Acceso<br>Restringido
        </h1>

        <hr class="bloqueo-divisor">

        <p class="bloqueo-usuario">
          Usuario <span>{{ props.usuario.name }}</span> no tiene permisos de administrador.
        </p>

        <p class="bloqueo-mensaje">
          Esta sección está reservada para administradores del sistema.
          Si creés que esto es un error, contactá al responsable del sitio.
        </p>

        <button
          class="btn-brutal bloqueo-btn"
          @click="emit('reintentar')"
        >
          ← Reintentar con otra cuenta
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* PantallaBloqueo — acceso restringido, look alineado con las demos */

.bloqueo-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 160px);
  padding: var(--space-4) var(--space-3);
}

/* Bloque dramático oscuro, redondeado, con sombra suave */
.bloqueo-bloque {
  background: var(--color-sepia);
  border: 1px solid var(--glass-border);
  border-radius: 18px;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.5);
  padding: var(--space-5) var(--space-4);
  width: 100%;
  max-width: 560px;
  text-align: center;
  position: relative;
  overflow: hidden;
}

/* Marca de agua gigante (roja tenue) */
.bloqueo-bg-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-family: var(--font-display);
  font-size: clamp(5rem, 20vw, 14rem);
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: -0.05em;
  color: color-mix(in srgb, var(--color-surreal) 8%, transparent);
  pointer-events: none;
  white-space: nowrap;
  line-height: 1;
  user-select: none;
}

.bloqueo-contenido {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-3);
}

.bloqueo-codigo {
  font-family: var(--font-mono);
  font-size: var(--text-micro);
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--color-surreal);
  font-weight: 700;
}

/* Texto gigante "ACCESO RESTRINGIDO" */
.bloqueo-titulo {
  font-family: var(--font-display);
  font-size: clamp(2rem, 8vw, 5rem);
  text-transform: uppercase;
  letter-spacing: -0.02em;
  line-height: 0.9;
  color: var(--color-surreal);
}

.bloqueo-divisor {
  width: 100%;
  height: 1px;
  background: var(--glass-border);
  border: none;
  margin: 0;
}

.bloqueo-usuario {
  font-family: var(--font-mono);
  font-size: var(--text-small);
  color: color-mix(in srgb, var(--color-paper) 55%, transparent);
  letter-spacing: 0.06em;
}

.bloqueo-usuario span {
  color: var(--color-paper);
  font-weight: 700;
}

.bloqueo-mensaje {
  font-family: 'DM Sans', sans-serif;
  font-size: var(--text-body);
  color: color-mix(in srgb, var(--color-paper) 65%, transparent);
  max-width: 340px;
  line-height: 1.55;
}

/* Botón: outline limpio que se rellena en hover */
.btn-brutal {
  font-family: var(--font-mono);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-paper);
  background: transparent;
  border: 1px solid var(--glass-border);
  border-radius: 10px;
  padding: 0.7rem 1.4rem;
  box-shadow: none;
  transition: background 160ms ease, color 160ms ease, border-color 160ms ease;
}

.btn-brutal:active {
  transform: none;
  box-shadow: none;
}

.bloqueo-btn:hover {
  background: var(--color-primary);
  border-color: transparent;
  color: var(--color-ink);
}

@media (max-width: 480px) {
  .bloqueo-bloque {
    padding: var(--space-4) var(--space-3);
  }
}
</style>
