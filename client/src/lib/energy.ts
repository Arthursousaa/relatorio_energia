/** Caderno Técnico Solar: cálculos transparentes, auditáveis e independentes da interface. */
import type { EnergyRecord, UcSummary } from "@/types/energy";

export const formatKwh = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(Math.round(value));

export const formatDecimal = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  }).format(value);

export function pendingBalance(record: EnergyRecord) {
  return record.balanceBeforeKwh + record.injectedKwh - record.compensationNuvKwh;
}

export function sortPeriods(records: EnergyRecord[]) {
  return [...records].sort((a, b) => a.period.localeCompare(b.period, "pt-BR"));
}

export function summarizeUcs(records: EnergyRecord[]): UcSummary[] {
  const grouped = new Map<string, EnergyRecord[]>();

  records.forEach((record) => {
    const entries = grouped.get(record.ucId) ?? [];
    entries.push(record);
    grouped.set(record.ucId, entries);
  });

  return Array.from(grouped.entries())
    .map(([ucId, ucRecords]) => ({
      ucId,
      records: sortPeriods(ucRecords),
      totalConsumptionKwh: ucRecords.reduce((total, item) => total + item.consumptionKwh, 0),
      totalGenerationKwh: ucRecords.reduce((total, item) => total + item.ownGenerationKwh, 0),
      totalInjectedKwh: ucRecords.reduce((total, item) => total + item.injectedKwh, 0),
      totalCompensationKwh: ucRecords.reduce((total, item) => total + item.compensationNuvKwh, 0),
      totalBalanceKwh: ucRecords.reduce((total, item) => total + pendingBalance(item), 0),
    }))
    .sort((a, b) => a.ucId.localeCompare(b.ucId, "pt-BR", { numeric: true }));
}
