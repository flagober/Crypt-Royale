# Coleção por arenas —28/10/2026

Fonte C, espelho G. Pedido aprovado: começar com básicos, conquistar famílias em batalhas e desenvolver as evoluções antes de ampliar classes/Nexus/bosses.

Novos perfis têm progression.collectionPolicy=arenas-v1. Oito iniciais: Bit Bug, Data Mouse, Code Slime, Pixel Pup, Circuit Hare, Cache Crow, Byte Boar, Socket Crab. Vitória manual elegível na fase3 libera Copper Mole, Fiber Finch, Patch Toad e Logic Lizard; fase6 libera Kernel Goat, Packet Fox, Buffer Bison e Cache Mantis. Desbloqueio deriva dos marcos persistidos da campanha; não depende do saldo consumível de duplicatas. Não há custo para desbloquear famílias.

Mão/fila/implantação e melhorias/evoluções usam a mesma regra. Treino comum também respeita a coleção; createGame sem perfil continua disponível apenas aos testes do motor. Campanha normaliza inimigo ao capítulo, congelando coleção e atributos antes da partida. Abertura de mapa de treino, derrota, empate, resultado com carta bloqueada ou uso do automático não liberam famílias. Treino manual pode avançar atividades; só vitória de campanha libera arena.

Cartas de missão/correio recebidas antes do desbloqueio ficam guardadas. Missão de destaque é escolhida entre disponíveis e fixada para o dia; não troca prêmio ao liberar arena. Perfil legado sem política preserva acesso total e saldos/evoluções/recibos/classes; esquema desconhecido é rejeitado sem reset. Não reimportar G antigo.

Economia do beta segue validada no cliente e sincronizada por revisão, sem PvP pago/MCT real. Isto não substitui uma autoridade de resultados no servidor para um lançamento competitivo/comercial.

Primeiras artes evoluídas aprovadas: Bit Bug Mk-II e Apex. Coleção usa as imagens-mestras, mas combate ainda identifica sprite-base provisório. Nenhuma animação nova é declarada concluída sem vistas, quadros, QA e aprovação visual.

Antigravity gemini-3.8-flash-high acionado em plan para revisão restrita. Retornou SUCCESS com resposta vazia e RunCommand recusado; não foi contabilizado como revisão útil. Implementação e testes assumidos pelo Codex; sem ampliar permissões.

QA final da fonte:185 testes passaram, incluindo8+4+4, saves legados, duplicatas bloqueadas sem débito, mão/fila/implantação de ambas equipes, replay de arena com IA restrita, congelamento de acesso, derrota/automático, destaque diário estável e artes/custos de evolução. Prévia local com fixture descartável mostrou12/16 na fase3 e imagem Mk-II, cinco viewports320x568,390x844,768x1024,844x390,1440x900 sem overflow horizontal e sem imagem quebrada. Fixture não escreve saves reais; erro inicial de import React do harness corrigido antes da inspeção. Não houve teste físico Android deste lote.
