# Auditoria técnica inicial — Crypt Royale

Data: 25/09/2026  
Versão auditada: 0.1.0  
Fonte de trabalho: `C:\Projetos\MonsterCrypt\Crypt-Royale`

## Estado encontrado

O projeto é um protótipo visual React/Vite. A tela representa arena, torres, quatro cartas e uma barra de energia, mas ainda não contém uma partida: não há loop de simulação, unidades, alvo, dano, HP, cronômetro, condição de vitória, IA, matchmaking, persistência ou Firebase.

O build estava quebrado porque o projeto declarava Tailwind CSS 3.4 e executava o plugin PostCSS do Tailwind CSS 4. O inicializador também forçava a otimização do Vite e copiava o conteúdo do Google Drive para cima da fonte local antes de cada execução. A porta 5179 era rígida e uma segunda execução encerrava com erro.

## Compatibilidade com o cânone V10

Os nomes Cyber Cub, Nano Slime, Spark Rat, Circuit Beetle, Data Bat e Byte Cat são canônicos. Porém, todos são Nexus: unidades únicas, geradas por Gênese, elegíveis a NFT e comandadas somente após os gates canônicos. Usá-los como tropas comuns e descartáveis da mão contradiz o papel definido nos MDs V10.

A solução proposta é separar o baralho em:

- cartas de tropa com monstros comuns do CryptDex, começando pelos habitantes de Vila Byte;
- um slot de Nexus vinculado ao Operador, com entrada especial e identidade persistente;
- técnicas do Operador baseadas na classe;
- Crypto Gemas Azul e Vermelha como consumíveis defensivos/de controle, sem tratá-las como feitiços genéricos de dano.

Para o primeiro baralho de treino, Bit Bug, Data Mouse, Code Slime, Pixel Pup, Circuit Hare e Cache Crow fornecem papéis diferentes sem quebrar a singularidade dos Nexus. Cyber Cub pode aparecer no slot Nexus do tutorial como projeção de treino claramente identificada.

## Arquitetura recomendada

1. React controla menus, HUD, deck, perfil, acessibilidade e resultados.
2. A batalha roda em Canvas com passo fixo e dados inteiros/versionados.
3. Regras, cartas e arenas ficam em dados validados, nunca espalhadas no JSX.
4. Firebase Auth e Firestore cuidam de conta, coleção, deck e histórico.
5. Presença e matchmaking podem usar Firebase, mas o combate competitivo precisa de servidor autoritativo. Sincronizar apenas eventos com uma seed não basta para impedir trapaça ou divergência.
6. Cada partida grava versão das regras, seed, entradas, hashes periódicos e resultado validado para replay e auditoria.
7. O Marketplace fica fora do primeiro vertical slice. Antes dele, a prioridade é uma batalha local divertida, determinística e testável.

## Fases de entrega

### Fase 1 — batalha local jogável

- arena Vila Byte;
- oito cartas, mão de quatro e rotação;
- energia contínua;
- posicionamento, rotas, combate, torres, cronômetro e vitória;
- IA local e botão de reinício;
- habilidade ativa de um Operador;
- testes das regras puras.

### Fase 2 — metajogo

- coleção, montagem de deck e progressão;
- sete Operadores/classes e slot Nexus;
- sete arenas regionais;
- tutorial, acessibilidade e replay local.

### Fase 3 — serviços

- Firebase Auth/Firestore;
- inventário e decks persistentes;
- matchmaking, presença e reconexão;
- servidor de partida autoritativo e telemetria.

### Fase 4 — diferencial MonsterCrypt

- habilidades de Operador;
- eventos de Glitch com regras previsíveis e sinalização prévia;
- objetivos laterais e arenas com identidade regional;
- modos cooperativos, Nexus persistente e integração controlada com o RPG.

## Critérios antes da publicação no ecossistema

- build e testes sem erro;
- partida completa em desktop e celular;
- nenhuma dependência de URL externa para arte essencial;
- versão e notas atualizadas;
- configuração Firebase por ambiente, sem segredos no repositório;
- pacote copiado para `G:\Meu Drive\MonsterCrypt\_Ecosystem\_V1.0\Crypt-Royale` somente após validação final.
