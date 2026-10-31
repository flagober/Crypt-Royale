# Crypt Royale — Prompts Visuais das 16 Cartas Iniciais

**Versão:** 1.0  
**Data:** 26/09/2026  
**Uso:** Gemini/Nano Banana e GPT Image 2.5  
**Fonte canônica:** catálogo MonsterCrypt V10 + `Crypt_Royale_Catalogo_16_Cartas_v1.0.gdd`

---

## 1. Estratégia recomendada

Não tente gerar a arte final, a carta, o sprite e todas as vistas no mesmo pedido. Trabalhe em quatro etapas:

1. **Exploração:** três variações rápidas da criatura, sem cenário.
2. **Imagem-mestra:** escolha uma variação e fixe anatomia, materiais, cores e marcas de identidade.
3. **Produção:** gere separadamente arte de carta, vistas ortográficas e sprite sheet usando a imagem-mestra como referência.
4. **Controle de qualidade:** confira silhueta, transparência, número de membros, consistência de cores, leitura em miniatura e ausência de texto/marca d’água.

Para as oito cartas que já possuem PNG no projeto, anexe o arquivo existente como referência. A nova imagem deve **refinar a identidade**, não substituir a criatura por outra.

### Qual modelo usar em cada etapa

- **Gemini / Nano Banana 2:** exploração rápida, variações, composição e iteração diária.
- **Gemini / Nano Banana Pro:** folhas de modelo, cenas complexas, maior resolução e consistência com várias referências.
- **GPT Image 2.5 Flare:** rascunhos rápidos e muitas alternativas.
- **GPT Image 2.5 Sunburst:** imagem-mestra, edição precisa, fundo transparente e acabamento final.

Nomes comerciais e disponibilidade podem mudar. Preserve sempre os arquivos-fonte e registre o modelo usado no nome ou nos metadados.

---

## 2. Bíblia visual compartilhada

Cole o bloco abaixo antes do prompt específico de cada criatura.

```text
ORIGINAL MONSTERCRYPT / CRYPT ROYALE CHARACTER DESIGN.
Premium cyber-fantasy anime pixel-art aesthetic, designed for a readable 2D/2.5D mobile strategy game. Chibi proportions with a strong, instantly recognizable silhouette; graphite-black engineered body materials; restrained neon cyan, electric blue, amber, magenta, violet or acid-green accents according to the character; crisp pixel clusters combined with polished concept-art lighting; friendly but battle-ready expression; original design with no resemblance to an existing franchise.

The creature must look like a regular MonsterCrypt monster, never like a Nexus or a humanoid operator. Preserve biological species cues while integrating functional digital components. Show one complete creature, fully inside the canvas, centered, three-quarter front view, neutral combat-ready pose. Transparent background. No scenery, floor, cast shadow, frame, UI, typography, letters, numbers, logo, watermark, signature, weapon floating outside the body, duplicate character or cropped anatomy.

Production requirements: consistent anatomy, exactly the intended number of limbs, clean outer contour, separated readable parts, controlled highlights, no tiny noisy ornaments, readable at 96 px, suitable as the approved identity reference for later sprite-sheet and card-art production.
```

### Restrições negativas compartilhadas

```text
Avoid: photorealism, soft plush-toy rendering, generic robot, human body, armored human, excessive steampunk, medieval clothing, guns unless explicitly requested, text, card border, statistics, coins, crypto logos, brand logos, scenery, pedestal, cast shadow, opaque background, multiple characters, anatomy errors, extra limbs, missing limbs, mismatched eyes, asymmetric accidental details, blur, low contrast, muddy colors, overexposure and direct imitation of any existing IP.
```

---

## 3. Prompts das imagens-mestras

Cada bloco abaixo já está pronto para ser usado após a Bíblia visual. Gere primeiro em formato quadrado, idealmente 2048 × 2048, com transparência.

### 01 — MC-0001 Bit Bug

**Referência existente:** `public/assets/units/bit-bug.png`

