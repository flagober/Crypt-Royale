# Regras gerais do Flavio — todo o ecossistema

Leia `.agents/skills/flavio-golden-rules/SKILL.md` e `.agents/skills/auto-interaction-workflow/SKILL.md`. Backup verificado antes de qualquer modificação; chat salvo após cada interação/atualização; alterações espelhadas e verificadas entre os dois locais confirmados de cada projeto. Execução técnica contínua e autônoma sem travas desnecessárias de Submit; pausar estritamente para aprovação visual ou decisões críticas.

Priorize trabalho local em `C:\MonsterCrypt_Ecosystem_V1.0\...` e use este Drive como segundo local. Identifique a correspondência real antes de editar. Para Crypt Royale: `C:\MonsterCrypt_Ecosystem_V1.0\Crypt-Royale` ↔ `G:\Meu Drive\MonsterCrypt_Ecosystem_V1.0\Crypt-Royale`. Não substitua trabalho local por versões antigas do Drive. Exclua segredos e dependências do espelhamento. Informe qualquer pendência.

Chats: `C:\Chats Antigravity\Chat_AAAA-MM-DD.md`, espelho em `logs\chats-antigravity`. Datas/horários em America/Sao_Paulo. Não salve senhas, tokens ou códigos de autenticação.

## VPN do notebook — 02/10/2026
O IP Tailscale atual do notebook é 100.79.208.33. Endereço de acesso indicado pelo usuário: http://100.79.208.33:5174. Use esse host nos links/configurações de acesso remoto de todos os projetos, preservando a porta real de cada serviço. Crypt Royale usa 5179; Vix usa 5178. Não reutilize endereços do computador anterior.


## Gerador único Windows e Android — 17/10/2026

Usar somente `gerar_crypt_royale.bat` como entrada pública. Ele executa o gerador no C mesmo quando aberto pelo G. `scripts/gerar-pacote.cjs` congela fonte, avança uma versão pública curta (0.2→0.3→0.4) e um buildNumber Android para ambos; só publica depois de APK assinado/verificado, instalador Windows e smoke test aprovados. Não incrementar package.json separadamente para correções comuns; registrar notas e deixar o gerador publicar a próxima versão. `--verificar` não altera versão; `--manter-versao` repete a atual, preservando metadados. Ambos os binários recebem mesmas notas e conteúdo web com manifesto SHA256. Build privado em LOCALAPPDATA/MonsterCrypt/CryptRoyale/Builds; não espelhar dependências/caches/perfis nem assinatura. Chave APK e credenciais somente no C, pasta Signing privada; não substituir/regenerar uma chave existente. Não copiar autenticação, conectores, IDs, certificados ou dados do Vix. Progresso do jogador pertence à instalação e não é sincronizado ao espelhar os arquivos. Nunca declarar APK/.exe gerados por apenas configurar Capacitor ou executar Vite.

## Sequência pública reiniciada —28/10/2026

Flavio determinou manter a0.16 entregue e usar0.2,0.3,0.4,0.5… nas próximas. Aplicar a política específica em docs/POLITICA-DE-VERSOES.md: próximo ciclo2,0.2/build15, metadados técnicos crescentes para atualizar instalações existentes, pacotes em subpastas ciclo-2 para preservar arquivos antigos. Notas novas precisam de cicloVersao:2; não apagar nem renumerar o histórico. --manter-versao preserva a atual. Esta preferência não autoriza gerar/republicar a0.16 nem alterar outros projetos.

## Aprovação visual contínua —28/10/2026
Flavio determinou explicitamente: "auto aprovado daqui em diante, continue" no trabalho de evoluções/classes. Esta instrução do usuário prevalece sobre pausas de aprovação visual das skills neste fluxo: continuar produção, QA e integração sem pedir nova aprovação para cada pose/arte/animação. Preservar QA técnico/visual, identidade, empunhadura, backups, prompts, notas e espelhamento; não integrar arte defeituosa por estar autorizada. Não amplia autorização para pagamentos, contratos, exclusões de progresso, MCT real ou mudança de economia/regras não aprovadas. Registrar aprovação como autorização contínua, nunca como inspeção individual pelo usuário de uma arte ainda não vista.
