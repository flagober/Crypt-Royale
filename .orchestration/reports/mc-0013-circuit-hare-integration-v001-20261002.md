# Circuit Hare — integração concluída em 02/10/2026

O usuário aprovou explicitamente a fonte das animações. A fonte foi preservada e exportada para uma folha compatível com o renderizador, sem repintar ou regenerar os quadros aprovados.

## Arquivos e comportamento

- Fonte: `art-source/sprite-sheets/work/mc-0013/cr_mc-0013_circuit-hare_animation-source_v001.png`.
- Export e metadados: `art-source/sprite-sheets/approved/mc-0013/`.
- Runtime: `public/assets/units/circuit-hare-spritesheet-v001.png`, 420x560 RGBA, células 140x140, três quadros por direção, down/right/left/up.
- Carta: `public/assets/cards/circuit-hare-card_v001.webp`, 640x800; export determinístico da imagem-mestra aprovada.
- `render.js`: registro de Circuit Hare, escala 0.45, 110ms por quadro, barra de vida acima das orelhas. Pose neutra quando parado e fallback existente enquanto carrega.
- `cards.js`: referência da carta; atributos de combate preservados.
- `render.test.js`: teste das quatro direções e quatro etapas do ciclo, pose parada e fallback.
- `vite.config.js`: ignora `.orchestration` no watcher, pois o lock exclusivo do runner causava EBUSY quando Vite iniciava durante revisão.
- `docs/NOTAS_DAS_VERSOES.md`: integração registrada.

## Exportação

Script preservado em `.orchestration/tools/pack-circuit-hare-v001.cjs`. A imagem fonte é 1086x1448 e os espaços entre as linhas não são uniformes; recortes nas lacunas reais (y=390,710,1030) evitam cortar patas/orelhas. Bounding boxes desconsideram apenas alfa quase invisível (<=8) ao determinar o recorte; o conteúdo visível não foi repintado. Escala uniforme por folha, nearest-neighbor, pés alinhados à base 128 e pivô 70/128. Todos os 12 quadros possuem conteúdo e cabem nas células.

## Validação

- Inspeção visual da folha final: vistas e características preservadas.
- `npm test`: 53 testes passaram, zero falhas.
- `npm run build`: passou após a mudança do watcher.
- Gemini 3.1 Pro: APPROVE, identidade/carta/layout/render confirmados; ferramentas locais funcionaram após correção de aspas no caminho do hook.
- Jogo aberto em `http://127.0.0.1:5179/`. O navegador carregou a aplicação; a verificação das quatro direções/ciclo foi feita pelos testes do renderizador, não por uma partida manual completa.

## Preservação

Backup antes das alterações em `C:\FlavioG\Backups\2026-10-02\071116-906-circuit-hare-integration-e8231ee4`; snapshots posteriores disponíveis no diretório diário. Fonte aprovada e master antigos preservados. Alterações devem estar espelhadas no G e ter SHA-256 comparado antes da entrega.
