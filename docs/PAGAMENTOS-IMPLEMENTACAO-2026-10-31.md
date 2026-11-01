# Loja e pagamentos — implementação em andamento — 31/10/2026

## Escopo e estado real

Usuário mandou prosseguir com as skills/Antigravity, priorizando pagamentos. Fonte C:\MonsterCrypt_Ecosystem_V1.0\Crypt-Royale, espelho G:\Meu Drive\MonsterCrypt_Ecosystem_V1.0\Crypt-Royale. Metadados atuais preservados0.13/build27; próxima0.2/build28 conforme instrução31/10, sem sobrescrever arquivos de ciclos anteriores. Nenhum build/deploy/cobrança neste lote. APKs instalados ainda contêm fontes anteriores à contenção.

Wallet não localizada na raiz C/G atual. Mapa histórico do painel cita MonsterCrypt-Wallet,5175; SDKmercadopago3.2.0 instalado no painel não comprova fluxo existente. Pergunta assíncrona enviada pedindo caminho/nome do projeto, sem chaves. Não ler perfis, .env, cartãoOracle ou importar cópia antiga do Drive.

## Delegação executada

Runner oficial do projeto, sessão anteriormente confirmada flagober, modelo Gemini3.8FlashHigh/high já autorizado. Modo plan+TextOnly, sem ferramentas/escrita direta do CLI. Run20261031-194621-965-payments-ledger-20261031,67s,SUCCESS,exit0,espelhadoverificado. Pedido/resultados em .orchestration/requests/payments-ledger-20261031.md e .orchestration/runs. Codex leu, corrigiu e integrou a proposta; não três contas simultâneas.

Revisão encontrou e corrigiu: acesso ao catálogo por protótipo; UUID frouxo; arredondamento de valor com mais de dois decimais; conversão Boolean de ambiente; fallback de datas inválidas para agora; estorno sem conferir paymentId; aprovação após reembolso que chegou primeiro. Não copiar saídaCLI sem revisão.

## Arquivos implementados

- server/payments-domain.js: catálogo fixo de cinco pacotes/preços, pedido vinculado aUID/UUID, validade30min, normalização estrita de resultadoAPI MercadoPago. Confere valor exatoBRL, recebedor, external_reference, ambiente booleano e datas. Decisão imutável de grant/reverse, retorno de chaves para registroúnico global; reembolso anterior não concede Gold, repetição não reconcede e eventos antigos não desfazem estados novos. Reembolso parcial/inconsistente exige conciliação. Prova em memória liga normalizador ao decisor, não substitui transação persistente.
- server/mercadopago.js: verifica HMACSHA256/tempo constante para headers e data.id (ids numéricos payments); consulta GET em endpointHTTPSfixo doMP, sem redirects, com timeout. Erros não reproduzem payload/credencial. Token somente recebido no backend em execução; nenhum segredo gravado. Não cria pagamento nem faz compra real.
- src/payments-domain.test.js e src/mercadopago.test.js: adulteração de valor/conta/moeda/ambiente/referência, dadosinválidos, assinaturaalterada/camposduplicados, APIindisponível/IDdivergente, crédito e estorno repetidos, inversãodeordem, atraso e reembolsoparcial.

Validação:262/262testes Node passaram (antes256), incluindo6novos. Adapterusoufetchfictício e chavesfixture; nenhum pagamento/tokenreal. Correções novas de tipos foram verificadas novamente nos6testes. Buildweb do lote anterior da contenção já aprovado; estes módulos são server-only e não importados pelo frontend.

## O que falta para funcionar com dinheiro real

1. Identificar a wallet existente e sua fonte/hospedagem; auditar reuso sem modificar outros apps.
2. Repositório transacional durável, registroúnico por provider/paymentId e entrada grant/reverse por ordem; salvar ordem/recibo/entrada na MESMA transação. Decisor puro não implementa concorrência global sozinho. Não usar Map/JSON local em produção/RenderFree.
3. Autoridade de servidor e regras de acesso protegendo saldo comprado; profileJsonowner-managed atual não basta. Definir consumo/conciliação de Gold ganho/comprado sem perda ou fusão arbitrária do save. Preservar legado; sem migraçãofinanceira automática.
4. AutenticarUID pelo Firebase no checkout (não aceitar UID vindo do corpo); criar pedido com catálogo servidor, checkouthospedadoMP paraweb, status autorizado/pending sem entrega. Webhook deve passar assinatura E consultaAPI; só depois normalizar/decidir e persistir atomicamente. Nunca confirmar por retorno de tela. LeituraAPI aqui não está conectada a rotaHTTP.
5. AndroidPlay: adicionar bridgeSDKGooglePlayBilling e produtos reais, consultarpreçolocalizado, verificar token/produto/pacote/estado no backend, vínculoàconta e consumo/ack após entrega durável. AdaptadorGoogle e bridge não implementados neste lote. Não encaminharPix externo daPlay sem programa elegível/configurado.
6. Sandbox/licensetesters e cenários simultâneos/reinstalação/reembolso pontaaponta; liberar somente após confirmar no provedor e persistência. Testes puros não comprovam transaçãofinanceira ou integração real.

Dependências de configuração: backend/DB com autoridade apropriada; credenciaisMP e recebedor/ambiente, webhooksecret e URLHTTPS; acessoAPIPlay/pacoteprodutos. Devem ser configurados de forma privada no serviço adequado; nunca pedir que usuário envie no chat ou copiar .env paraDrive. Novos módulos permanecem não expostos/checkoutemreaisdesativado até essas condições.

Fontes primárias consultadas31/10:
- https://www.mercadopago.com.br/developers/en/docs/checkout-pro-preferences/payment-notifications
- https://developer.android.com/google/play/billing/security

## Backups

D:\FlavioG\Backups\2026-10-31\194619-371-pagamentos-dominio-cli-abf0d5f1 e194702-806-mercadopago-validacao-backend-f01ca709. Runner preservou pedido antes da execução. Não apagar backups antigos; nenhuma alteração deconta/caminhoDrive.
