/** Referência GitHub Pages: estado de análise e lista de UCs no mesmo painel escuro do portal original. */
import { FileSearch, Search, ChevronRight } from "lucide-react";
import { formatKwh } from "@/lib/energy";
import type { UcSummary } from "@/types/energy";

type UcExplorerProps = { ucs: UcSummary[]; search: string; selectedUcId?: string; onSearch: (value: string) => void; onSelect: (value: string) => void; };

export default function UcExplorer({ ucs, search, selectedUcId, onSearch, onSelect }: UcExplorerProps) {
  const visibleUcs = ucs.filter((uc) => uc.ucId.toLowerCase().includes(search.toLowerCase()));
  if (!ucs.length) {
    return <section className="gd-panel gd-ready-panel"><div className="reference-dashes dashes-left" aria-hidden="true" /><div className="gd-ready-label"><span className="gd-ready-icon"><FileSearch size={20} /></span>PRONTO PARA ANÁLISE</div><h2>Leia o XML da distribuidora sem montar planilhas manualmente.</h2><p>Depois do upload, você poderá pesquisar qualquer UC por instalação e gerar o demonstrativo completo com consumo, geração própria, injeção, compensação NUV efetiva e saldo pendente.</p><div className="gd-pills"><span>Consumo</span><span>Geração própria</span><span>Compensação NUV</span><span>Injetado</span><span>Saldo pendente</span></div></section>;
  }
  return (
    <section className="gd-panel gd-uc-panel" aria-labelledby="uc-title">
      <div className="reference-dashes dashes-left" aria-hidden="true" />
      <div className="gd-panel-heading"><div><p>CONSULTAR UC</p><h2 id="uc-title">Unidades consumidoras</h2></div><span>{ucs.length} UCs</span></div>
      <label className="gd-search"><Search size={17} /><span className="sr-only">Localizar unidade consumidora</span><input value={search} onChange={(event) => onSearch(event.target.value)} placeholder="Localizar unidade consumidora" /></label>
      <div className="gd-uc-list">
        {visibleUcs.map((uc) => <button className={selectedUcId === uc.ucId ? "is-active" : ""} type="button" key={uc.ucId} onClick={() => onSelect(uc.ucId)}><span><small>UC</small><strong>{uc.ucId}</strong></span><span className="gd-uc-balance"><small>SALDO</small><b>{formatKwh(uc.totalBalanceKwh)} kWh</b></span><ChevronRight size={18} /></button>)}
        {!visibleUcs.length && <p className="gd-no-result">Não encontrei uma UC exata. Escolha uma opção sugerida ou revise o número informado.</p>}
      </div>
    </section>
  );
}
