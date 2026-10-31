# Evoluções piloto — QA de 28/10/2026

Escopo autorizado: Bit Bug Mk-II e Apex; Paladino e Paladina. Usuário aprovou quatro mestres/vistas e depois determinou aprovação visual contínua. Autorização não representa inspeção individual de todos os quadros pelo usuário.

## Arte e montagem

- 16 vistas neutras (14 produzidas neste lote e duas costas já aprovadas), com RGBA e limites inspecionados.
- Oito tiras de caminhada de três poses, quatro por evolução: duas folhas finais 420×560, células 140×140 e sequência 0,1,2,1 a110ms. Pivô70,128.
- Oito folhas direcionais de quatro ataques para as duas aparências da especialização: dois atlas finais560×560, repouso/preparo/disparo/recuperação. Sem espelhamento global.
- Fontes preservadas em art-source/sprite-sheets/work; metadados e hashes em art-source/sprite-sheets/approved/lote2. DireitaApexv002 corrige corte de antena; costasPaladinav002 corrige direção da lâmina na liberação. Candidatas anteriores preservadas.
- Montagem determinística por componentes conectados, escala uniforme por atlas, quadros únicos, margens e alpha conferidos. Não foram fabricadas poses por duplicação ou deformação de uma imagem neutra.

## Integração e regressões

- Formas possuídas capturadas antes da partida. Treino conserva HP/dano normalizados; campanha mantém a fórmula anterior.
- Especialização existente paladin ativa a arte M/F apenas na central do jogador. Arqueiros, outras especializações e inimigos conservam o visual anterior.
- Ponta do disparo calculada a partir de cada fonte, normalizada no atlas e consumida por towerMuzzle. Quatro direções independentes; espada direita e escudo esquerdo conferidos.
- Carregador de imagens normaliza caminho absoluto relativo à origem, evitando URL iniciada com duas barras para os novos atlas.
- Nenhuma mudança de formato de save, preços, bônus, desbloqueios, login, correio ou regras de elegibilidade.

## Conferência executada

- Suíte190/190 antes do teste de integridade adicional; arquivo focado6/6 após ele. O gerador executará a suíte completa191 antes da distribuição.
- Prévia local isolada usando renderGame, configureCampaign, deployCard e stepGame reais. Mk-II/Apex e Paladino/Paladina trocados por controles, batalha avançada e estados de animação inspecionados. Sem salvar recursos de fixture em contas reais.
- Coleção real renderizada com perfil efêmero: Apex3/3 e retratos Paladino/Paladina. Em390×844, sem overflow horizontal; recursos e exigências conservados.
- Evidências: evolucoes-0.4-quadros-20261028.png e evolucoes-0.4-classes-mobile-20261028.png. Fixtures em .orchestration/qa/evolution-art.html e evolution-classes.html, fora do pacote.

## Limites

Este lote não ativa outras cinco classes, demais evoluções, Nexus ou bosses. Custos atuais permanecem20cartas+500Gold e50cartas+1.500Gold; especialização10cartas+500Gold. Assets de outros ramos ainda provisórios. iOS continua projeto-fonte, sem IPA/AppStore. Windows continua sem certificado Authenticode.

Pacote alvo0.4/ciclo2/build17/técnica0.19.0. Este relatório não confirma publicação; consultar o relatório PACOTE-v0.4 após o gerador e o envio terminarem.
