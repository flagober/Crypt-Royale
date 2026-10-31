# Missão: auditoria independente da torre V004-body

Atue somente como auditor técnico do projeto Crypt Royale. Não edite, crie, mova, renomeie nem exclua arquivo algum nesta missão.

## Objetivo

Verificar de forma independente se a candidata `art-source/exploration/cr_vila_byte_operator_core_master-candidate_v004-body.png` está tecnicamente apta a seguir para decisão humana de aprovação.

## Entradas canônicas

- Imagem V004-body acima.
- `art-source/exploration/relatorio_qa_v004_body.md`, se existir.
- Evidências em `art-source/exploration/qa-operator-core-v004/`.

## Verificações obrigatórias

1. Calcule o SHA-256 diretamente do arquivo.
2. Meça dimensões, modo, bounding box e contagens de alfa 0, 255 e intermediário.
3. Confirme se há pixels visíveis violeta segundo `R > G+20 && B > G+20`.
4. Confirme se pixels totalmente transparentes possuem RGB preto.
5. Liste riscos que métricas não conseguem eliminar sem inspeção humana.

## Restrições

- Zero alterações no workspace.
- Não promover para `approved-masters`.
- Não confiar no relatório existente sem recalcular.
- Não executar rede, publicação, upload ou instalação.

## Saída

Responda em português com um resumo objetivo, valores recalculados, divergências encontradas e a recomendação `APTA PARA REVISÃO HUMANA` ou `REPROVADA TECNICAMENTE`.
