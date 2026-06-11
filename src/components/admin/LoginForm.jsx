/**
 * LoginForm — formulario de autenticación del panel admin.
 * Estética de ficha/carnet: centrado, sombra dura grande, bordes rectos.
 */
import { useState } from 'react';
import './LoginForm.css';

export default function LoginForm({ onLoginExitoso, onLoginBloqueado }) {
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setCargando(true);

    try {
      const res = await fetch('/usuarios.json');
      const usuarios = await res.json();

      // Comparar credenciales con el listado
      const encontrado = usuarios.find(
        (u) => u.name === usuario.trim() && u.password === contrasena
      );

      if (!encontrado) {
        setError('Credenciales inválidas. Revisá usuario y contraseña.');
        setCargando(false);
        return;
      }

      if (!encontrado.isAdmin) {
        // Usuario válido pero sin permiso admin
        onLoginBloqueado(encontrado);
        return;
      }

      // Admin confirmado
      onLoginExitoso(encontrado);
    } catch {
      setError('Error al conectar con el servidor. Intentá de nuevo.');
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="login-wrapper">
      <div className="login-ficha">
        {/* Encabezado tipo sello de imprenta */}
        <div className="login-header">
          <span className="login-stamp">PANEL DE CONTROL</span>
          <h1 className="login-titulo">ADMIN</h1>
          <p className="login-subtitulo">Acceso restringido al sistema</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit} noValidate>
          <div className="login-campo">
            <label className="login-label" htmlFor="login-usuario">
              USUARIO
            </label>
            <input
              id="login-usuario"
              className="login-input"
              type="text"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              autoComplete="username"
              placeholder="nombre de usuario"
              required
            />
          </div>

          <div className="login-campo">
            <label className="login-label" htmlFor="login-contrasena">
              CONTRASEÑA
            </label>
            <input
              id="login-contrasena"
              className="login-input"
              type="password"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              autoComplete="current-password"
              placeholder="••••••••"
              required
            />
          </div>

          {/* Mensaje de error duro */}
          {error && (
            <div className="login-error" role="alert">
              <span className="login-error-icono">!</span>
              {error}
            </div>
          )}

          <button
            type="submit"
            className="btn-brutal btn-brutal--accent login-btn"
            disabled={cargando}
          >
            {cargando ? 'VERIFICANDO...' : 'INGRESAR AL PANEL'}
          </button>
        </form>

        {/* Pie de la ficha */}
        <div className="login-pie">
          <span className="tag-brutal">UMAI · 2026</span>
        </div>
      </div>
    </div>
  );
}
