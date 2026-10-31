# Entrega confirmada — v0.5 — 18/10/2026

Gosma corrosiva doCodeSlime integrada:3s,base8dano/0,5s,contatoindividualsemacúmulo,imunidades,bolhas efeedbackverdeporperdaHP.115testes+35checksvisuais passaram; navegador confirmou40/48HPno0,5s e0/48HPaos3s/poçaencerrada na simulação real. Fonte/web/APK/Windows espelhadosSHA256. APKassinadov1/v2/v3verificado,buildAndroid3. WindowsPE0.5.0 eaberturaempacotada verificados.

Instaladores:dist-apk/Crypt_Royale_v0.5.apk e dist-electron/Crypt Royale Setup 0.5.exe. Manifesto:dist-pacote/v0.5/manifesto.json. Aplicativosinstaladosprecisamreceber0.5; progressoélocal,semnovasincronização. Androidfísicopendente; WindowssemcertificadoAuthenticode. AtualizaçãonãoemiteMCT.

---
# Code Slime — Gosma corrosiva — 18/10/2026

Regras aprovadas por Flavio: duração3000ms, raio28, dano-base8/500ms, primeiro pulso após500ms de contato; seis pulsos possíveis em contato contínuo. Uma contagem por alvo, sem multiplicação por poças sobrepostas. Saída interrompe exposição e reentrada exige novo intervalo. Tropas terrestres inimigas apenas; aliados, voadores e estruturas imunes. Pode derrotar unidades. Reduções de dano e escudos existentes continuam aplicáveis; o número flutuante informa a perda real deHP.

Lentidão anterior15% mantida somente para terrestres; visual com bolhas e pulsogreen350ms no inimigo por perdaHP, feedback de número400ms. Modo movimento reduzido respeitado. Poças não dão dano retroativo ao entrar e renderização não altera simulação. Ticks param ao término da partida.

115testes passaram, incluindo7cenáriosnovos: duração/seispulsos/morte; múltiploscontatos/nãoacúmulo; imunidades; saída/reentrada; cruzamentoexpiração/escudos; pausa/idempotência/partidanova; finitude/estadocanvas/imutabilidade. Prévia técnica corrosion-check.html usaengine real e fixture48HP, é de desenvolvimento e não integra os instaladores. Jogo recebeimplementação sem dependerda prévia.

BackuppreventivoSHA256; espelhoC/G. Preparar próximo pacote pelo geradorúnico (0.4→0.5); só confirmar instaladores apóscompilação/assinatura/smoketest.

---
# Entrega confirmada — Crypt Royale v0.4 — 18/10/2026

16 habilidades e efeitos integrados ao combate local, incluindo cura, controle, bônus, camuflagem/revelação e auras. NúcleoOperador/TorreGuardiã possuem novos disparos/impactos e Bastião possui pulso. Fonte, web, APK e Windows atualizados e espelhados.108testes +35checksvisuais; APK release assinado; metadados e abertura Windows verificados (0.4.0/versãopública0.4). BuildAndroid2. Instaladores em dist-apk/Crypt_Royale_v0.4.apk e dist-electron/Crypt Royale Setup 0.4.exe; SHA256 no manifesto dist-pacote/v0.4/manifesto.json. Windows sem certificadoAuthenticode; instalação físicaAndroid ainda pendente.

Esta etapa antecipa as habilidades dos16monstros a pedido deFlavio, após aprovação visual18/10; referências anteriores a habilidades não implementadas ficam superadas para estes16. Classes/Guerreiro/Guerreira, Nexus eBosses continuam adiados. Parâmetrosdegameplay locais iniciais em docs/MAGIAS_INTEGRADAS.md; balanceamento futuro necessário. Progresso/economia/MCT/Marketplace não ampliados por esta integração.

---
# Crypt Royale — Game Design Document

Versão documental 0.2 — 17/10/2026. Documento vivo de consolidação; não representa funcionalidades já entregues. Fonte de implementação: C:/MonsterCrypt_Ecosystem_V1.0/Crypt-Royale. Espelho: G:/Meu Drive/MonsterCrypt_Ecosystem_V1.0/Crypt-Royale.

