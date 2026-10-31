# Crypt Royale — beta e próximos módulos

27/10/2026 · Fonte C:\MonsterCrypt_Ecosystem_V1.0\Crypt-Royale; espelho G homônimo.

## Comparação honesta

Implementado: treino contra IA de até3 minutos, 3 cenários, campanha própria com9 desafios sequenciais,16 famílias com3 formas, classes, níveis1–10, coleção, missões, check-in e carteira. MCT é somente indicação de integração pendente.

Ainda não implementado: PvP entre jogadores, pareamento, troféus, arenas competitivas desbloqueadas por troféus, ligas, temporadas, clãs e classificação validada pelo servidor. Não exibir campanha como se fosse ranking humano. A campanha pode coexistir com arenas; não é necessário descartá-la.

Os níveis das cartas atuais pedem2/4/6/10/15/20/30/40/50 cópias e Gold. As formas pedem20 e50 cópias, respectivamente. São custos de teste; não equivalem à economia do Clash Royale. Na tabela oficial da Supercell, cartas comuns de alto nível exigem milhares de cópias; evolução usa fragmentos próprios. Proposta futura de curva de níveis:2/4/10/20/40/80/150/300/500, com recompensas revisadas em conjunto. Não aplicar aumento retroativo nem remover melhorias já conquistadas sem decisão do Flavio e teste de ritmo de progressão.

Referências: https://supercell.com/en/games/clashroyale/blog/news/coming-in-the-next-update/ e https://support.clashroyale.com/hc/en-us/articles/49484890885531-Evolution-Shards

## Abertura

Oito capturas do concorrente foram analisadas na pasta imagens de testes/concorrente: carregamento com personagens, idade, privacidade e tutorial guiado por personagem. Nossa abertura reaproveita a pose frontal já aprovada do guerreiro de Vila Byte, sem copiar rei, logo ou mapas alheios. Quatro passos explicam cartas, energia, torres e salvamento. O guia é informativo; não alegar tutorial completo com validação de cada comando do jogador.

## Protocolo Sentinela — proposta, sem cobrança ativada

- Passe de7 dias:5000 Gold +20 Fragmentos de Dados +50 cartas repetidas escolhidas explicitamente. Todos os custos juntos; não são alternativas. Sem renovação automática.
- PvE em arenas já vencidas; filas de até5 partidas, escolha de estratégia e relatório da sessão; parada manual sempre disponível. Sem PvP, troféus, classificação, avanço da primeira vitória ou recompensa MCT.
- Recompensas de repetição, se autorizadas futuramente, precisam de orçamento diário e rendimento menor que o manual para evitar um ciclo infinito que pague o próprio passe. Sugestão para ensaio de balanceamento:25% do Gold/XP manual, teto diário proposto250 Gold/250XP, sem cartas/fragmentos automáticos. Esses limites ainda não estão implementados nem foram aprovados.
- No beta atual o botão automático permanece ferramenta de treino identificada como teste, sem recompensa ou progresso de campanha. Não confundir esse botão com VIP comercial concluído.
- Não há preço em reais definido. Antes de vender Gold ou VIP na Play Store, integrar Google Play Billing, validação de recibos e direitos no servidor. O save de beta, ainda originado pelo cliente, não é autoridade antifraude para economia paga, ranking ou MCT.

## Conta e conservação

Firebase Authentication existente do projeto monstercrypt-core; apps próprios Crypt Royale Web e Android criados. Coleção cryptroyale_saves/{uid} com um save JSON completo, revisão monotônica e carimbo do servidor. Acesso individual; listagem vedada; sem mudanças nas permissões dos outros aplicativos.

Entrar em conta existente recupera o save dessa conta; nunca soma o visitante. Conta sem save oferece levar o visitante ou começar outra jornada. Cada ação guarda cópia anterior local e envia o checkpoint inteiro. Offline conserva pendência; próximo acesso compara revisão antes de enviar. Divergência exige restauração explícita com cópia local preservada. Uma partida reinicia na troca de conta para não creditar resultados ao jogador errado. A partida em andamento não é retomada entre aparelhos; seu resultado só entra no save ao terminar.

