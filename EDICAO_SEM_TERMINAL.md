# Como alterar o portal sem usar terminal

O portal é publicado automaticamente toda vez que uma alteração é confirmada na branch `master` do GitHub.

## Para alterar pelo navegador

1. Abra o repositório no GitHub.
2. Navegue até o arquivo que deseja alterar.
3. Clique no ícone de lápis **Edit this file**.
4. Faça a alteração e clique em **Commit changes**.
5. Aguarde a execução chamada **Compilar e publicar o Relatório GD** terminar com sucesso.
6. Abra o endereço do portal para conferir a nova versão.

## Arquivos que a equipe deve alterar

| Alteração desejada | Arquivo |
|---|---|
| Textos ou fluxo da tela | `client/src/pages/Home.tsx` |
| Cores, tamanhos e layout | `client/src/index.css` |
| Cartão de importação de XML | `client/src/components/ImportPanel.tsx` |
| Lista e busca de UCs | `client/src/components/UcExplorer.tsx` |
| Demonstrativo e impressão | `client/src/components/ReportPreview.tsx` |
| Leitura de tags do XML | `client/src/lib/xml.ts` |
| Cálculo de saldo | `client/src/lib/energy.ts` |

## Segurança antes de publicar

O GitHub executa automaticamente os testes e a checagem do código. Se alguma validação falhar, a versão publicada anterior permanece disponível. Corrija o arquivo indicado pela execução e confirme uma nova alteração.
