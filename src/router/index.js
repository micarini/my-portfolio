import { createRouter, createWebHistory } from 'vue-router';
import Home from '../pages/Home.vue';
import Admin from '../pages/Admin.vue';
import Investigacion from '../pages/Investigacion.vue';

/**
 * Rutas de la SPA. createWebHistory usa la History API del navegador
 * (URLs limpias sin #); vercel.json reescribe todo a index.html para
 * que el refresh en rutas internas no devuelva 404.
 */
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: Home },
    { path: '/admin', name: 'admin', component: Admin },
    { path: '/investigacion', name: 'investigacion', component: Investigacion },
  ],
  scrollBehavior() {
    // Al navegar entre páginas, siempre arrancar arriba
    return { top: 0 };
  },
});

export default router;
