import { NavLink } from 'react-router-dom';
import './Header.css';

const NAV_LINKS = [
  { to: '/', label: 'Galería' },
  { to: '/investigacion', label: 'Investigación' },
  { to: '/admin', label: 'Admin' },
];

export default function Header() {
  return (
    <header className="header">
      <div className="header__inner">
        <NavLink to="/" className="header__logo">
          MCR<span className="header__logo-dot">®</span>
        </NavLink>

        <p className="header__edition">
          Portfolio — Tecnología Multimedial · Ed. 2026 · Buenos Aires
        </p>

        <nav className="header__nav" aria-label="Navegación principal">
          {NAV_LINKS.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                isActive ? 'header__link header__link--active' : 'header__link'
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