```text
Create the approved master design for Bit Bug, MC-0001, Digital element, Feral nature, common rarity. A tiny cyber-beetle built for coordinated swarming: compact oval graphite carapace, six short articulated insect legs, two small forward mandibles and two cyan pixel-antennas. The shell is split by a luminous binary seam; the eyes are bright cyan squares with a mischievous feral focus. Add only a few orange warning pixels near the joints. Its identity markers are the binary shell seam, paired square eyes and twin antenna tips. Small, agile and inexpensive-looking, never elite or ornate. Pose it leaning forward as if the swarm has just selected a target. Preserve the attached legacy Bit Bug image as the same character while improving clarity and production quality.
```

### 02 — MC-0004 Data Mouse

**Referência existente:** `public/assets/units/data-mouse.png`

```text
Create the approved master design for Data Mouse, MC-0004, Metal element, Vigilante nature, common rarity. A compact cyber mouse sentinel with four natural rodent legs, rounded graphite body armor, large dish-like ears that function as data receivers, a flexible cable tail ending in a tiny connector, and an amber tactical visor integrated around the eyes. A small cyan checksum emitter sits on the chest, not a handheld gun. Identity markers: receiver ears, connector tail and amber visor. The pose is alert and precise, one forepaw raised while tracking a distant target. Preserve the attached legacy Data Mouse image as the same character while refining materials and silhouette.
```

### 03 — MC-0007 Code Slime

**Referência existente:** `public/assets/units/code-slime.png`

```text
Create the approved master design for Code Slime, MC-0007, Terra element, Agile nature, common rarity. A low, elastic slime creature made of translucent green-cyan computational gel with a darker graphite core suspended inside. It has two clear luminous eyes, two small pseudopod arms and a broad base that can visibly split into two lobes. Sparse square code fragments float inside the gel without forming readable text. Identity markers: suspended core, twin-lobed base and three bright data bubbles. The pose suggests fast elastic motion and duplication, but show only one complete creature. Preserve the attached legacy Code Slime identity and make the silhouette clean enough for animation.
```

### 04 — MC-0010 Pixel Pup

**Referência existente:** `public/assets/units/pixel-pup.png`

```text
Create the approved master design for Pixel Pup, MC-0010, Water element, Wise nature, common rarity. A loyal young cyber canine with four legs, a friendly but focused face, compact graphite-blue armor plates, soft electric-blue energy fur along the ears and back, a luminous cyan collar ring and a tail that resolves into a controlled trail of square pixels. Identity markers: cyan collar, pixel-tail tip and two water-blue cheek marks. Balanced fighter proportions, neither tiny nor tank-like. Pose it braced protectively toward an unseen ally. Preserve the attached legacy Pixel Pup as the same recognizable character.
```

### 05 — MC-0013 Circuit Hare

**Referência existente:** `public/assets/units/circuit-hare.png`

```text
Create the approved master design for Circuit Hare, MC-0013, Digital element, Resonant nature, common rarity. A lean cyber hare with two powerful rear legs, two smaller front legs, long swept-back ears and an aerodynamic graphite body. Cyan and magenta circuit paths run from the rear legs to the ear tips, forming a visible stored-charge route. Small electric arcs bridge the two ears. Identity markers: paired charged ears, magenta-cyan leg circuits and diamond-shaped chest node. Pose at the instant before a high-speed leap, with readable limb separation. Preserve the attached legacy Circuit Hare identity.
```

### 06 — MC-0016 Cache Crow

**Referência existente:** `public/assets/units/cache-crow.png`

```text
Create the approved master design for Cache Crow, MC-0016, Metal element, Stable nature, common rarity. A cyber crow with two wings, two legs and a natural bird silhouette, built from layered graphite feather plates. Violet eyes, subtle cyan edges and one luminous cache crystal embedded in the chest create the focal point. The tail feathers resemble neatly stacked memory segments. Identity markers: chest cache crystal, stacked tail and violet gaze. Pose hovering with wings partly open, stable and controlled rather than aggressive. Preserve the attached legacy Cache Crow design.
```

### 07 — MC-0019 Byte Boar

**Referência existente:** `public/assets/units/byte-boar.png`

