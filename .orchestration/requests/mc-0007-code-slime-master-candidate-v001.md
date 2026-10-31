# 1. Papel e objetivo

Atue como artista técnico de produção do Crypt Royale. Usando a opção **central aprovada pelo usuário** da exploração V003, crie uma única candidata V001 à Imagem‑Mestra do MC-0007 Code Slime, isolada em PNG RGBA verdadeiro. Não promova a candidata.

# 2. Entradas canônicas

- Identidade visual escolhida: `E:\Projetos\MonsterCrypt\Crypt-Royale\art-source\exploration\cr_mc-0007_code-slime_exploration_v003_qa_center.png`
- Prancha completa para linhagem: `E:\Projetos\MonsterCrypt\Crypt-Royale\art-source\exploration\cr_mc-0007_code-slime_exploration_v003.png`
- Referência legada: `E:\Projetos\MonsterCrypt\Crypt-Royale\public\assets\units\code-slime.png`
- Prompt canônico: `E:\Projetos\MonsterCrypt\Crypt-Royale\docs\Prompts_Visuais_16_Cartas_v1.0.md`, seção `03 — MC-0007 Code Slime`.

A opção central é a autoridade de design: slime verde-ciano simpático, dois olhos luminosos, sorriso simples, núcleo grafite redondo suspenso, dois pequenos braços/pseudópodes, base larga de dois lóbulos, circuitos discretos dentro do gel e exatamente três bolhas abstratas de dados.

# 3. Alterações permitidas

Crie somente:

- `E:\Projetos\MonsterCrypt\Crypt-Royale\art-source\exploration\cr_mc-0007_code-slime_master-candidate_v001.png`
- `E:\Projetos\MonsterCrypt\Crypt-Royale\art-source\exploration\cr_mc-0007_code-slime_master-candidate_v001.json`
- Previews com prefixo `cr_mc-0007_code-slime_master-candidate_v001_qa_` na mesma pasta.

Se precisar de processamento temporário, use apenas memória ou `.orchestration\temp\mc-0007-master-v001\` e remova os temporários antes de encerrar. Não deixe scripts na raiz.

# 4. Ações proibidas

- Não alterar V001/V002/V003 de exploração, referências, docs, código ou `public`.
- Não criar turnaround, sprite sheet, card art ou integração.
- Não promover para `approved-masters`.
- Não criar variações: o resultado deve ser exatamente um personagem.
- Não alterar a identidade central para robô sólido, humanoide, fantasma ou gel genérico.
- Não usar texto, letras, números, reticências, código legível, UI, moldura, logo, watermark, chão, sombra projetada, cenário ou pedestal.
- Não usar xadrez falso de transparência nem fundo opaco no arquivo final.
- Não inventar olhos, braços, pernas, armas, acessórios ou bolhas extras.

# 5. Critérios de aceitação

- Um único Code Slime completo, centralizado, vista frontal levemente 3/4, pose neutra pronta para combate e futura animação.
- Exatamente dois olhos; exatamente dois braços/pseudópodes; base com dois lóbulos; um núcleo grafite suspenso; exatamente três bolhas luminosas abstratas separadas, sem hastes.
- Rosto amigável e silhueta de sino preservados da opção central.
- Gel verde-ciano com aparência translúcida produzida por luz e sombreamento internos; não tornar o corpo fisicamente semitransparente a ponto de contaminar o fundo.
- Estética pixel art cyber-fantasy premium consistente com Bit Bug/Data Mouse, contornos nítidos e legibilidade a 96 px.
- Arquivo final exato: 2048×2048, PNG RGBA, fundo alfa 0 real; corpo principal predominantemente alfa 255; apenas bordas antialias podem usar alfa intermediário.
- Personagem inteiro dentro do canvas, margem uniforme, sem corte. Bounding box recomendada entre 55% e 75% da largura/altura do canvas.
- Se o gerador não produzir alfa real, gere sobre magenta puro `#FF00FF`, sem sombra e sem glow externo, remova o fundo deterministicamente e faça despill sem alterar o verde-ciano do personagem. Nunca entregue magenta visível ou oculto.
- QA obrigatório: composições sobre branco, cinza-escuro e magenta, crop 4× da borda, previews a 128 px e 96 px.
- JSON: fontes/linhagem, dimensões, modo, SHA-256, bbox, contagens alfa 0/255/intermediário, pixels magenta visíveis e ocultos, descrição anatômica e riscos.

# 6. Evidências obrigatórias

- Lista exata dos arquivos criados e ferramentas usadas.
- Métricas medidas do disco, não estimadas.
- Confirmação de ausência de temporários fora do local permitido.
- Confirmação de que nenhum arquivo fora dos destinos permitidos foi alterado.
- Apresente a candidata e aguarde aprovação humana; não a copie para `approved-masters`.
