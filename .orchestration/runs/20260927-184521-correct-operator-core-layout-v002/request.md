# Correção da integração: torre inimiga cortada no topo

## Evidência observada

Na inspeção real em `http://127.0.0.1:5189/`, a Operator Core rival ficou visivelmente cortada pelo limite superior da arena. A configuração atual usa `scale: 0.06`, `pivotY: 1750` e `anchorOffsetY: -84`.

Com bbox visível Y `[232,1980]` e torre rival em `y=58`, o topo visível calculado é:

`58 + (232 - 1750) * 0.06 = -33.08`

Portanto, aproximadamente 33 pixels visíveis ficam fora da arena. O relatório anterior estava incorreto ao considerar essa escala adequada.

## Objetivo

Corrigir somente a escala/pivô visual da Operator Core e a âncora proporcional do anel, mantendo toda a integração funcional aprovada.

## Alterações permitidas

- `src/game/render.js`
- `src/game/render.test.js`
- `src/game/vfx-operator-ring.js`
- `src/game/vfx-operator-ring.test.js` somente se necessário para validar a nova âncora.

## Requisitos

1. Use escala visual `0.034` para o master 2048×2048 com pivot `(1085,1750)`, salvo se demonstrar matematicamente outro valor menor ou igual que mantenha o topo visível da torre rival em `y >= 4`.
2. Com `scale: 0.034`, o bbox visível esperado da torre rival é aproximadamente Y `6.39..65.82`, inteiramente dentro da arena.
3. Recalibre `anchorOffsetY` proporcionalmente de `-84` para aproximadamente `-48`, alinhado à plataforma superior.
4. Remova o comentário residual que ainda chama `anchorOffsetY` de placeholder.
5. Não altere coordenadas lógicas das torres, hitboxes, HP, dano, alcance ou asset PNG.
6. Preserve a ordem corpo → anel → barra de vida e o fallback.
7. Adicione teste geométrico que falhe se o bbox visível da torre rival ultrapassar o topo da arena. O teste deve verificar a região visível do bbox, não o canvas transparente inteiro do PNG.
8. Execute `npm test` e `npm run build`.

## Proibido

- Não editar o master nem sua cópia pública.
- Não alterar engine, App, cartas, UI ou balanceamento.
- Não esconder o corte com clipping, máscara ou deslocamento lógico da torre.

## Evidência exigida

Informe escala, pivô, âncora final, fórmula do topo/bottom visível, arquivos alterados e resultados de testes/build.