```text
Create the approved master design for Byte Boar, MC-0019, Earth element, Chaotic nature, common rarity. A heavy quadruped cyber boar with a low center of gravity, broad armored forehead, short powerful legs and two large tusks made of stacked luminous data blocks. Graphite armor carries restrained amber-orange impact plates; a small cyan status strip runs along the spine. Identity markers: block-data tusks, reinforced forehead and orange shoulder plates. Pose charging forward with massive weight, while keeping the entire body visible. It must look durable and common, not royal or legendary. Preserve the attached legacy Byte Boar identity.
```

### 08 — MC-0031 Socket Crab

**Referência existente:** `public/assets/units/socket-crab.png`

```text
Create the approved master design for Socket Crab, MC-0031, Earth element, Tenacious nature, common rarity. A defensive cyber crab with eight walking legs, two large connector-shaped claws and a wide low hexagonal graphite shell. A calm blue core glows under the front rim. The shell front is clearly reinforced while the sides and back remain visibly lighter, supporting a frontal-defense gameplay read. Identity markers: socket claws, hexagonal shell and central blue core. Pose planted firmly with both claws guarding the front. Preserve the attached legacy Socket Crab identity and correct any unclear anatomy.
```

### 09 — MC-0022 Copper Mole

```text
Create the approved master design for Copper Mole, MC-0022, Water element, Loyal nature, common rarity. A compact quadruped cyber mole specialized in tunneling: dark graphite fur-armor, two oversized fan-shaped copper digging claws, a blunt sensor snout, very small protected eyes and turquoise water-cooling channels along the flanks. Fine droplets condense around the cooling vents but do not create scenery. Identity markers: copper fan claws, probe snout and paired turquoise cooling lines. Pose emerging upward from an implied tunnel motion without showing soil or ground. Practical, loyal and workmanlike, not luxurious.
```

### 10 — MC-0025 Fiber Finch

```text
Create the approved master design for Fiber Finch, MC-0025, Digital element, Predatory nature, common rarity. A tiny cyber finch with two wings, two legs, a sharp luminous beak and a fast aerial silhouette. Each wing is formed by a small number of translucent fiber-optic feathers with controlled cyan, violet and warm amber tips. A single scanning lens surrounds one eye; the other eye remains biological-digital and expressive. Identity markers: fiber-optic wings, scanning eye ring and three-pronged tail. Pose banking quickly in flight, fully contained in frame, alert and predatory without looking evil.
```

### 11 — MC-0028 Patch Toad

```text
Create the approved master design for Patch Toad, MC-0028, Metal element, Serene nature, common rarity. A squat cyber toad support creature with four limbs, broad calm face and rounded graphite-metal skin panels. Two compact repair reservoirs sit naturally on its back, linked to a flexible cable-like tongue and small cyan-gold healing emitters on the forearms. A simple cross-shaped patch motif may be abstract and non-medical, with no text. Identity markers: twin repair reservoirs, cable tongue and glowing forearm patches. Pose seated but ready to hop, serene and dependable, clearly a support rather than a fighter.
```

### 12 — MC-0034 Logic Lizard

```text
Create the approved master design for Logic Lizard, MC-0034, Water element, Curious nature, common rarity. A sleek quadruped cyber lizard with a long balancing tail, low graphite-blue body, bright inquisitive eyes and a geometric cyan cranial crest. The tail contains three connected logic nodes that visually explain a chain attack; water-blue light travels from node to node. Identity markers: triangular logic crest, three tail nodes and cursor-shaped pupils that do not form text. Pose with head tilted curiously while projecting a small controlled energy pulse from the crest. Clean, intelligent and nimble.
```

### 13 — MC-0037 Kernel Goat

```text
Create the approved master design for Kernel Goat, MC-0037, Digital element, Feral nature, common rarity. A robust quadruped cyber goat with a muscular neck, graphite coat plates, cloven mechanical hooves and two large spiral horns patterned like circuit-board traces. A contained red-orange kernel core glows in the chest, balanced by cyan status lights so the creature does not read as demonic. Identity markers: circuit spiral horns, kernel chest core and reinforced forehead band. Pose lowering its head before a knockback charge, all four legs clearly visible and planted.
```

