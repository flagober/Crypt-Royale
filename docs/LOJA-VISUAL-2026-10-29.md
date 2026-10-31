# Loja e créditos MCT —29/10/2026

Pedido:prints doAPK0.6confirmaram fechar esticado, créditos sem arte e seletor de duplicatas em linhas sem botões.

## Implementação0.7
Fechar fixo44x44 com flex:0,align-self:flex-start; cabeçalho alinhado ao topo. Fundo opaco elimina interferência visual do jogo no modal. Três cards por linha em320/360/390/768/1366, artesCARD_BY_ID existentes, nome/estoque/seleção,controles−/+ e entrada numérica. Limite de cada família e50no total; reconciliação após mudança de inventário. Recibos/custos do passe não alterados.

MCT:moeda gerada comimage_genbuiltin,RGBA1278x1230,alpha0..255,contorno visível em144,85,1148,1153. Original/prompt emart-source/rewards/mct-credit-coin-v001*. Nova imagem empublic/assets/rewards/mct-credit-coin-v001.png; MctIcon reutilizado no saldo e marcos7/14/21/30. Aparência de conquistas recebidas preserva regra existente, créditos internos sem saque/transferência.

## QA isolado no Edge
Rotas.orchestration/qa/shop.html e shop-mct.html,sem acesso a contas reais. Cinco larguras320/360/390/768/1366:fechar44x44,três colunas,nenhum overflow horizontal. Seis artes carregadas. Escolha48BitBug+1DataMouse+1BufferBison=50,botões+bloqueados;−DataMouse libera espaço e digitar999emBitBug limita49,total50. Compra emfixture:10000Gold/40Fragmentos/70BitBug+1BufferBison→5000Gold/20Fragmentos/21BitBug/0BufferBison,ativo7dias,seleçãozera. Nenhum save real modificado. CliqueFechar encerrou modal e mostrouReabrir.

8testes focados aprovados:3novos limites/reconciliação+2loja+3loyalty. Suitecompleta será executada pelo gerador. Prévias:docs/loja-fechar-20261029.jpg,loja-cards-20261029.jpg,mct-presenca-20261029.jpg.

Backupinicial:C:\FlavioG\Backups\2026-10-29\042231-391-royale-loja-cards-mct-0-7-e5b04205;correçãoplural/screenshotsbackup042941-109-royale-qa-loja-final-0-7-5a684527. Fontes/arte/prévias/notas espelhadasC/GcomSHA.

## Distribuição
Notas0.7/ciclo2registradas antes do gerador. Próxima0.7/build20/técnica0.22.0.0.6/build19continuaPlayatualconfirmadaatépublicação0.7. Não reutilizar0.6paraestasmudanças.

## Compilação e distribuição concluídas
Geradorúnicocompletou0.7/ciclo2/build20/técnica0.22.0,204testes,APK/AABassinados,Windowsmetadata/smoke,ZIPiOSfonte. QuatroartefatosSHAverificadosC/G/manifesto,6fontes/assetcoincidemcongelamento. Playinternorelease10publicadoeconfirmadoDisponívelparatestadoresinternosem29/10/2026às04:39. DetalhesemPACOTE-v0.7-ciclo2-2026-10-29.md;provaemplay-teste-interno-v0.7-20261029.jpg. Mesmolinkbeta preservado. NenhumcheckoutrealouMCTblockchainativado.
