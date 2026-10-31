# Crypt Royale 0.2.0 — Atividades e eventos

Entrega das fases 3 (rotina diária) e 4 (eventos), solicitada em 17/10/2026. Guerreiro e Guerreira ficam para a próxima ocasião. Não altera estatísticas, sprites, atributos das cartas, perfis de alvo nem regras de combate. Não implementa habilidades antes dos lotes de classes, Nexus e Bosses.

## Acesso e experiência

Desktop: presente no cabeçalho. Celular: Menu → Missões e eventos. Sub-abas: Rotina diária, Semana e eventos, Recompensas. Abrir a central pausa somente a simulação local e não recupera energia/tempo pela duração do menu. Escape/Fechar retorna à arena. O diálogo isola os controles de fundo e mantém navegação de teclado dentro dele.

Recursos e cartas são **locais de teste**. Não alteram poder de combate, não são Gold/MCT do ecossistema e não estão sincronizados entre dispositivos. A integração real de coleção, níveis, Base/Job e evolução é outra etapa. Os 16 monstros continuam disponíveis no treino como antes.

## Regras de partida

- Concluída pelo motor, com vitória, derrota ou empate e pelo menos 30 segundos de simulação e uma carta válida implantada manualmente. Duração mínima é parâmetro inicial de teste, não regra econômica final do ecossistema.
- Identificador próprio por partida; registro concluído é idempotente. Reiniciar antes do fim não concede progresso.
- Qualquer uso do automático marca toda a partida como treino inelegível, mesmo se desligado depois. Não conta para missões, primeira vitória, evento ou recursos de batalha.
- Dano conta somente HP efetivo das torres inimigas; escudos e dano excedente não contam. Limite máximo natural por partida: 6.400 HP das três torres atuais.
- A criatura destaque é escolhida de forma estável para a data entre os 16 monstros. Exige jogar a carta em uma vitória, não basta constar no deck. Nesta etapa, cada família está representada apenas por sua forma-base; formas futuras precisam de mapeamento canônico de família.
- Partida que atravessa a meia-noite conta no dia em que seu resultado é registrado; a simulação e o protótipo não usam isso como autorização financeira.

## Parâmetros de balanceamento de teste

| Atividade | Objetivo | Recursos locais |
|---|---|---|
| Presença na arena | 3 partidas manuais concluídas | 100 Gold + 20 XP |
| Pressão nas torres | 1.000 HP efetivos removidos | 80 Gold + 15 XP + 1 Fragmento de Dados |
| Destaque do dia | 1 vitória com a criatura indicada implantada | 50 Gold + 30 XP + 1 carta dessa criatura |
| Primeira vitória | 1 vitória manual no dia | 75 Gold + 25 XP + 1 carta mostrada antes do resgate |
| Objetivo semanal | Resgatar 9 missões diárias na semana | 300 Gold + 100 XP + 2 Fragmentos de Dados + Cache Tático de 3 cartas |
| Operação Vila Byte | 3 vitórias, 5.000 de dano nas torres e 4 criaturas diferentes usadas | 200 Gold + 80 XP + 3 Fragmentos de Dados + Cache Regional de 5 cartas |

Primeira vitória e check-in não contam como uma das nove missões semanais. Conteúdos dos caches são determinísticos por semana, exibidos antes de receber e limitados às cartas atuais. Não há compra, roleta, aleatoriedade paga ou conversão para MCT. Repetições da mesma carta acumulam no inventário, sem mint ou propriedade financeira.

| Dia do ciclo | Gold | XP | Fragmentos de Dados |
|---:|---:|---:|---:|
| 1 | 30 | 10 | 0 |
| 2 | 40 | 10 | 0 |
| 3 | 50 | 15 | 1 |
| 4 | 60 | 15 | 0 |
| 5 | 80 | 20 | 1 |
| 6 | 100 | 20 | 0 |
| 7 | 150 | 30 | 2 |

Ciclo avança somente ao resgatar e reinicia após o sétimo prêmio. Faltar um dia não apaga a posição no ciclo de Gold/materiais. Dias consecutivos são contados à parte e voltam a 1 após faltar; isso não gera elegibilidade MCT nesta versão.

## Calendário, persistência e limites

