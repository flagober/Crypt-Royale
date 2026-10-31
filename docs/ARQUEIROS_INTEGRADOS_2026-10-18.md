# Arqueiros e composição aprovada integrados

Usuário aprovou three-towers-heroes-preview-v007.png. Aplicado ao jogo local, sem geração de novos instaladores.

## Entrega

- Central com plataforma aprovada archer-platform-v001.png, altura visual15% maior. Guerreiro/Guerreira existentes continuam selecionáveis e animados, preservando preferência local.
- Laterais com archer-side-narrow-v001.png e altura visual reduzida15%. Arqueira à esquerda e Arqueiro à direita nas duas equipes, sem canhões.
- Personagens isolados em PNGs transparentes independentes, usando a paleta aprovada: armadura verde/prata, flecha verde, capa/arco feminino roxo/rosa e masculino azul. Pivôs e pontas dos arcos declarados em tower-art.json.
- Disparo de flecha verde acompanha cada evento real de ataque da Guardiã, saindo do arco; dano54 e recarga1000ms preservados. Alcance105, filtro por rota e metade defensiva preservados. Motor aplica dano no instante original; viagem da flecha é visual.
- Nesta entrega os arqueiros usam uma pose aprovada cada, voltados para dentro, com pequeno recuo visual no disparo (respeita movimento reduzido). Não há novas vistas ou quadros desenhados de puxar/soltar o arco, nem giro anatômico para todos os alvos. A trajetória visual acompanha o alvo real. Estas animações completas continuam pendentes e não são simuladas por espelhamento global.

## Verificação

127 testes passaram, incluindo posicionamento feminino/esquerda e masculino/direita, origem da flecha, preservação de dano/recarga e ausência de dano no desenho do efeito. Build Vite isolado concluído. Partida automática de teste sem erros no console, automático desligado ao concluir; sem recompensas elegíveis. Captura docs/arqueiros-integrados-20261018.png.

Backup prévio231852-228-integrate-approved-archers-f110813e verificado. Assets anteriores preservados. Lote espelhado C/G por SHA256.

## Separação técnica dos personagens

image_gen integrada foi usada para isolamento a partir da composição aprovada. Não são novos spritesheets. Prompts:

### Arqueira

Technical background extraction ONLY from approved reference. Isolate exactly the FEMALE ARCHER on VIEWER LEFT into one full-body transparent PNG. Preserve her exact approved face, proportions, purple/pink high ponytail with tiny green streaks, green/silver armor, violet/rose cape, violet graphite bow with GREEN nocked arrow, correct arm pose aiming RIGHT. No redesign, no new pose. Include full hair/cape/bow/arrow/boots with 10 percent transparent margin. Remove every pixel of tower/platform/background/other characters, no floor or shadow. Full body centered. Genuine transparency. Keep approved mixed palette, not all-purple armor. This is production cutout of existing approved character, not new concept. Exactly one female.

### Arqueiro

Technical background extraction ONLY from approved reference. Isolate exactly the MALE ARCHER on VIEWER RIGHT into one full-body transparent PNG. Preserve his exact approved face, proportions, short swept two-tone BLUE hair with tiny green streaks, green/silver armor, navy/azure cape, silver/blue bow with GREEN nocked arrow, correct two-arm pose aiming LEFT. Anatomical left hand holds bow aiming left, right hand draws string near cheek. No redesign, no new pose, do not mirror. Include full hair/cape/bow/arrow/boots with 10 percent transparent margin. Remove every pixel of tower/platform/background/other characters, no floor/shadow. Full body centered. Genuine transparency. Keep approved mixed palette, not all-blue armor. This is production cutout of approved existing character, not new concept. Exactly one male.
