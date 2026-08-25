/** Caderno Técnico Solar: tipos que preservam a rastreabilidade de cada competência GD. */
export type EnergyRecord = {
  id: string;
  sourceFile: string;
  ucId: string;
  period: string;
  consumptionKwh: number;
  ownGenerationKwh: number;
  injectedKwh: number;
  compensationNuvKwh: number;
  balanceBeforeKwh: number;
  reportedBalanceKwh?: number;
  rawValues: Record<string, string>;
};

export type UcSummary = {
  ucId: string;
  records: EnergyRecord[];
  totalConsumptionKwh: number;
  totalGenerationKwh: number;
  totalInjectedKwh: number;
  totalCompensationKwh: number;
  totalBalanceKwh: number;
};

export type ImportResult = {
  records: EnergyRecord[];
  fileNames: string[];
  warnings: string[];
};
