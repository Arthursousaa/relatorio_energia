/** Referência GitHub Pages: refatoração estrutural que preserva o portal de créditos GD publicado. */
import { useMemo, useState } from "react";
import { FileText, Gauge, Search, ShieldCheck, Sparkles, Upload, Zap } from "lucide-react";
import ImportPanel from "@/components/ImportPanel";
import ReportPreview from "@/components/ReportPreview";
import UcExplorer from "@/components/UcExplorer";
import { summarizeUcs } from "@/lib/energy";
import { parseXmlFiles } from "@/lib/xml";
import type { EnergyRecord } from "@/types/energy";

const navigation = [Zap, Upload, Search, FileText, Gauge];

export default function Home() {
  const [records, setRecords] = useState<EnergyRecord[]>([]);
  const [fileNames, setFileNames] = useState<string[]>([]);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [selectedUcId, setSelectedUcId] = useState<string>();
  const [selectedRecordId, setSelectedRecordId] = useState<string>();
  const [busy, setBusy] = useState(false);
  const ucs = useMemo(() => summarizeUcs(records), [records]);
  const selectedUc = useMemo(() => ucs.find((uc) => uc.ucId === selectedUcId), [ucs, selectedUcId]);
  const selectedRecord = useMemo(() => selectedUc?.records.find((record) => record.id === selectedRecordId) ?? selectedUc?.records.at(-1), [selectedUc, selectedRecordId]);

  function applyImport(nextRecords: EnergyRecord[], nextFileNames: string[], nextWarnings: string[]) {
    const merged: Record<string, EnergyRecord> = {};
    [...records, ...nextRecords].forEach((record) => { merged[`${record.sourceFile}-${record.ucId}-${record.period}`] = record; });
    const next = Object.keys(merged).map((key) => merged[key]);
    setRecords(next); setFileNames([...fileNames, ...nextFileNames].filter((name, index, list) => list.indexOf(name) === index)); setWarnings(nextWarnings);
    const first = summarizeUcs(next)[0]; if (first) { setSelectedUcId(first.ucId); setSelectedRecordId(first.records.at(-1)?.id); }
  }
  async function handleFiles(files: File[]) { setBusy(true); try { const result = await parseXmlFiles(files); applyImport(result.records, result.fileNames, result.warnings); } catch (error) { setWarnings([error instanceof Error ? error.message : "Não foi possível processar os XMLs selecionados."]); } finally { setBusy(false); } }
  function selectUc(ucId: string) { const uc = ucs.find((item) => item.ucId === ucId); setSelectedUcId(ucId); setSelectedRecordId(uc?.records.at(-1)?.id); }

  return <div className="gd-app"><aside className="gd-sidebar" aria-label="Navegação do portal">{navigation.map((Icon, index) => <button aria-label={["Início", "Importar XML", "Consultar UC", "Demonstrativo", "Indicadores"][index]} className={index === 1 ? "is-active" : ""} type="button" key={index}><Icon size={19} /></button>)}<div className="gd-side-bottom"><button aria-label="Segurança" type="button"><ShieldCheck size={18} /></button><button aria-label="Preferências" type="button"><Sparkles size={18} /></button></div></aside><div className="gd-content"><header className="gd-header"><div><p><span />GD · CONFERÊNCIA DE CRÉDITOS</p><h1>Gerenciamento de Créditos GD</h1><span>Importe o XML, consulte a UC e gere o demonstrativo de energia.</span></div><div className="gd-file-status"><FileText size={22} /><div><small>ARQUIVO ATUAL</small><strong>{fileNames.length ? (fileNames.length === 1 ? fileNames[0] : `${fileNames.length} XMLs selecionados`) : "Nenhum XML selecionado"}</strong></div></div></header><main className="gd-main"><ImportPanel fileNames={fileNames} recordCount={records.length} warnings={warnings} busy={busy} onFiles={handleFiles} /><div className="gd-lower-grid"><UcExplorer ucs={ucs} search={search} selectedUcId={selectedUcId} onSearch={setSearch} onSelect={selectUc} /><ReportPreview uc={selectedUc} selectedRecord={selectedRecord} onSelectPeriod={setSelectedRecordId} /></div></main></div></div>;
}
