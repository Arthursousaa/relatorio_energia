/** Caderno Técnico Solar: marca geométrica de energia, visível e consistente no cabeçalho. */
type EnergyLogoProps = { compact?: boolean };

export default function EnergyLogo({ compact = false }: EnergyLogoProps) {
  return (
    <div className="brand-lockup" aria-label="Energia GD">
      <img src="/manus-storage/relatorio-gd-logo_3fbbd0ca.png" alt="Marca Energia GD" className="brand-mark" />
      {!compact && (
        <div>
          <p className="brand-kicker">ENERGIA / GD</p>
          <p className="brand-name">RELATÓRIO POR UC</p>
        </div>
      )}
    </div>
  );
}
