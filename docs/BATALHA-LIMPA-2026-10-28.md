# Batalha em primeiro plano — 28/10/2026

Pedido: enxugar a tela, especialmente som e automático, tomando como referência de organização as20 capturas em imagens de testes/concorrente/02.

Aplicado com artes e identidade próprias; nenhuma imagem, personagem ou marca do concorrente foi incorporada ao jogo.

## Interface
- Batalha: logo compacta, relógio, menu único, placar, arena, cartas/energia e habilidade do Bastião. Saiu o conjunto permanente de conta, correio, versão, recursos e ferramentas. Removidas caixas explicativas/reinício permanentes no PC.
- Menu lateral: três abas Jogo, Coleção e Ajustes. Conta, correio, campanha, mapas, missões, classes, recursos, MCT, versão e guia continuam acessíveis.
- Som, volume, trilha e treino automático em Ajustes. Áudio incorporado ao painel em vez de outra caixa flutuante. Componente continua montado quando o menu fecha para manter o acompanhamento da trilha e preferências.
- Automático mantém sua lógica de treino/teste, incluindo a inelegibilidade das missões manuais. Quando ativo, apenas um indicador AUTO discreto fica na batalha.
- Abrir menu pausa a partida; voltar à arena retoma. Diálogo com fundo inerte, foco de teclado, Escape, abas com setas e rolagem interna. Botões com área mínima de44px.
- Recursos e MCT não removidos: ficam na aba Coleção. Nenhuma alteração em custos, prêmios, login, save, tokens ou regras de combate.

## Verificação
-320x568,390x844,768x1024,844x390 e1440x900: sem rolagem horizontal/vertical da batalha, uma ação no cabeçalho, imagens carregadas. Canvas mantém proporção e mesmo mapeamento de entrada.
- Menu aberto: relógio permaneceu1:51 em leituras separadas durante navegação/configuração; retornou normalmente depois.
- Mutar/desmutar e automático ligar/desligar funcionaram; estado preservado ao trocar aba/reabrir. Trilha automática continuou acompanhando o tempo da partida com o menu fechado.
- Coleção/MCT, notas e retorno via Escape exercitados; navegação por seta entre abas e reinício de treino verificados. Sem erros no console. Apenas contexto visitante de QA emlocalhost5189; nenhuma conta real ou save remoto utilizado.
- Capturas: batalha-limpa-mobile-20261028.png, batalha-limpa-desktop-20261028.png, menu-ajustes-20261028.png.
- Smoke Windows atualizado para conferir o número da versão em atributo do contêiner do jogo; não exige a caixa explicativa removida. Continua validando título e imagens carregadas do pacote real.

As notas0.16 foram registradas antes da geração. Não confundir código revisado com instaladores ou publicação; consultar o manifesto do pacote0.16 para a conclusão real.