## 1. Visão e estados

Batalha de arena com cartas de criaturas, três torres por equipe, Operadores escolhíveis e progressão de coleção. Diferenciais: composição de até duas linhagens de classe, evolução de monstros/classes/Nexus, descoberta no CryptDex e economia compartilhada com MonsterCrypt.

Legenda: **Implementado** = presente no protótipo; **Direção aprovada** = pedido do Flavio, ainda sem implementação; **Proposta** = parâmetros sugeridos, sujeitos a aprovação/balanceamento; **Pendente** = decisão necessária.

Referências: MDs V10 04 (CryptDex), 05 (evoluções), 07/09/69 (economia/check-in), 16/72 (classes/progressão), 17 (Nexus), 18 (Bosses), 30/38 (arte de classes). Este documento adapta sistemas ao Royale sem substituir silenciosamente o cânone do RPG.

## 2. Protótipo atual

Implementado: batalha local, energia, mão rotativa de cartas, IA adversária, cronômetro, HP/dano/escudos, vitória, três torres por lado, sprites direcionais e áudio. Dezesseis monstros integrados; Bit Bug, Data Mouse, Code Slime e Pixel Pup renovados. Última verificação: 78 testes e build passaram. Isso não comprova backend, contas, Marketplace ou distribuição de tokens.

Movimento mantém faixa esquerda/direita até o eixo central horizontal da arena, sem alternar de faixa para perseguir. Separação de unidades e aproximação pelo lado próximo do alvo implementadas. Bot automático atual é ferramenta interna de testes; não é um benefício público.

## 3. Operadores e torres

Direção atualizada por Flavio em 18/10/2026: personagem de classe somente sobre a torre central; as duas laterais são Guardiãs mecânicas sem personagens. Aparências masculina/feminina não alteram poder. Evolução continua na mesma linhagem. O limite anterior de duas linhagens e a proposta de ocupantes nas três torres não autorizam adicionar personagens às laterais neste lote.

Defesa por rota confirmada em 18/10/2026: Guardiã esquerda só mira alvos à esquerda da linha x=180; direita só à direita. A linha exata x=180 é defendida pelo Núcleo, que também pode cobrir alvos nas duas faixas dentro do seu alcance. Todas respeitam a própria metade defensiva (y>=280 jogador, y<=280 adversário). Alcance de Guardiã105/Núcleo125, dano54/72 e recarga1000/850ms preservados. Filtrar rota, metade e alcance antes de escolher o inimigo válido mais próximo. Regra implementada no motor local e testada, simétrica para ambas as equipes. Artes v004 aprovadas e integradas ao combate local em 18/10: central com seleção Guerreiro/Guerreira, três vistas, Guardiãs mecânicas sem personagens com canhões móveis. Escolha cosmética persistida por instalação, sem alterar atributos. Ainda não empacotadas em novos instaladores.

Presença de classes no campo também solicitada. Proposta inicial: um Operador móvel por equipe, contado no mesmo limite de duas linhagens. A mesma instância não ocupa torre e campo simultaneamente; personagens diferentes podem pertencer à mesma classe. Condições de implantação, custo, morte/retorno e controle do Operador móvel permanecem pendentes antes de programar o sistema.

Torres: ampliar plataforma visual para personagem e animação; validar legibilidade, barra de HP, perspectiva e espaço para tropas. Alterar tamanho visual não aumenta automaticamente colisão, alcance ou HP. Mudanças de área física exigem revisão explícita de posicionamento e testes. Habilidades especiais aguardam a etapa geral de habilidades.

## 4. Classes e produção inicial

Escopo: sete classes-base e quatorze especializações Tier II, 21 formas de classe; masculino/feminino são variantes, não novas classes ou descobertas. Mercenário está excluído do cânone.

