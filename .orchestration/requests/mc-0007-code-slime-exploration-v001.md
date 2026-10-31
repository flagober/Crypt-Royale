# 1. Papel e objetivo

Atue como artista técnico de pré-produção do Crypt Royale. Produza **uma única prancha de exploração V001 do MC-0007 Code Slime**, com três variações visuais claramente separadas e consistentes entre si. O resultado é somente uma etapa de exploração para escolha humana; não aprove nem promova nenhum master.

# 2. Entradas canônicas

- Referência visual legada obrigatória: `E:\Projetos\MonsterCrypt\Crypt-Royale\public\assets\units\code-slime.png`
- Prompt canônico e identidade: `E:\Projetos\MonsterCrypt\Crypt-Royale\docs\Prompts_Visuais_16_Cartas_v1.0.md`, seção `03 — MC-0007 Code Slime`.
- Catálogo tático: `E:\Projetos\MonsterCrypt\Crypt-Royale\docs\Deck_Canonico_Vila_Byte.md`.
- Use Bit Bug e Data Mouse aprovados apenas como referência de acabamento e legibilidade mobile, nunca como anatomia: `E:\Projetos\MonsterCrypt\Crypt-Royale\art-source\approved-masters\`.

Identidade obrigatória: Code Slime, MC-0007, elemento Terra, natureza Agile, raridade comum; corpo baixo de gel computacional verde-ciano translúcido; núcleo grafite suspenso; exatamente dois olhos luminosos; exatamente dois pequenos braços/pseudópodes; base larga dividida visualmente em dois lóbulos; exatamente três bolhas de dados brilhantes; fragmentos quadrados internos esparsos, sem formar letras, números ou texto legível. A pose deve sugerir elasticidade, velocidade e futura duplicação, mostrando apenas um personagem completo em cada variação.

# 3. Alterações permitidas

Crie somente estes arquivos versionados:

- `E:\Projetos\MonsterCrypt\Crypt-Royale\art-source\exploration\cr_mc-0007_code-slime_exploration_v001.png`
- `E:\Projetos\MonsterCrypt\Crypt-Royale\art-source\exploration\cr_mc-0007_code-slime_exploration_v001.json`
- Previews de QA com prefixo `cr_mc-0007_code-slime_exploration_v001_qa_` dentro de `art-source\exploration\`.

A prancha deve ter três variações horizontais:

1. esquerda: mais gelatinosa/biológica;
2. centro: equilíbrio recomendado entre gel e tecnologia;
3. direita: mais tecnológica, ainda claramente um slime.

# 4. Ações proibidas

- Não alterar código em `src`, `public`, testes, documentos canônicos ou assets existentes.
- Não deletar, renomear ou sobrescrever histórico.
- Não criar turnaround, sprite sheet, card art ou integração no jogo nesta tarefa.
- Não copiar diretamente personagem, silhueta ou símbolos de franquias existentes.
- Não promover nada para `approved-masters`.
- Não usar xadrez de transparência renderizado, texto, rótulos, UI, moldura, logotipo ou watermark dentro da arte.
- Não inventar membros extras, olhos extras, bolhas extras ou código legível.

# 5. Critérios de aceitação

- PNG em alta resolução, preferencialmente 2048×1024 ou maior, com as três criaturas inteiras e sem cortes.
- Três variações em uma única linha, escala e baseline consistentes, separação clara.
- Fundo simples e uniforme que não confunda a silhueta. Transparência real é aceita; caso o gerador não consiga alfa verdadeiro, use fundo sólido neutro e declare isso no JSON. Nunca simule transparência com xadrez.
- A variação central deve ser a recomendação de produção e preservar mais diretamente o rosto amigável e a forma de sino da referência legada.
- Silhuetas legíveis quando reduzidas para aproximadamente 96 px de altura.
- JSON com dimensões, modo, SHA-256, bounding box global, tipo de fundo, descrição objetiva das três opções, contagem visual dos marcadores anatômicos e riscos ainda pendentes.
- Gere QA em fundo escuro/claro quando houver alfa; se não houver alfa, gere ao menos um preview reduzido mobile e três crops individuais.

# 6. Evidências obrigatórias

Na resposta final, informe:

- lista exata dos arquivos criados;
- comando/ferramenta usada para geração e processamento;
- dimensões, modo, SHA-256 e tipo de fundo medidos do arquivo salvo em disco;
- confirmação de que nenhum arquivo fora da lista permitida foi alterado;
- limitações ou riscos visuais ainda não resolvidos;
- solicitação explícita de escolha humana entre esquerda, centro e direita, sem promover automaticamente nenhuma opção.