### 14 — MC-0040 Packet Fox

```text
Create the approved master design for Packet Fox, MC-0040, Metal element, Vigilante nature, common rarity. An elegant quadruped cyber fox with long legs, pointed ears, graphite-silver armor and a large tail made from a coherent stream of rectangular data packets. A violet optical mask is integrated into the face; subtle refraction along the outline suggests camouflage without making the body disappear. Identity markers: packet-stream tail, violet mask and two silver cheek blades. Pose stalking low and silently, intelligent and watchful, never humanoid and never holding a weapon.
```

### 15 — MC-0046 Buffer Bison

```text
Create the approved master design for Buffer Bison, MC-0046, Water element, Wise nature, common rarity. A massive quadruped cyber bison with broad shoulders, short sturdy legs, a heavy graphite-blue head and rounded armor plates designed to absorb impacts. Two thick horns curve outward around a calm face. Concentric aqua buffer rings are embedded across the shoulders and pulse outward as a protective aura, without drawing a full background circle. Identity markers: shoulder buffer rings, rounded forehead shield and aqua beard made of energy strands. Pose as an immovable protector, large but not legendary or overly ornate.
```

### 16 — MC-0049 Cache Mantis

```text
Create the approved master design for Cache Mantis, MC-0049, Digital element, Resonant nature, common rarity. A lean cyber praying mantis with exactly six insect limbs: two large folded raptorial forelimbs shaped as green-cyan data blades and four thin walking legs. The graphite thorax is narrow; two transparent memory crystals sit along the upper back, and resonant lines pulse between them and the blade arms. Identity markers: paired cache crystals, folded data blades and segmented cyan eyes. Pose at the start of a precise ambush dash, dangerous but readable, with no extra limbs and no handheld weapons.
```

---

## 4. Prompt de exploração rápida

Use este complemento com qualquer um dos 16 prompts:

```text
Exploration sheet only. Produce three clearly separated design variations of the same character identity, labeled only by position and with no written text: left emphasizes biological species, center balances biology and technology, right emphasizes technology while preserving the species. Keep the same identity markers and palette in all three. Plain transparent background. Do not merge the characters or crop them.
```

Escolha uma única variação antes de avançar. Não use uma folha de exploração como referência final de sprite, pois múltiplas versões podem confundir o modelo.

---

## 5. Prompt para folha de vistas

Depois de aprovar a imagem-mestra, anexe **somente a imagem aprovada** e use:

```text
Using the attached approved master image as the exact character identity, create a professional orthographic model sheet for animation. Show four separate full-body views of the exact same creature: front, right side, left side and back. Preserve anatomy, limb count, proportions, materials, palette and every identity marker. Neutral standing pose, consistent scale, consistent baseline and even spacing. Transparent background. No perspective exaggeration, no action pose, no shadows, no environment, no text, no labels, no frame, no watermark and no alternate design. This is a production reference, not a new interpretation.
```

---

## 6. Prompt para sprite sheet canônica

O arquivo final deve ser ajustado e verificado manualmente em grade; IA generativa pode errar posições exatas. Especificação canônica: **420 × 560 px**, RGBA, grade **3 × 4**, células de **140 × 140 px**.

Ordem das linhas:

1. frente — três frames;
2. direita — três frames;
3. esquerda — três frames;
4. costas — três frames.

Área segura por célula: `x=10–130`, `y=6–132`; baseline `y=128`; pivô `x=70, y=128`.

```text
Use the attached approved master character as an exact identity reference. Create a clean 3 columns by 4 rows pixel-art walking sprite sheet, transparent RGBA background, no gaps between cell backgrounds and no visible grid. Row 1: front walk, three phases. Row 2: right walk, three phases. Row 3: left walk, three phases. Row 4: back walk, three phases. Maintain exact anatomy, limb count, palette, lighting direction and scale in every frame. Feet or lowest body point share one baseline. Motion must loop smoothly: contact, passing, opposite contact. No scenery, cast shadow, text, UI, borders, watermark, duplicated detached parts or change of character design. Keep the character fully inside each cell with generous safety margin.
```

