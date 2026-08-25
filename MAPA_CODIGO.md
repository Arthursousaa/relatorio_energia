# Mapa do código-fonte — Relatório GD por UC

Este projeto separa os pontos de manutenção do portal em arquivos específicos. A equipe não precisa editar os arquivos compilados dentro de `assets/`.

| Necessidade | Arquivo para editar | Resultado |
|---|---|---|
| Alterar a aparência do portal | `client/src/index.css` | Cores, menu lateral, cabeçalho, cartões, fontes e responsividade. |
| Alterar a estrutura ou os textos da tela | `client/src/pages/Home.tsx` | Cabeçalho, fluxo de importação, estado do arquivo e composição da página. |
| Alterar o cartão de importação | `client/src/components/ImportPanel.tsx` | Botão, texto e mensagens de importação de XML. |
| Alterar a busca e a lista de UCs | `client/src/components/UcExplorer.tsx` | Pesquisa, seleção e apresentação de unidades consumidoras. |
| Alterar o demonstrativo ou as exportações | `client/src/components/ReportPreview.tsx` | Competências, impressão/PDF, Word e saldo apresentado. |
| Ajustar campos/tags de XML | `client/src/lib/xml.ts` | Nomes de tags reconhecidos da distribuidora. |
| Alterar cálculo ou arredondamento | `client/src/lib/energy.ts` | Saldo pendente, consolidação por UC e formatação de kWh. |
| Ajustar os dados disponíveis | `client/src/types/energy.ts` | Estrutura de registros de energia. |
| Validar cálculos antes de publicar | `client/src/lib/energy.test.ts` | Testes automatizados. |

## Fluxo de dados

```text
XML → client/src/lib/xml.ts → registros tipados → client/src/lib/energy.ts → Home.tsx → componentes visuais
```

O saldo pendente é calculado em `client/src/lib/energy.ts` como `energia injetada − compensação NUV`.

## Comandos da equipe

```bash
pnpm install
pnpm dev
```

Antes de colocar em produção:

```bash
pnpm test
pnpm check
pnpm build
```