| Classe-base | Especializações Tier II |
|---|---|
| Guerreiro/Guerreira | Paladino/Paladina; Gladiador/Gladiadora |
| Mago/Maga | Bruxo/Bruxa; Arquimago/Arquimaga |
| Arqueiro/Arqueira | Caçador/Caçadora; Franco-Atirador/Franco-Atiradora |
| Assassino/Assassina | Fantasma; Netrunner Elite |
| Contrabandista | Negociante; Pistoleiro/Pistoleira |
| Noviço/Noviça | Sacerdote/Sacerdotisa; Monge/Monja |
| Invocador/Invocadora | Domador/Domadora Nexus; Conjurador/Conjuradora Abissal |

Produção proposta: Base em lotes Guerreiro/Arqueiro, Mago/Noviço, Assassino/Contrabandista/Invocador; depois Tier II por linhagem. Cada aparência segue master aprovado → vistas → animação → integração. Começar pelo Guerreiro, depois Guerreira, com comparação de escala para torre/campo. Arte canônica do Mago não usa livros ou grimórios.

## 5. Perfis de alvo

Todos os perfis abaixo são propostas documentadas, não comportamento já implantado. Regras idênticas para jogador e IA. Separar prioridade de alvo, alvos permitidos (terra/ar/estrutura), alcance e mobilidade.

| Perfil | Monstros iniciais propostos |
|---|---|
| Estruturas exclusivamente | Byte Boar, Copper Mole, Kernel Goat |
| Tropas próximas, depois estruturas | Bit Bug, Data Mouse, Code Slime, Pixel Pup, Circuit Hare, Cache Crow, Socket Crab, Fiber Finch, Patch Toad, Logic Lizard, Buffer Bison |
| Caçar tropas, estrutura como alternativa | Packet Fox, Cache Mantis |

Classes ofensivas: perfil misto por padrão proposto; Assassino caçador; Noviço/Invocador têm prioridade de suporte conforme habilidades futuras. Nexus recebem perfil por forma. Bosses podem mudar prioridade por fase. Voar visualmente não implica imunidade ou permissão automática para atacar alvos aéreos.

Perseguição: raio de percepção e distância máxima de abandono configuráveis por perfil, com tempo limite e estabilidade do alvo. Ao perder alvo válido, voltar ao avanço da própria faixa. Atacar estruturas não concede atravessar unidades. Testar tropas que ignoram distrações, suporte, troca de alvo após morte, perseguição limitada, faixas, alcance e simetria.

## 6. Coleção, níveis e evolução

Direção aprovada: cartas e duplicatas participam do progresso, com missões/eventos/check-ins. Proposta: nível de carta usa duplicatas e Gold; mudança de forma exige marcos, materiais e desafio. Quantidades, custos e integração com Base/Job precisam de tabela própria antes da implementação.

Monstros: marcos canônicos Nv.18/40/60/75, somente até o estágio da família; não inventar quatro evoluções para todas. Nexus: Nv.20/45 e vínculo/quest. Classes: Base/Job 1/1, 40/20, 80/40, 130/70, 200/100; produção inicial limitada a Tier I/II. Bosses não evoluem.

Propostas: evolução entre partidas, forma fixada ao entrar na arena; duplicatas excedentes tornam-se fragmentos da própria família, sem conversão MCT; modo competitivo normaliza atributos, preservando acesso às formas/habilidades. Mesmo normalizadas, formas exigem balanceamento de mecânicas e matchmaking. Progressão persistente e transações serão validadas no servidor, não confiadas ao cliente.

## 7. Nexus e Bosses

Nexus: sete linhagens canônicas, 21 formas. Primeira produção proposta de Formas I em lotes 3+2+2: Cyber Cub, Nano Slime, Spark Rat; Circuit Beetle, Data Bat; Byte Cat, Wire Snake. Formas II/III seguem aprovação por linhagem. Um slot ativo por equipe é proposta; condições de convocação ainda pendentes.

