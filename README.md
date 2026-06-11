# Portfolio Final — Tecnología Multimedial · UMAI 2026

Portfolio personal con estética **brutalismo suizo / warm retro**, construido
con **Vite + React + CSS puro** (sin frameworks de estilos).

## Stack

- React 19 + Vite
- `react-router-dom` (SPA multipágina)
- CSS puro con design tokens centralizados en `src/index.css` (`:root`)
- "Base de datos" simulada con JSON estáticos servidos desde `public/`

## Estructura

```
├── public/
│   ├── contenido.json        # proyectos de la galería (BD simulada)
│   └── usuarios.json         # usuarios para auth simulada del admin
├── src/
│   ├── main.jsx              # entry: StrictMode + BrowserRouter
│   ├── App.jsx               # layout + rutas
│   ├── index.css             # SISTEMA DE DISEÑO: variables :root + utilidades
│   ├── components/           # piezas reutilizables (Header, Footer, cards…)
│   ├── pages/                # una carpeta de vista por ruta (.jsx + .css)
│   │   ├── Home.jsx          # galería asincrónica (fetch + loading/error)
│   │   ├── Admin.jsx         # login simulado + CRUD con feedback inmediato
│   │   └── Investigacion.jsx # ensayo interactivo "La arquitectura del canon"
│   └── models/
│       └── AdminRequest.js   # clase POO: peticiones estructuradas + log
├── vercel.json               # rewrites SPA para react-router en Vercel
└── DEFENSA.md                # guía conceptual para la defensa oral
```

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
   de `react-router-dom` funcionen al recargar.
