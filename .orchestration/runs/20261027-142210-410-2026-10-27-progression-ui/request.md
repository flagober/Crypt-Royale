# Implementar somente apresentação de coleção/campanha/classes

Autorizado por Flavio nesta conversa: resumo dos recursos na tela inicial/menu, cartas obtidas, evoluções por cartas e Gold no estilo de progressão do Royale, níveis de jogadores/monstros/classes e campanha. Codex implementa regras e integração separadamente. Não usar marcos18/40 do RPG como gates do Royale; números desta adaptação estão no módulo abaixo.

## Escopo estrito
LER: src/game/progression.js, src/game/families.json, src/game/cards.js, src/game/maps.js e src/activities-v2.css como referência. Você pode ler as regras AGENTS.md, mas NÃO editar outros arquivos. EDITAR/CRIAR SOMENTE src/ProgressionPanel.jsx e src/progression.css. Backup do escopo já feito e verificado por Codex em C:/FlavioG/Backups/2026-10-27/141916-014-crypt09-colecao-campanha-evolucao-5781a789; runner faz snapshot adicional. FonteC, espelhoG feito pelo runner. Não executar shell, RunCommand, testes, npm, geração de imagens nem outros agentes. Não ler credenciais/perfis/.keys/.env. Codex testa e salva chat pelo helper depois.

## API
Exportar ProgressionPanel({profile,initialTab='collection',busy=false,message='',onClose,onUpgrade,onEvolve,onClassUpgrade,onSpecialize,onStartStage}).
Exportar WalletSummary({profile,onOpen}) para a tela inicial. onOpen recebe uma string collection/classes/campaign.
Importar progressionView de ./game/progression.js. O módulo já existe com contrato final. Uma chamada progressionView(profile) retorna:
- player {level,xp,currentXp,neededXp,nextXp,percent}
- wallet {gold,xp,dataFragments,cards(objeto),cardCount,classCardCount}
- monsters array {id,name,baseName,art,role,level,form(0base),formCount,forms(array nomes),copies,upgrade:{cards,gold}|null,canUpgrade,evolve:{cards,gold,name}|null,canEvolve,hp,damage}
- classes array {id,name,branches:[{id,name}],level,cards,branch:string|null,upgrade:{cards,gold}|null,canUpgrade,specialCost:{cards,gold},canSpecialize}
- stages array {id,index,mapId,mapName,title,enemyLevel,cardId,unlocked,completed,stars,reward:{gold,xp,dataFragments,cards,classCards}}
- campaign {completed,total,nextStageId|null}.

Callbacks: onUpgrade(id,expectedLevel); onEvolve(id,expectedForm); onClassUpgrade(id,expectedLevel); onSpecialize(id,branchId); onStartStage(stageId).
Nunca alterar perfil, storage ou motor na apresentação. Consumir apenas os callbacks. Botões desabilitados para busy/recursos insuficientes, nível máximo ou fase bloqueada. Nenhum saldo de demonstração nem vitória fictícia.

## Visual e conteúdo
Original Crypt Royale navy/cyan/gold, acabamento bonito usando artes JÁ APROVADAS: public/assets/rewards/vila-byte-{chest,coins,fragments,gift,xp,cards}-v001.png. Não gerar/desenhar artes novas. Cartas usam monster.art. Não anunciar sprites de forma evoluída: quando form>0 indicar discretamente “Arte base provisória”; nomes/atributos são reais.
WalletSummary compacto, 4recursos com imagens, nível do jogador e barraXP, links Coleção e evoluções e Campanha. Os cards da tela inicial precisam ser legíveis no mobile sem ocupar arena inteira; grade2x2 compacta. Contador de cartas corresponde a duplicatas disponíveis, sem incluir instâncias-base grátis do treino. Cartas de classe têm contador separado.
Painel full-screen fixed com rolagem; 3abas: Coleção, Classes, Campanha, cabeçalhoCarteira/nível/XP e botão Fechar coleção. initialTab inicializa aba. Trap de foco estável sem reiniciar a cada update100msda HUD, Escape/onClose e foco ao fechar; document.body overflow tratado pelo App, não tocar.
Coleção: todos16monstros, nome/carta/nível/forma/duplicatas disponiveis e stats de campanha vida/dano. As bases já estão disponíveis para treino, mesmo0duplicatas. Barras de progresso para cartas até próxima melhoria. Botão “Melhorar [nome] · Nv.X” com custos visíveis antes; botão “Evoluir [nome]” com nome da próximaforma e custos20cartas500Gold /50cartas1500Gold. Forma final claramente indicada. Níveis cap10. Não confundir subir nível com mudar forma.
Classes: Guerreiro/Guerreira e Arqueiro/Arqueira, nível, cartas de classe, custos/próxima melhoria. TierII via escolha de uma das duas branches por dropdown e botão de especializar com o nome, custo10cartas500Gold e aviso escolha permanente. Não fazer duas escolhas com um clique. Indicar aparência atual preservada até produção de artes da especialização. As outras classes do universo ainda não estão integradas; não prometer acesso a elas.
Campanha: 9fases em3capítulos usando3mapas aprovados; thumbnails com map.file via importMAPS. Locked/unlocked/completed3stars, nível adversário e prévia exata da primeira/repetida recompensa (nomes cartas, cartas de classe). Botão “Jogar fase N” disabledlocked, rótulo fasecompleta jogar novamente. Indicar iniciarfase cria nova partida, treino livre continua sem recompensas automáticas; só batalhas manuais concluídas com30s contam. campanha local salva neste aparelho. Não alegar conta online/sync/MCT.

Responsivo320px/390px e desktop, min44pxinterações, sem cortes/horizontaloverflow, estadosloading/erro comdadospreservados (progressionView pode lançar; mostrarerro+fechar, não criar perfilzero). PrefixoCSSprg-. Respeitar reduced-motion. ImportsLucide permitidos para UI, sem dependências novas. Sem mudanças em assets/lógica/economia/notas/versão/build. Devolver arquivos feitos e pontos pendentes; não basta propor código.
