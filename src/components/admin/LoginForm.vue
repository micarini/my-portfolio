<script setup>
import { ref } from 'vue'

// Eventos hacia el padre
const emit = defineEmits(['login-exitoso', 'acceso-restringido']) 

// Estado del formulario
const usuario = ref('')
const contrasena = ref('')
const error = ref('')
const cargando = ref(false)

/*Maneja el submit del formulario.
 Hace fetch async de /usuarios.json, busca credenciales y emite el evento correspondiente según el resultado.*/
async function handleSubmit() {
  error.value = '' // resetea el error previo
  cargando.value = true // activa el estado de carga (deshabilita el botón y cambia su texto)

  try {
    const respuesta = await fetch('/usuarios.json') //cargo la base de usuarios desde el JSON local
    if (!respuesta.ok) throw new Error('No se pudo cargar la base de usuarios.') //manejo de error si la respuesta no es OK

    const usuarios = await respuesta.json() //parseo del JSON a objeto JS

    const encontrado = usuarios.find(
      (u) => u.name === usuario.value && u.password === contrasena.value //busca un usuario que coincida con las credenciales ingresadas
    )

    if (!encontrado) { // si no se encuentra un usuario que coincida, se muestra un mensaje de error
      error.value = 'Credenciales inválidas. Revisá usuario y contraseña.'
      return
    }

    if (!encontrado.isAdmin) {
      // si el usuario encontrado no es admin, se emite un evento de acceso restringido
      emit('acceso-restringido', encontrado)
      return
    }

    // si el usuario encontrado es admin, se emite un evento de login exitoso
    emit('login-exitoso', encontrado)
  } catch (e) {
    error.value = 'Error al verificar credenciales: ' + e.message // muestra un mensaje de error si ocurre un error durante el fetch o el parseo del JSON
  } finally {
    cargando.value = false // desactiva el estado de carga (habilita el botón y restaura su texto)
  }
}
</script>

<template>
  <div class="login-wrapper">
    <div class="login-ficha">
      <div class="login-cabecera">
        <span class="login-stamp">Sistema de gestión</span>
        <h1 class="login-titulo">
          Panel<br>Admin
        </h1>
      </div>

      <form
        class="login-form"
        @submit.prevent="handleSubmit" 
      >
        <div class="login-campo">
          <label
            for="login-usuario"
            class="login-label"
          >Usuario</label>
          <input
            id="login-usuario"
            v-model="usuario"
            type="text"
            class="login-input"
            autocomplete="username"
            placeholder="nombre de usuario"
            required
          >
        </div>

        <div class="login-campo">
          <label
            for="login-contrasena"
            class="login-label"
          >Contraseña</label>
          <input
            id="login-contrasena"
            v-model="contrasena"
            type="password"
            class="login-input"
            autocomplete="current-password"
            placeholder="••••••••"
            required
          >
        </div>

        <!-- si hay error de credenciales emito feedback inmediato en el mismo form -->
        <div
          v-if="error"
          class="login-error"
          role="alert"
        >
          <em class="login-error-icono">!</em>
          {{ error }}
        </div>

        <div class="login-submit">
          <button
            type="submit"
            class="btn-brutal btn-brutal--accent login-btn"
            :class="{ 'login-btn--cargando': cargando }"
            :disabled="cargando"
          >
            {{ cargando ? 'Verificando...' : 'Ingresar al panel' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.login-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 160px);
  padding: var(--space-4) var(--space-3);
}

.login-ficha {
  width: 100%;
  max-width: 420px;
  background: var(--color-sepia);
  border: 1px solid var(--glass-border);
  border-radius: 16px;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.45);
  padding: var(--space-4);
}

.login-cabecera {
  margin-bottom: var(--space-3);
  border-bottom: 1px solid var(--glass-border);
  padding-bottom: var(--space-2);
}

.login-stamp {
  display: block;
  font-family: var(--font-mono);
  font-size: var(--text-micro);
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--color-primary);
  margin-bottom: 0.4rem;
}

.login-titulo {
  font-family: var(--font-display);
  font-size: clamp(2rem, 6vw, 3rem);
  letter-spacing: -0.02em;
  line-height: 0.9;
  color: var(--color-paper);
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.login-campo {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.login-label {
  font-family: var(--font-mono);
  font-size: var(--text-micro);
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: color-mix(in srgb, var(--color-paper) 55%, transparent);
  font-weight: 700;
}

.login-input {
  font-family: var(--font-mono);
  font-size: var(--text-body);
  color: var(--color-paper);
  background: var(--color-ink);
  border: 1px solid var(--glass-border);
  border-radius: 8px;
  padding: 0.7rem 0.85rem;
  outline: none;
  width: 100%;
  transition: border-color 160ms ease, box-shadow 160ms ease;
}

.login-input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-primary) 25%, transparent);
}

.login-error {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  background: color-mix(in srgb, var(--color-surreal) 12%, transparent);
  color: var(--color-surreal);
  font-family: var(--font-mono);
  font-size: var(--text-small);
  padding: 0.7rem 0.9rem;
  border: 1px solid color-mix(in srgb, var(--color-surreal) 35%, transparent);
  border-radius: 8px;
  letter-spacing: 0.04em;
}

.login-error-icono {
  flex-shrink: 0;
  font-style: normal;
  font-weight: 700;
}

.login-submit {
  margin-top: var(--space-1);
}

.login-btn {
  width: 100%;
  padding: 0.9rem;
  font-size: var(--text-body);
  letter-spacing: 0.1em;
}

.login-btn--cargando {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-brutal {
  font-family: var(--font-mono);
  font-weight: 700;
  text-transform: uppercase;
  color: var(--color-paper);
  background: color-mix(in srgb, var(--color-paper) 8%, transparent);
  border: 1px solid var(--glass-border);
  border-radius: 10px;
  box-shadow: none;
  transition: background 160ms ease, color 160ms ease;
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

@media (max-width: 480px) {
  .login-ficha {
    padding: var(--space-3);
  }
}
</style>
