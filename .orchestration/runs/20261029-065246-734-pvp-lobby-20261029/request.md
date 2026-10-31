# PvP amistoso — interface delimitada

Usuário aprovou amistoso 1v1 por código no Base7 após vencer as três batalhas de Vila Byte. Trabalhe somente no C, em C:\MonsterCrypt_Ecosystem_V1.0\Crypt-Royale. Regras de ouro: backup antes de editar, chat sem credenciais, espelho verificado C/G. Snapshot verificado pelo coordenador antes desta execução. Não ler chaves, .env, sessões, .keys ou perfis. Sem novas bibliotecas, sem executar builds/deploy, sem alterar versões ou quaisquer outros arquivos. Codex revisará a integração, regras e testes.

Arquivos permitidos para criar: **src/PvpPanel.jsx e src/pvp.css**, somente. Leia GameMenu.jsx, game-menu.css, ProgressionPanel.jsx para referência visual se necessário. Não editar esses arquivos nem App.jsx. Não pedir confirmação; execute a implementação autorizada.

Criar export function PvpPanel({state, access, configured, onClose, onConnect, onCreate, onJoin, onReady, onLeave, onAccount}). Todos callbacks fornecidos externamente, sem Firebase/fetch/armazenamento aqui. Não criar mock de combate ou alterar recursos.

Contrato:
- state={status:'offline'|'connecting'|'connected'|'reconnecting'|'error', message:string, room:null|{code:string,status:'waiting'|'countdown'|'playing'|'finished'|'cancelled',seat:0|1,players:[{name:string,connected:boolean,ready:boolean}],paused:boolean,countdownMs:number,reconnectSeconds:number,resultReason:string}, game?:object}. state.room pode ser nulo. Se playing game pode estar presente; a arena real é externa.
- access={allowed:boolean,base:number,vilaByte:boolean,authenticated:boolean,reason:string}. reason explica bloqueio. A liberação é apenas exibida; será validada também pelo servidor.
- configured:boolean indica se servidor foi configurado. false deve dizer Em preparação e não habilitar criar/entrar/conectar. Login onAccount pode ficar disponível.
- onConnect(), onCreate(), onJoin(code), onReady(boolean), onLeave(), onClose(), onAccount(). Não passar JWT em UI. Os callbacks não precisam retornar resultado; feedback vem de state.message.

UI modal elegante dark/navy com cyan/purple/gold, responsiva 320px desktop, CSS prefixo pvp-. Cabeçalho PvP amistoso / Desafie um amigo, fechar44x44 alinhado topo, focus trap+Escape restaurando foco. Escape e Fechar só recolhem painel; não abandonam partida/sala. Campos sempre com labels, status aria-live, evitar componentes demais. Corpo scroll para não cortar.

Sem sala: regras Base7+3vitóriasVilaByte, manual e atributos normalizados, sem ranking/troféus/recompensas nesta primeira fase; criar sala e entrar por código de6caracteres (alfabeto ABCDEFGHJKLMNPQRSTUVWXYZ23456789), normalizar maiúsculas, input autocompleteoff. Mostrar botão Conectar/reconectar quando necessário. Só liberar criar/join se configured&&access.allowed&&status==='connected'. Login se não autenticado. Não expor campo de endpoint nem dados pessoais/e-mails.

Com sala: código com botão Copiar usando navigator.clipboard (tratar erro, fallback código selecionável), nomes dos dois jogadores escapados pelo React, conectado/aguardando/desconectado e pronto. onReady toggle para ambos ficarem prontos quando waiting/countdown; countdown com segundos. Playing: aviso combate continua quando painel está aberto, Retomar arena fecha; pausa/reconexão mostra prazo de30segundos; não prometer appfechado/standby. Finished/cancelled: resultado no state.game.message se presente; sem prometer recompensas; sairparaonLeave. Botão claro Sair da sala ou Desistir e voltar ao treino durante playing; última ação em duas etapas inline de confirmação, com Cancelar, sem alert/confirm do navegador. DepoisonLeave(resetconfirm).

Nenhuma imagem nova necessária: usar ícones lucide existentes e uma mini-ilustração CSS de duas cartas/espadas se útil. Não copiar arte concorrente. Sem preços, pagamentos, MCT ou economia. Não mostrar tokens/configuração técnica ao jogador.

Ao terminar, informar arquivos criados e decisões de UI; não afirmar testes ou integração em App que não executou.
