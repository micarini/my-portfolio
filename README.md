# Portfolio Final — Tecnología Multimedial · UMAI 2026

Portfolio personal con estética **brutalismo suizo / warm retro**, construido
con **Vite + Vue 3 (Composition API / `<script setup>`) + CSS puro**
(sin frameworks de estilos). Vue es además el tema de investigación técnica
del segundo cuatrimestre, por eso todo el proyecto está implementado con él.

## Stack

- Vue 3 con `<script setup>` (Composition API)
- Vite
- `vue-router` (SPA multipágina con History API)
- CSS puro con design tokens centralizados en `src/index.css` (`:root`)
- "Base de datos" simulada con JSON estáticos servidos desde `public/`

## Estructura

```
├── public/
│   ├── contenido.json        # proyectos de la galería (BD simulada)
│   └── usuarios.json         # usuarios para auth simulada del admin
├── src/
│   ├── main.js               # entry: createApp + router + estilos globales
│   ├── App.vue               # shell: Header + <RouterView/> + Footer
│   ├── index.css             # SISTEMA DE DISEÑO: variables :root + utilidades
│   ├── router/
│   │   └── index.js          # rutas /, /admin, /investigacion (createWebHistory)
│   ├── components/           # SFCs reutilizables + un .css por componente
│   ├── pages/                # una vista por ruta (.vue + .css)
│   │   ├── Home.vue          # galería asincrónica (onMounted + fetch)
│   │   ├── Admin.vue         # login simulado + CRUD con feedback inmediato
│   │   └── Investigacion.vue # ensayo interactivo "La arquitectura del canon"
│   └── models/
│       └── AdminRequest.js   # clase POO: peticiones estructuradas + log
├── vercel.json               # rewrites SPA para vue-router en Vercel
└── DEFENSA.md                # guía conceptual para la defensa oral
```

Convención del proyecto: los estilos de cada componente viven en un archivo
`.css` propio importado desde el `<script setup>` (CSS puro por componente,
sin bloques `<style>` en los SFC).

## Correr en local

```bash
npm install
npm run dev
```

## Credenciales de prueba (admin)

- Usuario: `mia` · Contraseña: `umai2026` (admin)
- Usuario: `valentina` · Contraseña: `valen123` (sin permisos → pantalla de bloqueo)

## Deploy en Vercel

1. Subir el repo a GitHub.
2. En Vercel: *New Project* → importar el repo. Detecta Vite solo
   (build `npm run build`, output `dist/`).
3. `vercel.json` ya incluye el rewrite a `index.html` para que las rutas
   de `vue-router` funcionen al recargar.
