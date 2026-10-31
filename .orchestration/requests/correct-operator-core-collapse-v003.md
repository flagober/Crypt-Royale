# Correção final da integração: ciclo de colapso da Operator Core

## Evidência do defeito

O código atual chama `notifyTowerDestroyed()`, mas a animação de colapso não consegue aparecer nem terminar:

1. `render.js` executa `if (item.hp <= 0) continue`, portanto nunca chama `drawOperatorRing()` para uma core destruída.
2. `stepGame()` retorna imediatamente quando `game.status !== 'playing'`, antes de `tickRingVFX()`. Como destruir uma core finaliza a partida no mesmo passo, `collapseRemainingMs` deixa de avançar.

Os testes atuais exercitam o módulo VFX isolado, mas não provam essa integração com engine/render.

## Objetivo

Fazer o anel da core destruída executar seu colapso por 600 ms após o término da partida e então desaparecer, sem redesenhar o corpo raster destruído e sem alterar lógica de jogo.

## Alterações permitidas

- `src/game/engine.js`
- `src/game/engine.test.js`
- `src/game/render.js`
- `src/game/render.test.js`
- `src/game/vfx-operator-ring.js` e seu teste somente se uma pequena API de consulta realmente for necessária.

## Requisitos

1. Em `stepGame`, normalize `dt` e avance `tickRingVFX(dt, game.towers)` mesmo quando a partida já estiver `finished`; continue bloqueando toda a lógica de gameplay nesse estado.
2. Em `renderGame`, para uma core com `hp <= 0`, não desenhe o corpo raster nem a barra de vida, mas permita que `drawOperatorRing()` desenhe enquanto o estado de colapso estiver ativo. Guard destruída continua invisível.
3. Após 600 ms acumulados de passos pós-destruição, o anel deve ficar completamente ausente.
4. Preserve a escala `0.034`, âncora `-48`, posições, hitboxes, balanceamento e todos os demais comportamentos.
5. Adicione teste integrado que:
   - provoque a transição real de HP positivo para zero por `stepGame()`;
   - confirme que o estado da partida termina;
   - confirme que o anel ainda é desenhável durante o início do colapso;
   - chame `stepGame()` após `finished` até completar pelo menos 600 ms;
   - confirme que o anel desapareceu.
6. Mantenha o teste geométrico da torre rival e todos os testes existentes.
7. Execute `npm test` e `npm run build`.

## Proibido

- Não alterar o asset ou metadados.
- Não mudar regras da partida, dano, HP, alcance, cooldown, posição ou hitbox.
- Não desenhar novamente o corpo da torre após destruição.
- Não alterar App, cartas ou interface.

## Evidência exigida

Liste arquivos alterados, explique a ordem exata do tick após `finished`, descreva o novo teste integrado e informe testes/build completos.
