# Classes e torres — integração aprovada em 18/10/2026

A aprovação do conjunto v004 foi aplicada ao jogo local em http://localhost:5179/.

## Comportamento

- Operador central: escolha Guerreiro/Guerreira, salva localmente por instalação. Troca cosmética, sem alterar HP, dano, alcance ou recarga. Rival usa Guerreira por padrão.
- Três vistas próprias: frente, esquerda e direita. Não há vista traseira nesta entrega nem espelhamento global de espada/escudo.
- Guarda, preparação, golpe e recuperação acompanham o relógio do motor. Dano permanece no evento real do disparo; animação não aplica dano adicional. Primeiro disparo mantém resposta imediata; preparação aparece antes das recargas seguintes.
- Guardiãs: somente base e canhão, com rotação independente em direção ao alvo. Projéteis saem da boca do canhão; disparos centrais saem da espada.
- Cada Guardiã respeita sua faixa (esquerda x<180; direita x>180), alcance105 e metade defensiva. Linha central exata pertence ao Núcleo, alcance125. Dano54/72 e recargas1000/850ms preservados.

## Implementação

Assets aprovados e hashes em public/assets/class-tower-candidates/approval-20261018.json. Manifesto v004 aprovado corresponde a src/game/tower-art.json. As seis folhas são carregadas uma vez, separadas em componentes alfa e conferidas contra os recortes aprovados. Cada pose tem superfície própria e pivô explícito, impedindo fragmentos vizinhos. Falha de carregamento informa o usuário e mantém desenho anterior disponível.

Módulos tower-animation, tower-assets e tower-render separam relógio, preparação e desenho. Deslocamento visual de24px no Núcleo rival mantém a arte no topo da arena sem mudar coordenadas de combate. Mobile ajusta altura da arena; desktop posiciona cabeçalho em linha inteira.

## Validação

125 testes do jogo passaram, incluindo disparo único/recarga/poses, preservação de atributos e renderização de classes/canhões. Sete testes da prévia já passaram. Build Vite final isolado em .orchestration/build-check-integrated-final-20261018-2030 concluído. Seleção Guerreira persistiu após recarregamento; partida automática de teste sem erros no console e sem elegibilidade a recompensas. Captura: classes-torres-no-jogo-20261018.png.

Backup preventivo verificado antes das alterações. Lote espelhado C → G com SHA256. Instaladores publicados permanecem v0.6; nenhuma geração APK/EXE foi feita nesta etapa. Próxima geração usa o gerador único, com incremento automático.
