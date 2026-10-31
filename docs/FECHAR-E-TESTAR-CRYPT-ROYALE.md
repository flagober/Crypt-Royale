# Fechar o jogo e participar da beta — 28/10/2026

## Fechamento forçado no Windows

Abra `fechar_crypt_royale.bat` na raiz do projeto. Ele chama `scripts/fechar-crypt-royale.ps1`.

Fecha o aplicativo identificado por nome de executável e metadados próprios, o Electron deste projeto e seu servidor Vite. Não encerra todos os processos Node/Electron, não fecha o Chrome e não remove saves, contas ou arquivos. Uma partida ou alteração ainda não salva pode ser perdida.

Para consultar sem fechar, use `fechar_crypt_royale.bat -Listar`. Não solicita elevação automática nem mexe nas proteções do Windows; processos inacessíveis geram mensagem de erro. Antes de encerrar, revalida PID, criação, caminho e comando para evitar atingir outro processo que reutilizou o número.

Validação: 12 cenários de seleção aprovados, incluindo Vix, painel, Chrome, build, executável renomeado e caminhos com prefixo/sufixo parecidos. Consulta real concluída sem encerrar processos. Nenhum processo do usuário foi fechado durante os testes.

## Beta Google Play

Convite oficial do Crypt Royale: https://play.google.com/apps/internaltest/4701495716764622459

1. Abra o convite no Chrome do celular, em vez de começar pelo link direto da loja.
2. Confirme que a Conta do Google mostrada é o e-mail autorizado para essa pessoa.
3. Aceite participar do teste. Se já constar como testador, não é necessário aceitar novamente.
4. Use o link de download mostrado nessa página e confira a mesma conta no avatar da Play Store.

Conferência ao vivo em28/10: lista “Crypt Royale — Beta interno” selecionada,17 endereços únicos. Os15 endereços da lista anterior do Pulso estão todos presentes. Os13 e-mails únicos reenviados pelo usuário também estão presentes, inclusive infrapredialvix, bernardopereiragomes0809 e macieleeflavio. Não houve necessidade de adicionar novamente nem alterar a lista do Pulso.

O usuário informou “item não encontrado” na conta infrapredialvix. A inclusão está confirmada, mas não foi possível reproduzir a adesão nessa conta do aparelho do usuário. Não declarar que a causa foi corrigida sem verificar a tela da conta afetada. A documentação Google exige inclusão na faixa e adesão individual; alterações podem levar algumas horas para propagar.

Fonte: https://support.google.com/googleplay/android-developer/answer/9845334?hl=pt-BR

Teste interno não substitui o teste fechado exigido para acesso à produção em contas pessoais abrangidas pela regra dos12 testadores/14 dias.

Confirmação posterior: erro da conta infrapredialvix ocorre ANTES de aceitar. O convite oficial foi conferido na conta principal e mostra testador já inscrito. A conta de serviço não está conectada no Chrome disponível ao agente; portanto o teste nessa identidade permanece pendente. No aparelho afetado: copiar o convite oficial na barra do Chrome (sem abrir direto no aplicativo Play Store), entrar explicitamente em infrapredialvix e aceitar. Após isso, conferir a mesma conta na Play Store. Se continuar antes da aceitação, registrar a tela e a URL sem credenciais; não supor falha de APK.
