# Cabeçalho rápido —28/10/2026

Pedido: OFF/AUTO clicável, nível do jogador à esquerda e correio à direita, mantendo a batalha limpa.

Implementação: nível derivado do XP do save; clique abre a coleção. O botão OFF/AUTO usa toggleAutomatic já existente, sem mudar elegibilidade de missões. Correio abre MailboxPanel já existente e exige conta para consultar os presentes. Menu, logo e relógio preservados.

QA real em prévia local isolada: OFF→AUTO→OFF, correspondência com Ajustes, abertura da coleção pelo nível e correio com orientação de login para visitante. Cinco viewports320x568,390x844,768x1024,844x390,1440x900 sem overflow do documento; botões44px ou maiores. Relógio visível na paisagem; nenhum erro de console observado.

Evidências: cabecalho-rapido-mobile-20261028.png e cabecalho-rapido-correio-20261028.png. Reutiliza artes aprovadas. Novo pacote previsto: ciclo2, versão pública0.2, build15, versão técnica0.17.0. Confirmar geração/publicação no relatório do pacote; este documento descreve validação da fonte.
