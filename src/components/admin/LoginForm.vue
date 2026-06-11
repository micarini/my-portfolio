<script setup>
import './LoginForm.css'
import { ref } from 'vue'

// Eventos hacia el padre
const emit = defineEmits(['login-exitoso', 'acceso-restringido'])

// Estado del formulario
const usuario = ref('')
const contrasena = ref('')
const error = ref('')
const cargando = ref(false)

/**
 * Maneja el submit del formulario.
 * Hace fetch async de /usuarios.json, busca credenciales y emite
 * el evento correspondiente según el resultado.
 */
async function handleSubmit() {
  error.value = ''
  cargando.value = true

  try {
    const respuesta = await fetch('/usuarios.json')
    if (!respuesta.ok) throw new Error('No se pudo cargar la base de usuarios.')

    const usuarios = await respuesta.json()

    const encontrado = usuarios.find(
      (u) => u.name === usuario.value && u.password === contrasena.value
    )

    if (!encontrado) {
      error.value = 'Credenciales inválidas. Revisá usuario y contraseña.'
      return
    }

    if (!encontrado.isAdmin) {
      // Usuario existe pero no tiene permisos de admin
      emit('acceso-restringido', encontrado)
      return
    }

    // Admin legítimo
    emit('login-exitoso', encontrado)
  } catch (e) {
    error.value = 'Error al verificar credenciales: ' + e.message
  } finally {
    cargando.value = false
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

        <!-- Error de credenciales — feedback inmediato en el mismo form -->
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