**Regra de produção:** gere em resolução maior se necessário, mas faça a montagem final da grade, redução com nearest-neighbor e validação de pivôs em ferramenta de imagem ou script determinístico.

---

## 7. Prompt para arte vertical da carta

Anexe a imagem-mestra aprovada. Gere a ilustração **sem moldura e sem texto**, pois moldura, raridade, custo e estatísticas devem ser adicionados pela interface do jogo.

```text
Create a premium vertical 4:5 key art illustration for a Crypt Royale card using the attached approved master character as the exact identity. Show one complete character in a dynamic action that communicates its gameplay role. Use a cyber-fantasy arena environment inspired by its element, with a clear foreground, restrained midground and soft background. Strong silhouette, cinematic rim light, controlled particles and clear empty breathing room near the upper-left corner for a future energy-cost UI. Preserve anatomy, colors and identity markers exactly. No card frame, no text, no numbers, no rarity gems, no logo, no watermark, no extra creatures and no references to existing franchises.
```

### Ações por carta para a arte vertical

| Carta | Ação principal | Ambiente sugerido |
|---|---|---|
| Bit Bug | três rastros sugerem o enxame, mas apenas um herói em foco | trilha de dados fragmentada |
| Data Mouse | mira um pulso de checksum | posto de transmissão metálico |
| Code Slime | corpo começa a dividir-se | solo de código líquido |
| Pixel Pup | corre para proteger um aliado fora do quadro | ponte aquática digital |
| Circuit Hare | salta com carga acumulada | corredor neon de alta velocidade |
| Cache Crow | mergulha enquanto o cache brilha | torres de memória distantes |
| Byte Boar | investe contra uma barreira | portão de dados rachando |
| Socket Crab | bloqueia um impacto frontal | passagem hexagonal terrestre |
| Copper Mole | emerge de um túnel luminoso | condutos subterrâneos de cobre |
| Fiber Finch | revela uma distorção camuflada | céu de fibras ópticas |
| Patch Toad | envia um pulso de reparo | oficina metálica serena |
| Logic Lizard | dispara energia encadeada | canais de lógica aquática |
| Kernel Goat | executa cabeçada de repulsão | núcleo digital instável |
| Packet Fox | sai da camuflagem | corredores de pacotes metálicos |
| Buffer Bison | protege a formação com a aura | planície de buffers aquáticos |
| Cache Mantis | inicia salto de emboscada | jardim de memória cristalina |

---

## 8. Nomes e organização de arquivos

Use nomes sem espaços e sem acentos:

```text
cr_mc-0001_bit-bug_exploration_v001.png
cr_mc-0001_bit-bug_master_v001.png
cr_mc-0001_bit-bug_turnaround_v001.png
cr_mc-0001_bit-bug_spritesheet_v001.png
cr_mc-0001_bit-bug_cardart_v001.png
```

Estrutura recomendada:

```text
art-source/
  references/
  exploration/
  approved-masters/
  turnarounds/
  card-art/
  sprite-sheets/
  rejected/
```

Para cada geração, registre num pequeno arquivo `.json` ou planilha:

- ID da carta;
- nome do modelo;
- data;
- prompt usado;
- imagens de referência;
- seed, se disponível;
- resolução;
- autor da aprovação;
- status: rascunho, revisar, aprovado ou rejeitado.

---

## 9. Como aproveitar o Gemini Pro sem deixá-lo apenas gerando imagens

O Gemini pode trabalhar em paralelo como **assistente de pré-produção**, usando este GDD e o catálogo canônico como fontes. Tarefas úteis:

1. montar um inventário das artes existentes e apontar arquivos ausentes;
2. criar uma planilha de produção com status, prioridade e dependências;
3. revisar cada imagem gerada contra a ficha da carta;
4. detectar inconsistências de anatomia, paleta e marcas de identidade;
5. propor descrições curtas, falas, efeitos sonoros e animações sem alterar o cânone;
6. preparar versões PT-BR, inglês e espanhol dos textos de interface;
7. construir matriz de counters e cenários de playtest;
8. transformar relatórios de partidas em sugestões de balanceamento;
9. gerar especificações JSON a partir de fichas já aprovadas;
10. documentar decisões e manter um changelog de arte.

