<script setup>
import './Header.css';

const navLinks = [
  { to: '/', label: 'Galería' },
  { to: '/investigacion', label: 'Investigación' },
  { to: '/admin', label: 'Admin' },
];
</script>

<template>
  <header class="header">
    <div class="header__inner">
      <RouterLink
        to="/"
        class="header__logo"
      >
        MCR<span class="header__logo-dot">®</span>
      </RouterLink>

      <p class="header__edition">
        Portfolio — Tecnología Multimedial · Ed. 2026 · Buenos Aires
      </p>

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
    </div>
  </header>
</template>
