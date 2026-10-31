# Crypt Royale 0.8 — ciclo 2 — build 21 — 29/10/2026

**Publicada no teste interno do Google Play:** release 11, 21 (0.8), disponível para testadores internos. Lançamento em 29/10/2026 às 05:26 conforme Console, verificado no Edge 4, aba 819714951, mantida como entrega. Mesma faixa e audiência; nenhuma promoção para produção.

Prova: play-teste-interno-v0.8-20261029.jpg. Convite preservado: https://play.google.com/apps/internaltest/4701495716764622459

## Comportamento entregue

Base e Job separados; XP antigo permanece em Base. Novas especializações exigem Base 40 / Job 20, com o reforço por cartas independente. Job: 20 por vitória e 10 por derrota/empate manual elegível, uma vez por resultado e classe ativa. Novas formas dos monstros nos níveis próprios 6/10, mesmos custos de 20/50 duplicatas e 500/1.500 Gold. Formas e ramos anteriores preservados.

Nexus, bosses e tiers III–V somente com regras e prévia futura, sem conteúdo jogável novo. Especificação, migração e curva de XP em PROGRESSAO-NIVEIS-v0.8-2026-10-29.md.

## Geração e verificações

- Coordenador único: `node scripts/gerar-pacote.cjs`. Técnica 0.23.0, Android 21, pública 0.8, ciclo 2.
- Cópia congelada em `%LOCALAPPDATA%/MonsterCrypt/CryptRoyale/Builds/0.8-1793261681182-55349bfc`.
- 212 testes, 0 falhas, e Vite concluído na cópia congelada. Persistência nova inclui offline, reinício, sincronização e replay com remoto simulado. Isso não substitui testes de campo em celulares/contas reais.
- APK release assinado, `APK_VERSION_OK 0.8 / 21`; assinatura, identidade e API 36 do AAB verificadas.
- Windows com metadados 0.23.0; teste de abertura confirmou interface 0.8 e nove imagens carregadas. Condição anterior sem certificado Authenticode preservada.
- ZIP do projeto iOS verificado: fontes/configuração somente, sem IPA ou assinatura App Store.
- 490 entradas de fontes congeladas/metadados finais conferidas no C antes da documentação após a entrega.
- Quatro artefatos conferidos independentemente contra manifesto e C/G; seis metadados também conferidos. Lote de fontes, notas e manifestos espelhados com SHA256.

## Falta de espaço e recuperação

O gerador terminou as compilações/verificações e publicou os arquivos locais, mas retornou exit 1 no espelhamento por espaço insuficiente. C tinha aproximadamente 428 MB livres e G reportava espaço semelhante. Pacotes e diagnóstico local foram preservados, sem nova compilação ou incremento.

A revisão automática recusou a exclusão recursiva dos intermediários temporários. Nenhuma exclusão alternativa foi executada. Foi usada compressão NTFS reversível apenas na pasta temporária criada nesta geração, preservando o conteúdo. Relatório final: 3.249.120.958 bytes armazenados em 2.935.889.779 bytes, redução de aproximadamente 313 MB. Depois da recuperação o SSD tinha cerca de 7 GB livres; a mudança total do espaço livre não deve ser atribuída integralmente à compressão.

O espelhamento de 14 arquivos de entrega e do chat foi retomado explicitamente com `Mirror-Files.ps1`, com exit 0 e hashes verificados. Depois, nova verificação independente dos quatro artefatos e seis metadados C/G. Não declarar que o primeiro comando do gerador retornou exit 0: a falha final foi de cópia e foi recuperada sem recompilar. Não regenerar esta entrega com `--manter-versao` para alterações novas.

Backup inicial de 112 arquivos em `C:/FlavioG/Backups/2026-10-29/045812-275-royale-base-job-evolucoes-0-8-fa9d8c23`. Publicação local preservou 14 destinos em `051848-456-cryptroyale-before-release-publish-462735b1`. Backups adicionais de notas, provas e retomada sob a mesma raiz diária.

## Artefatos preservados no C e G

| Arquivo relativo | Bytes | SHA256 |
| --- | ---: | --- |
| dist-apk/ciclo-2/Crypt_Royale_v0.8.apk | 151625238 | 7e99ef5ff6fc95c6222ab536bc786a3c668a5b71c03b796cf30a9f0bb75272a8 |
| dist-electron/ciclo-2/Crypt Royale Setup 0.8.exe | 251526092 | 04a0a8007ac05aa691bbd38675287fc36ac488d64221959605a17553fa44de79 |
| dist-apk/ciclo-2/Crypt_Royale_v0.8_BETA.aab | 148473190 | 7ab9fdd2e5d7a82358cc9796f91c19cdef61e731740af2019b640eb9a802d4e1 |
| dist-pacote/ciclo-2/v0.8/Crypt_Royale_v0.8_Projeto_iOS.zip | 145420982 | c06108f461f1b40222cdd3aec30867731f5f939e7dd3dd397931bb7004821ca1 |

Manifestos/notas em `dist-pacote/ciclo-2/v0.8/`, além de `v0.8-manifesto.json` e `v0.8-notas.json`. Entregas anteriores preservadas.

## Google Play e limites

Play Console aceitou o AAB 21 (0.8). Único aviso: ausência de arquivo de desofuscação. Build com `minifyEnabled false`, sem mapping R8 gerado e sem erro impeditivo. Publicação e confirmação de disponibilidade concluídas. O Console informa que atualizações normalmente aparecem em até uma hora, podendo demorar mais. Não houve publicação em produção.

Hosting público não foi atualizado nesta etapa; última versão confirmada era 0.4. Mesmo JSON de perfil e revisões Firebase, sem nova regra/permissão. Pagamentos reais continuam desativados. Nexus, bosses e outras cinco classes aguardam produção de conteúdo; tiers III–V ainda indisponíveis. iOS requer Apple Developer, Mac, assinatura e testes reais.
