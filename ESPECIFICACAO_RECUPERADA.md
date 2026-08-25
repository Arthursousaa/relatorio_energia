# Especificação funcional recuperada

## Origem analisada

Esta reconstrução preserva as capacidades identificadas na versão histórica do aplicativo **Relatório GD por UC**. O histórico disponível preserva o conteúdo funcional em um arquivo HTML único, mas não a estrutura original em componentes.

## Fluxo operacional que será reconstruído

| Etapa | Capacidade | Resultado esperado |
|---|---|---|
| 1. Importar XML | Aceitar um ou mais arquivos XML de demonstrativos GD e ler o conteúdo no navegador. | Arquivos consolidados e indicação de importação concluída. |
| 2. Consolidar dados | Identificar UCs recebedoras, ciclos de referência e registros de crédito/saldo. | Lista de UCs disponíveis e resumo de linhas processadas. |
| 3. Consultar UC | Localizar uma unidade consumidora por número ou selecioná-la na lista. | Detalhe da UC com competências disponíveis. |
| 4. Conferir saldos | Calcular e apresentar o saldo NUV e os dados relevantes por competência. | Valores legíveis, com estado de consistência e possibilidade de ajuste manual quando necessário. |
| 5. Emitir demonstrativo | Abrir uma versão própria para impressão do demonstrativo selecionado. | Documento pronto para usar a caixa de impressão do navegador e salvar em PDF. |

## Regras e mensagens identificadas

| Situação | Comportamento esperado |
|---|---|
| Arquivo sem UCs recebedoras | Informar que o arquivo foi lido, mas não há UCs disponíveis para consulta. |
| UC não encontrada | Exibir opções sugeridas e orientar a revisar o número informado. |
| Competência repetida | Alertar que a competência já existe para a UC e solicitar revisão do XML GD. |
| Importação múltipla | Consolidar arquivos e indicar a quantidade de arquivos processados. |
| Valores | Exibir `Saldo NUV (kWh)` com arredondamento visual. |

## Premissas da versão reconstruída

1. O processamento será integralmente local no navegador, sem envio dos XMLs a servidores.
2. A primeira entrega suportará XMLs estruturados com tags e atributos usuais para identificação de UC, período e valores de energia. As variações específicas de layout devem ser validadas com arquivos reais do sistema de vocês.
3. O PDF será obtido por meio da impressão do navegador, mecanismo mais confiável para uma aplicação estática e fácil de adaptar.
4. A estrutura-fonte será separada em tipos, serviços de leitura XML, funções de cálculo, componentes e testes unitários.
