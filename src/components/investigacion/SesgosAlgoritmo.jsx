import { useState, useMemo } from 'react';
import './SesgosAlgoritmo.css';

/* Datos de 12 rostros abstractos representados con composiciones CSS.
   Cada tarjeta tiene: tono de piel (hue), forma de cara (oval/ancho/redondo),
   y un valor de "ajuste al canon" (0 = diverso, 1 = canónico). */
const ROSTROS_INICIALES = [
  { id: 1, nombre: 'Figura A', tono: '#3d1f0e', forma: 'oval',    canon: 0.15, ojos: 'almendra', pelo: '#111' },
  { id: 2, nombre: 'Figura B', tono: '#f5d0a9', forma: 'angular', canon: 0.92, ojos: 'grande',   pelo: '#8b6914' },
  { id: 3, nombre: 'Figura C', tono: '#6b3a2a', forma: 'redondo', canon: 0.20, ojos: 'almendra', pelo: '#1a0a0a' },
  { id: 4, nombre: 'Figura D', tono: '#e8b89a', forma: 'oval',    canon: 0.88, ojos: 'grande',   pelo: '#3d2b1f' },
  { id: 5, nombre: 'Figura E', tono: '#4a2c17', forma: 'ancho',   canon: 0.18, ojos: 'medio',    pelo: '#111' },
  { id: 6, nombre: 'Figura F', tono: '#d4956a', forma: 'oval',    canon: 0.65, ojos: 'grande',   pelo: '#5c3d2e' },
  { id: 7, nombre: 'Figura G', tono: '#8c5040', forma: 'redondo', canon: 0.30, ojos: 'medio',    pelo: '#222' },
  { id: 8, nombre: 'Figura H', tono: '#f0c8a0', forma: 'oval',    canon: 0.85, ojos: 'grande',   pelo: '#c49a3c' },
  { id: 9, nombre: 'Figura I', tono: '#2c1810', forma: 'angular', canon: 0.10, ojos: 'almendra', pelo: '#111' },
  { id: 10, nombre: 'Figura J', tono: '#c47a5a', forma: 'oval',   canon: 0.55, ojos: 'medio',    pelo: '#6b3d2e' },
  { id: 11, nombre: 'Figura K', tono: '#7a4a35', forma: 'ancho',  canon: 0.22, ojos: 'almendra', pelo: '#1a1a1a' },
  { id: 12, nombre: 'Figura L', tono: '#fce0c4', forma: 'oval',   canon: 0.95, ojos: 'grande',   pelo: '#b8860b' },
];

