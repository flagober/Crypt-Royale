# 1. Papel e objetivo

Faça uma correção raster determinística na V002 do MC-0007 Code Slime para produzir a **V003**, removendo apenas bolhas externas excedentes e dois pixels isolados. Não regenere nem redesenhe os personagens.

# 2. Entrada canônica

- Fonte única: `E:\Projetos\MonsterCrypt\Crypt-Royale\art-source\exploration\cr_mc-0007_code-slime_exploration_v002.png`
- A fonte mede 1376×768 RGB e usa fundo plano exato `#20242A`.

Auditoria independente por componentes 8-conectados contra o fundo `#20242A`:

- esquerda: corpo + 4 bolhas; remover apenas a bolha inferior em bbox global `(96,546)–(137,578)`;
- centro: corpo + 5 bolhas; remover apenas as duas bolhas inferiores em bboxes globais `(515,552)–(555,583)` e `(818,552)–(856,583)`;
- direita: corpo + exatamente 3 bolhas; não alterar;
- limpar também os pixels isolados de 1 px em `(312,56)` e `(1375,767)`.

Após a correção, cada painel deve conter exatamente um componente principal do personagem e exatamente três componentes externos de bolhas.

# 3. Alterações permitidas

Crie somente:

- `E:\Projetos\MonsterCrypt\Crypt-Royale\art-source\exploration\cr_mc-0007_code-slime_exploration_v003.png`
- `E:\Projetos\MonsterCrypt\Crypt-Royale\art-source\exploration\cr_mc-0007_code-slime_exploration_v003.json`
- Previews com prefixo `cr_mc-0007_code-slime_exploration_v003_qa_` na mesma pasta.

# 4. Ações proibidas

- Não alterar V001 ou V002.
- Não usar nova geração de imagem, IA generativa, filtros, reamostragem, blur ou recompressão com perdas.
- Não alterar nenhum pixel fora das três bboxes de bolhas e dos dois pixels isolados listados.
- Não alterar personagens, paleta, fundo restante, escala ou composição.
- Não promover para `approved-masters` e não tocar qualquer outro diretório.

# 5. Critérios de aceitação

- Copiar V002 pixel a pixel e preencher somente os alvos autorizados com RGB exato `(32,36,42)`.
- PNG V003: 1376×768, RGB, sem alfa, fundo `#20242A`.
- Por painel: exatamente 4 componentes visíveis maiores que 1 px — 1 personagem + 3 bolhas.
- Nenhum componente de 1 px em toda a imagem.
- Diff V002→V003 limitado às três bboxes e aos dois pixels autorizados.
- Gerar crops esquerda/centro/direita e preview mobile sem modificar a fonte V003.
- JSON com SHA-256, dimensões, modo, contagem de componentes por painel, bboxes removidas e total de pixels alterados.

# 6. Evidências obrigatórias

- Arquivos criados e comandos executados.
- Hash, dimensões e modo medidos do disco.
- Contagem final de componentes por painel.
- Total de pixels diferentes e confirmação de zero diferenças fora das regiões autorizadas.
- Solicitar escolha humana entre esquerda, centro e direita; não aprovar automaticamente.
