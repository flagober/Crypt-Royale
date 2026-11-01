## 31/10/2026 — v0.2 · Pagamentos Oficiais via Mercado Pago/Pix, Medidor de Energia na GUI e Pipeline iOS na Nuvem

Resumo: Integração do checkout oficial Mercado Pago com Pix instantâneo, medidor de energia visível na tela de batalha do PC, botões de pós-partida com retorno ao menu e compilação nativa para iPhone.

- Loja Oficial conectada à API Mercado Pago: compras de Gold via Pix e Cartão de Crédito com validação de assinatura e entrega atômica no servidor.
- Medidor de Energia na GUI Desktop: indicador numérico com ícone luminoso e contagem X/10 tanto na barra de combate quanto no cabeçalho.
- Tela de Fim de Partida Aprimorada: botão (X) para retorno imediato à arena limpa e novo botão "Opções de menu do jogo" para navegação direta.
- Automação iOS na Nuvem: pipeline oficial com macOS 15 e Xcode 16 gerando o pacote instalável Crypt_Royale_iOS.ipa.
- Build 28 oficial pronto para atualização na Google Play Store (AAB), Windows Desktop (EXE) e iOS (IPA).

## 31/10/2026 — v0.13 · Arena Matchmaking PvP, Cards da Caixa de Correio e Loja em Modo Real

Resumo: PvP com Modo Livre e Modo Equilíbrio com alerta de nível, cards visuais de itens no Correio e Loja oficial em modo real com checkout.

- Arena PvP com Modo Equilíbrio: pareamento balanceado e alerta de confirmação quando o oponente for de nível superior.
- Arena PvP com Modo Livre: combates abertos entre quaisquer níveis (dos mais fracos aos mais fortes) sem confirmação prévia.
- Caixa de Correio com cards visuais de itens para Gold, XP, Fragmentos de Dados, cartas e classes, e modal de celebração ao resgatar presentes.
- Loja Oficial ativada em Modo Real com checkout interativo, opções de pagamento e geração de recibos atômicos.
- Build 27 oficial pronto para atualização na Google Play Store e instalador Windows Desktop.

## 31/10/2026 — v0.12 · Sincronização de faixa e estabilidade de publicação

Resumo: Empacotamento oficial build 26 para lançamento sincronizado nas faixas da Google Play Store.

- Código de versão 26 oficial para lançamento desimpedido no Google Play Console.
- Consolidação de empacotamento para faixas de teste fechado e teste interno.
- Otimização contínua de integridade de save e resposta de transação.

## 31/10/2026 — v0.11 · Estabilidade de versão e refinamentos de conectividade

Resumo: Empacotamento com código de versão 25 atualizado para o Google Play Console e estabilidade contínua de rede.

- Código de versão 25 oficial para entrega desimpedida no Google Play Console.
- Consolidação da proteção de fluxo de batalha e reconexão offline transparente.
- Tratamento aprimorado de erros transitórios de autenticação e cotas de banco de dados.

## 30/10/2026 — v0.10 · Resiliência offline e proteção do fluxo de batalha

Resumo: Jogo resiliente a oscilações de rede e cotas na nuvem, fluxo de batalha sem interrupções e controles de saída de conta.

- Sincronização em segundo plano reconhece limites temporários de cota e instabilidade de rede sem interromper partidas em andamento.
- Save local no aparelho preservado integralmente com avanço contínuo de campanha, ouro e coleção em modo offline seguro.
- Modal de conta nunca mais abre automaticamente durante a jogatina em caso de erros transitórios de nuvem.
- Painel de conta ganha botão Voltar ao jogo, atalho Escape e fechamento ativo mesmo em contingência de rede.
- Mensagens de status traduzidas e explicativas em português, substituindo avisos técnicos em inglês.

## 29/10/2026 — v0.9 · VIP e um novo ritmo para o Bastião

Resumo: VIPs por sete dias, compra em Gold confirmada na conta e recarga do Bastião separada da duração do escudo.

- Loja ganha botão Voltar à arena visível durante a rolagem, com alvo de toque de44pixels.
- Fim da apresentação para convidados mostra Entrar ou criar conta como única ação principal; contas autenticadas mantêm campanha e treino. Progresso legado preservado.
- Salas amistosas 1v1 por código, Base7 e três vitórias deVilaByte, manuais e com atributos normalizados; sem troféus, Gold, XP ou MCT. Autoridade do servidor e reconexão com pausa.
- Cliente preparado para o despertar do servidor gratuito; recusa explícita de autenticação encerra tentativas mesmo se o proxy perder o código de fechamento.
- Backend beta implantado no Render Free. Conexão remota habilitada somente no desenvolvimento para QA; ativação na distribuição depende de duas contas reais.
- VIP 1/2/3 por sete dias, por 5.000/12.000/25.000 Gold; renovação manual do mesmo nível soma sete dias. Molduras bronze/prata/ouro, títulos nos níveis 2/3 e efeito de entrada PvE no VIP 3.
- Bastião permanece ativo por 15 segundos e depois recarrega por 20 segundos. No PvE, VIP 1/2/3 reduz essa espera para 18/16/15 segundos. No PvP, ambos os lados mantêm 20 segundos.
- Compra VIP exige conta sincronizada e conexão; confirmação e recibo evitam débito duplicado ao verificar o mesmo pedido. Benefícios definidos ao iniciar cada partida; validade confirmada pelo horário do servidor.
- Passe automático continua separado, por 5.000 Gold, 20 Fragmentos e 50 cartas repetidas. Pagamentos reais e migração do Drive não foram ativados.

