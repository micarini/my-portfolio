import { useState, useMemo } from 'react';
import './HomogeneizacionEstetica.css';

/* Seis rostros CSS con características distintas.
   Cada uno tiene valores de inicio y el "target" es el Instagram Face canónico. */
const ROSTROS_ORIGINALES = [
  {
    id: 1,
    tono:        '#3d1f0e',
    anchoMandib: 62,
    tamOjos:     8,
    anchoNariz:  9,
    pelo:        '#111',
    radiusCara:  '5px',
  },
  {
    id: 2,
    tono:        '#6b3a2a',
    anchoMandib: 58,
    tamOjos:     9,
    anchoNariz:  10,
    pelo:        '#1a0a0a',
    radiusCara:  '30px',
  },
  {
    id: 3,
    tono:        '#c47a5a',
    anchoMandib: 55,
    tamOjos:     7,
    anchoNariz:  8,
    pelo:        '#6b3d2e',
    radiusCara:  '10px',
  },
  {
    id: 4,
    tono:        '#8c5040',
    anchoMandib: 65,
    tamOjos:     10,
    anchoNariz:  11,
    pelo:        '#222',
    radiusCara:  '20px',
  },
  {
    id: 5,
    tono:        '#d4956a',
    anchoMandib: 52,
    tamOjos:     8,
    anchoNariz:  7,
    pelo:        '#5c3d2e',
    radiusCara:  '8px',
  },
  {
    id: 6,
    tono:        '#4a2c17',
    anchoMandib: 60,
    tamOjos:     9,
    anchoNariz:  9,
    pelo:        '#111',
    radiusCara:  '15px',
  },
];

/* Target "Instagram Face": nariz fina, ojos grandes, mandíbula pequeña, piel clara */
const TARGET_INSTAGRAM = {
  tono:        '#f0c8a0',
  anchoMandib: 46,
  tamOjos:     14,
  anchoNariz:  5,
  pelo:        '#c49a3c',
  radiusCara:  '50px',
};

/* Interpola linealmente entre dos colores hex */
function interpolarColor(hexA, hexB, t) {
  const parse = hex => [
    parseInt(hex.slice(1,3), 16),
    parseInt(hex.slice(3,5), 16),
    parseInt(hex.slice(5,7), 16),
  ];
  const [r1,g1,b1] = parse(hexA);
  const [r2,g2,b2] = parse(hexB);
  const r = Math.round(r1 + (r2-r1)*t);
  const g = Math.round(g1 + (g2-g1)*t);
  const b = Math.round(b1 + (b2-b1)*t);
  return `rgb(${r},${g},${b})`;
}

/* Interpola un número */
const lerp = (a, b, t) => a + (b - a) * t;

