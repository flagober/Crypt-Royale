> Atualização posterior: proposta aprovada pelo Flavio e implementada nas fontes da **0.8**, conforme PROGRESSAO-NIVEIS-v0.8-2026-10-29.md. O texto abaixo preserva a auditoria histórica da 0.7. Nexus/bosses e tiers III–V seguem em preparação, sem conteúdo jogável novo.

# Auditoria de evolução e proposta de progressão — 29/10/2026

Status: comparação concluída e proposta registrada. **Nenhuma regra da 0.7 foi alterada por este documento.** A loja e os ajustes dos prints já foram concluídos e publicados no teste interno como 20 (0.7).

## Resposta sobre a versão atual

A 0.7 conserva as famílias, formas e ramificações canônicas já integradas, mas usa a adaptação por cartas aprovada para o Royale em 27/10. Ela NÃO implementa integralmente o sistema Base/Job do RPG.

- Jogador: XP total e nível de 1 a 200; não existem ainda trilhas independentes Base XP e Job XP.
- Monstros e reforços de classe: níveis de 1 a 10 comprados com cartas e Gold.
- Monstros: primeira evolução por 20 duplicatas + 500 Gold; segunda por 50 + 1.500 Gold. Atualmente podem ocorrer no nível 1, se a família estiver liberada e houver recursos.
- Classes: somente Guerreiro/Guerreira e Arqueiro/Arqueira estão integrados. Especialização custa 10 cartas de classe + 500 Gold, sem requisito Base/Job. A escolha e os bônus já obtidos ficam salvos.
- As 16 famílias iniciais têm **três formas: base, Mk-II e Apex**, portanto duas mudanças de forma. Isso não significa três evoluções além da base.
- Nexus e bosses não estão implementados como conteúdo jogável. Os pilotos planejados são Cyber Cub/Nano Slime e RAM Ram/Buffer Golem.

Evidências: `src/game/progression.js` (LEVEL_CAP, EVOLUTION_COSTS, SPECIALIZATION_COST, evolveMonster, specializeClass), `src/game/families.json`, `docs/PROGRESSAO_ROYALE_2026-10-27.md` e `docs/PRODUCAO-CONTEUDO-2026-10-28.md`.

## O que os documentos canônicos determinam

Fontes lidas no acervo `G:\Meu Drive\MonsterCrypt_Ecosystem_V1.0\MDs V10`, somente como referência; nenhum documento do acervo foi modificado ou importado sobre o projeto local.

### Classes — documentos 16 e 72

| Estágio | Base mínimo | Job mínimo |
| --- | ---: | ---: |
| Classe-base | 1 | 1 |
| Especialização | 40 | 20 |
| Ascensão | 80 | 40 |
| Despertar | 130 | 70 |
| Transcendência | 200 | 100 |

Base e Job têm XP independente; o teto canônico é Base 200 / Job 120. Os marcos 18/40/60/75 NÃO são os marcos de evolução das classes. Sete classes-base, dois ramos e cinco tiers, mantendo o ramo escolhido.

Documentos: `16_BIBLIA_CLASSES_COMPLETA_V10.md`, `72_PROGRESSAO_BASE_JOB_ATRIBUTOS_SKILLS_V10.md`.

### Monstros — documento 05

Forma inicial → primeira evolução no nível 18; segunda no 40; terceira no 60; quarta no 75, conforme a quantidade de formas da família. Exige também vínculo, material regional e feito. A maioria termina na segunda evolução. Este é o sistema do RPG; o Royale publicado adotou cartas/Gold por pedido posterior do usuário.

Documento: `05_SPAWN_CAPTURA_EVOLUCAO_V10.md`.

### Nexus — documentos 17, 41, 16 e 72

Forma I nasce no nível 1; Forma II no nível próprio do Nexus 20; Forma III no 45. Vínculo mínimo 30/70 e missão regional. Não é capturável nem uma duplicata descartável de carta. Um slot ativo; outros slots são presets, não multiplicação automática de unidades simultâneas.

Há uma divergência real de acesso: documentos 14/17/41 dizem Tier III, Base 80/Job 40 para Domar/uso; documentos 16/72 permitem a missão Domar Nexus no Tier II, Base 40/Job 20 e mantêm Gênese/Incubadora em 80/40. Não anunciar esses textos como se fossem idênticos. A evolução própria 20/45 é consistente.

