import { useState } from 'react';
import './DistorsionMorfologica.css';

/* Valores "canon eurocéntrico" hacia los que convergen los sliders */
const VALORES_CANON = {
  nariz: 85,    // afinar nariz al máximo
  ojos: 80,     // agrandar ojos
  mandibula: 75,// reducir mandíbula
  piel: 78,     // aclarar piel
};

/* Valores neutros (rostro original sin filtro) */
const VALORES_NEUTROS = {
  nariz: 0,
  ojos: 0,
  mandibula: 0,
  piel: 0,
};

/* Interpola entre dos colores de piel según el valor del slider */
function interpolarTonoPiel(valor) {
  // 0 = tono natural oscuro (#7a4a35), 100 = tono blanqueado (#f5d8c0)
  const t = valor / 100;
  const r = Math.round(0x7a + (0xf5 - 0x7a) * t);
  const g = Math.round(0x4a + (0xd8 - 0x4a) * t);
  const b = Math.round(0x35 + (0xc0 - 0x35) * t);
  return `rgb(${r},${g},${b})`;
}

export default function DistorsionMorfologica() {
  const [valores, setValores] = useState(VALORES_NEUTROS);
  const [animando, setAnimando] = useState(false);

  /* Actualiza un valor individual */
  const cambiarValor = (key, val) => {
    setValores(prev => ({ ...prev, [key]: Number(val) }));
  };

  /* Anima todos los sliders hacia el canon */
  const aplicarCanon = () => {
    setAnimando(true);
    setValores(VALORES_CANON);
    setTimeout(() => setAnimando(false), 600);
  };

  const restablecer = () => {
    setAnimando(true);
    setValores(VALORES_NEUTROS);
    setTimeout(() => setAnimando(false), 400);
  };

  /* Estilos derivados del estado */
  const anchoCara = `${58 - valores.mandibula * 0.12}px`; // mandíbula reduce ancho
  const altoOjos  = `${9 + valores.ojos * 0.08}px`;       // ojos se agrandan
  const anchoOjos = `${10 + valores.ojos * 0.07}px`;
  const anchoNariz = `${9 - valores.nariz * 0.05}px`;     // nariz se afina
  const altoNariz  = `${12 - valores.nariz * 0.04}px`;
  const tonoPiel   = interpolarTonoPiel(valores.piel);
  const borderRadiusMandibula = `${4 + valores.mandibula * 0.12}px`; // mandíbula se redondea

  /* Datos para la ficha técnica */
  const ficha = [
    { label: 'Nariz afinada',         valor: valores.nariz,    unidad: '%', color: valores.nariz > 50 ? 'var(--color-danger)' : 'inherit' },
    { label: 'Ojos agrandados',       valor: valores.ojos,     unidad: '%', color: valores.ojos > 50 ? 'var(--color-danger)' : 'inherit' },
    { label: 'Mandíbula reducida',    valor: valores.mandibula, unidad: '%', color: valores.mandibula > 50 ? 'var(--color-danger)' : 'inherit' },
    { label: 'Piel aclarada',         valor: valores.piel,     unidad: '%', color: valores.piel > 50 ? 'var(--color-danger)' : 'inherit' },
  ];

  return (
    <div className="morfo-demo">
      {/* Columna izquierda: rostro CSS + botones */}
      <div className="morfo-col-rostro">
        <p className="morfo-etiqueta-rostro">ROSTRO SIMULADO</p>

        {/* Rostro construido íntegramente con CSS */}
        <div className="morfo-rostro-wrap" aria-label="Rostro ilustrativo CSS" aria-hidden="true">
          {/* Pelo */}
          <div
            className="morfo-pelo"
            style={{
              width: anchoCara,
              borderRadius: '6px 6px 0 0',
              transition: animando ? 'all 500ms cubic-bezier(0.4,0,0.2,1)' : 'all 300ms ease',
            }}
          />

          {/* Cara principal */}
          <div
            className="morfo-cara"
            style={{
              backgroundColor: tonoPiel,
              width: anchoCara,
              borderRadius: `${borderRadiusMandibula} ${borderRadiusMandibula} ${borderRadiusMandibula} ${borderRadiusMandibula}`,
              transition: animando ? 'all 500ms cubic-bezier(0.4,0,0.2,1)' : 'all 300ms ease',
            }}
          >
            {/* Cejas */}
            <div className="morfo-cejas" style={{ width: anchoOjos }}>
              <div className="morfo-ceja" style={{ backgroundColor: `color-mix(in srgb, ${tonoPiel} 30%, #111 70%)` }} />
              <div className="morfo-ceja" style={{ backgroundColor: `color-mix(in srgb, ${tonoPiel} 30%, #111 70%)` }} />
            </div>

            {/* Ojos */}
            <div className="morfo-ojos-row">
              {[0, 1].map(i => (
                <div key={i} className="morfo-ojo-wrap">
                  <div
                    className="morfo-ojo"
                    style={{
                      width: anchoOjos,
                      height: altoOjos,
                      transition: animando ? 'all 500ms cubic-bezier(0.4,0,0.2,1)' : 'all 300ms ease',
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Nariz */}
            <div
              className="morfo-nariz"
              style={{
                width: anchoNariz,
                height: altoNariz,
                backgroundColor: `color-mix(in srgb, ${tonoPiel} 60%, #111 40%)`,
                transition: animando ? 'all 500ms cubic-bezier(0.4,0,0.2,1)' : 'all 300ms ease',
              }}
            />

            {/* Boca */}
            <div className="morfo-boca">
              <div
                className="morfo-labio-superior"
                style={{
                  backgroundColor: `color-mix(in srgb, ${tonoPiel} 40%, #8b2a2a 60%)`,
                }}
              />
              <div
                className="morfo-labio-inferior"
                style={{
                  backgroundColor: `color-mix(in srgb, ${tonoPiel} 30%, #8b2a2a 70%)`,
                }}
              />
            </div>
          </div>
        </div>

        <div className="morfo-botones">
          <button
            className="btn-brutal btn-brutal--accent morfo-btn"
            onClick={aplicarCanon}
            disabled={animando}
          >
            APLICAR FILTRO CANON
          </button>
          <button
            className="btn-brutal morfo-btn"
            onClick={restablecer}
            disabled={animando}
          >
            RESTABLECER
          </button>
        </div>
      </div>

      {/* Columna derecha: sliders + ficha técnica */}
      <div className="morfo-col-controles">
        <div className="morfo-sliders">
          {[
            { key: 'nariz',     label: 'AFINAR NARIZ',       emoji: '↔' },
            { key: 'ojos',      label: 'AGRANDAR OJOS',      emoji: '◯' },
            { key: 'mandibula', label: 'REDUCIR MANDÍBULA',  emoji: '⌒' },
            { key: 'piel',      label: 'ACLARAR PIEL',       emoji: '◐' },
          ].map(({ key, label, emoji }) => (
            <div key={key} className="morfo-slider-item">
              <div className="morfo-slider-header">
                <label className="morfo-slider-label" htmlFor={`morfo-${key}`}>
                  <span className="morfo-emoji" aria-hidden="true">{emoji}</span>
                  {label}
                </label>
                <span className="morfo-slider-val">{valores[key]}%</span>
              </div>
              <input
                id={`morfo-${key}`}
                className="slider-brutal slider-brutal--light"
                type="range"
                min={0}
                max={100}
                value={valores[key]}
                onChange={e => cambiarValor(key, e.target.value)}
                aria-label={`${label}: ${valores[key]}%`}
              />
            </div>
          ))}
        </div>

        {/* Ficha técnica */}
        <div className="morfo-ficha">
          <p className="morfo-ficha-titulo">FICHA TÉCNICA DE DEFORMACIÓN</p>
          <table className="morfo-tabla" aria-label="Ficha técnica de deformación morfológica">
            <tbody>
              {ficha.map(({ label, valor, unidad, color }) => (
                <tr key={label}>
                  <td className="morfo-tabla-label">{label}</td>
                  <td className="morfo-tabla-val" style={{ color }}>
                    {valor}{unidad}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {Object.values(valores).some(v => v > 50) && (
            <p className="morfo-ficha-alerta">
              ⬆ Modificación significativa detectada.
              El filtro opera sobre características racializadas.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