## 29/10/2026 — v0.8 · Cada evolução tem sua jornada

Resumo: Base e Job separados, requisitos de nível para novas evoluções e conquistas anteriores preservadas.

- XP existente permanece como Base do jogador, com teto 200. Job tem XP próprio por classe e teto 120; não recebe cópia retroativa do XP antigo.
- Partidas manuais elegíveis concedem 20 XP Job por vitória ou 10 por derrota/empate às duas classes de defesa em uso. Mínimo de 30 segundos e uma carta jogada; automático não concede Job; o mesmo resultado não pontua duas vezes.
- Novas especializações exigem Base 40 e Job 20 da classe, além das mesmas 10 cartas de classe e 500 Gold. Reforço da torre por cartas continua separado. Especializações já conquistadas permanecem válidas.
- Novas formas dos monstros exigem nível próprio 6 para Mk-II e 10 para Apex, com os mesmos custos de 20/50 duplicatas e 500/1.500 Gold. Evoluções anteriores permanecem válidas mesmo abaixo desses níveis.
- Coleção mostra Base, Job, XP, requisitos e a jornada canônica de cinco tiers. Tiers III a V, Nexus e bosses aparecem como conteúdo futuro; nenhuma invocação ou batalha nova é liberada nesta versão.
- Regras preparadas: Nexus nos níveis próprios 20/45 e vínculo 30/70; Domar em Base40/Job20 e Gênese em80/40. Bosses sem evolução, Base15 após as nove batalhas, dificuldades Normal/Veterano/Heroico. Pagamentos reais continuam desativados.

## 29/10/2026 — v0.7 · Sua coleção ganha destaque

Resumo: Loja com fechar compacto, seleção de cartas ilustradas com controles de quantidade e nova moeda dos créditos MCT.

- Botão Fechar loja com tamanho fixo de44por44pixels e alinhamento no topo, sem esticar com o cabeçalho.
- Seletor do passe com três cards por linha, artes reais das famílias, cópias disponíveis e botões de diminuir/aumentar, além de digitação direta.
- Seleção limitada ao estoque de cada família e ao total de50cartas; atualização do inventário remove escolhas indisponíveis.
- Nova moeda ilustrada de créditos internos MCT no saldo e nos quatro marcos de presença7/14/21/30dias, com destaque para marcos alcançados.
- Custos do passe, bônus de presença, saves, arenas e preços planejados preservados. Compras em reais continuam desativadas.

## 28/10/2026 — v0.6 · Uma arena de cada vez

Resumo: Jornada de arenas em sequência, treino na arena alcançada e acesso direto à próxima batalha.

- Menu Arenas substitui a escolha livre de mapas. Vila Byte, Minas de Cobre e Bosque de Circuitos são alcançados em ordem pelas nove batalhas existentes, três por arena.
- Botão Continuar aponta para a primeira batalha ainda não vencida. Arenas mostram bloqueio, vitórias e possibilidade de repetir batalhas já concluídas.
- Treino acompanha automaticamente a arena alcançada pelo save, ignorando a antiga preferência local de cenário; atributos continuam normalizados.
- Progresso, cartas, evoluções, recursos e recompensas anteriores preservados. Derrotas, empates e partidas automáticas não liberam novas arenas.
- Catálogo de Gold em reais continua somente em prévia; nenhum novo pagamento ou carteira externa habilitado.

## 28/10/2026 — v0.5 · Vila Byte recebe você

Resumo: Loja com passe Sentinela, catálogo de pacotes de Gold em preparação, baú de boas-vindas e sequência de créditos internos MCT.

- Loja com recursos internos do jogo; pacotes de Gold em reais aparecem somente como prévia, com compra desativada.
- Baú de boas-vindas de conteúdo fixo no primeiro save novo da conta:300 Gold,4 Bit Bug,4 Data Mouse,2 Fragmentos de Dados. Correio com resgate único por conta; não ativa o automático.
- Passe de7 dias por5.000 Gold+20 Fragmentos de Dados+50 duplicatas escolhidas explicitamente. Sem renovação automática, recompensas de batalha, missões manuais ou primeira vitória de campanha automática.
- Presença online em30 dias:marcos7/14/21/30 dão5/7/10/15 créditos internos MCT. Falta reinicia a sequência sem apagar créditos já recebidos; Gold e materiais continuam em seu ciclo independente. Sem integração a carteiras externas ou saldo blockchain.
- Prévia de pacotes de Gold com preços revisados aprovados:500 porR$1,49;1.200 porR$2,90;2.500 porR$4,90;5.500 porR$9,90;12.000 porR$19,90. Quantidades e custos de progressão preservados. Botões de compra em reais desativados. Nenhuma integração financeira ou entrega paga declarada concluída.

## 28/10/2026 — v0.4 · Evoluções ganham vida

Resumo: Bit Bug Mk-II e Apex animados na arena; Paladino e Paladina com visual próprio na torre central e na coleção.

