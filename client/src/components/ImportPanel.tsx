/** Referência GitHub Pages: cartão de importação escuro com o mesmo texto, hierarquia e estados do portal publicado. */
import { useRef } from "react";
import { FileUp, Files } from "lucide-react";
import { Button } from "@/components/ui/button";

type ImportPanelProps = {
  fileNames: string[];
  recordCount: number;
  warnings: string[];
  busy: boolean;
  onFiles: (files: File[]) => void;
};

export default function ImportPanel({ fileNames, recordCount, warnings, busy, onFiles }: ImportPanelProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const hasFiles = fileNames.length > 0;

  return (
    <section className="gd-import-card" aria-labelledby="import-title">
      <div className="reference-dashes dashes-left" aria-hidden="true" />
      <div className="reference-dashes dashes-right" aria-hidden="true" />
      <input ref={inputRef} className="sr-only" type="file" accept=".xml,text/xml,application/xml" multiple onChange={(event) => { const files = Array.from(event.target.files ?? []); if (files.length) onFiles(files); event.currentTarget.value = ""; }} />
      <div className="gd-import-icon"><FileUp size={22} /></div>
      <div className="gd-import-copy">
        <h2 id="import-title">Importar relatório GD</h2>
        <p>Selecione um ou mais XMLs da distribuidora. Os dados serão consolidados por UC e competência automaticamente. Após o upload, o resumo de UCs por arquivo aparece logo abaixo.</p>
        <div className="gd-data-key"><span>XML</span><i /><span>UC</span><i /><span>SALDO</span></div>
      </div>
      <div className="gd-import-action"><Button className="gd-primary-button" disabled={busy} onClick={() => inputRef.current?.click()}><FileUp size={17} />{busy ? "Lendo XMLs" : "Selecionar XMLs"}</Button></div>
      {hasFiles && <div className="gd-import-summary"><Files size={15} /><span>{fileNames.length === 1 ? fileNames[0] : `${fileNames.length} arquivos consolidados`} · {recordCount} competências identificadas</span></div>}
      {warnings.length > 0 && <div className="gd-warning">{warnings.map((warning) => <p key={warning}>{warning}</p>)}</div>}
    </section>
  );
}