Nexus não são capturáveis ou duplicatas descartáveis de pacotes. Projeções de teste devem ser identificadas e não concedem propriedade ou mint. Divergência a resolver: doc17 exige Tier III/80/40 para uso, enquanto docs16/72 liberam Domar Nexus em Tier II/40/20. Não implementar gate silenciosamente.

Bosses: catálogo canônico de42, sem captura/evolução. Escopo inicial proposto: três Bosses piloto, não os42. Sugestão R1: RAM Ram, Buffer Golem e Rootkit Minotaur; confirmar antes da produção. Modo PvE/evento é proposta inicial. Eco de Boss jogável em PvP é proposta separada, ainda sem aprovação de regras.

## 8. CryptDex

Nome oficial verificado no título do doc04: CryptDex. 677 criaturas/formas incluem21 Nexus e42 Bosses; classes são aba adicional do Royale. Catálogo disponível cresce por lotes, sem prometer conteúdo ainda não produzido.

Direção aprovada: primeiro encontro válido desbloqueia ficha. Primeira aparência masculina/feminina fica registrada; posteriores não sobrescrevem nem duplicam descoberta/recompensa. Skins não contam como nova entrada. Formas evolutivas com ID canônico próprio podem contar separadamente conforme manifesto da campanha. Avistar não equivale a possuir/capturar. Abrir catálogo ou imagem não conta como encontro.

Campanha solicitada: marco a cada20 descobertas e total promocional300MCT. Pendente: 300por conta ou pool global; catálogo elegível; valores por marco; participantes/vigência. Não publicar promessa ou ativar pagamentos antes desses parâmetros. Crescimento do catálogo não reinicia marcos pagos. Regras detalhadas em PROPOSTA_CRYPTDEX_RECOMPENSAS.md.

## 9. Economia, atividades e Marketplace

MCT: supply canônico100milhões, Rewards40milhões, compartilhado; Royale não cria supply adicional. Gratuitos eVIPs podem ganhar MCT por participação válida; automação paga não gera MCT. Definir budget global e teto porconta antes de recompensas. Gold paga melhoria/gameplay; cartas/fragmentos alimentam coleção/evolução; MCT cobre utilidades habilitadas. Não prometer conversão fixa de Gold/cartas emMCT.

Propostas de atividades: missões diárias Gold/cartas/XP, objetivo semanal elegível aMCT, eventos com pool previamente reservado, check-in. Doc07 atualizado prevê1MCT no sétimo check-in; valores legados divergem. Consolidar e validar custo, sem duplicar resgate entreRPG/Royale. Verificação server-side, histórico e proteção contra contas/partidas combinadas necessários.

Caches de cartas propostos: Recruta (rotina), Tático (semanal/Gold), Regional (eventos/loja), Especial (temporada/Boss). Conteúdo conhecido/escolhível para compras é preferência proposta. Pacotes aleatórios exigem chances/garantias explícitas e decisão de regras antes de lançamento. Abrir/comprar caches não geraMCT. Cartas em comprasMCT aceleram coleção; decisão ainda pendente, não anunciar como cosmético.

Marketplace: categorias elegíveis conforme cânone; preço, taxas e entrega antes da confirmação, recibo, idempotência e reconciliação. Não habilitar comércio de instâncias/progressão sem regras de vínculo e antifraude. Nexus seguem propriedade própria. VIP Bronze/Prata/Ouro30dias é proposta baseada noV10, com conveniência/cosméticos sem aumento de dano/chance de vitória/MCT. Preços Royale pendentes.

Automação pública: proposta de licença opcionalMCT para treino/PvE, semranking ou MCT, semrenovação silenciosa. Permissão de XP/cartas e limites ainda pendente. Bot atual continua interno até haver implementação pública específica.

## 10. Entrega e critérios

Ordem vigente: documentação/fundação → classesBase/TierII → Nexus → loteBosses → habilidades de TODOS os conteúdos criados → novo lote demonstros. Isso substitui proposta antiga de habilidades junto a cada lote. Datas de entrega dependem aprovação e volume deassets, sem prazo fictício.

