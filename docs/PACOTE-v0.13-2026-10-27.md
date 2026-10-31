# Crypt Royale0.13 — beta interno publicado

27/10/2026,20:19 São Paulo. App Google Play4972181214995920647, pacote com.monstercrypt.cryptroyale, faixa interna4701495716764622459. Console confirmou Ativo, última versão0.13 · Beta e histórico, disponível para testadores internos, código11. Produção não foi solicitada.

## Entrega

- APK132002256bytes · SHA25614e26ee37eb1f9a8eb77ca46e97e54ae73daa398a8afd5b472f6bbb77578251b.
- Windows234876427bytes · SHA2567f8b7fcb13cb7e05b6314d74f600cf2543d35f34fd8ec959f5f9982077f8e178.
- AAB129199593bytes · SHA2567ee881a216c35b9d7d2c5857bcfe34d1d600ace733d138d3673d36e5ed9c359c.
- Manifestos e notas preservados na pasta dist-pacote/v0.13 e nos aliases v0.13-notas.json/v0.13-manifesto.json. Aliases conferidos byte a byte.154 arquivos web conferidos contra o manifesto;164 arquivos da distribuição web local, incluindo bundles anteriores sem referência, espelhados com SHA256.
- Gerador único terminou com exit0,161 testes aprovados, assinatura APK/AAB, validação bundletool, API36/min24 e smoke do executável empacotado aprovados. Os12 arquivos de publicação foram espelhados pelo gerador. Instaladores0.10/0.11/0.12 preservados.
- https://monstercrypt-royale.web.app/release-info.json confirmou0.13. Política e instruções de exclusão acessíveis por HTTPS.

## Conta e validação

E-mail/senha e integração Google configurados. Firebase real validado com duas contas QA temporárias, sem uso de saves reais: acesso próprio, rejeição entre contas/sem login/revisão inválida, recuperação em dois navegadores independentes e check-in. Contas/documentos QA excluídos. Oito cenários de persistência também cobrem offline, dados inválidos, troca de conta e conflitos. Notas acessíveis pelo número da versão, menu e arquivo completo embutido; testadas em320/390/1440px no endereço publicado, sem erros, transbordamento ou mudança do save.

Certificados públicos do upload local, assinatura atual da loja e variantes clássica/pós-quântica de compatibilidade foram conferidos no Console e registrados no Firebase, totalizando8 impressões. Os clientes OAuth Android correspondentes foram confirmados pela configuração remota. Chaves privadas/sessões permaneceram somente no C. Google Login no Android/Windows físico não foi confirmado: o popup no navegador abriu a seleção de conta, mas a automação de entrada nessa janela não concluiu a seleção. Isso deve ser testado pelo titular no APK.

Lista própria Crypt Royale — Beta interno: conta principal flagober. A lista de15 testadores do Pulso ficou desmarcada. Link elegível conferido na conta principal: https://play.google.com/apps/internaltest/4701495716764622459 . O convite ainda depende de aceite do titular; a automação não aceitou o compartilhamento pessoal de informações de uso em seu nome. Nome temporário com.monstercrypt.cryptroyale (unreviewed) é informado pelo Console até configuração/revisão.

## Migração e limites

A assinatura do APK manual0.13 foi comparada à0.10 e permaneceu igual. A assinatura gerenciada pela loja é diferente: atualizar o APK manual primeiro, entrar e levar o save à conta, conferir sincronização, então migrar para a loja e entrar na mesma conta. Evitar perda do visitante na troca de instalações.

Continuam disponíveis treino IA, campanha9 desafios, coleção, cartas, classes e níveis. PvP, troféus, ligas, economia paga e MCT real não estão implementados. Protocolo Sentinela permanece proposta sem débito/compra. O automático atual é ferramenta de treino sem recompensas. Partidas em andamento não migram entre aparelhos; resultados entram no save após o término.

Aviso único do envio: ausência de arquivo de desofuscação R8/Proguard; minifyEnabled está false, portanto não há arquivo de mapeamento próprio a enviar. Proteção Automática permaneceu ativada. Produção depende de configuração, teste fechado com12 participantes contínuos por14 dias e aprovação do Google.
