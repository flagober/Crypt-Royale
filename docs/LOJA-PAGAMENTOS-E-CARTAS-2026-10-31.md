# Retomada e prioridades — 31/10/2026

Pedido: plano de cartas de construções/feitiços exclusivos do Crypt Royale; prioridade imediata loja/pagamentos; usar registro C:\Chats Antigravity\Chat_2026-10-31.md para atualizar contexto. Histórico registra0.13/build27 e avançosdePvP/correio/iOS. Fonte atual confirma0.13/build27/técnica0.28.0. Não retomar publicação antiga0.9. Regra nova: próxima pública0.2/build28; manter builds crescentes e não sobrescrever versões anteriores. iOS conta paga suspensa, CI/Mac sujeito a assinatura/distribuição válidas; arquivo IPA sozinho não comprova instalação.

## Diagnóstico confirmado no código

ShopPanel chamava onBuyGold(pack) independentemente de paymentMethod; App chamava purchaseGoldPack e progressAction; shop.js adicionava Gold diretamente no cliente. Não existe SDK Google Play Billing nas dependências atuais, nem chamada de cobrança nesse fluxo. Modal gerava número aleatório e mostrava Pagamento Confirmado. Registro anterior que descreve loja como Modo Real não comprova cobrança. Nenhuma credencial foi aberta ou copiada; nenhum pagamento real feito na auditoria.

## Contenção aplicada nas fontes

Removido checkout sem provedor e seloModoReal; preços planejados mantidos, vendasemreais indisponíveis até integração. Retirada chamada de crédito do App; purchaseGoldPack rejeita requisições client-only, sem tocar perfil. goldOrders legados seguem legíveis; saldos não removidos/recalculados. VIP/Sentinela por recursos internos mantidos. BackupD verificado antes; suíte256/256 e buildVite deQA concluídos. Não gerou APK/AAB/EXE nem fez deploy; instalados0.13 não recebem a correção automaticamente.

## Ordem comercial proposta

1. Mapear wallet/backend Mercado Pago existente e confirmar integração, ambiente, endpoints e titularidade sem expor chaves. SDK instalado no painelAdmin não comprova integração funcionando.
2. Android distribuído pela Play: produtos consumíveis Google Play Billing, preço localizado do provedor, compraPENDING sem entrega, validação purchaseToken/package/product no backend e consumo após entrega persistida. Billingalternativo só se habilitado e elegível conforme política.
3. Web: Mercado Pago Checkout hospedado; pedido ligado ao UID e catálogo/preço do servidor, chave de idempotência. Webhook assinado e consulta API do pagamento, conferindo aprovação, moeda, valor, recebedor e referência. Retorno de tela não autoriza Gold.
4. Registro de entregas/pagamentos protegido no servidor; saldo comprado não pode ser alterado pelo JSON owner-managed. Conciliar atualizações de progresso sem sobrescrever entrega; uma entrega por transação, histórico de estados, recuperação após desconexão, estorno/reembolso e trilha administrativa. Nenhum token secreto no frontend/Drive.
5. Testes de sandbox/licença: aprovado/pendente/negado/cancelado, retomada/reinstalação, webhook/requisição repetidos, compra simultânea, mudança de conta, valor adulterado e estorno. Publicar somente após validação ponta a ponta e pacote novo.

Fontes oficiais consultadas: https://support.google.com/googleplay/android-developer/answer/9858738 e https://www.mercadopago.com.br/developers/en/docs/links-and-debts/additional-content/your-integrations/notifications/webhooks . Consultar documentação de integração atual antes de implementar.

## Plano de cartas — proposta, não implementada

Aparelhos de combate/feitiços próprios deVilaByte; não reclassificar como monstros canônicos do MonsterCrypt. Mesmo sistema de energia/baralho, arte e nomes originais. Sem mexer nos custos das evoluções existentes.

| Carta | Energia inicial sugerida | Função/counter |
|---|---:|---|
| Torre de Pulso |3| Defesa terrestre temporária, vulnerável a aéreos |
| Morteiro Byte |4| Cerco lento; vulnerável a unidades próximas |
| Mina de Cache |2| Explosão terrestre de uso único, com sinal visual |
| Chuva de Bits |3| Área contra grupos terrestres/aéreos; dano reduzido em torres |
| Pulso EMP |2| Lentidão breve; sem paralisia permanente |
| Nanorreparo |3| Cura limitada de aliados, sem ressuscitar |

Começar com Torre/Chuva/EMP no treino e campanha, desbloqueio por arenas. DepoisMina/Morteiro/Nanorreparo. Estruturas com vida+tempo, limite de duas ativas por jogador, nunca bloqueiam pontes/caminhos; efeito no servidor para PvP, custo/alcance/área visíveis e testes contra spam/acúmulo. Comparar taxa de vitória, energia trocada e dano a torres antes doPvP. Balanceamento desses números ainda proposto. Implementação só depois da prioridade comercial.
