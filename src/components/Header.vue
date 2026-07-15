<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue';
import { useRoute } from 'vue-router';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/investigacion', label: 'Investigación' },
  { to: '/admin', label: 'Admin' },
];

const route = useRoute();
const menuAbierto = ref(false);

function alternarMenu() {
  menuAbierto.value = !menuAbierto.value;
}

function cerrarMenu() {
  menuAbierto.value = false;
}

watch(
  () => route.path,
  () => {
    cerrarMenu();
  },
);

function onKeydown(e) {
  if (e.key === 'Escape') cerrarMenu();
}

onMounted(() => {
  window.addEventListener('keydown', onKeydown);
});

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown);
});
</script>

<template>
  <header class="header">
    <div class="header__inner">
      <RouterLink
        to="/"
        class="header__logo"
        aria-label="mia carini rojo — inicio"
      >
        <img
          src="../assets/LOGONAME.png"
          alt="mia carini rojo"
          class="header__logo-img"
        >
      </RouterLink>

      <nav
        class="header__nav"
        aria-label="Navegación principal"
      >
        <RouterLink
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          class="header__link"
          exact-active-class="header__link--active"
        >
          {{ link.label }}
        </RouterLink>
      </nav>

      <button
        type="button"
        class="header__menu-button"
        :class="{ 'header__menu-button--open': menuAbierto }"
        :aria-expanded="menuAbierto"
        aria-label="Abrir menú principal"
        @click="alternarMenu"
      >
        <span />
        <span />
        <span />
      </button>

      <span class="header__year">©2026</span>
    </div>

    <Transition name="menu-slide">
      <nav
        v-if="menuAbierto"
        class="header__mobile-menu"
        aria-label="Navegación principal móvil"
      >
        <RouterLink
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          class="header__mobile-link"
          exact-active-class="header__mobile-link--active"
          @click="cerrarMenu()"
        >
          {{ link.label }}
        </RouterLink>
      </nav>
    </Transition>
  </header>
</template>

<style scoped>
.header {
  position: sticky;
  top: 0;
  z-index: 50;
  background: transparent;
  border-bottom: 1px solid rgba(217, 222, 236, 0.08);
  color: #e0e4ef;
}

.header__inner {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  padding-inline: var(--space-3);
  height: 52px;
}

.header__logo {
  text-decoration: none;
  display: flex;
  align-items: center;
  opacity: 0.9;
  transition: opacity 180ms ease;
}

.header__logo:hover {
  opacity: 1;
}

.header__logo-img {
  height: 16px;
  width: auto;
  display: block;
  filter: brightness(0) invert(1);
}

.header__nav {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.header__link {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #9498a2;
  text-decoration: none;
  transition: color 180ms ease;
}

.header__link:hover {
  color: #52555e;
}

.header__link--active {
  color: var(--color-primary);
}

.header__link--active:hover {
  color: var(--color-primary);
  opacity: 0.85;
}

.header__year {
  font-family: var(--font-mono);
  font-size: 0.68rem;
  letter-spacing: 0.08em;
  color: #5b5d65;
  text-align: right;
  justify-self: end;
}

.header__menu-button {
  display: none;
  justify-self: end;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 4px;
  width: 28px;
  height: 28px;
  padding: 0;
  border: 0;
  background: transparent;
  box-shadow: none;
}

.header__menu-button span {
  display: block;
  width: 18px;
  height: 2px;
  background: #e0e4ef;
  border-radius: 999px;
  transition: transform 180ms ease, opacity 180ms ease;
}

.header__menu-button--open span:nth-child(1) {
  transform: translateY(6px) rotate(45deg);
}

.header__menu-button--open span:nth-child(2) {
  opacity: 0;
}

.header__menu-button--open span:nth-child(3) {
  transform: translateY(-6px) rotate(-45deg);
}

.header__mobile-menu {
  display: none;
}

@media (max-width: 720px) {
  .header__inner {
    grid-template-columns: 1fr auto auto;
    padding-inline: var(--space-2);
  }

  .header__nav,
  .header__year {
    display: none;
  }

  .header__menu-button {
    display: inline-flex;
  }

  .header__mobile-menu {
    display: flex;
    flex-direction: column;
    position: absolute;
    top: calc(52px + 8px);
    right: var(--space-2);
    min-width: 180px;
    padding: var(--space-2);
    border: 1px solid rgba(217, 222, 236, 0.12);
    background: rgba(10, 10, 10, 0.96);
    backdrop-filter: blur(18px);
    -webkit-backdrop-filter: blur(18px);
    box-shadow: 0 24px 48px rgba(0, 0, 0, 0.42);
    gap: 0.6rem;
    align-items: stretch;
  }

  .header__mobile-link {
    font-family: var(--font-mono);
    font-size: 0.78rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #9498a2;
    text-decoration: none;
    padding: 0.5rem 0.65rem;
    border-radius: 999px;
    border: 1px solid transparent;
    transition: background-color 180ms ease, color 180ms ease, border-color 180ms ease;
  }

  .header__mobile-link:hover {
    color: #e0e4ef;
    background: rgba(255, 255, 255, 0.06);
  }

  .header__mobile-link--active {
    color: var(--color-primary);
    border-color: rgba(111, 185, 228, 0.3);
    background: rgba(111, 185, 228, 0.08);
  }
}

.menu-slide-enter-active,
.menu-slide-leave-active {
  transition: opacity 180ms ease, transform 180ms ease;
}

.menu-slide-enter-from,
.menu-slide-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
