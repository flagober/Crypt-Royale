# Classes e Guardiãs com acompanhamento de alvo — candidata v003

Prévia: http://localhost:5179/class-tower-preview.html
VPN: http://100.79.208.33:5179/class-tower-preview.html

O usuário aprovou o conjunto v002, solicitando canhões e personagens voltados ao alvo e uma Guerreira com muito menos rosa. Este lote é uma candidata visual nova, ainda sem integração ao combate ou instaladores.

## Artes

- Central v002 e piso amplo preservados.
- Guardiãs agora têm duas camadas independentes: base fixa PNG 1201×1309 e conjunto mecânico do canhão PNG 1536×1024. Sem personagens nas laterais. Hub de giro [545,512], escala visual 0,085; encaixe na base [610,300]. Projétil acompanha a boca do canhão e só aparece com mira alinhada.
- Guerreiro e Guerreira têm vistas esquerda/direita produzidas separadamente, sem flip global, quatro poses em cada direção. Quatro PNGs 1254×1254 em arranjo 2×2, guarda/preparação/corte/recuperação. Espada na direita e escudo na esquerda anatômicas.
- Guerreira volta ao metal prata/grafite; objetivo visual de 15–20% de detalhes roxos/rosados em frisos e gemas, sem pintar as placas de rosa. Escudo metálico com cor no cristal e nas runas; capa violeta. Percentual é orientação artística, não uma medição exata de pixels.
- Ferramenta image_gen integrada: primeira série em faixa horizontal foi descartada por falta de espaço para as armas. A série final em 2×2 é a utilizada na prévia. Prompts completos em CLASSES_MIRA_PROMPTS_2026-10-18.json. Fontes anteriores preservadas.

## Recorte e metadados

Algumas armas/capas ultrapassam a divisão ideal da grade. Um recorte retangular simples incluiria pedaços do vizinho ou cortaria a espada. O módulo class-tower-frames.js separa os quatro componentes alfa principais, com conectividade de oito vizinhos e limiar alfa 32; preserva cores e alfa dos pixels selecionados e rejeita folhas com poses fundidas/ausentes. Fontes PNG nunca são sobrescritas.

No carregamento, cada pose recebe uma superfície independente. Isso impede que um pedaço da outra pose seja desenhado mesmo quando seus retângulos se sobrepõem. O limiar remove franjas de brilho de baixa opacidade; não é uma reconstrução de anatomia. Há quatro componentes separados por folha, verificados nas imagens finais.

Manifesto v003 registra dimensões, área, retângulo, pivô dos pés, referência da ponta da espada, escala de exibição e pivôs dos canhões. Os personagens mantêm o apoio [280,255] na plataforma. Layout não é o legado de caminhada 140×140; não inserir diretamente no renderizador de tropas.

## Mira e controles

- Canhões giram por ângulo contínuo sobre a base parada, com velocidade limitada, buscando o menor caminho angular (inclusive na passagem -π/π).
- Personagens selecionam uma das duas vistas conforme o lado do alvo; pequena zona morta evita troca incessante no centro. Direção fica estável durante o corte. Não há oito direções ou interpolação 3D.
- Alvo em movimento automático, fixo à esquerda/direita ou controlado pelo mouse/toque no cenário. Linhas de mira opcionais.
- Pausar congela o clipe e o deslocamento automático do alvo. Alterar o alvo manualmente ainda permite que os canhões terminem o giro para inspeção.
- VFX visual congela o destino no instante do corte. Este alvo é demonstrativo: não consulta inimigos da partida, não causa dano, não altera atributos nem recompensas.

## Verificação

- Seis testes passaram: menor caminho de giro, histerese de direção, transformação da boca do canhão, deslocamento do alvo, isolamento sem recolorir e rejeição de poses fundidas.
- node --check passou no módulo da prévia.
- Navegador carregou as artes sem erros registrados. Alvo fixo à esquerda e à direita conferido: personagens mudam a vista; canhões mudam os ângulos; bases ficam fixas. Clique no canvas ativou o modo mouse/toque.
- Screenshot de conferência: docs/classes-mira-20261018.png.
- Sem alterações na versão 0.6 ou nos instaladores. Nenhum arquivo de combate em src foi alterado. Aprovação visual desta candidata é o próximo passo antes da integração.

Backups: 192713-950-class-tower-tracking-v003-4dd16671; 193825-464-sprite-isolation-preview-0769d576; 193959-747-tracking-release-metadata-39d04d18, sob C:\FlavioG\Backups\2026-10-18.
