/**
 * TablaUsuarios — tabla de solo lectura con todos los usuarios del sistema.
 * Muestra: nombre, email, rol admin, suscripción, fecha de registro, cantidad de likes.
 */
import './TablaUsuarios.css';

export default function TablaUsuarios({ usuarios }) {
  return (
    <div className="tabla-scroll">
      <table className="tabla-brutal">
        <thead>
          <tr>
            <th>USUARIO</th>
            <th>EMAIL</th>
            <th>ADMIN</th>
            <th>SUSCRIPTO</th>
            <th>REGISTRO</th>
            <th>LIKES</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((u) => (
            <tr key={u.name}>
              <td>
                <span className="tabla-nombre">{u.name}</span>
              </td>
              <td>{u.email}</td>
              <td>
                {u.isAdmin ? (
                  <span className="tabla-badge tabla-badge--admin">SÍ</span>
                ) : (
                  <span className="tabla-badge tabla-badge--no">NO</span>
                )}
              </td>
              <td>
                {u.isSubscribed ? (
                  <span className="tabla-badge tabla-badge--ok">SÍ</span>
                ) : (
                  <span className="tabla-badge tabla-badge--no">NO</span>
                )}
              </td>
              <td className="tabla-mono">{u.registerDate}</td>
              <td className="tabla-mono tabla-num">{u.likedPostIDs.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