- Dois atlas próprios de caminhada, com três poses por direção: Bit Bug Mk-II e Apex. A forma conquistada aparece na coleção e na partida; formas ainda sem atlas continuam no visual-base.
- Paladino e Paladina com retratos aprovados, quatro direções independentes e quatro estados de ataque: repouso, preparo, disparo e recuperação. A torre central usa a especialização já escolhida e a aparência selecionada.
- Armas preservadas na mão direita e escudo na esquerda, sem espelhamento global. Posição do disparo derivada da lâmina de cada vista.
- Treino exibe a evolução e a especialização possuídas, mantendo atributos normalizados. Campanha conserva seus bônus anteriores; a forma é capturada antes da partida.
- Mesmos custos de evolução/especialização, desbloqueios e regras de missões manuais. Sem alteração de formato de save, novos pagamentos ou MCT real. Outras classes, Nexus, bosses e demais famílias não foram ativados neste lote.

## 28/10/2026 — v0.3 · Uma coleção para conquistar

Resumo: Oito famílias iniciais, desbloqueios nas arenas e primeiras artes evoluídas do Bit Bug na coleção.

- Perfis novos recebem a política arenas-v1: Bit Bug, Data Mouse, Code Slime, Pixel Pup, Circuit Hare, Cache Crow, Byte Boar e Socket Crab disponíveis desde o início.
- Vitória manual elegível na fase 3 libera Copper Mole, Fiber Finch, Patch Toad e Logic Lizard; fase 6 libera Kernel Goat, Packet Fox, Buffer Bison e Cache Mantis. Treino e campanha respeitam a coleção. Adversário de campanha limitado ao capítulo jogado.
- Bloqueio na coleção, mão, fila, implantação direta e melhorias/evoluções. Duplicatas recebidas antes da arena ficam guardadas e não burlam desbloqueios.
- Saves legados sem a nova política mantêm as 16 famílias e o progresso anterior. Nada é removido, renumerado ou debitado na migração. A coleção é capturada antes da partida e não muda durante o combate.
- Missão de destaque usa família disponível no início do dia e não muda após liberar uma arena. Objetivos já existentes em saves antigos são mantidos até virar o dia.
- Duas imagens-mestras do Bit Bug aprovadas por Flavio em 28/10/2026, aplicadas à coleção: Mk-II e Apex. O sprite de combate ainda é o da base, com aviso explícito; animações próprias aguardam produção e aprovação.
- Mesmos custos de 20 cartas+500 Gold e 50 cartas+1.500 Gold; automático não gera progresso de campanha ou desbloqueios. Sem novos conteúdos pagos, MCT real, Nexus ou bosses ativos neste pacote.

## 28/10/2026 — v0.2 · Sua arena, seus atalhos

Resumo: OFF/AUTO clicável, nível à esquerda e correio à direita no cabeçalho da arena.

- Indicador OFF/AUTO sempre visível e clicável, compartilhando o estado e a lógica do automático em Ajustes.
- Nível real do jogador calculado do XP salvo, à esquerda, com acesso direto à coleção e ao progresso.
- Correio no extremo direito, com as mesmas regras de login, mensagens e resgate por conta.
- Cabeçalho conferido em320x568,390x844,768x1024,844x390 e1440x900, sem rolagem da batalha. Botões com área mínima de44px; relógio visível também em paisagem.
- Início do ciclo público2 na0.2, mantendo os números técnicos crescentes e os pacotes antigos. Histórico anterior preservado.
- Progresso, regras de batalha e missões manuais preservados; sem novas compras, anúncios ou MCT real.

## 28/10/2026 — v0.16 · A arena em primeiro plano

Resumo: Batalha com mais espaço e menu organizado em Jogo, Coleção e Ajustes.

- Logo, relógio e um único menu no cabeçalho. Conta, correio, versão e recursos organizados no painel lateral.
- Som incorporado à aba Ajustes, com volume, trilha e automático; acompanhamento do áudio continua ativo com o painel fechado.
- Campanha, coleção, classes, MCT, missões e notas continuam disponíveis. Partida pausa com o menu e retoma ao fechar.
- Diálogo com foco, Escape, abas navegáveis, rolagem própria e controles de44px. Cinco tamanhos de tela revisados sem rolagem da batalha.
- Mesmas artes, lógica de combate, elegibilidade das missões e salvamento. Imagens do concorrente serviram apenas como referência de organização.

## 28/10/2026 — v0.15 · A identidade de Crypt Royale

Resumo: Logo aprovada na abertura e no cabeçalho do jogo.

- Wordmark original em dourado, azul e cristal violeta, aprovado pelo usuário, com PNG e alpha preservados. Ícone do Guardião mantido.
- Nome acessível mantido no cabeçalho; imagem dimensionada para não ampliar a barra móvel. Sem alterar regras ou saves.
- Utilitário separado fechar_crypt_royale.bat na raiz do projeto e script PowerShell com seleção restrita e revalidação de identidade antes de fechar. Seleção aprovada em12 cenários, consulta real sem encerrar processos.
- Conferência Play:17 e-mails únicos, incluindo todos os15 do Pulso e os13 reenviados. Problema do convite na conta de serviço depende de verificação da conta/navegador afetado; não atribuído ao APK.
- Logo aprovada não equivale à liberação jurídica do nome: pesquisa preliminar encontrou Crypto Royale; avaliar anterioridades antes do lançamento comercial.

## 28/10/2026 — v0.14 · Correio de Vila Byte e arena na medida

