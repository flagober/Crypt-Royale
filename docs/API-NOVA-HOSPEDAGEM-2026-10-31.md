# API comercial na nova hospedagem — 31/10/2026

Flavio informou que não tem mais acesso à VPS antiga da Wallet e perguntou se podemos hospedar a nova API onde está o Crypt Royale. Pode usar a mesma plataforma/conta, com serviço comercial separado do PvP. O serviço confirmado neste chat é Render Free, não uma VPS completa. Não tentar recuperar sessões/chaves da VPS perdida, nem afirmar que histórico/saldos/segredos foram restaurados.

## Arquitetura decidida para preparação

Frontend Wallet permanece independente, com FirebaseAuth/cofre/BSC existentes. API comercial separada no Render, com armazenamento durável externo Firestore e identidade de servidor via IAM. PvP mantém seu serviço. Gold comprado terá ledger separado de profileJson e de tokenscripto. Não habilitar transferênciaMCT/BNB/USDT nem reusar chavetesouraria automaticamente; o mecanismo de entrega cripto da VPS perdida precisa reconstrução/auditoria específica.

Free pode hibernar após15min e perder arquivos locais emreinício/redeploy; guardar documentos financeiros emarquivo/SQLite/Maplocal seria incorreto. Free só para homologação; antes de dinheiro real reavaliar disponibilidade conforme orientação oficial doRender. Nada pago contratado nesta etapa. Domínioapi.monstercrypt.com.br nãofoiredirecionado, walletnãoapontadanovahost.

## Implementação deste lote

server/payments-repository.js implementa adapter para servidorFirestoreinjetado: createpedidoUUIDidempotente, lookupporowner, saldocompradocredits/debits, applyMp com ordem/reciboúnicoglobal/lançamentosgrantreverse/countersnamesmatransação. Todasleiturasantesdeescritas. Semredeexternanafunçãotransacional. Dadosdepagador/token/cartãonãogravados. Não toca saveprofileJson ou saldoonchain. ContaUID deverá ser obtida daautenticaçãoFirebaseverificada porcamadaHTTP.

Reembolso parcial/revisão grava reviewRequired e vínculo dopagamento duravelmente, impedindoaprovaçãodefasadadeconcederGold depois. A resolução serámanual, nãoexisteautorização financeira deoperaçãoexterna nesta implementação. Refunded/charged_back integral contabilizadevoluçãoumaúnicavez. Consumo comercialdeGold/conciliçãocom recursosganhosnojogo ainda pendente; nãoalterarlegadoautomaticamente.

src/payments-repository.test.js usa fixturetransacionalisolada com escritasstaged/rollback/serialização; NÃO éFirestorereal/emulador. Quatrotestes cobrem8confirmaçõesconcorrentes, reconstruçãodo adapter/retry, estornoúnico, pending, falhadecommitsemcréditoparcial, crossUID/crossorder e bloqueiopersistentepara reembolsoparcial. NãoafirmarQAcloudrealpor esses testes.

## Revisão Antigravity

Runpayment-repository-review-20261031 via runneroficial, Gemini3.8FlashHigh/high, planTextOnly, SUCCESS. Codexaplicouchecagensdeatomicidade e acrescentouholddeconciliação. DescartadaorientaçãoabsolutaFieldValue.serverTimestampparatodaoperação: decisões com now de relógio servidorinjetado e datasAPI precisamnúmeros; metadadospodemusar timestampnarealintegração. NãoacreditaremdeclararAppendOnlysemregras/IAM/transaçõesconfirmados. Nenhumnovocontratoserviço ou permissãoampliada.

## Ainda não implantado/habilitado

Adapter precisa conexãoFirestore Admin real com IAM/regrasprivadas, camadaHTTP/autenticaçãoFirebase, consultaAPI eassinaturaMP acopladas, credenciaisMP/receiver/secret configuradosprivadamenteservidor, criaçãoCheckout e testeE2Eemhomologação; GooglePlayBilling permanece separado. Sem credenciais não iniciar cobrança. Não copiar .env/chaves paraDrive nem solicitar porchat.

Nenhuma API nova está publicada; nenhuma alteração deDNS, domínioantigo, serviçoPvP, regrasFirebase, preços, saldos, assinatura ou APK foi feita neste lote. O banco e os testes preparados são código de servidor, não recuperação do serviço antigo. Registrar próximas configurações e aprovações concretas na implantação.

Fontesprimárias consultadas:
https://render.com/docs/free
https://render.com/docs/faq
https://firebase.google.com/docs/firestore/security/get-started

Backup novo noD antesdecriar arquivos; fontesC/espelhoG comhashes, conforme goldenrules.