Cada entrega: backup verificado, preservação fontes/versões, aprovação visual quando pertinente, testes relevantes de comportamento, build quando aplicativo mudar, relatório de limitações, chat diário, espelhamentoSHA256. Conteúdo semhabilidade fica identificado como integração básica, não catálogo plenamente funcional.

## 11. Decisões abertas

- Custo/controle/morte do Operador móvel e convocaçãoNexus; tamanho físico das torres.
- Balanceamento deformas, matriz ar/terra e valores deperseguição.
- Custos decartas, curva deXP, persistência eorçamentoRewards.
- Limite/catálogo/público da promoção300MCT.
- GatesNexus e requisitosJob inconsistentes no cânone.
- Termos promocionais: alterações futuras comunicadas, preservação de recompensas conquistadas e revisão jurídica; cláusula semaviso não é garantia deproteção.

## 12. Documentos de apoio

- ROTEIRO_PRODUCAO_ROYALE.md: ordem eescopo deprodução.
- PROPOSTA_CRYPTDEX_RECOMPENSAS.md: descoberta ecampanha.
- Deck_Canonico_Vila_Byte.md ePrompts_Visuais_16_Cartas_v1.0.md: catálogo/arte inicial.
- NOTAS_DAS_VERSOES.md: mudanças entregues noaplicativo.
- ../.orchestration/reports/RETOMADA.md: estado operacional recente.

## Revisão obrigatória de caminhadas — 03/10/2026
Pedido explícito do Flavio: não aprovar folhas que repetem a mesma perna à frente nas três colunas. Validar contato A com uma perna avançada, quadro central neutro/passagem e contato B com a perna oposta avançada em TODAS as quatro direções. Verificar joelho/pé/perna de apoio, não apenas deslocamento do corpo ou capa. Direção constante por linha, mão anatômica da arma consistente. Montar preview do ciclo0/1/2/1 antes de integração; repetir pose ou mera translação não conta como caminhada válida. Aplicar daqui em diante e revisar Guerreiro/Guerreira atuais.


## Atualização de 17/10/2026 — rotina diária e eventos locais

Pedido atual do Flavio: avançar as fases 3 (rotina diária) e 4 (eventos), deixando Guerreiro/Guerreira para outra ocasião. A produção de seus assets não foi alterada. A ordem futura de classes/Nexus/Bosses antes das habilidades permanece.

Implementado no protótipo 0.2.0: Central de Atividades, três missões diárias, bônus da primeira vitória, ciclo de sete check-ins, objetivo semanal por nove missões diárias resgatadas, evento semanal Operação Vila Byte e inventário dos recursos recebidos. São recursos **locais de teste**, sem efeito nos atributos da batalha, sem integração com Marketplace ou Base/Job. Cartas de recompensa são duplicatas explícitas dos 16 monstros atuais; caches mostram o conteúdo conhecido antes do resgate.

Partidas concluídas manualmente, com implantação válida e mínimo de 30 segundos, alimentam os objetivos uma única vez. Treino automático fica inelegível para toda a partida, mesmo se desligado depois. Dano conta somente HP efetivamente removido das torres rivais. Reiniciar uma partida inacabada não concede progresso. Abrir a central pausa a simulação local.

Horário de Brasília: missões/primeira vitória/check-in mudam à meia-noite; semana reinicia segunda-feira. Ciclo de Gold/materiais não perde posição por faltar um dia, enquanto o contador de dias consecutivos é separado. Política V10 de 1 MCT no sétimo check-in consecutivo permanece registrada, mas **não há resgate, voucher, saldo ou distribuição MCT no Royale**. Ainda são necessários orçamento, identidade validada, servidor e ledger único compartilhado com MonsterCrypt. Não se considera implementada a sincronização entre jogos/dispositivos.

Eventos de Boss e Ecos aguardam produção/integração dos Bosses. Não foi criada batalha fictícia de Boss nem promessa de recompensa. Habilidades, evolução e Marketplace permanecem fora desta entrega. Regras e parâmetros de teste em ATIVIDADES_E_EVENTOS.md.