Resumo: Brindes por conta, artes das classes e arena ajustada às telas de celular.

- Caixa de correio com presentes criados por administrador Root no painel5174. Resgate transacional junto do save; recibo único, isolamento entre contas e revisão para evitar sobrescrita entre aparelhos.
- Gold, XP, cartas e Fragmentos de Dados, sem criar diamantes ou MCT reais. Nenhum brinde concedido automaticamente neste lote.
- Guerreiro, Guerreira, Arqueiro e Arqueira ilustrados com as artes já aprovadas. Especializações preservam a aparência base.
- Tela de combate ajustada ao espaço disponível; em telas curtas, conta e recursos ficam no menu. As janelas continuam roláveis e o zoom acessível foi preservado.
- Configuração Android Google atualizada com os certificados de distribuição cadastrados; Flavio confirmou o login normal em28/10/2026.
- iOS: projeto Xcode, Firebase próprio e ZIP de projeto preparado pelo gerador; não confundir com IPA. Conta Apple Developer, Mac, assinatura, Sign in with Apple, exclusão da conta e testes reais pendentes antes da App Store.
- Ícone do Guardião e Baú Fundador aprovados por Flavio em28/10/2026 e aplicados. Ícones e abertura nativa Android/iOS exportados pelo @capacitor/assets; Windows recebeICO próprio, web recebe favicon/manifesto. Campanha dos primeiros100 ainda em preparação; não ativa prêmios, compras ou vantagens VIP.

Empacotamento Windows: prazo de até10 minutos exclusivo para o compilador NSIS, com término por erro/tempo e diagnóstico; demais comandos e assinatura preservados. O primeiro lote0.14 atingiu o prazo fixo de4 minutos sem publicar instaladores.

Validação de fontes:172 testes do jogo e72 do painel aprovados, build web isolado concluído. QA real de correio com contas descartáveis confirmou regras, resgate, retry e segundo dispositivo. Não foi testado em iPhone físico.

## 27/10/2026 — v0.13 · Histórico dentro do jogo

Resumo: Notas das versões pelo número da versão e pelo menu, com histórico estruturado preservado no pacote do beta.

- Botão de versão na barra da conta abre as notas, tanto no celular como no PC. Acesso adicional no menu. O jogo pausa enquanto o histórico está aberto, com fechamento por Escape/botão, foco de teclado e rolagem em telas baixas.
- Histórico estruturado com novidades para o jogador e arquivo completo de notas anteriores acessível sem sair do app. Nenhum save, custo, recompensa ou regra de batalha foi alterado.
- Gerador verifica o registro da versão alvo antes de incrementar e publica notas JSON e manifesto no padrão dist-pacote/v<versão>-notas.json e v<versão>-manifesto.json, além da pasta histórica usada nas versões anteriores. APK, AAB e Windows mantêm a mesma versão.
- A versão0.12 foi liberada em teste interno no Google Play. A0.13 atualiza a mesma faixa/link; produção continua pendente do teste fechado e da revisão. Certificados do App Signing da loja e cliente OAuth Android foram confirmados no Firebase; login no Android físico ainda requer teste do titular.

---

## 27/10/2026 — v0.12 · Compatibilidade com a proteção do Google Play

Resumo: Android mínimo7/API24 para atender à Proteção Automática do Google Play, preservando conta, progresso e abertura do beta.

- O primeiro envio do AAB0.11 foi processado, mas o Console recusou sua versão mínima22 para a Proteção Automática. A versão0.12 passa a exigir Android7/API24, mantendo target API36. A proteção da loja permanece ativada.
- Código Android monotônico novo; pacotes0.11 e notas anteriores preservados. A geração única continua produzindo APK, AAB beta e Windows da mesma cópia congelada. Cadastro por e-mail/Google, save por conta, progresso de visitante e custos atuais de cartas não mudaram.
- A distribuição mínima deixa de incluir Android5.1/6. Não foi afirmada publicação em produção nem teste em Android físico. O resultado do segundo envio deve ser verificado no Console.

---

## 27/10/2026 — v0.11 · Beta, conta e jornada protegida

Resumo: Boas-vindas com o guardião de Vila Byte, cadastro por e-mail/Google, salvamento na conta com recuperação entre aparelhos e AAB beta para Google Play.

