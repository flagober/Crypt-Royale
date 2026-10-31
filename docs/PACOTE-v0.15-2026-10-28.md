# Crypt Royale v0.15 — 28/10/2026

Versão pública0.15, interna0.15.0, Android/iOS build13. A0.14 foi preservada.

## Concluído
- Logo1536x1024 com alpha criada pelo image_gen nativo a partir da identidade do Guardião. Usuário respondeu “Aprovo a logo”. Fonte e prompt preservados em art-source/branding; aprovação com SHA registrada. Aplicada à apresentação e ao cabeçalho. Ícone do Guardião não substituído.
- QA visual390x844 na apresentação,320x568 e844x390 na arena sem rolagem horizontal/vertical; desktop1440x900 com rolagem normal e logo carregada. Capturas logo-mobile-20261028.png e logo-desktop-20261028.png. Nenhum save de conta real alterado; contexto visitante local separado.
-172 testes do jogo passaram,0 falhas. APK e AAB assinados e verificados, EXE Windows compilado e smoke/metadados aprovados. ZIP de projeto iOS produzido; não é IPA nem publicação Apple.
- Quatro artefatos conferidos por SHA com manifesto e espelho G. Dist publicado veio do mesmo estágio congelado. Arquivos modificados e documentação espelhados/verificados. Notas registradas antes do incremento.
- Play interno4701495716764622459: ATIVO, versão “0.15 · Logo de Vila Byte”, build13, disponível para testadores em28/10 às10:04 São Paulo. Prova beta-0.15-play-20261028.png. Único aviso: ausência de arquivo de desofuscação. Publicação de produção não realizada.
- Hosting monstercrypt-royale atualizado; release-info remoto confirma0.15/build13 e hash das notas igual ao manifesto. Logo remota idêntica ao PNG aprovado, SHA125D5F620C7EB1CD0BC73EFA00F55047C24BC360EB95E4A21E99DB5DE20BCDFE.
- fechar_crypt_royale.bat criado na raiz com helper scripts/fechar-crypt-royale.ps1.12 cenários de seleção passaram; metadados do EXE real reconhecidos. Consulta real sem encerrar processos. Revalida PID/criação/caminho/comando. Não elimina saves nem fecha todos os Node/Electron. É ferramenta separada do instalador.

## Convites e lista
Lista Royale selecionada com17 endereços únicos, contendo todos os15 do Pulso. Todos os13 únicos reenviados pelo usuário presentes; macieleeflavio duplicado ignorado. Não foi necessário alterar a lista. Prova testadores-reconfirmados-20261028.png.

Convite oficial https://play.google.com/apps/internaltest/4701495716764622459 conferido com flagober já inscrito e flaviobji2023 mostrando “Accept invite”; não aceito automaticamente nessa outra conta. Usuário relata erro ANTES de aceitar em infrapredialvix, que está na lista, mas não está conectado no navegador disponível ao agente. O caso específico continua sem reprodução na conta/aparelho afetado; não declarar resolvido. Orientado copiar o convite na barra do Chrome, preferencialmente sessão privada com a conta de serviço, aceitar e usar a mesma conta na Play Store. Não usar o convite do Pulso nem começar pelo link direto da loja.

## Nome e limites
Pesquisa preliminar encontrou jogo Crypto Royale em cryptoroyale.one. Logo aprovada não libera o nome juridicamente. Não foi feita busca integral de anterioridades nem confirmado registro de terceiros no Brasil; recomendada avaliação INPI/profissional antes lançamento comercial. Detalhes e fontes em NOTA-NOME-CRYPT-ROYALE-2026-10-28.md. Nome/pacote/domínio não alterados automaticamente.

Permanecem pendentes: conta Apple/Mac/assinatura/Sign in with Apple/exclusão de conta/revisão; cadastro público Play e requisitos de teste fechado; campanha primeiros100 e monetização. API administrativa de brindes ainda depende do reinício manual informado no relatório0.14. Não foram enviados e-mails, postagens ou brindes reais.

## Artefatos
- dist-apk/Crypt_Royale_v0.15.apk
- dist-apk/Crypt_Royale_v0.15_BETA.aab
- dist-electron/Crypt Royale Setup 0.15.exe (sem certificado Authenticode)
- dist-pacote/v0.15/Crypt_Royale_v0.15_Projeto_iOS.zip
- dist-pacote/v0.15/manifesto.json

Log local: v0.15-a1d53a6b-f5d4-485a-a74d-782c35876a03.log. Estágio0.15-1793192063749-25885885. Servidor de QA5189 iniciado e encerrado pelo agente; outros serviços preservados.