Arquivos privados de assinatura/sessões permanecem somente no C. Arquivos públicos de configuração Firebase não contêm chave privada. Exclusão do save não elimina identidade de acesso compartilhada por outros aplicativos; a política esclarece o escopo.

## Testes realizados

-161 testes Node incluindo oito cenários de persistência/offline/conflito, sem alterar saves reais.
-Firebase real: duas contas QA temporárias, autorização negativa entre UIDs, bloqueio de acesso sem login, bloqueio de salto de revisão; login e recuperação em dois perfis isolados de navegador. Contas/documentos removidos ao final.
-Larguras320/390/768/1440 sem transbordamento; abertura e conta inspecionadas visualmente. Sem teste em Android físico. Google nativo/Windows precisam de login real do titular para confirmação de ponta a ponta.
-npm audit:zero vulnerabilidades conhecidas; gRPC atualizado para1.13.6 por override compatível de major.
-Durante a prévia houve compilação direta antes do backup específico do índice web. O índice estável0.10 foi recuperado e verificado a partir da cópia congelada já preservada; instaladores0.10 e seus manifestos permaneceram intactos. Novas prévias devem usar diretório isolado.

## Google Play

Conta de desenvolvedor flagober aberta no Console. Preparar Crypt Royale, jogo gratuito,pt-BR,pacote com.monstercrypt.cryptroyale. Declarar requisitos legais apenas com confirmação específica para este app. A autorização anterior de Pulso não foi reaproveitada como aceite do Crypt Royale.

Beta inicial recomendado em teste interno. Teste fechado e aprovação de acesso à produção são etapas próprias do jogo, quando exigidas pelo Console; teste interno do Pulso não as substitui. API36, AAB assinado, política e exclusão de dados são preparados neste lote. Os certificados de assinatura distribuídos pelo Play precisam ser adicionados ao Firebase antes de prometer Google Login no pacote instalado pela loja.

Resultado:0.11 foi compilada e preservada; seu primeiro AAB foi recusado pelo requisito minSDK24 da Proteção Automática. A correção0.12/build10 foi compilada em APK/AAB/Windows, verificada e espelhada. Em27/10/2026 às19:51 de São Paulo, o Console confirmou a versão0.12 disponível para testadores internos, faixa ativa. A conta principal do desenvolvedor é o primeiro integrante da lista própria Crypt Royale — Beta interno; a lista do Pulso não foi compartilhada automaticamente.

App no Console:4972181214995920647. Link oficial de teste: https://play.google.com/apps/internaltest/4701495716764622459 . Produção ainda depende da configuração da loja, teste fechado com12 participantes por14 dias e aprovação do Google. Não confundir teste interno com publicação pública.

Site/política/exclusão publicados em https://monstercrypt-royale.web.app . A atualização final0.13/build11 foi liberada na mesma faixa às20:19 de São Paulo, com histórico dentro do jogo e notas/manifestos JSON no padrão combinado. Release-info remoto confirmou0.13. Oito certificados estão cadastrados no Firebase: upload local, assinatura atual da loja e variantes clássica/pós-quântica de compatibilidade. A configuração remota confirmou os clientes OAuth Android correspondentes. Isso prepara o login; não substitui teste em aparelho físico. No navegador oficial, o popup Google e a escolha de conta foram abertos; a automação não concluiu a seleção por indisponibilidade de entrada nessa janela. Nenhum save real foi criado ou sobrescrito nesse teste.

Para migrar um APK manual já instalado, usar primeiro o APK0.13 de mesma assinatura, entrar e levar o visitante à conta, conferir sincronização, então instalar pela loja e entrar nessa mesma conta. A assinatura gerenciada pela loja é diferente. Guia em COMO_TESTAR_BETA.md e evidência em PACOTE-v0.13-2026-10-27.md.

O automático VIP continua proposta, sem venda, débito, expiração ou novas recompensas implementadas. O botão automático atual é treino sem recompensas. Arenas competitivas/PvP/ligas continuam pendentes.
