# Pacote Crypt Royale 0.5 — ciclo2 — 28/10/2026

Pedido: gerar APK para testes. Gerador único concluído e espelhado; versão pública0.5, técnica0.20.0, Android build18. Não houve envio à Play Store nem publicação Hosting neste lote.

## Conteúdo
Loja com passe Sentinela de7dias comprado por5.000Gold+20Fragmentos+50cartas repetidas escolhidas pelo jogador. Baú de boas-vindas fixo para contas novas via correio. Check-in com créditos internos MCT nos marcos7/14/21/30 (5/7/10/15), sequência reiniciada após falta e saldo preservado. Sem saque/transferência/carteiras externas. Catálogo Gold:500/R$1,49;1.200/R$2,90;2.500/R$4,90;5.500/R$9,90;12.000/R$19,90. Compra em reais desativada, Mercado Pago não integrado neste pacote. Custos de evolução preservados.

Foi corrigido o foco no campo de quantidade de cartas do ShopPanel: o efeito agora acompanha a montagem do painel e usa referência para fechar, evitando reiniciar foco a cada atualização da interface. A primeira compilação0.5 ainda não entregue foi substituída por repetição --manter-versao, com backup. O manifesto final corresponde à fonte corrigida.

## Validação
198testes aprovados, nenhuma falha; build web concluído. APK assinatura v2/v3 e identidade0.5/18 verificados; AAB assinatura/identidade/API36. Windows metadados nativos0.20.0 e smoke empacotado renderizando0.5. ZIP iOS contém projeto-fonte verificado, não IPA; assinatura iOS exige Mac e conta Apple.

Hashes dos quatro artefatos conferidos separadamente contra o manifesto e entre C/G. Hash de src/ShopPanel.jsx e src/gold-packs.js confere com a fonte congelada e o espelho. Gerador terminou com PACOTE v0.5 CONCLUÍDO E ESPELHADO. Assinatura Windows continua conforme configuração existente, sem certificado Authenticode.

- APK: dist-apk/ciclo-2/Crypt_Royale_v0.5.apk
  SHA256:383B98FE927DDEEC8F6838009A63C9FC65F87464752548D94000E7DAF70FEB75
- EXE: dist-electron/ciclo-2/Crypt Royale Setup0.5.exe (nome real: Crypt Royale Setup 0.5.exe)
  SHA256:B3FB074BD5628C944A9860425C14E565FF9E56AE3291CF5DD8E9BFC7D5C776A5
- AAB: dist-apk/ciclo-2/Crypt_Royale_v0.5_BETA.aab
  SHA256:8FDF100AA8BE7A2FE172D36799C75C09616BCA121490E091A7E03EC8A4FD73BD
- iOS fonte: dist-pacote/ciclo-2/v0.5/Crypt_Royale_v0.5_Projeto_iOS.zip
  SHA256:8653F0EDDC4EB87DF510F9E24C95043BB16D70519485D920A7243E1F067A3E48
- Manifesto: dist-pacote/ciclo-2/v0.5/manifesto.json

Log final local: C:\Users\flavi\AppData\Local\MonsterCrypt\CryptRoyale\Builds\logs\v0.5-final-cc6d042a-ee99-4ec6-b2c2-536e0042be68.log
Fonte congelada: C:\Users\flavi\AppData\Local\MonsterCrypt\CryptRoyale\Builds\0.5-1793229923856-b540cad8
Backup pré-publicação local: C:\FlavioG\Backups\2026-10-28\203205-134-cryptroyale-before-release-publish-61098291

## Pendências preservadas
Não foi feito teste manual deste APK em aparelho nem nova revisão visual da loja. Fluxos remotos de boas-vindas/check-in ainda precisam QA funcional positivo/negativo; as regras foram compiladas/publicadas no lote anterior, outros apps preservados. Não considerar save do cliente como autoridade financeira para venda real. Play última disponibilidade confirmada0.3/build16;0.4 em revisão pendente anterior,0.5 sem upload. Site continua0.4. Pedido atual apenas geração local.
