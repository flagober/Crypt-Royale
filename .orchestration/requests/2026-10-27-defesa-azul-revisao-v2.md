# Revisão somente leitura — defesa azul Crypt Royale

Use modo plan, sem edição e sem comandos shell/RunCommand/subagentes. O Codex prepara/roda os testes e fará as mudanças autorizadas depois da revisão. Pedido do Flavio: retomar revisão da defesa azul e, após aprovação visual concreta, integrar/testar/gerar0.7. Ainda não há aprovação das poses de costas; não promover candidatas automaticamente.

Regras: fonte C:\MonsterCrypt_Ecosystem_V1.0\Crypt-Royale; espelho homônimo G; não importar G. Backups SHA256 antes de editar, chat diário em C:\Chats Antigravity sem credenciais, espelhamento verificado por lote. Este pedido é somente leitura; runner faz backup e registra resultado. Não acessar .env, .keys, Signing, perfis, credenciais, caches ou outros projetos. Não ampliar permissões se houver recusa.

Leia apenas: public/blue-defense-preview.html e .js; public/assets/class-tower-candidates/blue-back-attack-candidate-v001.json e quatro PNG *-back-attack-candidate-v001.png; src/game/tower-animation.js, tower-assets.js, tower-render.js, tower-art.json, tower-frames.js, tower-animation.test.js e tower-render.test.js; docs/DEFESA_AZUL_COSTAS_CANDIDATA_2026-10-19.md e ATAQUES_FRONTAIS_INTEGRADOS_2026-10-19.md.

Entregue relatório curto e concreto:
1. Riscos de recorte/margem, pivô, troca de volume e mão anatômica. Se não conseguir ver PNG, declare limitação.
2. Integração mínima proposta para equipe player olhar para cima/costas, preservando poses frontais enemy e Guerreiro/Guerreira selecionável. Não fabricar costas por flip.
3. Arquivos/contratos e testes pertinentes para carregar4poses por personagem mantendo dano/alcance/recarga/eventos de flecha existentes. Separar relógio da prévia850ms do combate real.
4. Diferenciar bugs comprovados, suspeitas e questões visuais que só Flavio pode aprovar. Não mudar combate, economia, personagens, versões ou instaladores.

Em paralelo Codex pode atualizar dependências package/lock e capturar prévias; não alterar esses arquivos nem tratar essas mudanças externas como sua autoria.

Nova tentativa delimitada após examinar o retorno anterior: hooks.json restaurado para o wrapper CMD existente, sem desativar telemetria nem ampliar permissões. Apenas leitura: não edite arquivos. Concentre-se no contrato e riscos comprováveis por leitura; não precisa inspecionar outros plugins ou perfis. Se a leitura continuar bloqueada, entregue a limitação e pare, sem novas tentativas internas.
