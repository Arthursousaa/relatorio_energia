/** @vitest-environment jsdom */
/** Caderno Técnico Solar: testes básicos para impedir regressões na leitura e no saldo de energia. */
import { describe, expect, it } from "vitest";
import { pendingBalance, summarizeUcs } from "@/lib/energy";
import { exampleXml } from "@/lib/sampleXml";
import { parseXmlText } from "@/lib/xml";

describe("processamento de demonstrativo GD", () => {
  it("lê UCs e competências a partir do XML", () => {
    const result = parseXmlText(exampleXml, "exemplo.xml");
    expect(result.records).toHaveLength(3);
    expect(result.records[0]).toMatchObject({ ucId: "10293847", period: "04/2026", injectedKwh: 340 });
  });

  it("calcula o saldo pendente como injetado menos compensação NUV", () => {
    const record = parseXmlText(exampleXml, "exemplo.xml").records[0];
    expect(pendingBalance(record)).toBe(50);
  });

  it("consolida corretamente os registros por UC", () => {
    const records = parseXmlText(exampleXml, "exemplo.xml").records;
    const summaries = summarizeUcs(records);
    expect(summaries).toHaveLength(2);
    expect(summaries.find((item) => item.ucId === "10293847")?.totalBalanceKwh).toBe(80);
  });
});
