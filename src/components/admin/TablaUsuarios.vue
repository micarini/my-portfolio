<script setup>
import './TablaUsuarios.css'

// La tabla de usuarios es solo lectura: recibe el array desde el padre
const props = defineProps({
  usuarios: {
    type: Array,
    required: true
  }
})

/**
 * Formatea una fecha ISO en formato local legible.
 * @param {string} fechaISO
 * @returns {string}
 */
function formatFecha(fechaISO) {
  if (!fechaISO) return '—'
  const [anio, mes, dia] = fechaISO.split('-')
  return `${dia}/${mes}/${anio}`
}
</script>

<template>
  <div class="tabla-wrapper">
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
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="usuario in props.usuarios"
            :key="usuario.name"
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
          </tr>
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
