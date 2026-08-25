# Relatório GD por UC — código-fonte funcional

Este é um projeto independente, com código-fonte organizado, para reproduzir o portal publicado em `https://arthursousaa.github.io/relatorio_energia/`.

A interface inicial mantém a mesma paleta escura, barra lateral, cabeçalho, cartões de importação/análise e os textos do portal. A aplicação processa XMLs no navegador, consolida registros por unidade consumidora (UC) e competência, permite consultar a UC e cria demonstrativos para impressão/PDF ou Word.

## Requisitos

Instale Node.js 22 ou superior e pnpm 10 ou superior no servidor ou computador de execução.

## Instalação e execução

No diretório deste projeto, execute:

```bash
pnpm install
pnpm dev
```

O comando apresentará um endereço local para abrir no navegador. Para gerar a versão otimizada de produção, execute:

```bash
pnpm check
pnpm test
pnpm build
pnpm start
```

A versão compilada estará em `dist/public`.

## Estrutura de código

| Diretório ou arquivo | Finalidade |
|---|---|
| `client/src/components` | Cartões e controles da interface publicada. |
| `client/src/pages/Home.tsx` | Fluxo de importação, seleção e consulta de UCs. |
| `client/src/lib/xml.ts` | Leitura de XML e normalização de campos. |
| `client/src/lib/energy.ts` | Consolidação e cálculo de saldo pendente. |
| `client/src/types/energy.ts` | Tipos do domínio de energia. |
| `client/src/lib/energy.test.ts` | Testes automatizados de leitura e cálculos. |
| `client/src/index.css` | Estilos que reproduzem a referência visual. |

## Regra de saldo

O saldo pendente é calculado como:

```text
energia injetada − compensação NUV
```

## Atenção aos XMLs reais

O leitor aceita nomes de tags comuns para instalação/UC, competência, consumo, geração própria, injeção e compensação NUV. Antes de uso em produção, testem com XMLs reais da distribuidora. Se a distribuidora utilizar outros nomes de tags, acrescentem os sinônimos em `client/src/lib/xml.ts`, na constante `FIELD_KEYS`.