- Abertura com o guerreiro já aprovado, quatro passos de orientação e acesso à campanha, treino e cadastro. Guia disponível novamente no menu; arte do concorrente não foi reutilizada.
- Conta própria do Crypt Royale no Firebase: e-mail/senha com recuperação e verificação, Google no navegador, ponte nativa Android e autenticação Windows no navegador do sistema. Os fluxos Google no Android físico/Windows ainda precisam de teste com o titular; cadastrar SHA do App Signing do Google Play depois do primeiro envio, além dos certificados locais já registrados.
- Save completo de Gold, XP, cartas, classes, formas, campanha, missões, check-in e recibos em documento privado da conta. Importação do visitante é explícita no primeiro save; saves de duas contas não são somados. O save de visitante anterior permanece separado.
- Cópia local por conta, revisão em transação remota e estado visível de sincronização. Offline mantém envio pendente; conflito entre aparelhos bloqueia novas ações e preserva a cópia divergente antes de restaurar a conta. Exportação do save e exclusão dos dados do jogo disponíveis. A identidade compartilhada MonsterCrypt não é apagada ao excluir o save do jogo.
- Firebase real validado com contas descartáveis: leitura e gravação próprias, bloqueio de outra conta/visitante/revisão inválida, login e recuperação do save em dois perfis de navegador. Contas e documentos de teste removidos ao final. Regras dos outros aplicativos preservadas integralmente ao acrescentar a coleção do Crypt Royale.
- Android compile/target API36, AGP8.13/Gradle8.14.3, margens para barras do sistema e configuração própria Google. O gerador único passa a produzir APK, AAB beta assinado e instalador Windows com a mesma versão. Só considerar os formatos gerados após a conclusão do manifesto do pacote.
- Política de privacidade e instruções de exclusão incluídas. Sem anúncios, compras, transferência de MCT ou recompensas financeiras neste beta. Protocolo Sentinela VIP é proposta de balanceamento, sem débito ou ativação comercial.
- 161 testes aprovados, interface em320/390/768/1440px sem transbordamento e sem erros de página. npm audit sem vulnerabilidades conhecidas após atualização do gRPC. Não houve teste em Android físico. Google Play ainda depende de criação do app, declarações e envio do AAB; gerar arquivo não publica o jogo.

---

## 27/10/2026 — v0.10 · Token MCT na carteira

Resumo: Token MCT visível na tela inicial, recompensas e menu, com saldo não conectado e estado de integração pendente.

- Cartão MCT no resumo inicial e na carteira das atividades; identificação também na barra móvel e no cabeçalho da coleção. Novo acesso Token MCT pelo menu e pela coleção, com painel de estado.
- Saldo confirmado exibido como — MCT enquanto a carteira real não está integrada. Não se cria saldo fictício/zero presumido, campo local de token, emissão, resgate, compra ou transferência. Gold/XP/cartas/fragmentos, custos de evolução, recompensas e recibos existentes preservados.
- Interface responsiva para os cinco recursos e explicação clara da integração pendente. Não foi produzida nova arte-mestra nem atribuída ao token uma imagem de outro produto.
- Notas antigas preservadas. Testes e geração conjunta registrados no relatório do pacote após a execução real.

---
## 27/10/2026 — v0.9 · Coleção, evoluções por cartas e campanha

Resumo: Carteira na tela inicial, coleção com níveis/evoluções por cartas e Gold, classes com especialização e campanha local de nove fases.

- Carteira e nível do jogador na tela inicial, acesso pelo menu a Coleção/Classes/Campanha e ligação na aba Recompensas da Central de atividades. Coleção lista os 16 monstros, duplicatas disponíveis, níveis, formas, vida/ataque de campanha e filtro Só minhas cartas.
- Melhorias de nível por cartas da mesma família e Gold, com custos crescentes e teto inicial10. Evoluções independentes de XP/nível:20cartas+500Gold para Mk-II;50cartas+1.500Gold para Apex. Os 16 monstros atuais têm três formas canônicas; não foram inventadas formas extras. Nomes verificados no catálogo V10; artes-base permanecem identificadas como provisórias nas formas evoluídas.
- Classes Guerreiro/Guerreira e Arqueiro/Arqueira recebem cartas próprias na campanha. Melhorias de nível e escolha de especialização canônica por10cartas da classe+500Gold. Bônus inicial e custos visíveis; escolha do ramo permanente nesta etapa. Novas aparências/habilidades de especialização ainda pendentes. Regras do RPG Base/Job não são gates deste modo, conforme esclarecimento do Flavio.
- Campanha de nove fases nos três cenários, liberação sequencial por vitória, prévia exata das recompensas, primeira vitória e repetição com recibos únicos. Requer partida manual concluída com ao menos30segundos e uma carta usada. Automático e treino livre não concedem recompensas de campanha. Derrota/empate não liberam fases; melhor marca de estrelas preservada.
- Níveis/formas afetam vida e ataque básico na próxima partida de campanha, com snapshot ao início. Inimigos usam nível anunciado. Treino livre permanece normalizado, com atributos anteriores. Carteira/XP/recibos existentes preservados; gravação mantém backup anterior, sem zerar perfil inválido.
- 153 testes Node passaram. Navegador em320/390/768/1440px confirmou migração, duplo clique sem débito duplicado, melhorias/evoluções/classes persistidas, término de campanha no motor real sob fixture isolada, recompensa única e liberação da próxima fase; zero erros de página. Não houve teste em Android físico. APK/EXE0.9 só são confirmados após o gerador conjunto concluir.

---
## 27/10/2026 — v0.8 · Mapas iniciais, áudio e atacantes de torres

Resumo: Três cenários de treino aprovados, XP/cartas e abas ilustradas, painel de áudio corrigido e Copper Mole/Byte Boar com foco exclusivo nas torres.

