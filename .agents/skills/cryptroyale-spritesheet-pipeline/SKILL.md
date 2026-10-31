---
name: cryptroyale-spritesheet-pipeline
description: Pipeline oficial de criação, separação de vistas (turnaround), cinemática de passos e montagem de Sprite Sheets 3x4 (140x140) para o Crypt Royale, com preservação estrita de empunhadura e anatomia (espada na mão direita, escudo na esquerda, sem espelhamento global).
---

# Pipeline de Sprite Sheets 3x4 — Crypt Royale

Este guia define o padrão técnico, anatômico e ferramental para produção e integração dos Sprite Sheets canônicos do Crypt Royale.

---

## 1. Especificações Técnicas da Engine

- **Dimensões da Folha Completa**: `420 x 560 px` (RGBA, canal alpha transparente real, sem artefatos ou xadrez falso).
- **Grade (Grid)**: `3 colunas x 4 linhas`.
- **Dimensão da Célula Unitária**: `140 x 140 px`.
- **Ponto de Apoio (Pivot Ground Contact)**: `[70, 128]` (X centralizado em 70, Y do chão/sola das botas em 128).
- **Mapeamento de Linhas (Row Order)**:
  - `Linha 0 (Down)`: Frente (Olhando para a câmera).
  - `Linha 1 (Right)`: Perfil Direito (Olhando para a direita da tela).
  - `Linha 2 (Left)`: Perfil Esquerdo (Olhando para a esquerda da tela).
  - `Linha 3 (Up)`: Costas (Olhando para o norte/fundo da tela).
- **Mapeamento de Colunas (Frame Order)**:
  - `Coluna 0 (contact-a)`: Passo A (ex: perna esquerda anatômica avançada à frente, perna direita atrás).
  - `Coluna 1 (passing)`: Pose Neutra / Meio de Passo (pés juntos alinhados com o chão, base de repouso).
  - `Coluna 2 (contact-b)`: Passo B (ex: perna direita anatômica avançada à frente, perna esquerda atrás).
- **Padrão de Reprodução no Motor**: `[0, 1, 2, 1]` (Loop de 4 tempos: Passo A -> Neutro -> Passo B -> Neutro). Frame duration padrão: `110 ms`.

---

## 2. Regras de Ouro: Anatomia, Empunhadura e Cinemática (Sem Flip Global)

### 2.1 A Proibição do Espelhamento Total
> **REGRA CRÍTICA**: NUNCA aplicar flip horizontal (`mirror` / `flipX`) no personagem inteiro.
- A espada deve permanecer SEMPRE na **mão direita anatômica** do personagem.
- O escudo deve permanecer SEMPRE no **braço esquerdo anatômico** do personagem.
- Detalhes assimétricos (mecha branca no cabelo, fivelas do cinto, cicatrizes ou ombreiras) devem preservar seus lados corretos.

### 2.2 Visões Laterais (Perfil Direito vs Perfil Esquerdo)
- **Perfil Direito (Row 1)**: O lado direito do guerreiro está virado para a câmera.
  - A **espada** fica em **primeiro plano (foreground)**, claramente visível na frente do torso.
  - O **escudo** fica em **segundo plano (background)**, atrás do torso.
- **Perfil Esquerdo (Row 2)**: O lado esquerdo do guerreiro está virado para a câmera.
  - O **escudo** fica em **primeiro plano (foreground)**, cobrindo parte do peito/braço.
  - A **espada** fica em **segundo plano (background)**, com lâmina projetada para trás ou atrás do corpo.

### 2.3 Cinemática das Pernas na Caminhada
- Em **Down (Frente)** e **Up (Costas)**:
  - O tronco, cabeça e armas NÃO trocam de lado entre Coluna 0 e Coluna 2.
  - Apenas as pernas alternam (uma dá o passo à frente enquanto a outra vai para trás).
  - O tronco tem um sutil afundamento/elevação (bobbing de 1 a 2 pixels) para dar sensação de peso ao passo.
- Em **Right (Direita)** e **Left (Esquerda)**:
  - A passada alterna a perna anterior e a perna posterior.
  - O tronco e os braços mantêm a empunhadura correta sem inverter profundidade.

---

## 3. Divisão de Trabalho: IA + Editores + Antigravity

### Por que não pedir a grade 3x4 inteira em um único prompt de IA?
Modelos generativos (Gemini Nano Banana, GPT Image, Midjourney) não possuem rig esquelético rígido. Ao tentar gerar 12 bonecos num quadro só, eles invariavelmente:
1. Distorcem a grade (geram 4x4, desalinham pés ou cortam armas).
2. Pintam um padrão xadrez cinza e branco falso em vez de transparência PNG real.
3. Invertem a mão da espada e do escudo entre colunas.
4. Alteram o rosto, detalhes da armadura e proporções a cada quadro.

### Fluxo Integrado Recomendado

1. **Geração com Gemini 3.1 Pro / GPT Plus / Nano Banana**:
   - Usar a **Imagem-Mestra Aprovada** como referência de estilo e proporção.
   - Gerar **Poses Isoladas (Turnaround)** com fundo neutro sólido (verde croma puro `#00FF00` ou preto puro `#000000`, NUNCA xadrez):
     - *Pose 1*: Frente neutra (`down_passing`) — Já temos aprovada!
     - *Pose 2*: Costas neutra (`up_passing`)
     - *Pose 3*: Perfil direito neutro (`right_passing` - espada na frente)
     - *Pose 4*: Perfil esquerdo neutro (`left_passing` - escudo na frente)
2. **Editores de Imagem Recomendados**:
   - **Aseprite**: O melhor software para animação de sprites, controle de paleta, grade 140x140 com onion skinning e exportação limpa.
   - **Photoshop / Krita**: Excelente para separar camadas (Camada Torso/Cabeça fixa, Camada Braços/Armas, Camada Pernas/Passada).
3. **Automação Antigravity (Scripts de Montagem)**:
   - Scripts Node.js / Python automatizados para:
     - Remover fundo sólido e gerar alfa transparente puro.
     - Detectar contorno e centralizar o personagem no pivot `[70, 128]`.
     - Montar a folha 420x560 com encaixe milimétrico em cada célula.
     - Gerar o arquivo `.json` com metadados do Crypt Royale.

---

## 4. Ordem Oficial de Produção (Roadmap por Etapas)

1. **Etapa 1: Classes Base e Tier II (Sempre 1 Masculino e 1 Feminino)**:
   - Guerreiro (M) Tier 1 & Guerreira (F) Tier 1.
   - Guerreiro (M) Tier 2 & Guerreira (F) Tier 2.
   - Demais classes (Mago/Maga, Arqueiro/Arqueira, etc.).
2. **Etapa 2: Os Nexus**:
   - Bases, geradores de dados e estruturas de spawn.
3. **Etapa 3: Os Bosses**:
   - Os 10 Bosses principais do ecossistema.
4. **Etapa 4: Restante dos Monstros na CryptDex**:
   - Expansão de catálogo com aprovação por lotes verificados.
