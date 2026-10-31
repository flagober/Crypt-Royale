# Missão: promover a Operator Core Tower V004-body

## Objetivo

Promover a candidata V004-body aprovada pelo usuário para o catálogo oficial de `approved-masters`, preservando a imagem byte a byte e criando seu metadado canônico.

## Entrada canônica

- `art-source/exploration/cr_vila_byte_operator_core_master-candidate_v004-body.png`
- SHA-256 esperado da origem: `78D2143639F981F589B01585375DF38007B0F01098C98DE733759BE13580D37B`
- Use o formato de metadados de `art-source/approved-masters/cr_mc-0001_bit-bug_master_v001.json` como referência estrutural, adaptando apenas os campos aplicáveis a uma torre.

## Alterações permitidas

Crie exclusivamente:

- `art-source/approved-masters/cr_vila_byte_operator_core_master_v001.png`
- `art-source/approved-masters/cr_vila_byte_operator_core_master_v001.json`

## Regras obrigatórias

- Copie o PNG sem abrir, converter, reamostrar ou regravar seus pixels.
- Origem e destino devem ter SHA-256 idêntico.
- Preserve 2048 × 2048, RGBA, bounding box `[482,232,1688,1980]` e as contagens de alfa auditadas.
- No JSON, registre: nome, status `approved`, versão 1, data `2026-09-27`, fonte direta, destino aprovado, SHA-256, dimensões, modo, bounding box, contagens alfa, `body_only: true`, e que o anel/slot do Operador é VFX procedural separado.
- Preserve todos os arquivos de exploração e QA.

## Ações proibidas

- Não editar nenhum arquivo existente.
- Não apagar, mover ou renomear históricos.
- Não integrar código ou VFX nesta missão.
- Não criar previews adicionais.

## Evidência exigida

Informe os dois arquivos criados, hashes de origem/destino, comparação byte a byte, métricas técnicas do destino e qualquer divergência. Se algum requisito falhar, não declare aprovação.