### Prompt coordenador para o Gemini

```text
Atue como coordenador de pré-produção do Crypt Royale. Considere os documentos anexos como fonte canônica e não invente mudanças silenciosas. Sua função é organizar, validar e apontar lacunas; decisões novas devem aparecer numa seção separada chamada PROPOSTAS PARA APROVAÇÃO.

Para cada uma das 16 cartas, produza uma tabela com: ID, nome, referência disponível, arte-mestra, folha de vistas, sprite sheet, card art, VFX, SFX, descrição PT-BR, localização EN/ES, status, responsável, dependências e critérios de aceite. Em seguida, revise os prompts e sinalize conflitos de anatomia, elemento, natureza, raridade, função tática ou nomenclatura. Não altere valores de combate. Não prometa valorização, renda, recompra ou lucro com MCT. Não proponha conversão automática de Gold ou Diamantes em MCT. Não copie franquias existentes.

Quando eu anexar uma imagem, compare-a com a ficha correspondente e responda em quatro blocos: APROVADO, CORRIGIR, RISCOS e PROMPT DE EDIÇÃO. Seja específico e mensurável. Se faltar fonte para uma conclusão, marque como PENDENTE em vez de inventar.
```

### Prompt de revisão de imagem para o Gemini

```text
Revise a imagem anexada como diretor de arte técnico. Carta: [ID E NOME]. Compare com a imagem-mestra e a ficha canônica anexadas. Avalie de 0 a 5: silhueta em 96 px, anatomia, número de membros, identidade da espécie, marcadores visuais, fidelidade de paleta, leitura da função tática, transparência do fundo, ausência de texto/logos e adequação ao estilo Crypt Royale. Liste defeitos objetivos por prioridade. Depois escreva um único prompt de edição que corrija os defeitos sem redesenhar o personagem. Não aprove uma imagem com anatomia inconsistente ou identidade alterada.
```

---

## 10. Checklist de aprovação

Uma imagem só recebe o status **APROVADA** quando:

- corresponde ao ID e à espécie correta;
- mantém todos os marcadores de identidade;
- possui o número correto de membros e partes;
- não se parece com personagem protegido de outra franquia;
- é legível em 96 px;
- usa fundo transparente quando for asset isolado;
- não contém texto, números, logos, moldura ou marca d’água;
- não mistura arte de carta com sprite sheet;
- mantém proporção e paleta entre vistas;
- registra modelo, versão e prompt utilizados;
- possui arquivo-fonte e exportação final separados;
- foi revisada por uma pessoa antes de entrar no jogo.

### Regra de ouro de conclusão por personagem

Um personagem somente pode ser marcado como **CONCLUÍDO** depois que sua arte de carta vertical também tiver sido criada, validada e integrada ao catálogo jogável. Portanto, após aprovar a imagem-mestra, turnaround e sprite sheet de cada monstro, o pipeline deve produzir automaticamente:

- card art vertical 4:5 sem moldura ou texto;
- arquivo-fonte versionado em `art-source/card-art/`;
- exportação WebP otimizada em `public/assets/cards/`;
- metadados e SHA-256 da fonte;
- referência `cardArt` no catálogo `src/game/cards.js`;
- validação visual em tamanho mobile, testes e build.

Não iniciar o personagem seguinte deixando a carta do personagem atual como sigla ou placeholder.

---

## 11. Ordem de produção sugerida

Produza em lotes de quatro para aprender e corrigir o pipeline cedo:

1. **Lote A:** Bit Bug, Data Mouse, Code Slime e Pixel Pup.
2. **Lote B:** Circuit Hare, Cache Crow, Byte Boar e Socket Crab.
3. **Lote C:** Copper Mole, Fiber Finch, Patch Toad e Logic Lizard.
4. **Lote D:** Kernel Goat, Packet Fox, Buffer Bison e Cache Mantis.

Finalize a imagem-mestra do Lote A antes de gerar 64 assets de uma vez. A consistência conquistada no primeiro lote vira referência para os demais.

