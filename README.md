# Crypt Royale

Protótipo jogável de estratégia em arena 2D/2.5D integrado ao universo MonsterCrypt. O projeto usa React, Vite, Tailwind CSS e Canvas para executar batalhas locais com cartas, energia, tropas, torres e IA.

## Estado atual

- batalha local jogável;
- 16 cartas canônicas implementadas;
- central de missões, check-in e eventos com recursos locais de teste;
- direção de arte e prompts de produção documentados;
- integração futura com a Wallet MonsterCrypt planejada, ainda sem ativar transações MCT no combate.

## Executar localmente

No Windows, execute `iniciar_local.bat` ou `iniciar_local.ps1`.

Alternativamente:

```bash
npm install
npm run dev
```

## Verificações

```bash
npm test
npm run build
```

## Documentação

- `docs/Crypt_Royale_GDD_v1.0.gdd` — visão geral do jogo;
- `docs/Crypt_Royale_Catalogo_16_Cartas_v1.0.gdd` — elenco inicial, combate, economia e aquisição;
- `docs/Prompts_Visuais_16_Cartas_v1.0.md` — prompts e pipeline de produção visual;
- `docs/Deck_Canonico_Vila_Byte.md` — baralho canônico inicial;
- `docs/AUDITORIA_TECNICA_2026-09-25.md` — auditoria do protótipo;
- `docs/NOTAS_DAS_VERSOES.md` — histórico de mudanças.

## Princípios de economia

- Gold e Diamantes são moedas internas e não possuem conversão automática para MCT.
- MCT não é apresentado como investimento ou promessa de valorização, renda, recompra ou lucro.
- Cartas funcionais possuem caminho de obtenção jogando.
- Compras com MCT mostram previamente o item e o preço; não há vantagem competitiva exclusiva nem loot box paga aleatória.

## Arte

Os assets atuais são referências de identidade. Novas artes devem passar pelo fluxo: exploração → imagem-mestra aprovada → vistas → sprite sheet → arte de carta → controle de qualidade.



## Instalar no Windows ou Android

Execute `gerar_crypt_royale.bat` para gerar ambos com a mesma versão automática. Validação sem gerar/incrementar: `gerar_crypt_royale.bat --verificar`. Para repetir a versão atual: `gerar_crypt_royale.bat --manter-versao` (somente após existir um pacote publicado).

Saídas: `dist-electron/Crypt Royale Setup VERSAO.exe`, `dist-apk/Crypt_Royale_vVERSAO.apk` e `dist-pacote/vVERSAO/manifesto.json`. Detalhes e requisitos em `docs/INSTALADORES.md`. Os aplicativos incluem o protótipo local; não habilitam MCT, Marketplace, nuvem ou contas. O progresso do navegador não é importado automaticamente.
