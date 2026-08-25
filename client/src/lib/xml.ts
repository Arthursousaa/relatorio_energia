/** Caderno Técnico Solar: leitor tolerante a variações de XML, com valores sempre processados no navegador. */
import type { EnergyRecord, ImportResult } from "@/types/energy";

const normalize = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]/g, "")
    .toLowerCase();

const FIELD_KEYS = {
  ucId: ["uc", "numerouc", "unidadeconsumidora", "instalacao", "numeroinstalacao", "codigouc", "codigoinstalacao"],
  period: ["periodouso", "competencia", "mesreferencia", "periodoreferencia", "referencia", "ciclo", "mesano"],
  consumptionKwh: ["consumo", "consumokwh", "consumofaturado", "energiaconsumida", "energiafornecida", "qtdconsumo"],
  ownGenerationKwh: ["geracaopropria", "geracao", "energiagerada", "geracaokwh", "qtdgeracao"],
  injectedKwh: ["injetado", "energiainjetada", "injecao", "injecaokwh", "qtdrecebimento"],
  compensationNuvKwh: ["compensacaonuv", "compensacao", "energiacompensada", "creditoutilizado", "compensadokwh", "qtdcompensacao"],
  reportedBalanceKwh: ["saldonuv", "saldopendente", "saldocredito", "creditoacumulado", "saldo", "qtdsaldoatual"],
} as const;

const CANDIDATE_TAGS = ["uc", "unidade", "consumidor", "recebedor", "benefici", "instal", "registro", "detalhe", "item", "linha"];

