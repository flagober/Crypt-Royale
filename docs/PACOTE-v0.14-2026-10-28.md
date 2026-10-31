# Pacote Crypt Royale v0.14 — 28/10/2026

Versão pública 0.14; versão interna 0.14.0; Android/iOS build 12.

## Entrega verificada
- APK e AAB Android assinados com a chave release local; EXE Windows produzido; projeto iOS ZIP produzido (não é IPA).
- Quatro artefatos conferidos por SHA-256 com o manifesto e o espelho G. Versão anterior 0.13 preservada.
- 172 testes do Royale e 72 testes do painel aprovados. Smoke Windows empacotado, metadados nativos, assinaturas Android e conteúdo web aprovados no manifesto.
- Guardião e Baú Fundador explicitamente aprovados pelo usuário e aplicados ao jogo e aos ícones web/Android/Windows/iOS. Login Google confirmado normal pelo usuário.
- Primeiro build Windows interrompido pelo limite de quatro minutos do compilador NSIS. Corrigido exclusivamente no runner makensis com limite de dez minutos, heartbeat e testes; repetição concluída sem incrementar novamente.
- Play Console: faixa interna 4701495716764622459 ATIVA, última versão “0.14 · Guardião e correio”, código 12, disponível para testadores internos em 28/10 às 09:27 São Paulo. Prova: beta-0.14-play-20261028.png. Lista de 17 testadores preservada. A publicação pública em produção não ocorreu.
- Convite: https://play.google.com/apps/internaltest/4701495716764622459
- Hosting somente monstercrypt-royale publicado. https://monstercrypt-royale.web.app/release-info.json retorna 0.14/build12; notas remotas SHA f0d29abc411886e6771a12b74324331e2380679350b8517c1b70f9a35f1ee7e7, idênticas ao manifesto. Todos os arquivos web do manifesto conferidos no dist local.
- Fontes e arquivos web modificados espelhados com hash verificado; segredos e chaves permanecem somente no C.

## Pendências explícitas
- Painel de brindes: fonte e testes prontos; API atual antiga precisa que o usuário feche e reabra MonsterCrypt-Ecosystem-Admin/iniciar.bat. A revisão automática rejeitou a tentativa de parar/reiniciar o processo (blocked by policy); não foi contornada. Não afirmar que endpoints novos já estão ativos.
- iOS: falta conta Apple Developer, Mac/Xcode, assinatura, Sign in with Apple/exclusão de conta, testes e revisão. Nenhum IPA gerado nem app publicado na App Store.
- Página pública Play: ícone e descrições salvos em rascunho; recurso gráfico e screenshots obrigatórios ainda faltam. Beta usa nome temporário até revisão do cadastro.
- Divulgação pronta como PRÉVIA; campanha dos primeiros 100 e distribuição automática de brindes não ativadas. Nenhuma postagem enviada.
- Sem PvP, ligas, compras, pagamentos ou MCT real neste beta. EXE sem certificado Authenticode, como registrado no manifesto.

## Arquivos
- dist-apk/Crypt_Royale_v0.14.apk
- dist-apk/Crypt_Royale_v0.14_BETA.aab
- dist-electron/Crypt Royale Setup 0.14.exe
- dist-pacote/v0.14/Crypt_Royale_v0.14_Projeto_iOS.zip
- dist-pacote/v0.14/manifesto.json