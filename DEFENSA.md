# Guía de Defensa Oral — Portfolio Final (Vue 3)

> Cómo se conectan la reactividad de Vue, el ciclo de vida, el asincronismo
> y la POO en este proyecto. Pensada para responder con fluidez ante el
> cuerpo docente — y para lucir que Vue es además tu tema de investigación.

---

## 1. La idea central (el "elevator pitch" del código)

> "El proyecto simula una aplicación full-stack sin backend: los JSON en
> `public/` actúan como base de datos de solo lectura, `fetch` simula la capa
> de red, el estado reactivo de Vue simula la persistencia en memoria, y una
> clase nativa de JS (`AdminRequest`) modela las peticiones de escritura que
> en un sistema real viajarían a una API."

Cada pieza técnica de la consigna ocupa el lugar que ocuparía en una
arquitectura real.

## 2. Reactividad de Vue: el corazón del proyecto

- **`ref()`** crea una referencia reactiva. Al leer `.value` dentro de un
  template o un `computed`, Vue **registra la dependencia**; al escribirla,
  notifica y re-renderiza solo lo afectado.
- Cómo funciona por dentro (punto fuerte para la defensa): Vue 3 envuelve los
  objetos en un **Proxy de JavaScript**. Los `get` registran quién depende del
  dato y los `set` disparan las actualizaciones. Por eso en Vue **la mutación
  directa funciona** (`contenido.value.push(nuevo)`): el Proxy la intercepta.
  - Contraste con React (probablemente te lo pregunten): React detecta cambios
    **por referencia e inmutabilidad** (`setX(prev => [...prev, nuevo])`);
    Vue detecta cambios **por interceptación**. Mismo objetivo — UI como
    función del estado — con mecanismos opuestos.
- **`computed()`** deriva estado con caché: la lista filtrada de la galería o
  el "% de diversidad visible" de las demos se recalculan solo cuando cambia
  una dependencia. Nunca guardamos en estado algo que se puede derivar.
- **`v-model`** es azúcar para `:value` + `@input`: enlace bidireccional en
  los formularios del admin y los sliders de las demos. `v-model.number`
  castea el valor del slider a número automáticamente.

## 3. Asincronismo: onMounted + async/await + fetch

- **`onMounted(...)`** es el hook de ciclo de vida que corre cuando el
  componente ya está montado en el DOM: el lugar correcto para efectos como
  pedir datos (equivalente conceptual al `useEffect(..., [])` de React).
- Dentro se define una **función async** y se invoca con `await fetch(...)` y
  `await res.json()`. `async/await` es azúcar sobre Promises: lectura
  secuencial sin bloquear el event loop (la UI sigue viva mientras la red
  responde).
- **Los tres estados** (`loading` / `error` / éxito) modelan el ciclo de vida
  real de una petición y se renderizan con **`v-if` / `v-else-if` / `v-else`**.
  `try/catch/finally`: el `catch` captura errores de red y el `throw` manual
  cuando `!res.ok`; el `finally` apaga `loading` pase lo que pase.

## 4. POO: la clase AdminRequest

- `class AdminRequest` (en `src/models/AdminRequest.js`):
  - **Encapsulamiento**: datos (action, entity, payload, author, timestamp,
    id) + comportamiento (`describe()`, `log()`) en una unidad.
  - **Instanciación**: cada operación CRUD hace
    `new AdminRequest('DELETE', 'contenido', item, usuario.name).log()`.
  - `log()` devuelve `this` → **interfaz fluida** (encadenable).
- No es POO decorativa: en un sistema real cada escritura es una petición HTTP
  con verbo, recurso, cuerpo, autor y timestamp. El `console.log` obligatorio
  es donde en producción habría un `fetch POST` o un log de auditoría.
- Conexión POO ↔ Vue: las instancias se guardan en el `ref` `historial` y el
  template las renderiza con `v-for` — un objeto de clase nativa dentro del
  sistema reactivo de Vue, los dos paradigmas conviviendo.

## 5. Preguntas probables y respuestas cortas

- **"¿Por qué `<script setup>` y no Options API?"**
  Es la sintaxis recomendada por la documentación oficial de Vue 3: menos
  código, mejor inferencia de tipos, y la lógica se agrupa por función (como
  los composables) en vez de repartirse entre `data/methods/computed`.
- **"¿Por qué los JSON están en `public/` y no en `src/`?"**
  `public/` se sirve tal cual y permite pedirlos con `fetch` por URL,
  simulando una API real. En `src/` serían un `import` resuelto en build,
  sin asincronismo.
- **"¿Los cambios del admin persisten al recargar?"**
  No, intencionalmente: sin backend no hay escritura en disco. El estado
  reactivo es la persistencia en memoria de la sesión. El paso siguiente sería
  reemplazar las mutaciones por llamadas a una API REST — `AdminRequest` ya
  tiene la forma exacta de ese cuerpo de petición.
- **"¿Por qué CSS puro y no un framework?"**
  Control total de la identidad visual (brutalismo suizo / warm retro). Todo
  sale de variables en `:root` (`index.css`). Además el proyecto conecta
  estado de Vue con CSS: los sliders inyectan custom properties con
  `:style="{ '--valor': x }"` y el CSS las consume en transforms y colores
  con `transition` — Vue maneja el dato, CSS la animación.
- **"¿Qué hace vue-router?"**
  SPA con rutas declarativas: `createRouter` + `createWebHistory` (URLs
  limpias con la History API), `<RouterView/>` como slot de página y
  `<RouterLink>` con clase de link activo. En Vercel, `vercel.json` reescribe
  todo a `index.html` para que el refresh en `/admin` no dé 404.
- **"¿Por qué archivos .css separados y no `<style scoped>`?"**
  Decisión de consigna (CSS puro por componente, auditable por separado).
  Sabés explicar el trade-off: `scoped` aísla estilos por componente con
  atributos generados; aquí el aislamiento se logra con convención de
  nombres tipo BEM (`header__link--active`).

## 6. Mapa mental de 30 segundos para arrancar la defensa

1. **Estructura**: vistas en `pages/`, piezas en `components/`, rutas en
   `router/`, modelo POO en `models/`, datos en `public/`, tokens de diseño
   en `index.css`.
2. **Flujo de datos**: JSON → fetch en `onMounted` (async) → `ref` →
   template → interacción (`v-model`, `@click`) → mutación reactiva →
   actualización inmediata del DOM → `AdminRequest` → consola.
3. **Estética como sistema**: ninguna decisión visual está suelta; todas son
   variables CSS centralizadas (eso también es ingeniería).
