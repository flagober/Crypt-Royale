# Missão: integrar Operator Core aprovada e VFX procedural

## Objetivo

Substituir somente o placeholder visual das duas torres `core` pela arte oficial aprovada e integrar o módulo existente `vfx-operator-ring.js` ao ciclo real do jogo, sem alterar hitboxes, balanceamento ou torres `guard`.

## Entradas canônicas

- `art-source/approved-masters/cr_vila_byte_operator_core_master_v001.png`
- `art-source/approved-masters/cr_vila_byte_operator_core_master_v001.json`
- `src/game/vfx-operator-ring.js`
- `src/game/vfx-operator-ring.test.js`
- `src/game/render.js`
- `src/game/engine.js`
- `src/game/engine.test.js`
- `src/App.jsx` somente se o reset não puder ser corretamente conectado dentro de `createGame()`.

## Alterações permitidas

- Criar `public/assets/towers/cr_vila_byte_operator_core_master_v001.png` como cópia byte a byte do master aprovado.
- Editar apenas os arquivos `src/game/` necessários para a integração e seus testes.
- Editar `src/App.jsx` somente se estritamente necessário ao reset do VFX.

## Requisitos funcionais

1. Carregar a imagem pública uma única vez e desenhá-la apenas para `tower.type === 'core'`.
2. Manter o placeholder atual como fallback enquanto a imagem não estiver carregada; torres `guard` continuam exatamente como estão.
3. Usar `imageSmoothingEnabled = false` e calibrar escala/pivô visual a partir do master 2048×2048 e bbox `[482,232,1688,1980]`, preservando a posição lógica `tower.x/tower.y` e as hitboxes atuais.
4. Ordem de desenho obrigatória por core: corpo raster → `drawOperatorRing()` → futuro slot de avatar → barra de vida. A barra não pode ficar coberta.
5. Player usa o anel ciano; rival usa o anel coral/rose já definido no módulo. O corpo raster permanece canônico, sem recoloração destrutiva.
6. Considerar Bastião ativo para a torre enquanto `tower.shield > 0`.
7. Conectar `notifyTowerHit(id)` quando um ataque atingir uma torre, e `notifyTowerDestroyed(id)` somente na transição de HP positivo para zero.
8. Chamar `tickRingVFX(dt, game.towers)` uma vez por passo ativo do jogo.
9. Chamar `resetOperatorRingVFX()` ao criar/reiniciar uma partida, sem deixar estado visual vazar entre sessões.
10. Atualizar os comentários de V003/placeholder no módulo para referenciar o master V004 aprovado e registrar o anchor final calibrado.
11. Preservar `prefers-reduced-motion`, a lógica existente de partida, o balanceamento e a API pública atual.

## QA obrigatório

- Confirmar que o PNG público tem exatamente o mesmo SHA-256 do master aprovado.
- Adicionar ou atualizar testes que provem: reset entre partidas; hit/flash de torre; destruição de core; tick; guard sem anel; ordem corpo→anel→vida quando testável sem fragilidade excessiva; fallback de imagem.
- Executar `npm test`.
- Executar `npm run build`.
- Informar lista exata de arquivos alterados e qualquer risco visual que ainda exija inspeção no navegador/celular.

## Ações proibidas

- Não editar nem regravar o master aprovado.
- Não mudar HP, dano, alcance, posições ou hitboxes.
- Não integrar avatar ainda.
- Não alterar cartas, economia, carteira, Firebase, áudio ou layout da interface.
- Não apagar históricos ou arquivos superseded.
