---
name: cryptcodex-antigravity
description: Coordenar o Crypt Royale com CryptCodex e Antigravity CLI/Gemini, produzir e revisar assets e código, preservar registros e espelhar alterações do C para o Google Drive.
---

# CryptCodex + Antigravity

Fonte de trabalho: `C:\MonsterCrypt_Ecosystem_V1.0\Crypt-Royale`. Espelho: `G:\Meu Drive\MonsterCrypt_Ecosystem_V1.0\Crypt-Royale`. Execute builds e ferramentas no C. Nunca importe automaticamente o G sobre o C.

O usuário autorizou este fluxo integrado. CryptCodex coordena o pedido, fornece referências, revisa resultados e integra apenas assets aprovados. Preserve imagens-mestras e candidatos anteriores. Consulte `docs`, `art-source` e `.orchestration` para reconstruir a etapa atual antes de continuar a produção.

## Execução

- CLI oficial instalado: `agy`. Modelo preferido: `gemini-3.1-pro-high`, esforço `high`. Confira `agy models` após login; se o modelo não estiver disponível, informe e escolha com o usuário antes de substituí-lo.
- Use a skill irmã `cryptcodex-gemini-accounts` para autenticação/seleção. Uma conta solicitada não é uma conta autenticada.
- Grave um pedido específico em `.orchestration/requests/*.md`, com entradas, arquivos permitidos, saídas, critérios de aceitação e limites. Uma solicitação de revisão usa modo `plan`. Alterações autorizadas usam `accept-edits`.
- Execute `scripts/Invoke-AntigravityTask.ps1 -RequestFile <arquivo> -Mode plan|accept-edits`. O script registra pedido, stdout, stderr e metadados; não usa bypass de permissões, não troca de conta e não repete uma tarefa com falha automaticamente.
- Leia o resultado e revise os arquivos. Uma execução concluída não significa asset aprovado. Para imagens: confira identidade, dimensões, transparência, enquadramento, vistas, continuidade e integração. Uma mudança parcial após falha deve ser examinada antes de novo pedido.

## Espelhamento obrigatório

Após cada lote de alterações, execute `scripts/Sync-CryptRoyale.ps1 -Paths <caminhos relativos alterados>`. O runner espelha automaticamente os arquivos criados/modificados durante sua execução, incluindo seus registros.

O espelho é incremental C → G, com verificação SHA-256. Não apaga arquivos no destino. Se um arquivo diferente já existir, preserva a versão anterior em `.orchestration/mirror-backups` antes de substituí-lo. Não copia credenciais, `.env`, perfis de login, `.git`, dependências ou caches. Falha no Drive mantém os arquivos no C e deve ser comunicada; tente novamente quando acessível. Arquivos removidos precisam de tratamento explícito, nunca de exclusão automática no G.

Mantenha esta skill e a skill de contas também em `C:\Users\flavi\.codex\skills` e `C:\Users\flavi\.gemini\config\skills`; espelhe as cópias do projeto. Não espelhe tokens ou o perfil `.gemini`.
