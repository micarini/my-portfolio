/**
 * Admin.jsx — página del panel de administración.
 *
 * Flujo:
 *  1. Login simulado → fetch /usuarios.json → validar credenciales
 *  2a. Sin acceso admin → pantalla de bloqueo <AccesoRestringido>
 *  2b. Admin confirmado → panel con pestañas: Usuarios | Contenido
 *  3. Panel: TablaUsuarios (solo lectura) + TablaContenido (CRUD completo)
 *  4. Registro de auditoría de todas las AdminRequest generadas
 */
import { useState, useEffect } from 'react';
import LoginForm from '../components/admin/LoginForm.jsx';
import AccesoRestringido from '../components/admin/AccesoRestringido.jsx';
import TablaUsuarios from '../components/admin/TablaUsuarios.jsx';
import TablaContenido from '../components/admin/TablaContenido.jsx';
import RegistroAuditoria from '../components/admin/RegistroAuditoria.jsx';
import './Admin.css';

// Estados posibles de autenticación
const AUTH = {
  PENDIENTE: 'PENDIENTE',     // no ha intentado login aún
  BLOQUEADO: 'BLOQUEADO',     // credenciales ok pero sin isAdmin
  AUTENTICADO: 'AUTENTICADO', // admin confirmado
};

// Pestañas del panel
const PESTANAS = {
  USUARIOS: 'USUARIOS',
  CONTENIDO: 'CONTENIDO',
};

export default function Admin() {
  // Estado de autenticación y usuario logueado
  const [authEstado, setAuthEstado] = useState(AUTH.PENDIENTE);
  const [usuarioLogueado, setUsuarioLogueado] = useState(null);

  // Datos cargados desde JSON
  const [usuarios, setUsuarios] = useState([]);
  const [contenido, setContenido] = useState([]);

  // Pestaña activa del panel
  const [pestanaActiva, setPestanaActiva] = useState(PESTANAS.USUARIOS);

  // Historial de AdminRequests para el registro de auditoría
  const [historial, setHistorial] = useState([]);

  // Precargar ambos JSON una sola vez al montar el componente
  useEffect(() => {
    async function precargarDatos() {
      try {
        const [resUsers, resContent] = await Promise.all([
          fetch('/usuarios.json'),
          fetch('/contenido.json'),
        ]);
        const [u, c] = await Promise.all([resUsers.json(), resContent.json()]);
        setUsuarios(u);
        setContenido(c);
      } catch (err) {
        console.error('Error precargando datos:', err);
      }
    }
    precargarDatos();
  }, []);

  /* --- Handlers de autenticación --- */

  function handleLoginExitoso(usuario) {
    setUsuarioLogueado(usuario);
    setAuthEstado(AUTH.AUTENTICADO);
  }

  function handleLoginBloqueado(usuario) {
    setUsuarioLogueado(usuario);
    setAuthEstado(AUTH.BLOQUEADO);
  }

  function handleReintentar() {
    setAuthEstado(AUTH.PENDIENTE);
    setUsuarioLogueado(null);
  }

  function handleLogout() {
    setAuthEstado(AUTH.PENDIENTE);
    setUsuarioLogueado(null);
    setPestanaActiva(PESTANAS.USUARIOS);
    setHistorial([]);
  }

  /* --- Handler para agregar una nueva petición al historial --- */

  function handleNuevaRequest(req) {
    setHistorial((prev) => [...prev, req]);
  }

  /* ── Renderizado condicional según estado de auth ── */

  if (authEstado === AUTH.PENDIENTE) {
    return (
      <LoginForm
        onLoginExitoso={handleLoginExitoso}
        onLoginBloqueado={handleLoginBloqueado}
      />
    );
  }

  if (authEstado === AUTH.BLOQUEADO) {
    return (
      <AccesoRestringido
        usuario={usuarioLogueado}
        onReintentar={handleReintentar}
      />
    );
  }

  /* ── Panel admin ── */

  return (
    <div className="admin-panel">
      <div className="container">

        {/* Encabezado del panel */}
        <header className="admin-encabezado">
          <div className="admin-encabezado-izq">
            <span className="admin-stamp">PANEL ADMIN</span>
            <h1 className="admin-titulo">CONTROL<br />TOTAL</h1>
          </div>
          <div className="admin-encabezado-der">
            <div className="admin-sesion">
              <span className="admin-sesion-label">SESIÓN ACTIVA</span>
              <span className="admin-sesion-usuario">{usuarioLogueado?.name}</span>
              <span className="admin-sesion-email">{usuarioLogueado?.email}</span>
            </div>
            <button
              className="btn-brutal btn-brutal--danger admin-logout"
              onClick={handleLogout}
            >
              CERRAR SESIÓN
            </button>
          </div>
        </header>

        {/* Pestañas tipo brutalismo */}
        <nav className="admin-tabs" role="tablist" aria-label="Secciones del panel">
          <button
            className={`admin-tab ${pestanaActiva === PESTANAS.USUARIOS ? 'admin-tab--activa' : ''}`}
            role="tab"
            aria-selected={pestanaActiva === PESTANAS.USUARIOS}
            onClick={() => setPestanaActiva(PESTANAS.USUARIOS)}
          >
            USUARIOS
            <span className="admin-tab-count">{usuarios.length}</span>
          </button>
          <button
            className={`admin-tab ${pestanaActiva === PESTANAS.CONTENIDO ? 'admin-tab--activa' : ''}`}
            role="tab"
            aria-selected={pestanaActiva === PESTANAS.CONTENIDO}
            onClick={() => setPestanaActiva(PESTANAS.CONTENIDO)}
          >
            CONTENIDO
            <span className="admin-tab-count">{contenido.length}</span>
          </button>
        </nav>

        {/* Contenido de la pestaña activa */}
        <section className="admin-seccion" aria-label={`Tabla de ${pestanaActiva}`}>
          <div className="admin-seccion-header">
            <h2 className="admin-seccion-titulo">{pestanaActiva}</h2>
            {pestanaActiva === PESTANAS.USUARIOS && (
              <span className="tag-brutal">SOLO LECTURA</span>
            )}
            {pestanaActiva === PESTANAS.CONTENIDO && (
              <span className="tag-brutal">CRUD COMPLETO</span>
            )}
          </div>

          {pestanaActiva === PESTANAS.USUARIOS && (
            <TablaUsuarios usuarios={usuarios} />
          )}

          {pestanaActiva === PESTANAS.CONTENIDO && (
            <TablaContenido
              contenido={contenido}
              setContenido={setContenido}
              adminNombre={usuarioLogueado?.name}
              onNuevaRequest={handleNuevaRequest}
            />
          )}
        </section>

        {/* Registro de auditoría: siempre visible en el panel */}
        <section className="admin-auditoria" aria-label="Registro de auditoría">
          <div className="admin-seccion-header">
            <h2 className="admin-seccion-titulo">AUDITORÍA</h2>
            <span className="tag-brutal">AdminRequest · POO</span>
          </div>
          <RegistroAuditoria historial={historial} />
        </section>

      </div>
    </div>
  );
}
