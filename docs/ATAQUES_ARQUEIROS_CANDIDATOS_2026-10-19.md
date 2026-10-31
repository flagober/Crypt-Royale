# Ataques dos arqueiros — candidatos

Prévia: http://localhost:5179/archer-attack-preview.html. Acesso remoto: http://100.79.208.33:5179/archer-attack-preview.html.

Quatro poses próprias por personagem: preparar200ms, puxar300ms, soltar100ms, recuperar250ms. Ciclo proposto850ms para revisão, não acoplado ainda à recarga1000ms do motor. Arqueira mira à direita; Arqueiro mira à esquerda. Não há novas vistas, caminhada ou espelhamento global.

Folhas 2x2: feminina1353x1163, masculina1374x1145. Células nominais não são usadas para cortar vizinhos: a prévia isola quatro componentes alfa principais em cada folha (limiar32), com superfície independente e pivô pelo apoio inferior dos pés. Recortes/pivôs reais salvos em public/assets/class-tower-candidates/archer-attack-candidate-v001.json. São quatro quadros diferentes, não oito por personagem. Metadados candidatos; revisão artística ainda pendente.

Pausa, avanço, velocidades0,5/1/2x, zoom80/100/130% e fundos claro/escuro/grade. Prévia conferida por navegador: oito componentes separados, quatro fases acessíveis, reprodução e troca de controles funcionando, console sem erros. Captura docs/arqueiros-ataque-previa-20261019.png.

Servidor local estava desligado e foi iniciado pelo Vite no C, porta5179 sem duplicação. Não houve alteração no código de combate, nas poses já integradas ou nos instaladores. Novos arquivos apenas, originais preservados, espelhamento SHA256. Aprovação visual requerida pela skill monstercrypt-animation-pipeline antes de integrar novos assets ao jogo: “apresentar novos assets para aprovação visual antes de publicá-los no jogo”.

## Geração

Ferramenta image_gen integrada, referências archer-female-approved-v001.png e archer-male-approved-v001.png.

### Prompt Arqueira

Create a 2x2 sprite pose sheet, EXACTLY FOUR separated full-body drawings of the SAME approved female archer in reference. Genuine transparent background, equal four quadrants, generous transparent gutters, no pose touches another. All four same size, identical foot stance/pivot in cell, camera, anatomy, face, purple/pink ponytail with tiny green streaks, green/silver armor, violet/rose cape and purple bow, GREEN arrow. Always aiming RIGHT; anatomical LEFT hand holds bow and RIGHT hand pulls string, exactly two complete arms. Read order top-left/top-right/bottom-left/bottom-right: 1 READY: bow lowered slightly diagonal right, right hand bringing green arrow to string; 2 DRAW: bow up horizontal right, right elbow back, right hand at cheek and taut string, green arrow nocked; 3 RELEASE: bow arm extended right, string visibly straight/released, right fingers open beside cheek, NO arrow remains on string, no floating projectile in sheet; 4 RECOVER: bow slightly lowered, right hand moves toward quiver to retrieve next arrow, distinct from READY. Feet stay planted, only upper-body arms/cape subtle follow-through. Four DISTINCT anatomically drawn phases, not four repeats, not a walk. Preserve equipment and asymmetry, no global mirroring. No tower/floor/text/borders/numbers/background. Entire bow/cape/hair/boots fit each cell. Crisp chibi game art matching reference.

### Prompt Arqueiro

Create a 2x2 sprite pose sheet, EXACTLY FOUR separated full-body drawings of SAME approved male archer in reference. Genuine transparent background, equal four quadrants, generous transparent gutters, no pose touches another. All four same size, identical foot stance/pivot in cell, camera, anatomy, face, short blue hair with tiny green streaks, green/silver armor, navy/azure cape and silver/blue bow, GREEN arrow. Always aiming LEFT; anatomical LEFT hand holds bow and RIGHT hand pulls string, exactly two complete arms, natural joints. Read order top-left/top-right/bottom-left/bottom-right: 1 READY: bow lowered slightly diagonal left, right hand bringing green arrow to string; 2 DRAW: bow up horizontal left, right elbow back, right hand at cheek and taut string, green arrow nocked; 3 RELEASE: bow arm extended left, string visibly straight/released, right fingers open beside cheek, NO arrow remains on string, no floating projectile in sheet; 4 RECOVER: bow slightly lowered, right hand moves toward quiver to retrieve next arrow, distinct from READY. Feet stay planted, only upper-body arms/cape subtle follow-through. Four DISTINCT anatomically drawn phases, not four repeats, not a walk. Preserve equipment and asymmetry, no global mirroring. No tower/floor/text/borders/numbers/background. Entire bow/cape/hair/boots fit each cell. Crisp chibi game art matching reference.