Fuso America/Sao_Paulo; dia renova à meia-noite, semana de segunda a domingo. Recompensas exigem resgate antes do fim do período. Quem começa numa semana parcial não recebe progresso retroativo; nove missões exigem no mínimo três dias de participação. Caches semanais/evento são uma vez por período; Gold/cartas já recebidos continuam nas viradas.

LocalStorage cryptroyale.activities.v1 guarda os recursos, objetivos, partidas processadas e recibos. Escritas preservam o perfil anterior em .backup antes do commit. Dados ilegíveis, versão incompatível ou falha de quota não são substituídos por perfil vazio. A interface informa a falha; pode-se conferir novamente o resultado terminado pela central. Releitura antes de gravar e Web Locks, quando disponível, coordenam abas da mesma origem. Em navegadores sem Web Locks, não há garantia de exclusão mútua entre abas; isso não é mecanismo de distribuição financeira.

Mudança regressiva de data bloqueia resgate e preserva o perfil. Isto é conveniência de teste, não antifraude: cliente, relógio e armazenamento locais são manipuláveis. Não apague dados do navegador se quiser preservar o progresso de teste. localhost e o IP Tailscale são origens diferentes e têm perfis locais separados. Espelhar código C/G não sincroniza dados do jogador no navegador.

## MCT e relação com MonsterCrypt

Fontes oficiais lidas no Drive, sem alterá-las:
- MDs V10/07_ECONOMIA_GOLD_MCT_MARKETPLACE_V10.md, Política econômica aprovada de 12/09/2026.
- MDs V10/09_PROGRESSAO_MISSOES_CHECKIN_V10.md, trecho atualizado Check-in e impulso de reputação.
- GDD_CRYPT_ROYALE.md, direção aprovada de economia compartilhada e automático sem MCT.

Ambos os V10 atualizados indicam 1 MCT no sétimo check-in consecutivo. O documento 09 ainda contém uma tabela legada de 28 dias com valores diferentes; ela não foi copiada para o Royale nem aplicada em paralelo.

**MCT permanece sem saldo, resgate, voucher ou emissão no Royale.** Não há promessa de pagamento retroativo dos testes. Gratuitos e VIPs continuarão elegíveis por atividade válida na futura campanha; automação paga não gera MCT e VIP não multiplica recompensa financeira nesta proposta.

Antes da ativação real:
1. Aprovar orçamento global do pool Rewards, vigência, limites por conta e política de elegibilidade. Cada 1.000 contas que completem o mesmo marco de 1 MCT consomem 1.000 MCT do orçamento, antes de qualquer evento semanal adicional. Não definir valores novos de eventos sem simular o custo total.
2. Identidade e calendário autoritativos no servidor, com histórico validado de partidas e automação. Não aceitar contadores enviados pelo navegador como prova.
3. Ledger único do ecossistema com chave idempotente por conta + campanha + marco, sem incluir o jogo como um segundo direito de resgate. Resgatar no RPG ou Royale consome o mesmo marco compartilhado.
4. Reserva orçamentária e crédito em transação atômica; recusar se o pool estiver esgotado. Logs e leitura em outro dispositivo devem confirmar o estado antes de declarar sincronização.
5. Marketplace e serviços opcionais usam recibos próprios; não converter automaticamente Gold/cartas/XP em MCT. Contratos, tesouraria e saque precisam de implantação e reconciliação separadas.

## Eventos de Boss

A aba mostra Evento de Boss em preparação. Bosses piloto e suas batalhas não existem nesta entrega; não se fabrica uma batalha ou Eco a partir de um monstro comum. Quando os assets e regras estiverem prontos, adicionar evento versionado, janela, elegibilidade, limite de tentativas/recompensas e pool orçado. Sem MCT por derrotas ilimitadas de Boss.

## Validação

94 testes e build aprovados. Casos de virada de dia/semana, reentrada após reload, duplicação de partida/resgate, check-in com faltas, vitória/derrota, automático, quantidade de missões semanais, falha de quota, dados inválidos e dano real de torres. Conferência na interface móvel do navegador: check-in recebeu 30 Gold/10 XP de teste, continuou resgatado após recarregar e impediu repetição; objetivos semanais/evento e conteúdo conhecido dos caches visíveis. Prévia em atividades-diarias-20261017.png e atividades-eventos-20261017.png.