- Vila Byte, Minas de Cobre e Bosque de Circuitos disponíveis em Menu de opções → Mapas e fases. Trocar cenário pausa o treino e preserva a partida, recursos, tropas, rotas e atributos. A escolha é lembrada neste aparelho; fases são cenários de treino disponíveis, sem campanha ou desbloqueios.
- Ícones próprios de XP e cartas, com aprovação visual do Flavio, e botões ilustrados para Rotina diária, Semana e eventos e Recompensas. Valores e regras de resgate preservados.
- Controle de áudio mantém botão visível enquanto aberto. Painel abaixo do botão quando há espaço, contido na janela, com rolagem em telas baixas; fecha por Escape, clique fora ou botão. Preferências de volume e trilha mantidas.
- Copper Mole e Byte Boar ignoram tropas inimigas e procuram torres adversárias na sua rota; continuam recebendo dano e respeitando colisões. Custos, vida, dano, recarga, bônus de emergência e primeira investida preservados; cartas identificadas com Só torres.
- 139 testes aprovados, incluindo alvos e troca de mapas sem reinício. Navegador conferido em PC, celular e janela baixa, com imagens carregadas, seleção persistida e sem erro de página. Teste automatizado usa perfil isolado; não equivale a teste em aparelho Android físico.
- Notas e manifestos anteriores preservados em dist-pacote. APK e EXE da v0.8 só são confirmados após o gerador conjunto concluir suas verificações.

---
## 27/10/2026 — Central de atividades ilustrada e defesa azul

Resumo: Central de atividades ilustrada, defesa azul com vistas de costas aprovadas e correções de dependências.

- Central de atividades redesenhada com baú, moedas, presente diário e cristais próprios, aprovados pelo Flavio. Check-in de sete dias com imagens maiores, estados recebido/hoje/bloqueado, destaque dourado do sétimo dia e animação somente após resgate confirmado. Cristais representam Fragmentos de Dados existentes; não foi criada moeda nova.
- Carteira, missões, primeira vitória, semana/eventos, coleção e recibos mantêm regras e valores anteriores. Visual responsivo em 320/390/768px, movimento reduzido, foco preso no diálogo e resgate sem duplicação em clique duplo/recarregamento.
- Arqueira, Arqueiro, Guerreiro e Guerreira azuis usam vistas de costas aprovadas, preservando as vistas frontais rivais e as direções laterais da central. Recortes de corpo separados sem cortar espadas na divisão de colunas; PNGs originais intactos. Flechas partem do arco da vista correspondente, com dano, alcance e recarga preservados.
- Electron44.9.3, Vite8.3.5 e fast-uri3.1.9 corrigem os três alertas conhecidos: npm audit terminou com zero vulnerabilidades conhecidas. Script opcional do electron-winstaller não foi autorizado globalmente; instalador permanece NSIS.
- 132 testes do jogo, sete da prévia e 35 verificações das magias aprovados; build web e interface no navegador conferidos com perfil isolado. APK/EXE desta etapa só são confirmados após a geração conjunta.

---
## 19/10/2026 — Ataques frontais aprovados integrados

Usuário aprovou: EXCELENTE APROVADO!!! Runtime usa4posesfrontais por arqueiro, esquerda feminina/direita masculina; preparo/corda/soltura/recuperação ligados ao relógio real. Ataque continua54dano/1000ms/105alcance, filtros por rota/metade preservados. Primeiro disparo imediato; desenho não aplica dano. 128 testes e build isolado passaram; navegador sem erros, automático de teste desligado. Novas imagens não precisam de outra aprovação. Sem instaladores novos (publicados0.6). Ver docs/ATAQUES_FRONTAIS_INTEGRADOS_2026-10-19.md. Próximo: teste manual do usuário; eventuais ajustes de alvo/vistas conforme feedback.

---
## Arqueiros aprovados integrados — 18/10/2026

Composição v007 aprovada integrada ao jogo local: Arqueira esquerda e Arqueiro direita nas duas equipes, verde/prata nas armaduras/flechas, capas/arcos roxo/rosa e azul. Laterais mais baixas15%, central mais alta15%. Personagens separados das bases; flechas saem do arco nos eventos reais sem alterar dano, alcance ou recarga. Arqueiros usam uma pose cada e recuo no disparo; vistas e animação desenhada completa de arco continuam pendentes. 127 testes e build passaram, navegador sem erros. Instaladores continuam0.6. Ver docs/ARQUEIROS_INTEGRADOS_2026-10-18.md e captura docs/arqueiros-integrados-20261018.png.

---
## Central definida pelo usuário — 18/10/2026

archer-platform-v001.png promovida a CENTRAL e integrada sem deformação, com personagens separados. Variante lateral archer-side-narrow-v001.png criada mais estreita/baixa e aguarda aprovação visual. 125 testes e build passaram. Sem novos instaladores. Ver docs/TORRE_CENTRAL_DEFINIDA_LATERAIS_2026-10-18.md.

## Plataforma compacta e laterais sem canhões — 18/10/2026

Central com estrutura vertical reduzida a62% mantendo largura e personagem; plataforma desceu aproximadamente25px. Bastião ancorado2px acima da sombra da base em vez de junto ao personagem. Canhões removidos do desenho aprovado das quatro laterais; disparos temporariamente partem da montagem da base, sem alterar dano/recarga. Arqueiro/Arqueira e suas evoluções são recomendação para próxima etapa, ainda sem artes nem progressão implementada. 125 testes passaram e build isolado final passou. Captura docs/plataforma-sem-canhoes-20261018.png. Instaladores não gerados.

## Ajustes de arena e menu — 18/10/2026

