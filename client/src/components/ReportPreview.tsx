/** Referência GitHub Pages: painel de saldo e demonstrativo com as mesmas etapas semânticas da interface publicada. */
import { Bolt, CheckCircle2, FileDown, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatKwh, pendingBalance } from "@/lib/energy";
import type { EnergyRecord, UcSummary } from "@/types/energy";

type ReportPreviewProps = { uc?: UcSummary; selectedRecord?: EnergyRecord; onSelectPeriod: (recordId: string) => void; };

function downloadWord(record: EnergyRecord) {
  const balance = pendingBalance(record);
  const html = `<!doctype html><html><head><meta charset="utf-8"><title>Demonstrativo GD</title></head><body style="font-family:Arial,sans-serif;padding:36px"><h1>Demonstrativo de Créditos GD</h1><p><b>UC:</b> ${record.ucId}</p><p><b>Competência:</b> ${record.period}</p><p>Consumo: ${formatKwh(record.consumptionKwh)} kWh<br>Geração própria: ${formatKwh(record.ownGenerationKwh)} kWh<br>Injetado: ${formatKwh(record.injectedKwh)} kWh<br>Compensação NUV: ${formatKwh(record.compensationNuvKwh)} kWh<br><b>Saldo pendente: ${formatKwh(balance)} kWh</b></p></body></html>`;
  const url = URL.createObjectURL(new Blob([html], { type: "application/msword" }));
  const link = document.createElement("a"); link.href = url; link.download = `demonstrativo-gd-uc-${record.ucId}.doc`; link.click(); URL.revokeObjectURL(url);
}

export default function ReportPreview({ uc, selectedRecord, onSelectPeriod }: ReportPreviewProps) {
  if (!uc || !selectedRecord) {
    return <section className="gd-panel gd-balance-panel"><div className="reference-dashes dashes-right" aria-hidden="true" /><div className="gd-orbit" aria-hidden="true" /><div className="gd-balance-label"><Bolt size={17} />SEQUÊNCIA DO SALDO</div><h2>Geração própria</h2><strong>abate o consumo primeiro</strong><p>Saldo: injetado − compensação NUV</p><div className="gd-check"><CheckCircle2 size={17} />Saldo pendente por competência</div></section>;
  }
  const balance = pendingBalance(selectedRecord);
  return <section className="gd-panel gd-report-panel" id="demonstrativo"><div className="reference-dashes dashes-right" aria-hidden="true" /><div className="gd-panel-heading"><div><p>DEMONSTRATIVO</p><h2>UC {uc.ucId}</h2></div><div className="gd-report-actions"><Button variant="ghost" onClick={() => downloadWord(selectedRecord)}><FileDown size={15} /> Word</Button><Button className="gd-primary-button" onClick={() => window.print()}><Printer size={15} /> Imprimir / PDF</Button></div></div><div className="gd-periods no-print">{uc.records.map((record) => <button type="button" className={record.id === selectedRecord.id ? "is-active" : ""} onClick={() => onSelectPeriod(record.id)} key={record.id}>{record.period}</button>)}</div><div className="gd-report-grid"><div><small>CONSUMO</small><b>{formatKwh(selectedRecord.consumptionKwh)} kWh</b></div><div><small>GERAÇÃO PRÓPRIA</small><b>{formatKwh(selectedRecord.ownGenerationKwh)} kWh</b></div><div><small>INJETADO</small><b>{formatKwh(selectedRecord.injectedKwh)} kWh</b></div><div><small>COMPENSAÇÃO NUV</small><b>{formatKwh(selectedRecord.compensationNuvKwh)} kWh</b></div></div><div className="gd-saldo-box"><span>SALDO PENDENTE</span><strong>{formatKwh(balance)} <small>kWh</small></strong></div></section>;
}