export default function HomogeneizacionEstetica() {
  const [iteracion, setIteracion] = useState(0);

  /* t = 0 → rostros originales, t = 1 → Instagram Face homogéneo */
  const t = iteracion / 100;

  const rostrosInterpolados = useMemo(() =>
    ROSTROS_ORIGINALES.map(r => ({
      id: r.id,
      tono:        interpolarColor(r.tono, TARGET_INSTAGRAM.tono, t),
      anchoMandib: lerp(r.anchoMandib, TARGET_INSTAGRAM.anchoMandib, t),
      tamOjos:     lerp(r.tamOjos, TARGET_INSTAGRAM.tamOjos, t),
      anchoNariz:  lerp(r.anchoNariz, TARGET_INSTAGRAM.anchoNariz, t),
      pelo:        interpolarColor(r.pelo, TARGET_INSTAGRAM.pelo, t),
      radiusCara:  `${lerp(parseInt(r.radiusCara), 50, t)}px`,
    })),
  [t]);

  /* A partir del 70% los rostros son prácticamente idénticos */
  const convergencia = iteracion >= 70;
  const porcentajeDiferencia = Math.round((1 - t) * 100);

  return (
    <div className="homo-demo">
      {/* Slider de iteraciones */}
      <div className="homo-controles">
        <div className="homo-controles-inner">
          <label className="homo-label" htmlFor="slider-iteracion">
            ITERACIONES DE LA TENDENCIA
          </label>
          <div className="homo-slider-row">
            <span className="homo-extremo">0</span>
            <input
              id="slider-iteracion"
              className="slider-brutal"
              type="range"
              min={0}
              max={100}
              value={iteracion}
              onChange={e => setIteracion(Number(e.target.value))}
            />
            <span className="homo-extremo">∞</span>
          </div>
          <div className="homo-stats">
            <span className="homo-stat">
              <strong>{iteracion}</strong>
              <small>tendencia</small>
            </span>
            <span className="homo-stat">
              <strong style={{ color: porcentajeDiferencia < 30 ? 'var(--color-danger)' : 'inherit' }}>
                {porcentajeDiferencia}%
              </strong>
              <small>diversidad restante</small>
            </span>
            <span className="homo-stat">
              <strong style={{ color: convergencia ? 'var(--color-danger)' : 'inherit' }}>
                {convergencia ? 'CONVERGENCIA' : 'DIVERGENCIA'}
              </strong>
              <small>estado</small>
            </span>
          </div>
        </div>
      </div>

      {/* Fila de 6 rostros */}
      <div className="homo-fila" aria-label="Fila de rostros convergiendo hacia el mismo estándar">
        {rostrosInterpolados.map((rostro, i) => (
          <RostroConvergente key={rostro.id} rostro={rostro} indice={i + 1} />
        ))}
      </div>

      {convergencia && (
        <div className="homo-convergencia-alert" role="alert">
          <span className="homo-convergencia-icon">→</span>
          <span>
            A este nivel de tendencia, los 6 rostros son morfológicamente indistinguibles.
            Este es el "Instagram Face": un promedio global que borra la diferencia.
          </span>
        </div>
      )}

      {/* Cita editorial */}
      <blockquote className="homo-cita">
        <p className="homo-cita-texto">
          "Existe ahora, expandiéndose por las pantallas de smartphones de todo el mundo,
          un único e inquietante rostro: una mujer joven de ojos enormes y límpidos,
          nariz fina, mejillas levantadas, labios carnosos y la piel libre de imperfecciones."
        </p>
        <footer className="homo-cita-fuente">
          — Jia Tolentino, <cite>The New Yorker</cite>, 2019.
          Concepto: "Instagram Face" — la convergencia estética global producida por filtros AR.
        </footer>
      </blockquote>
    </div>
  );
}

/* Subcomponente de rostro CSS interpolado */
function RostroConvergente({ rostro, indice }) {
  return (
    <div className="homo-tarjeta" aria-label={`Rostro ${indice}`}>
      <div className="homo-rostro" aria-hidden="true">
        {/* Pelo */}
        <div
          className="homo-pelo"
          style={{
            backgroundColor: rostro.pelo,
            width: `${rostro.anchoMandib + 8}px`,
            borderRadius: `${rostro.radiusCara} ${rostro.radiusCara} 0 0`,
            transition: 'all 250ms ease',
          }}
        />
        {/* Cara */}
        <div
          className="homo-cara"
          style={{
            backgroundColor: rostro.tono,
            width: `${rostro.anchoMandib}px`,
            borderRadius: rostro.radiusCara,
            transition: 'all 250ms ease',
          }}
        >
          {/* Ojos */}
          <div className="homo-ojos">
            {[0, 1].map(i => (
              <div
                key={i}
                className="homo-ojo"
                style={{
                  width: `${rostro.tamOjos}px`,
                  height: `${rostro.tamOjos * 0.9}px`,
                  transition: 'all 250ms ease',
                }}
              />
            ))}
          </div>
          {/* Nariz */}
          <div
            className="homo-nariz"
            style={{
              width: `${rostro.anchoNariz}px`,
              backgroundColor: `color-mix(in srgb, ${rostro.tono} 60%, #111 40%)`,
              transition: 'all 250ms ease',
            }}
          />
          {/* Boca */}
          <div
            className="homo-boca"
            style={{
              backgroundColor: `color-mix(in srgb, ${rostro.tono} 20%, #8b2a2a 80%)`,
              transition: 'background-color 250ms ease',
            }}
          />
        </div>
      </div>
      <span className="homo-num">{String(indice).padStart(2, '0')}</span>
    </div>
  );
}
