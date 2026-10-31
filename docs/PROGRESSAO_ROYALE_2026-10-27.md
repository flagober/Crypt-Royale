# Coleção, campanha e evolução por cartas — Crypt Royale

Pedido do Flavio em27/10/2026: mostrar carteira na tela inicial e no menu, cartas recebidas por monstro, melhorias, evoluções, classes e passagem de fases. Esclarecimento posterior do usuário: evolução por cartas, no estilo de progressão do Royale. Esta adaptação tem regras próprias; marcos de nível18/40/60/75 e Base/Job do RPG não são gates deste modo. Não há alteração no RPG MonsterCrypt nem MCT, NFT ou sincronização online.

## Balanceamento inicial de teste

Nível do jogador calculado pelo XP total já existente: nível2 aos100XP, nível3 aos300XP, nível4 aos600XP. Próximo marco =50×nível×(nível+1), teto200. XP não é gasto nas melhorias. Gold, Fragmentos de Dados, duplicatas e recibos anteriores são mantidos.

| Melhoria de nível de monstro/classe | Cartas da mesma família/classe | Gold |
| --- | ---: | ---: |
| 1→2 | 2 | 25 |
| 2→3 | 4 | 50 |
| 3→4 | 6 | 100 |
| 4→5 | 10 | 150 |
| 5→6 | 15 | 250 |
| 6→7 | 20 | 400 |
| 7→8 | 30 | 600 |
| 8→9 | 40 | 900 |
| 9→10 | 50 | 1.300 |

Cada melhoria aumenta vida e ataque básico em4% dos valores-base. Evolução é independente do nível:20duplicatas+500Gold para a primeira;50duplicatas+1.500Gold para a segunda; cada forma concede+12% dos valores-base de vida/ataque. Não muda custo de energia, velocidade, alcance, recarga ou quantidade da tropa. Custos transparentes e validados novamente no momento do gasto; nível/forma esperado impedem cobrança dupla por dois cliques da mesma ação.

As16famílias atuais têm três formas canônicas cada: base,Mk-II,Apex. Nomes e contagens confirmados no catálogoV10 e snapshot em src/game/families.json. Não foram inventadas formas adicionais. Famílias com três/quatro evoluções serão adicionadas com seu elenco, arte e balanceamento próprios quando entrarem no Royale. Imagens das formas e especializações ainda são as artes-base aprovadas, identificadas como provisórias; não se anuncia sprite novo sem produção/aprovação.

Classes integradas: Guerreiro/Guerreira e Arqueiro/Arqueira, com cartas de classe separadas das duplicatas de monstros. Especializar custa10cartas da classe+500Gold, sem gate de XP: Paladino/Gladiador ou Caçador/Franco-Atirador. Escolha de ramo permanente nesta etapa; os dois ramos de cada classe têm o mesmo bônus inicial de10% em vida/ataque da torre correspondente. Habilidades distintas e artes dos ramos ainda pendentes. Masculino/feminino compartilham atributos e progresso.

## Campanha local

9fases, três por cenário: Vila Byte, Minas de Cobre e Bosque de Circuitos. A vitória libera somente a próxima fase; derrota/empate não liberam. Adversários nível1,2,3,4,5,6,7,8,10. Todos os treinos livres continuam disponíveis sem gates de campanha e normalizados no nível1.

Primeira vitória de cada faseN:150+25×NGold,100+20×NXP,4cartas da família anunciada e2cartas de classe; ímpares Guerreiro, pares Arqueiro. Fases3/6/9 acrescentam1Fragmento de Dados. Repetir uma fase:50Gold,50XP,2cartas da família anunciada e1carta da classe da fase. Derrota/empate elegível:10Gold,20XP. A prévia da fase informa a família exata tanto na primeira vitória quanto na repetição. Só resultado manual concluído com30segundos e implantação válida concede; ativar automático torna toda a partida inelegível.

Recibo identificado pela partida impede crédito duplicado. Recompensas de campanha são automáticas no término elegível; missões/check-in continuam com resgate explícito. Não há bônus de campanha por treino livre. Estrelas são coroas da vitória limitadas1–3; replay preserva a melhor marca. Ao concluir a fase9, campanha completa sem criar fase10 fictícia.

Na campanha, níveis/formas são capturados no início: trocar coleção durante a partida só afeta a próxima batalha. Guerreiro melhora torre central; Arqueiro melhora as duas laterais com o mesmo poder. Inimigos usam o nível anunciado e forma-base. Treino livre preserva estatísticas anteriores.

## Dados e validação

Chave existente cryptroyale.activities.v1 preservada. Novo campo opcional progression permite ler perfis anteriores sem zerar recursos, e só grava após ação pelo fluxo transacional já existente. Cópia anterior em .backup antes da gravação. Perfil novo malformado gera erro com dados preservados, nunca substituição silenciosa por zero. Sem alegação de segurança contra edição local ou de sincronização entre dispositivos. Necessário backend autoritativo antes de competição/economia comercial.

Testes cobrem preservação do inventário, migração, falha de gravação, custos/limites, duplo clique, formas por cartas sem gate RPG, classes, liberação sequencial, derrotas/automático/treino inelegíveis, recompensas únicas, snapshot da batalha e normalização de treino. Resultado final das verificações e dos pacotes registrado após execução real.

Verificado:153 testes Node aprovados. .orchestration/tools/verify-progression-20261027.mjs passou:perfil legado375Gold/110XP/2duplicatas preservado; melhoria cobra uma vez mesmo com dois cliques; recarregamento mantém níveis; filtro das cartas obtidas; evolução e especialização persistidas; início de fase no App e vitória controlada no motor real da partida do perfil de teste liberam fase2 e concedem exatamente175Gold/120XP/4BitBug/2cartasGuerreiro uma vez. Layout sem overflow em320/390/768/1440px e zero erros de página. Fixture de vitória é sintética em contexto isolado, sem alterar progresso do navegador real ou afirmar playtest de balanceamento. Capturas docs/progressao-*-20261027.png usam dados de teste.

Antigravity CLI preparou src/progression.css e terminou parcialmente por quota429. Não se trocou conta nem se repetiu automaticamente o pedido. Codex revisou estilos, concluiu src/ProgressionPanel.jsx e demais módulos e executou as verificações. Regras de negócio e integração não foram confiadas ao resultado parcial do CLI.
