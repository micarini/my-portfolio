# Guía de Defensa Oral — Portfolio Final

> Cómo se conectan los Hooks, el estado, el asincronismo y la POO en este proyecto.
> Pensada para responder con fluidez ante el cuerpo docente.

---

## 1. La idea central (el "elevator pitch" del código)

> "El proyecto simula una aplicación full-stack sin backend: los JSON en `public/`
> actúan como base de datos de solo lectura, `fetch` simula la capa de red,
> el estado de React simula la capa de persistencia en memoria, y una clase
> nativa de JS (`AdminRequest`) modela las peticiones de escritura que en un
> sistema real viajarían a una API."

Si recordás una sola frase, que sea esa: cada pieza técnica de la consigna
ocupa el lugar que ocuparía en una arquitectura real.

## 2. Hooks y estado: la UI como función del estado

- **`useState`** declara cada dato que puede cambiar y dispara re-render:
  `proyectos`, `loading`, `error` (Home); `usuarioLogueado`, `pestañaActiva`,
  `contenido`, `historial` (Admin); valores de sliders (Investigación).
- Concepto clave para enunciar: **React es declarativo**. Nunca tocamos el DOM;
  describimos cómo se ve la UI para cada estado posible y React reconcilia.
- **Inmutabilidad**: las funciones modificadoras nunca mutan el array original.
  - Crear: `setContenido(prev => [...prev, nuevo])`
  - Editar: `setContenido(prev => prev.map(item => item.id === id ? editado : item))`
  - Borrar: `setContenido(prev => prev.filter(item => item.id !== id))`
  - Por qué importa: React detecta cambios por **referencia**; si mutáramos el
    array, la referencia sería la misma y no habría re-render. De ahí el
    "feedback inmediato" que pide la consigna.

## 3. Asincronismo: useEffect + async/await + fetch

- **`useEffect(() => {...}, [])`** con array de dependencias vacío = "ejecutar
  una vez al montar el componente". Es el lugar correcto para efectos
  secundarios como pedir datos: el render debe ser puro.
- Dentro se define una **función async interna** y se invoca. Detalle fino para
  la defensa: el callback de `useEffect` no puede ser `async` directamente,
  porque una función async devuelve una Promise y React espera que el efecto
  devuelva una función de limpieza (o nada).
- **`async/await`** es azúcar sintáctica sobre Promises: el código se lee
  secuencial pero no bloquea el hilo principal (el event loop sigue atendiendo
  la UI mientras la red responde).
- **Los tres estados** (`loading` / `error` / `éxito`) modelan el ciclo de vida
  real de una petición de red. `try/catch/finally`: el `catch` captura tanto
  errores de red como el `throw` manual cuando `!res.ok`; el `finally` apaga
  `loading` pase lo que pase.

## 4. POO: la clase AdminRequest

- `class AdminRequest` (en `src/models/AdminRequest.js`) demuestra los pilares
  que pide la consigna:
  - **Encapsulamiento**: agrupa datos (action, entity, payload, author,
    timestamp, id) y comportamiento (`describe()`, `log()`) en una unidad.
  - **Instanciación**: cada operación CRUD hace
    `new AdminRequest('DELETE', 'contenido', item, usuario.name).log()`.
  - **`this`**: dentro de los métodos refiere a la instancia concreta.
  - `log()` devuelve `this` → patrón de **interfaz fluida** (encadenable).
- Por qué tiene sentido (no es POO decorativa): en un sistema real, cada
  escritura es una petición HTTP con verbo, recurso, cuerpo, autor y timestamp.
  La clase modela exactamente eso; el `console.log` obligatorio es el lugar
  donde en producción habría un `fetch POST` o un log de auditoría.
- Conexión POO ↔ React: la instancia además se guarda en el estado `historial`,
  o sea que un objeto creado con una clase nativa termina renderizado por React
  — muestra que ambos paradigmas conviven.

## 5. Preguntas probables y respuestas cortas

- **"¿Por qué los JSON están en `public/` y no en `src/`?"**
  Porque `public/` se sirve tal cual y permite pedirlos con `fetch` por URL,
  simulando una API. Si estuvieran en `src/` serían un `import` resuelto en
  build, sin asincronismo real.
- **"¿Los cambios del admin persisten al recargar?"**
  No, y es intencional: sin backend no hay escritura en disco. El estado de
  React es la persistencia en memoria de la sesión. El paso siguiente natural
  sería reemplazar las funciones modificadoras por llamadas a una API REST —
  la clase AdminRequest ya tiene la forma exacta de ese cuerpo de petición.
- **"¿Por qué CSS puro y no un framework?"**
  Control total de la identidad visual (brutalismo suizo / warm retro). Todo
  sale de variables en `:root` (`index.css`): paleta, tipografías, bordes y
  sombras duras. Cambiar una variable re-tematiza el sitio completo.
- **"¿Qué hace react-router-dom?"**
  SPA con rutas declarativas: `BrowserRouter` envuelve la app, `Routes/Route`
  mapean URL → componente de página, `NavLink` marca el link activo. En Vercel,
  `vercel.json` reescribe todas las rutas a `index.html` para que el refresh
  en `/admin` no dé 404 (el routing es del lado del cliente).
- **"¿Cómo funcionan las demos interactivas de Investigación?"**
  Cada slider/toggle es estado de React; ese valor se inyecta como CSS custom
  property inline (`style={{'--valor': x}}`) y el CSS lo consume en
  transforms/colores con `transition`. React maneja el dato, CSS la animación:
  separación de responsabilidades.

## 6. Mapa mental de 30 segundos para arrancar la defensa

1. **Estructura**: páginas en `pages/`, piezas reutilizables en `components/`,
   modelo POO en `models/`, datos en `public/`, tokens de diseño en `index.css`.
2. **Flujo de datos**: JSON → fetch (async) → estado → render → interacción →
   funciones modificadoras → re-render inmediato → AdminRequest → consola.
3. **Estética como sistema**: ninguna decisión visual está suelta; todas son
   variables CSS centralizadas (eso también es ingeniería).
