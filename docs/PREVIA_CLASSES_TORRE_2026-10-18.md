# Classes sobre a torre — candidata v001

Status: prévia para aprovação visual. Não integrada ao combate nem aos instaladores v0.6.

Prévia: http://localhost:5179/class-tower-preview.html
VPN: http://100.79.208.33:5179/class-tower-preview.html

## Entrega

- Torre vazia independente: PNG RGBA 1202×1309.
- Guerreiro e Guerreira: dois PNGs RGBA 2172×724, quatro células de 543×724 cada, uma vista de três quartos frontal.
- Guarda, preparação, corte e recuperação. A recuperação gerada se aproxima da guarda; o movimento é um estudo com quatro poses, não um ciclo expandido de oito quadros.
- Animação 2400 ms: guarda 0–649; preparação 650–999; corte 1000–1199; recuperação 1200–1559; guarda 1560–2399.
- Prévia canvas separa torre e personagem. Pivôs individuais dos pés registrados no manifesto; apoio comum [280,247] em canvas 560×600, escala 0,30. Nenhum flip global.
- Projétil visual no instante de corte; não cria dano, estado de partida ou recompensas.
- Pausa, reinício, avanço de pose, controle do instante, velocidade, três fundos, alternância do efeito e guia dos pés. Respeita movimento reduzido ao iniciar pausada.

## Referências e produção

Ferramenta: image_gen integrada. Referências fornecidas pelo usuário: `imagens de testes/torre 2.jpg` (torre e Guerreiro) e `torre 4 f.jpg` (Guerreira azul/prata). Originais preservados. Novas artes são candidatas; não substituem mestres aprovados anteriores de classes.

Prompts de produção:

1. Torre: usar torre 2 como referência; gerar somente torre vazia isolada, remover Guerreiro e fundo, preservar armadura grafite, núcleo ciano, detalhes laranja/violeta e plataforma circular, base inteira, vista frontal de três quartos, sem texto/logotipo/partículas externas, alfa transparente real.
2. Guerreiro: somente personagem de torre 2; faixa horizontal de quatro células igualmente espaçadas: guarda, espada preparada atrás do ombro direito, corte diagonal e retorno à guarda. Mesma câmera e botas apoiadas, cabelo castanho com mecha branca, lenço azul, armadura prata/ciano, espada direita e escudo esquerdo anatômicos. Corpo inteiro por célula, sem trilhas pintadas, texto ou fundo; proporções e apoio consistentes.
3. Guerreira: mesmo contrato de quatro poses usando torre 4 f como referência; cabelos longos prateados, tiara alada com gema ciano, capa azul, armadura prata/ciano, espada direita e escudo esquerdo anatômicos; sem torre, fundo, texto, espelhamento ou trilhas pintadas.

## Revisão e limites

- Alfa real confirmado (32bpp ARGB, canto alfa zero), dimensões verificadas e JS passou por `node --check`.
- HTTP 200 e navegador carregou as três artes; pausa, reinício, preparação aos 650 ms e corte aos 1000 ms conferidos na interface.
- Conferência visual: espada direita, escudo esquerdo, torre vazia, pés sobre a plataforma. Existe variação de cabelo/capa e abertura das pernas entre poses; avaliar fluidez em reprodução antes de aprovar.
- Esta faixa não usa o contrato legado de caminhada 140×140. Não inserir diretamente no renderizador de tropas.
- Quatro direções, ataque de campo, seleção de classe/arma, Arqueiro/Arqueira e balanceamento não foram implementados neste lote.
- Nenhuma regra de combate, habilidade existente, versão ou instalador foi alterado.

Backup de caminhos novos: `C:\FlavioG\Backups\2026-10-18\190329-877-class-tower-preview-5a1a8ab0`.
Backup do ajuste de âncora do efeito: `C:\FlavioG\Backups\2026-10-18\190552-517-class-tower-release-anchor-d49262da`.

Próximo passo após aprovação visual: refinar transições e produzir as demais vistas mantendo a anatomia, depois integrar seleção e sincronização com eventos reais de ataque.