Operador central movido para menu de três pontinhos, disponível em desktop/celular. Arena móvel ganhou45px de altura disponível. Laterais deslocadas um quadro horizontal de30px para fora (x58/302); três torres azuis desceram28px (guardas y496, central530). Mudança de posição afeta distâncias de combate, mantendo os valores de alcance e filtros por rota/metade. Faixa central e pontes preservadas conforme resposta do usuário. Construções reduzidas para72px central e60px laterais, personagens ampliados75% (base84 contra48). Origem dos projéteis acompanha canhão/espada. Margem rival64px acomoda personagem. Testes passaram; build isolado concluído. Fixtures de teste de rota e anel desacopladas das antigas coordenadas fixas. Captura docs/arena-ajustes-20261018.png. Sem novos instaladores.

---
## Escala ampliada — revisão após feedback

Central96px (2x original), laterais79,2px (1,8x original); personagens preservados, canhões proporcionais. Núcleo rival com deslocamento apenas visual80px para caber na arena. Substitui escala inicial considerada pequena. 125 testes passaram; sem alteração de combate ou novos instaladores. Captura docs/torres-escala-ampliada-20261018.png.

## Escala visual das torres — 18/10/2026

Central +40% (67,2px), laterais +30% (57,2px). Personagens mantêm tamanho anterior; canhões e sombras acompanham as construções. Núcleo rival com deslocamento visual48px para caber no topo, sem mudar posição de combate. Alcance, colisões, dano e regras de rota preservados. 125 testes e build isolado passaram. Captura docs/torres-escala-20261018.png. Ajuste no jogo local, ainda sem novos instaladores.

---
## Alterações locais ainda não empacotadas — 18/10/2026

- Torres: Guardiãs defendem somente sua faixa e todas respeitam a metade defensiva e o alcance. Núcleo mantém cobertura central dentro do alcance. Sem aumento de dano, HP ou alcance. 125 testes do jogo passaram.
- Estúdio de classes: três direções próprias (frente/esquerda/direita), canhões separados e móveis, plataforma ampla e Guerreira metálica com detalhes discretos. Artes v004 aprovadas e integradas ao combate: escolha Guerreiro/Guerreira, poses vinculadas aos disparos reais e canhões independentes. Seleção local persistente; layout ajustado para celular e desktop. Sete testes da prévia passaram.
- Os instaladores publicados continuam v0.6; estes ajustes só chegarão ao Windows/Android após nova geração pelo gerador único.

---
# Manutenção de dependências — 18/10/2026

Auditoria18→13alertas, nenhumcrítico. Atualizados tar,source-map-js epostcss-selector-parser. AdapterCapacitor6/tar7 reproduzívelpósnpmci,testado comextraçãoreal.115testes,JS/CSSaprovadospreservados.13alertasdeferramentascontinuampendentes; ver docs/DEPENDENCIAS_2026-10-18.md.

# Gosma corrosiva do Code Slime — 18/10/2026

Poça dura3s; tropas terrestres inimigas recebem dano-base8/0,5s; sem acúmulo entre poças. Aliados, voadores e torres imunes. Bolhas, brilho verde e número da perda real deHP.115testes passaram.

# Atualização de magias e torres — 18/10/2026

Magias dos16monstros integradas ao combate local com efeitos aprovados. NúcleoOperador e TorreGuardiã receberam disparos/impactos e pulsoBastião. LogicLizard: recorte de fragmentos corrigido.108testes,35checksvisuais. Parâmetros iniciais de balanceamento em docs/MAGIAS_INTEGRADAS.md.

# Notas das Versões — Crypt Royale

## Empacotamento unificado — 17/10/2026

- Gerador único Windows/Android, versão pública curta e incremento único por pacote.
- APK release com assinatura própria e instalador NSIS Windows; identidades exclusivas Crypt Royale.
- Fonte congelada, testes, conferência da versão compilada, conteúdo web/notas comuns e manifesto SHA256.
- Aplicativo Windows com contexto isolado, sandbox e origem própria; smoke test sem tocar no perfil do jogador.
- Publicação dos dois formatos após sucesso conjunto, backups e espelhamento C/G.


## 0.2.0 — Central de Atividades — 17/10/2026

- Missões diárias: três partidas manuais, 1.000 de dano em torres e uma vitória usando a criatura destaque do dia.
- Check-in de sete dias, sem perder o ciclo de Gold/materiais ao faltar; contador consecutivo separado.
- Primeira vitória diária, objetivo semanal e evento Operação Vila Byte com caches de conteúdo conhecido.
- Recursos de teste persistidos no navegador, cópia anterior preservada e resgates únicos. Sem saldo ou distribuição MCT.
- Partidas com automático são inelegíveis, mesmo após desligá-lo; dano considera HP real, sem escudo ou excesso.
- Central pausa o treino local e oferece navegação por teclado; cartas/recibos aparecem em Recompensas.
- Guerreiro/Guerreira adiados. Bosses/Ecos, habilidades e evolução não foram implantados nesta etapa.
- 94 testes e build aprovados; check-in verificado no navegador após recarregar, sem duplicar recebimento.


## Pixel Pup renovado — 02/10/2026

- Carta e caminhada v002 integradas, com12quadros em quatro direções.
- Atributos, escala e duração140ms preservados; versões anteriores mantidas.
- 78 testes e build passaram. Concluída renovação dos quatro primeiros monstros.

## Code Slime renovado — 02/10/2026