### Bosses — documentos 05, 18 e 03

Bosses **não evoluem e não são capturáveis**. A progressão é de dificuldade do encontro e de registro por Eco, com fases e habilidades próprias. RAM Ram e Buffer Golem são pilotos canônicos de R1 com referência de nível 15. O catálogo não autoriza transformá-los em tropas comuns ou em Nexus.

## Proposta de equilíbrio para o Royale

Os números abaixo são uma proposta de implementação e playtest; não foram colocados na versão publicada.

### Personagens

Seguir os marcos Base/Job do documento para as mudanças de classe. Separar o nível do jogador, o Job da classe e o reforço por cartas; não apresentar o reforço de torre de 1–10 como se fosse o Base/Job completo. Introduzir os novos campos por migração aditiva, sem zerar o XP existente. Não converter Gold ou MCT em XP automaticamente.

Especializações já conquistadas ficam preservadas. Novos gates não removem Paladino/Paladina ou outra escolha existente, nem debitam novamente cartas/Gold. Tiers avançados continuam identificados como futuros enquanto não houver arte, regras e conteúdo revisados. Antes de liberar o novo Job, publicar a curva de XP e verificar seu tempo por batalhas e missões elegíveis; não duplicar o XP atual silenciosamente em duas trilhas.

### Monstros

Manter o sistema por cartas aprovado para este jogo e os custos atuais. Para impedir formas finais no primeiro nível, a proposta é um sistema híbrido simples no teto atual:

| Mudança | Nível do próprio monstro | Duplicatas | Gold |
| --- | ---: | ---: | ---: |
| Base → Mk-II | 6 | 20 | 500 |
| Mk-II → Apex | 10 | 50 | 1.500 |

Níveis 6/10 são uma adaptação proposta do Royale, NÃO os números do documento do RPG. Cada família continua com sua quantidade e nomes canônicos; famílias futuras com quatro/cinco formas precisam de uma curva própria, sem inventar novas formas para estas 16.

O ganho de atributos atual (+4% por reforço, +12% por forma sobre a base) é o ponto de partida para testes, sem aumentar custo de energia ou quantidade da tropa. Evoluções já salvas permanecem válidas, mesmo abaixo do novo mínimo. Simular confrontos e medir vitórias antes de afirmar que a curva ficou balanceada.

### Nexus

Preservar o nível próprio 20/45 e vínculo 30/70, um ativo por equipe e entrada especial. Recomendação de conciliação para avaliação: missão/aptidão Domar no Base 40/Job 20, seguindo 16/72; Gênese e Incubadora no Base 80/Job 40, seguindo o requisito de criação. Registrar essa resolução antes de ativar o acesso, pois 14/17 divergem. Não ativar mint, NFTs, integração a carteira ou taxas MCT nesta fase: o usuário adiou carteiras externas e não autorizou uma nova economia on-chain.

### Bosses

- RAM Ram: primeiro desafio de boss após concluir as três arenas iniciais e atingir nível 15 do jogador. Introduz carga telegrafada e quebra de formação.
- Buffer Golem: mesmo mínimo de nível 15, após vencer RAM Ram na dificuldade normal; foco em zonas de perigo e posicionamento, sem exigir nível maior apenas para aumentar HP.
- Dificuldades Normal → Veterano → Heroico por vitórias no grau anterior. Isso é dificuldade de encontro, não evolução da criatura.
- Até três fases: início didático, combinação de mecânicas com 60% de vida e enrage suave com 30%. Animação/área de perigo legíveis, sem dano inevitável que obrigue uma compra.
- Loot fixo e transparente de recursos internos; primeira vitória por dificuldade gera recibo único. Repetições não produzem recompensa ilimitada nem MCT real. Valores de HP, dano e loot somente após um protótipo e playtest; não afirmar equilíbrio a partir do documento.

## Próxima implementação

Esta auditoria prepara a decisão da próxima versão; não altera saves, gates, compras ou conteúdo ativo. A mudança Base/Job de classes exige migração e uma regra de XP definida. Nexus exige conciliar a divergência de acesso. Não lançar um gate de nível 40 em uma trilha que só aceita nível 10, nem afirmar que os cinco tiers já estão no APK.