export default function SesgosAlgoritmo() {
  const [presion, setPresion] = useState(0);

  /* Calculamos visibilidad de cada tarjeta según presión algorítmica:
     A mayor presión, los rostros con bajo puntaje canon se opacan y escalan. */
  const tarjetasOrdenadas = useMemo(() => {
    const conVisibilidad = ROSTROS_INICIALES.map(r => {
      const factorPresion = presion / 100;
      // Opacidad mínima según distancia al canon y presión
      const opacidad = presion === 0
        ? 1
        : Math.max(0.08, 1 - factorPresion * (1 - r.canon) * 1.3);
      const escala = presion === 0
        ? 1
        : Math.max(0.72, 1 - factorPresion * (1 - r.canon) * 0.35);
      return { ...r, opacidad, escala };
    });
    // Ordenar: los de mayor canon primero cuando hay presión
    return [...conVisibilidad].sort((a, b) => {
      if (presion === 0) return 0;
      return b.canon - a.canon;
    });
  }, [presion]);

  /* Porcentaje de diversidad visible: tarjetas con opacidad > 0.3 y canon < 0.6 */
  const diversidadVisible = useMemo(() => {
    const visibles = tarjetasOrdenadas.filter(r => r.opacidad > 0.3 && r.canon < 0.6);
    return Math.round((visibles.length / ROSTROS_INICIALES.length) * 100);
  }, [tarjetasOrdenadas]);

  const canonicos = tarjetasOrdenadas.filter(r => r.opacidad > 0.3 && r.canon >= 0.6).length;

  return (
    <div className="sesgo-demo">
      {/* Panel de control */}
      <div className="sesgo-controles">
        <label className="sesgo-label" htmlFor="slider-presion">
          PRESIÓN ALGORÍTMICA
        </label>
        <div className="sesgo-slider-row">
          <span className="sesgo-valor-extremo">0</span>
          <input
            id="slider-presion"
            className="slider-brutal"
            type="range"
            min={0}
            max={100}
            value={presion}
            onChange={e => setPresion(Number(e.target.value))}
          />
          <span className="sesgo-valor-extremo">100</span>
        </div>
        <div className="sesgo-presion-display">
          <span className="sesgo-num">{presion}</span>
          <span className="sesgo-unit">/ 100</span>
        </div>
      </div>

      {/* Métricas en tiempo real */}
      <div className="sesgo-metricas">
        <div className="sesgo-metrica sesgo-metrica--danger">
          <span className="sesgo-metrica-num">{diversidadVisible}%</span>
          <span className="sesgo-metrica-label">diversidad<br />visible</span>
        </div>
        <div className="sesgo-metrica sesgo-metrica--ok">
          <span className="sesgo-metrica-num">{canonicos}</span>
          <span className="sesgo-metrica-label">rostros<br />promovidos</span>
        </div>
        <div className="sesgo-metrica">
          <span className="sesgo-metrica-num">{12 - tarjetasOrdenadas.filter(r => r.opacidad > 0.3).length}</span>
          <span className="sesgo-metrica-label">suprimidos<br />del feed</span>
        </div>
      </div>

      {/* Feed simulado */}
      <div className="sesgo-feed" aria-label="Feed simulado de rostros">
        {tarjetasOrdenadas.map(rostro => (
          <TarjetaRostro key={rostro.id} rostro={rostro} />
        ))}
      </div>

      {presion >= 80 && (
        <p className="sesgo-advertencia" role="alert">
          ↑ A presión máxima, el 83% de las figuras no eurocéntricas son invisibles.
          El algoritmo no censura: solo recomienda el estándar.
        </p>
      )}
    </div>
  );
}

/* Subcomponente de tarjeta individual: rostro abstracto con CSS */
function TarjetaRostro({ rostro }) {
  const esFormaAncha = rostro.forma === 'ancho';
  const esFormaRedonda = rostro.forma === 'redondo';
  const radiosCara = esFormaRedonda ? '50%' : esFormaAncha ? '12px' : '6px';
  const anchoCara = esFormaAncha ? '64px' : esFormaRedonda ? '58px' : '52px';
  const altoCara = esFormaRedonda ? '58px' : esFormaAncha ? '58px' : '70px';

  return (
    <div
      className="sesgo-tarjeta"
      style={{
        opacity: rostro.opacidad,
        transform: `scale(${rostro.escala})`,
        transition: 'opacity 350ms ease, transform 350ms ease',
      }}
      aria-label={`${rostro.nombre}, canon ${Math.round(rostro.canon * 100)}%`}
    >
      {/* Ilustración CSS del rostro */}
      <div className="rostro-css" aria-hidden="true">
        {/* Pelo */}
        <div
          className="rostro-pelo"
          style={{ backgroundColor: rostro.pelo, borderRadius: `${radiosCara} ${radiosCara} 0 0` }}
        />
        {/* Cara */}
        <div
          className="rostro-cara"
          style={{
            backgroundColor: rostro.tono,
            width: anchoCara,
            height: altoCara,
            borderRadius: radiosCara,
          }}
        >
          {/* Ojos */}
          <div className={`rostro-ojos rostro-ojos--${rostro.ojos}`}>
            <div className="rostro-ojo" />
            <div className="rostro-ojo" />
          </div>
          {/* Nariz */}
          <div className="rostro-nariz" style={{ backgroundColor: `color-mix(in srgb, ${rostro.tono} 70%, #111 30%)` }} />
          {/* Boca */}
          <div className="rostro-boca" />
        </div>
      </div>

      <div className="sesgo-tarjeta-meta">
        <span className="sesgo-tarjeta-nombre">{rostro.nombre}</span>
        <span className="sesgo-tarjeta-canon">Canon: {Math.round(rostro.canon * 100)}%</span>
      </div>
    </div>
  );
}
