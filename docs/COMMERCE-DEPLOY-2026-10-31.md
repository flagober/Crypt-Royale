# API comercial publicada — 31/10/2026

## O que está rodando
Serviço Render Free separado: crypt-royale-commerce-beta.
URL: https://crypt-royale-commerce-beta.onrender.com
Service ID: srv-dbj7l4m7bikc73el9cl0
Repositório privado já autorizado: flagober/crypt-royale-pvp, somente pasta commerce.
Commit: 57995e64a5e6a3e7316b3473228c78399d5da73d.
Deploy inicial: dep-dbj7l4u7bikc73el9e2g; com configuração privada: dep-dbj7n0ss728c73925280.
Node24, root commerce, npm ci --omit=dev --ignore-scripts --no-audit --no-fund, npm start, health /health, AutoDeploy Off. Nenhum plano pago contratado.
Os arquivos antigos do PvP não tiveram diff. /health do PvP respondeu200 após implantação comercial.

GET /health e /api/v1/catalog: HTTP200 remoto.
GET /ready: HTTP503 esperado; database/identity/provider=true, webhook=false.
GET /api/v1/gold/balance com FirebaseIDtoken válido: HTTP200, saldo zero da conta QA.
JWT forjado e conta QA desativada: HTTP401.
POST /api/v1/orders: HTTP503 deliberado, nunca cria cobrança neste release.
Webhook autentica assinatura antes da consulta API, valida data.id inequívoco e usa o resultado do provedor, não o status recebido do cliente.

## Credenciais
Flavio autorizou expressamente configurar no serviço Render a identidade de servidor Firebase monstercrypt-core e o token Mercado Pago locais. Salvos em Secret Files/variáveis privadas do serviço; valores omitidos do código, Git, logs, chat e Drive. Não foi copiada a chave da tesouraria cripto.
A credencial Firebase existente possui acesso amplo no projeto; planejar identidade exclusiva com privilégios mínimos antes de habilitar dinheiro real, com aprovação específica de IAM. Não gerar/remover/rotacionar chaves de outros aplicativos automaticamente.
Não inferir restauração de histórico ou tesouraria da VPS perdida.
MP_WEBHOOK_SECRET não configurado: login no painel Mercado Pago está pendente no Edge. Não inventar um segredo local como se fosse a assinatura do provedor.

## Verificações
272 testes locais passaram, incluindo seis testes HTTP novos.
Revisão Antigravity: commerce-api-review-20261031, Gemini3.8FlashHigh/high, planTextOnly, SUCCESS; revisão integrada com ressalva: não responder sucesso antes de processamento durável.
Firestore real: create/read de documento técnico sem dados de jogadores.
QA remota: conta Firebase exclusiva, sem e-mail/senha/provedor social, criada para teste; desativada e refresh tokens revogados ao final, preservada sem excluir.
Transações Firestore reais em namespace isolado cryptroyale_commerce_qa/{uuid}/: oito aprovações concorrentes, concessão total500 uma vez, reconstrução do adapter/retry sem duplicação e duas confirmações de estorno com devolução total500 uma vez, saldo final0.
Os pagamentos desses testes foram SIMULADOS. Não houve pagamento Mercado Pago/Play nem alteração de saldo de jogador real.
Relatório sem credenciais: .orchestration/reports/commerce-cloud-qa-20261031.json.
SDK14.5.0 possui seis avisos moderados transitivos glob/minimatch/rimraf na auditoria npm. npm audit fix sem force não resolveu. Não aplicar major overrides às cegas; nenhuma rota expõe padrões de glob ou acesso a arquivos do cliente. Pendência antes de produção.

## Limites reais e próxima etapa
Este deploy é API de homologação, não a loja paga concluída. Checkout continua desabilitado em código; não existe preferência de cobrança nem endpoint de consumo autoritativo de Gold pago nesta versão.
Antes de cobrar: integrar consumo/entrega de Gold comprado em transação no servidor, mantendo ledger fora do profileJson editável; implementar criação/retomada de checkout e conciliação ativa; configurar segredo webhooks; testar contas Mercado Pago de homologação; implementar GooglePlayBilling/validação de purchaseToken no Android.
Não anunciar que Pix externo pode vender Gold dentro do APK Play por padrão.
A Wallet não foi apontada para esta API: seus endpoints antigos de compra/entrega MCT/BNB/USDT ainda dependem reconstrução específica. Nada de transferências ou carteiras externas ativado.
Render Free pode dormir; duas instâncias compartilham a cota gratuita do workspace. Não prometer disponibilidade contínua nem guardar banco financeiro no filesystem do Render.
Sem mudança DNS, versão pública do jogo, APK/AAB/EXE ou publicação nas lojas. Fonte com contenção da compra simulada ainda precisa entrar no próximo pacote unificado; não alegar instalada a correção.
Próxima versão pública do jogo deve respeitar salto autorizado 0.13/build27 → 0.2/build28, mantendo artefatos históricos.
BackupD e espelhoC→G verificados do lote; segredos excluídos.

## Atualização posterior — fila de notificações
API0.1.1 acrescenta fila durável, conforme docs/WEBHOOKS-2026-10-31.md. 277 testes locais passaram e o adapter da fila foi validado com transações Firestore reais em namespace isolado. Runtime commit7e87b69, pacote commerce-api-20261031-r3. O painel geral Mercado Pago abriu; ao entrar na aplicação MonsterCrypt o provedor pediu confirmação adicional pelo QR/app, ainda pendente. Não afirmar notificações configuradas nem teste do simulador realizado enquanto esse passo não for concluído. Credenciais/serviço do lote anterior preservados; checkout permanece desabilitado.
