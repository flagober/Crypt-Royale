# Ataque frontal e defesa por rota — 18/10/2026

Solicitação e confirmação do usuário: personagens também atacam de frente; cada torre defende sua própria rota respeitando o limite do meio da arena.

Prévia candidata v004: http://localhost:5179/class-tower-preview.html
VPN: http://100.79.208.33:5179/class-tower-preview.html

## Direção frontal

- Duas novas folhas PNG RGBA 1254×1254, arranjo 2×2: warrior-male-front-v001.png e warrior-female-front-v001.png, em public/assets/class-tower-candidates.
- Quatro poses: guarda, preparação, corte frontal e recuperação. Corpo/rosto olhando para frente. Espada direita anatômica, escudo esquerdo; sem espelhamento global.
- Fontes anteriores e paleta aprovada da Guerreira preservadas. Armadura predominantemente metálica, detalhes roxos/rosados e escudo colorido apenas em cristal/runas.
- Produção com image_gen integrada; prompts integrais em CLASSES_FRENTE_PROMPTS_2026-10-18.json. Separação determinística dos quatro componentes alfa por folha, sem sobrescrever a arte fonte.
- Manifesto v004 registra retângulos, pivôs e escala. Pivôs explícitos dos pés usam pixels metálicos da faixa inferior para que a espada apontada para baixo não desloque o centro de apoio.
- Setor frontal selecionado quando alvo está aproximadamente alinhado com o personagem, com histerese para não oscilar entre vistas. Controle À frente / centro permite inspeção direta. Esquerda/direita continuam disponíveis.

## Regra de combate implementada

Antes, updateTower escolhia o inimigo mais próximo no alcance, sem filtro de rota. Agora src/game/tower-targeting.js valida:

1. Torre e alvo vivos, equipes opostas, coordenadas válidas e alvo dentro da arena.
2. Metade defensiva: jogador só ataca y>=280; adversário só y<=280, em arena 360×560.
3. Guardiã esquerda: alvo x<180. Direita: alvo x>180. A linha exata x=180 fica sob cobertura do Núcleo, sem favorecer uma equipe/faixa na igualdade.
4. Alcance radial inalterado: Guardiã105, Núcleo125. Núcleo pode cobrir centro e ambas as faixas se estiverem no alcance e na metade defensiva.
5. Filtros existentes de alvo/camuflagem mantidos. Escolha do inimigo válido mais próximo, dano54/72 e recargas1000/850ms preservados.

Regras simétricas para jogador e IA. A regra de rota é uma alteração real do motor local; não depende de aprovação ou presença das novas artes.

## Demonstração visual

- Cópia pública do módulo de alvo tem conteúdo idêntico ao módulo do motor; teste verifica a igualdade.
- O conjunto defensivo representa somente a metade da defesa, projetando coordenadas ilustrativas para uma arena lógica. Posições reais da partida não foram movidas para acomodar artes.
- Guardiã sem alvo válido não gira em direção à outra rota nem dispara. Central fora do alcance fica em guarda. Labels mostram Alvo válido, Fora da rota ou Fora do alcance.
- Os dois cards superiores são estudos livres de poses, sem regra de alcance. O conjunto inferior aplica os filtros. Alvo gráfico não causa dano na partida.

## Verificação

- 120 testes do jogo passaram, incluindo cinco novos: separação de faixas, cobertura/alcance do Núcleo, metade defensiva/simetria, dano real no motor e igualdade da política pública.
- Sete testes da prévia passaram, incluindo setor frontal e histerese, giro, boca do canhão e isolamento das poses.
- Build Vite passou em .orchestration/build-check-front-20261018-1959, sem substituir dist nem gerar instaladores. JS final verificado com node --check.
- Navegador: alvo esquerdo → esquerda válida, direita fora da rota; alvo direito → direita válida, esquerda fora da rota; centro → Núcleo válido, duas laterais fora da rota. Ataque frontal conferido nos dois personagens; console sem erros.
- Screenshot: docs/classes-frente-rotas-20261018.png.
- Fonte alterada é local. Instaladores publicados continuam v0.6 e precisam de futura geração para receber a regra. Artes novas permanecem candidatas na prévia até aprovação visual e integração explícita ao renderizador do jogo.

Backups verificados: 195336-938-frontal-and-tower-routes-517ddc73 e 200220-161-routes-gdd-release-notes-8194bc63, em C:\FlavioG\Backups\2026-10-18.

Próxima etapa: aprovação visual da frente; integrar as artes/classes aprovadas aos eventos de ataque, mantendo esta política de defesa. Novos instaladores somente após concluir e validar a integração.