function toNumber(value?: string) {
  if (!value) return 0;
  const compact = value.replace(/\s/g, "");
  const normalized = compact.includes(",")
    ? compact.replace(/\./g, "").replace(",", ".")
    : compact.replace(/,/g, "");
  const parsed = Number(normalized.replace(/[^0-9.-]/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
}

function valueFrom(element: Element, keys: readonly string[]) {
  const desired = new Set(keys.map(normalize));
  for (const attribute of Array.from(element.attributes)) {
    if (desired.has(normalize(attribute.name)) && attribute.value.trim()) return attribute.value.trim();
  }

  for (const child of Array.from(element.children)) {
    if (desired.has(normalize(child.tagName)) && child.textContent?.trim()) return child.textContent.trim();
    for (const attribute of Array.from(child.attributes)) {
      if (desired.has(normalize(attribute.name)) && attribute.value.trim()) return attribute.value.trim();
    }
  }

  const descendants = Array.from(element.querySelectorAll("*"));
  for (const descendant of descendants) {
    const tagName = normalize(descendant.tagName);
    if (desired.has(tagName) && descendant.textContent?.trim()) return descendant.textContent.trim();
    for (const attribute of Array.from(descendant.attributes)) {
      if (desired.has(normalize(attribute.name)) && attribute.value.trim()) return attribute.value.trim();
    }
  }
  return undefined;
}

function resolveRecord(element: Element, sourceFile: string, index: number): EnergyRecord | null {
  const ucId = valueFrom(element, FIELD_KEYS.ucId)?.replace(/\s+/g, "");
  if (!ucId || ucId.length < 3) return null;

  const rawValues = Object.fromEntries(
    Object.entries(FIELD_KEYS).map(([field, keys]) => [field, valueFrom(element, keys) ?? ""]),
  );

  const period = rawValues.period || "Competência não informada";
  const record: EnergyRecord = {
    id: `${sourceFile}-${ucId}-${period}-${index}`,
    sourceFile,
    ucId,
    period,
    consumptionKwh: toNumber(rawValues.consumptionKwh),
    ownGenerationKwh: toNumber(rawValues.ownGenerationKwh),
    injectedKwh: toNumber(rawValues.injectedKwh),
    compensationNuvKwh: toNumber(rawValues.compensationNuvKwh),
    balanceBeforeKwh: 0,
    rawValues,
  };
  const reported = rawValues.reportedBalanceKwh;
  if (reported) record.reportedBalanceKwh = toNumber(reported);
  return record;
}

type RealXmlPost = {
  consumptionKwh: number;
  ownGenerationKwh: number;
  injectedKwh: number;
  compensationNuvKwh: number;
  balanceBeforeKwh: number;
  reportedBalanceKwh: number;
};

type RealXmlAggregate = {
  installation: string;
  numberUc: string;
  period: string;
  modality: string;
  posts: Map<string, RealXmlPost>;
};

function tagValue(line: Element, tagName: string, occurrence = 0) {
  return line.getElementsByTagName(tagName).item(occurrence)?.textContent?.trim() ?? "";
}

function parseDistribuidoraReport(doc: Document, sourceFile: string): ImportResult | null {
  const lines = Array.from(doc.getElementsByTagName("Linha"));
  if (!lines.length) return null;

  const byInstallationPeriod = new Map<string, RealXmlAggregate>();
  for (const line of lines) {
    const installation = tagValue(line, "Instalacao");
    const numberUc = tagValue(line, "Numero_uc");
    const period = tagValue(line, "Periodo_uso") || tagValue(line, "Periodo");
    const modality = tagValue(line, "Modalidade");
    if (!installation || !period || modality.includes("Geradora")) continue;

    const key = `${installation}::${period}`;
    const aggregate = byInstallationPeriod.get(key) ?? { installation, numberUc, period, modality, posts: new Map() };
    const post = (tagValue(line, "Posto_horario") || "SEM_POSTO").toUpperCase();
    const current = aggregate.posts.get(post) ?? { consumptionKwh: 0, ownGenerationKwh: 0, injectedKwh: 0, compensationNuvKwh: 0, balanceBeforeKwh: 0, reportedBalanceKwh: 0 };
    current.consumptionKwh = Math.max(current.consumptionKwh, toNumber(tagValue(line, "Qtd_consumo")));
    current.ownGenerationKwh = Math.max(current.ownGenerationKwh, toNumber(tagValue(line, "Qtd_geracao")));
    current.injectedKwh = Math.max(current.injectedKwh, toNumber(tagValue(line, "Qtd_recebimento")));
    current.compensationNuvKwh = Math.max(current.compensationNuvKwh, toNumber(tagValue(line, "Qtd_compensacao", 0)));
    current.balanceBeforeKwh = Math.max(current.balanceBeforeKwh, toNumber(tagValue(line, "Qtd_saldo_ant")));
    current.reportedBalanceKwh = Math.max(current.reportedBalanceKwh, toNumber(tagValue(line, "Qtd_saldo_atual")));
    aggregate.posts.set(post, current);
    byInstallationPeriod.set(key, aggregate);
  }

  const records = Array.from(byInstallationPeriod.values()).map((aggregate, index) => {
    const totals = Array.from(aggregate.posts.values()).reduce<RealXmlPost>((total, post) => ({
      consumptionKwh: total.consumptionKwh + post.consumptionKwh,
      ownGenerationKwh: total.ownGenerationKwh + post.ownGenerationKwh,
      injectedKwh: total.injectedKwh + post.injectedKwh,
      compensationNuvKwh: total.compensationNuvKwh + post.compensationNuvKwh,
      balanceBeforeKwh: total.balanceBeforeKwh + post.balanceBeforeKwh,
      reportedBalanceKwh: total.reportedBalanceKwh + post.reportedBalanceKwh,
    }), { consumptionKwh: 0, ownGenerationKwh: 0, injectedKwh: 0, compensationNuvKwh: 0, balanceBeforeKwh: 0, reportedBalanceKwh: 0 });
    return {
      id: `${sourceFile}-${aggregate.installation}-${aggregate.period}-${index}`,
      sourceFile,
      ucId: aggregate.installation,
      period: aggregate.period,
      ...totals,
      rawValues: { numberUc: aggregate.numberUc, modality: aggregate.modality, installation: aggregate.installation },
    } satisfies EnergyRecord;
  });
  return { records, fileNames: [sourceFile], warnings: records.length ? [] : [`${sourceFile}: o XML foi lido, mas não há UCs recebedoras para consulta.`] };
}

export function parseXmlText(xmlText: string, sourceFile: string): ImportResult {
  const doc = new DOMParser().parseFromString(xmlText, "application/xml");
  if (doc.querySelector("parsererror")) {
    throw new Error(`O arquivo ${sourceFile} não contém um XML válido.`);
  }

  const distribuidoraResult = parseDistribuidoraReport(doc, sourceFile);
  if (distribuidoraResult) return distribuidoraResult;

  const allElements = Array.from(doc.querySelectorAll("*"));
  const candidates = allElements.filter((element) => {
    const tag = normalize(element.tagName);
    return CANDIDATE_TAGS.some((candidate) => tag.includes(candidate));
  });

  const resolved = candidates
    .map((element, index) => resolveRecord(element, sourceFile, index))
    .filter((record): record is EnergyRecord => Boolean(record));

  const deduplicated = Array.from(new Map(resolved.map((record) => [
    `${record.ucId}-${record.period}-${record.consumptionKwh}-${record.injectedKwh}-${record.compensationNuvKwh}`,
    record,
  ])).values());

  const warnings = deduplicated.length
    ? []
    : [`${sourceFile}: nenhum registro de UC foi identificado. Confira as tags de instalação, competência e energia do XML.`];

  return { records: deduplicated, fileNames: [sourceFile], warnings };
}

export async function parseXmlFiles(files: File[]): Promise<ImportResult> {
  const results = await Promise.all(files.map(async (file) => parseXmlText(await file.text(), file.name)));
  return {
    records: results.flatMap((result) => result.records),
    fileNames: results.flatMap((result) => result.fileNames),
    warnings: results.flatMap((result) => result.warnings),
  };
}
