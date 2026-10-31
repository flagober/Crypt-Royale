# Progressão de níveis — Crypt Royale 0.8 — 29/10/2026

Proposta da auditoria aprovada pelo Flavio. Implementação aditiva; não remove recursos, famílias, formas ou especializações conquistadas. Fonte C e espelho G nas raízes confirmadas. Compilação/publicação serão registradas em PACOTE-v0.8-ciclo2-2026-10-29.md após verificação.

## Classes e jogador

| Tier | Base mínimo | Job mínimo | Disponibilidade nesta versão |
| --- | ---: | ---: | --- |
| I — Classe-base | 1 | 1 | Guerreiro/Guerreira e Arqueiro/Arqueira integrados |
| II — Especialização | 40 | 20 | Ramos já integrados; custo 10 cartas da classe + 500 Gold |
| III — Ascensão | 80 | 40 | Futuro, sem botão de compra/desbloqueio |
| IV — Despertar | 130 | 70 | Futuro |
| V — Transcendência | 200 | 100 | Futuro |

Base é o XP já existente em `wallet.xp`, com teto de nível 200 e a mesma curva. Não foi zerado, debitado ou copiado para Job. O Job começa no nível 1 e usa `progression.career.jobXp` por classe, teto 120. As sete chaves previstas existem no save; somente as duas classes efetivamente usadas nas torres ganham XP. As outras cinco classes ainda precisam de integração de conteúdo.

Cada partida manual concluída, com mínimo de 30 segundos e ao menos uma carta de família liberada jogada, concede 20 XP Job na vitória ou 10 na derrota/empate para cada classe de defesa ativa (Guerreiro central e Arqueiro lateral). Não há multiplicador pela quantidade de torres; uma classe recebe uma vez. Treino manual e campanha são elegíveis; automático, partida curta, sem participação ou família bloqueada não concedem Job. A campanha não credita Job novamente: o registro passa por `recordBattle` uma única vez, protegido por `processedMatches` persistente.

Check-in, missões e recompensas de correio mantêm o XP Base atual; não concedem Job retroativo. Reforço por cartas da torre (níveis 1–10, +4% por reforço) é independente. Comprar reforço não compra níveis Base/Job. Especializações antigas permanecem válidas com o bônus atual de +10%, mesmo abaixo do novo gate; não se paga novamente.

## Curvas de XP e tempo de referência

XP acumulado necessário para alcançar nível L:
- Base: `50 × (L−1) × L`, teto 200; curva preexistente preservada.
- Job: `20 × (L−1) × L`, teto 120.

| Job alvo | XP acumulado | Vitórias manuais a 20 XP, começando do zero | Referência a 3 minutos por partida |
| --- | ---: | ---: | ---: |
| 2 | 40 | 2 | 6 minutos |
| 20 | 7.600 | 380 | 19 horas |
| 40 | 31.200 | 1.560 | 78 horas |
| 70 | 96.600 | 4.830 | 241,5 horas |
| 100 | 198.000 | 9.900 | 495 horas |

Derrotas/empates rendem metade. Estes tempos são uma conta de referência, sem filas, pausas ou limites de sessão, não uma medição de playtest. Tiers III–V continuam futuros. A duração efetiva da partida pode variar; mínimo de elegibilidade não é uma duração prometida nem uma taxa recomendada de ganho.

Base 40 exige 78.000 XP acumulado. Usando apenas a recompensa preexistente de repetição de vitória de campanha (50 XP), seriam 1.560 vitórias / 78 horas a três minutos, sem considerar primeiras vitórias, missões ou check-in. Base pode ser o requisito limitante antes do Job. Preservar a curva agora evita reclassificar os saves; medir retenção e tempo real no beta antes de modificar a economia/ritmo de Base. Não afirmar que o balanceamento já foi comprovado.

## Monstros do Royale

| Forma nova | Nível do próprio monstro | Duplicatas da família | Gold |
| --- | ---: | ---: | ---: |
| Base → Mk-II | 6 | 20 | 500 |
| Mk-II → Apex | 10 | 50 | 1.500 |

São requisitos híbridos aprovados para o Royale, distintos dos níveis 18/40/60/75 do RPG. Todas as 16 famílias atuais têm três formas ao todo, não três evoluções além da base. Custos de melhoria, energia, quantidade de tropas e fórmula `1 + 0,04×(nível−1) + 0,12×forma` preservados. O treino mantém atributos normalizados; campanha usa o snapshot dos reforços/formas. Formas antigas abaixo dos novos requisitos continuam válidas e visíveis. Novos gastos são bloqueados antes de debitar se faltar nível ou recurso.

## Nexus e bosses — regras preparadas, conteúdo futuro

Nexus: um ativo por equipe; pilotos Cyber Cub e Nano Slime. Domar/uso exige Base40/Job20 + Pacto de Sincronia; Gênese/Incubadora exige Base80/Job40. Esta separação resolve explicitamente a divergência de acesso entre documentos 16/72 e 14/17/41. Forma II no nível próprio20 + vínculo30 + missão regional; Forma III no45 + vínculo70 + missão. Nenhuma aquisição, invocação, missão ou recompensa de Nexus foi ativada; `ready:false`.

Bosses não evoluem, não são Nexus nem tropas capturáveis. RAM Ram requer Base15 e as nove batalhas iniciais vencidas; Buffer Golem também requer RAM Ram no Normal. Dificuldades Normal→Veterano→Heroico por vitória anterior; fases previstas a100/60/30% de HP. Habilidades anunciadas como plano, sem combate novo ou loot. Vida/dano/recompensas dependem de protótipo e playtest; `ready:false` mesmo quando os níveis são atendidos. Não há mint, carteira externa, NFT, cobrança ou distribuição de MCT blockchain.

## Preservação e verificação

Save antigo sem `career` é aceito e exibido sem mutação; a primeira ação que grava carreira adiciona o campo com Job zero ou apenas o ganho da partida corrente. Nenhuma importação de uma cópia antiga do G. Valores Job malformados/negativos ou overflow geram erro sem substituir o perfil por vazio. Os mesmos dados percorrem save local e JSON remoto com revisão/conflito existentes; não é necessária nova permissão de Firestore.

Testes automatizados cobrem limites6/10 e40/20, custos, retrocompatibilidade, replay, elegibilidade, overflow, permanência das formas/ramos, e Job offline→reinício→sincronização entre duas instâncias com remoto simulado. Isso não substitui teste de campo em celulares/contas reais. Não foram concedidos XP ou itens em contas reais para validar a interface.

QA visual isolada em `.orchestration/qa/career.html`:320/360/390/768/1366 sem corte horizontal; fechar44×44; ganho20Job, especialização exata com débito10cartas/500Gold, formaMk-II no nível6 e bloqueioApex até10, savelegado e préviafutura. Imagens em career-base-job-20261029.jpg e career-tiers-20261029.jpg. Fixture não persiste nem acessa conta; não é a versão de produção.
