# 1. Papel e objetivo

Atue como artista técnico corretivo do Crypt Royale. Gere uma **nova prancha V002** do MC-0007 Code Slime corrigindo somente as falhas visuais comprovadas da V001, mantendo três variações horizontais para escolha humana.

# 2. Entradas canônicas

- Referência legada obrigatória: `E:\Projetos\MonsterCrypt\Crypt-Royale\public\assets\units\code-slime.png`
- Identidade canônica: `E:\Projetos\MonsterCrypt\Crypt-Royale\docs\Prompts_Visuais_16_Cartas_v1.0.md`, seção `03 — MC-0007 Code Slime`.
- V001 a ser corrigida, sem sobrescrever: `E:\Projetos\MonsterCrypt\Crypt-Royale\art-source\exploration\cr_mc-0007_code-slime_exploration_v001.png`.

Evidência observada pelo revisor humano/Codex na V001:

- o fundo não é uniforme: há gradiente e sombras projetadas no chão;
- as opções central e direita possuem balões ligados por hastes contendo `...`, o que parece texto/UI;
- a opção esquerda não apresenta claramente um núcleo **grafite** suspenso;
- as três bolhas de dados não seguem uma identidade visual consistente;
- o rosto central perdeu parte da simpatia simples da referência legada.

# 3. Alterações permitidas

Crie somente:

- `E:\Projetos\MonsterCrypt\Crypt-Royale\art-source\exploration\cr_mc-0007_code-slime_exploration_v002.png`
- `E:\Projetos\MonsterCrypt\Crypt-Royale\art-source\exploration\cr_mc-0007_code-slime_exploration_v002.json`
- Previews com prefixo `cr_mc-0007_code-slime_exploration_v002_qa_` na mesma pasta.

Mantenha a ordem: esquerda mais gelatinosa, centro equilibrada/recomendada, direita mais tecnológica ainda reconhecível como slime.

# 4. Ações proibidas

- Não sobrescrever nem alterar a V001.
- Não alterar `src`, `public`, docs, masters ou qualquer outro asset.
- Não promover para `approved-masters`.
- Não criar turnaround, sprite sheet ou card art.
- Não desenhar texto, letras, números, reticências, balões de fala, UI, hastes de interface, logotipo ou watermark.
- Não desenhar chão, pedestal, sombra projetada, gradiente ou vinheta no fundo.
- Não usar xadrez falso de transparência.
- Não criar olhos, braços, membros ou personagens extras.

# 5. Critérios de aceitação

- Três criaturas completas em uma linha, mesma escala e baseline visual, sem cortes.
- Fundo **100% plano e uniforme** em RGB, preferencialmente `#20242A`, sem sombra no chão; alfa verdadeiro também é aceito se realmente existir.
- Em cada variação: exatamente dois olhos luminosos, exatamente dois braços/pseudópodes, base com dois lóbulos, um núcleo grafite suspenso e exatamente três bolhas de dados abstratas.
- As três bolhas devem ser formas luminosas simples, sem pontos parecidos com reticências, sem contorno de balão e sem linha/hastes. Podem flutuar próximas ao corpo.
- Gel verde-ciano translúcido, fragmentos quadrados internos esparsos sem código legível.
- Centro: rosto amigável simples inspirado na referência legada, equilíbrio gel/tecnologia e recomendação de produção.
- Direita: tecnologia integrada dentro do gel; não transformar em humano, robô sólido ou operador.
- Legibilidade clara em preview de aproximadamente 96 px de altura.
- PNG horizontal em alta resolução; não fazer upscale destrutivo apenas para declarar 2048 px.
- JSON deve registrar dimensões, modo, SHA-256, tipo/cor do fundo medidos do disco e descrição das opções.

# 6. Evidências obrigatórias

- Lista exata dos arquivos criados.
- Dimensões, modo, SHA-256 e fundo medidos.
- Crops individuais e preview mobile.
- Confirmação explícita de ausência de texto/UI, sombras projetadas e gradiente.
- Confirmação de que apenas arquivos V002 permitidos foram criados.
- Solicitar escolha humana entre esquerda, centro e direita; não aprovar automaticamente.