- Master v002, carta v002 e spritesheet v002 integrados; 12 poses elásticas nas quatro direções.
- Três bolhas preservadas por pose, quadros isolados. Versões anteriores mantidas.
- Valores de combate, escala e duração150ms preservados. 77 testes e build passaram.

## Data Mouse renovado — 02/10/2026

- Masterv002 aprovado, carta e animação v002 integradas em quatro direções.
- Valores de combate, escala e duração160ms preservados. Versões anteriores mantidas.
- 76testes/build passaram.

## Bit Bug renovado — 02/10/2026

- Masterv002 aprovado, carta v002 e animação v005 integradas em quatro direções.
- Mantidos valores de combate e duração110ms. Versões anteriores preservadas.
- 75testes e build passaram.

## Estabilidade nas batalhas — 02/10/2026

- Tropas limitadas à faixa esquerda/direita definida no posicionamento, até o centro da arena.
- Ataque estabilizado ao entrar no alcance; perfis deixam de procurar posições atrás dos adversários.
- Data Mouse permanece parado mirando o alvo quando pode disparar.
- Mantida separação aprovada.74testes/build passaram.

## Posicionamento das tropas — 02/10/2026

- Separação de30unidades entre centros e formação inicial mais espaçada.
- Reserva de posições ao redor de inimigos e torres, preservando distância dos atiradores.
- Correção de sobreposição limitada por passo, limites da arena e exclusão do centro de torres vivas.
- Alcance mínimo corpo a corpo compatível com espaçamento.72testes/build passaram; precisa avaliação visual em partida.

## Cache Mantis — 02/10/2026

- Carta e caminhada em quatro direções integradas. Catálogo inicial agora contém16cartas.
- Cache Hit pendente, junto à etapa de habilidades ainda não iniciada.
- 68 testes e build passaram.

## Buffer Bison — 02/10/2026

- Carta e caminhada integradas, valores básicos do catálogo, 160ms por quadro.
- Zona de Buffer adiada até concluir os 16 monstros.
- 67 testes e build passaram.

## Packet Fox — 02/10/2026

- Carta e caminhada em quatro direções integradas, valores básicos do catálogo.
- Pacote Fantasma reservado à etapa de habilidades após os 16 monstros.
- 66 testes e build passaram.

## Kernel Goat — 02/10/2026

- Carta e caminhada nas quatro direções integradas; valores básicos do catálogo.
- Kernel Panic pendente. Validação: 65 testes e build passaram.

## Logic Lizard — 02/10/2026

- Integradas carta e caminhada do MC-0034 em quatro direções, com três nós luminosos na cauda.
- Valores básicos conforme catálogo; habilidade Lógica Encadeada permanece pendente.
- Validação: 64 testes e build aprovados.

## 0.2.0 — Circuit Hare — 02/10/2026

- Integrada a animação aprovada do Circuit Hare (MC-0013), com três quadros em cada uma das quatro direções.
- A carta agora exibe a imagem-mestra aprovada do personagem.
- Mantido o fallback visual enquanto a folha de animação carrega e ajustada a barra de vida acima das orelhas.
- O servidor de desenvolvimento ignora os arquivos operacionais do agente, evitando erro de arquivo bloqueado ao iniciar durante uma revisão.

## 0.2.0 — planejamento de conteúdo — 26/09/2026

- Definido o catálogo inicial de 16 cartas, preservando as oito unidades do protótipo e acrescentando oito monstros canônicos.
- Registrados papéis táticos, custos, habilidades, forças, fraquezas, counters e valores provisórios de balanceamento.
- Formalizados os princípios de economia: sem pay-to-win, sem conversão automática de Diamantes em MCT e sem promessas de valorização, renda, recompra ou lucro.
- Definido o uso opcional da Wallet MonsterCrypt e do MCT para compra direta conhecida, cosméticos, edições colecionáveis e taxas transparentes de Marketplace.
- Criado o pacote de prompts visuais para imagem-mestra, folhas de vistas, sprites e arte de carta das 16 unidades.
- Definido um fluxo de produção em lotes e um papel de coordenação e revisão para o Gemini Pro.

## 0.1.0 — 25/09/2026

- Corrigido o pipeline de CSS que misturava Tailwind CSS 3 com o plugin de PostCSS do Tailwind CSS 4 e impedia o build.
- Atualizado o Vite para uma versão sem as vulnerabilidades conhecidas encontradas na auditoria inicial.
- O inicializador agora reconhece uma instância do próprio Crypt Royale já aberta e reutiliza a porta 5179.
- Quando outro programa ocupa a porta 5179, o inicializador escolhe automaticamente uma porta livre entre 5180 e 5199.
- Removida a recompilação forçada do Vite a cada início.
- A cópia automática do Google Drive para o projeto local foi suspensa durante o desenvolvimento para impedir que versões antigas sobrescrevam o código do `C:`.
- Registrada a auditoria inicial do protótipo e sua compatibilidade com o cânone MonsterCrypt V10.
- O protótipo visual virou uma batalha local jogável com cronômetro, energia contínua, mão rotativa de oito cartas, posicionamento, tropas, torres, IA, dano, escudos, placar e condição de vitória.
- O baralho inicial agora usa monstros comuns canônicos de Vila Byte; os Nexus foram reservados para um slot especial para preservar a progressão e a identidade definida no V10.
- Adicionados testes automatizados para posicionamento, gasto de energia, rotação da mão, limite de energia e encerramento da partida.










