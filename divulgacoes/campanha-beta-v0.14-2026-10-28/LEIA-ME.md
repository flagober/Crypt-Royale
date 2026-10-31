# Kit de divulgação — Crypt Royale

**PRÉVIA PARA APROVAÇÃO. Não publicar este kit ainda.** Criado em 28/10/2026 para revisão visual e de campanha. O número 0.14 identifica o lote de trabalho; materiais prontos não equivalem a um jogo publicado nas lojas.

## Entregas

- `imagens/royale-beta-quadrado-1080.png`: 1080 × 1080, chamada Vila Byte.
- `imagens/royale-beta-retrato-1080x1350.png`: 1080 × 1350, cartas/estratégia/evolução.
- `imagens/royale-fundador-story-1080x1920.png`: 1080 × 1920, proposta Baú Fundador.
- `videos/royale-beta-vertical-1080x1920.mp4` e `videos/royale-beta-horizontal-1920x1080.mp4`: 18,6 segundos, 5 cenas, H.264/yuv420p, AAC estéreo 48 kHz, 30 fps, faststart.
- `revisao/`: cenas em tamanho integral, relatórios de dimensões/caixas de texto e decodificação.
- `editaveis/campaign.html`, `copy.md`, `storyboard.json`, `assets.json`: layouts/textos/regras para editar e revisar.
- `fontes/`: cópias dos assets utilizados, sem alterar os originais, e vinheta original WAV.

## Revisão obrigatória

Ícone e baú foram **aprovados por Flavio em28/10/2026**. Os originais e as composições foram preservados. A proposta de 100 jogadores também depende da aprovação das regras, conteúdo, datas e entrega. Todos os criativos trazem selo PRÉVIA/NÃO DIVULGAR; o Baú Fundador diz CAMPANHA EM PREPARAÇÃO/NÃO ATIVA. Não retirar esses avisos nem anunciar promessa de recompensa até a campanha estar configurada, validada e aprovada.

A proposta é um brinde virtual garantido para os primeiros 100 jogadores elegíveis: 500 Gold + 10 cartas (5 Bit Bug + 5 Data Mouse) +3 Fragmentos de Dados. Não é sorteio, investimento, dinheiro ou MCT. Regrasrascunho em `editaveis/copy.md`.

As peças anunciam **beta Android por convite**, campanha contra IA, cartas e evolução. Não anunciam publicação pública no Google Play/App Store/Microsoft Store, iOS pronto, PvP, ligas, ranking ou vantagem financeira. As composições são ilustrações promocionais, não captura de partida ou prova de qualidade em dispositivo físico.

A vinheta é uma pequena composição sintetizada original, sem música da Fórmula 1, Clash Royale ou outras marcas. Não há narração nesta versão. Textos permanecem presentes em cada cena.

## Reproduzir

Requer Chrome e o Playwright já instalado no ambiente. Não precisa instalar dependências neste projeto.

```
node divulgacoes/campanha-beta-v0.14-2026-10-28/orquestracao/render.mjs
node divulgacoes/campanha-beta-v0.14-2026-10-28/orquestracao/video.mjs
```

Os scripts recusam sobrescrever saídas existentes. Antes de regenerar: backup verificado e variantes de nomes, preservando candidatos anteriores. O parâmetro `--reuse-audio` usa o WAV existente durante retomada de encode. O FFmpeg do pacote imageio_ffmpeg já instalado é referenciado em `video.mjs`.

Os vídeos foram decodificados integralmente; o relatório confirma tamanho, codecs, 30 fps, áudio, duração e átomo `moov` antes de `mdat`. PNGs foram renderizados com tamanho exato e elementos textuais conferidos quanto a cortes/overflow. O manifesto SHA-256 cobre os arquivos entregues, exceto o próprio manifesto. Nenhum material foi enviado a redes sociais, YouTube ou lojas.
