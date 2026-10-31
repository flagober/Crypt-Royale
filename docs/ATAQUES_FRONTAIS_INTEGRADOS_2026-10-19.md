# Ataques frontais aprovados e integrados

Usuário: EXCELENTE APROVADO!!! Aprovação da vista frontal de Arqueira e Arqueiro e suas quatro poses.

## Comportamento final

Arqueira na lateral esquerda e Arqueiro na direita, usando poses frontais próprias, sem flip global. O renderizador carrega e isola cada uma das quatro poses por componente alfa, conferindo recortes e pivôs contra tower-art.json. Superfícies separadas impedem fragmentos de imagens vizinhas; preparo acontece apenas no carregamento.

Pronto/Preparar é a pose0. Com alvo válido, nos últimos300ms da recarga passa à pose1 (puxar). No instante real do ataque passa à pose2 (soltar), por100ms; depois pose3 (recuperar), por250ms; retorna à pose0. Primeiro disparo permanece imediato, sem inserir espera. A reprodução não gera dano. Origem visual da flecha calibrada junto ao arco na pose de mira.

O ciclo850ms da prévia foi somente apresentação: a integração usa a recarga1000ms da Guardiã. Dano54, alcance105, defesa por rota e metade defensiva preservados. Central e seleção Guerreiro/Guerreira preservadas. Não há giro360graus nem novas vistas traseiras/laterais nesta integração: direção frontal foi a vista aprovada.

## Validação

128 testes passaram, incluindo limites temporais de soltura/recuperação, preparação condicionada a alvo e recarga, renderização da pose correta e origem da flecha sem alterar dano. Build Vite isolado em .orchestration/build-check-frontal-attacks-20261019 concluído. Partida automática de teste no navegador sem erros de console; automático desligado. Captura docs/ataques-frontais-integrados-20261019.png. Jogo local aberto no navegador lateral para teste manual.

Backup073008-792-integrate-frontal-archer-attacks-1c51f515 verificado. Aprovação/hashes em public/assets/class-tower-candidates/approval-frontal-attacks-20261019.json. Lote espelhado C/G com SHA256. Arquivos-fonte de geração e nomes candidate preservados por rastreabilidade; o registro de aprovação identifica seu uso final. Nenhum novo APK/EXE gerado; instaladores publicados continuam0.6.
