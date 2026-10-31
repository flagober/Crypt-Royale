# Crypt Royale no iPhone — preparação de 28/10/2026

O projeto nativo foi criado com Capacitor6.2.2, pacote `com.monstercrypt.cryptroyale`, no Firebase compartilhado `monstercrypt-core` com um app iOS próprio. Configuração GoogleService-Info.plist, callback Google e dependência CocoaPods Google estão no projeto. Nenhum dado/chave privada de outro aplicativo foi copiado.

**Não há IPA compilado, assinatura Apple, teste em iPhone ou cadastro concluído no App Store Connect.** Flavio informou que ainda não possui conta Apple Developer nem Mac. O gerador Windows entrega um ZIP de projeto iOS com o mesmo conteúdo web congelado e a mesma versão do Android/Windows; esse ZIP não instala no iPhone.

## Próximo ambiente necessário

Criar a conta Apple pessoal, ativar autenticação de dois fatores e inscrever-se no Apple Developer Program, cuja anuidade anunciada é US$99: https://developer.apple.com/programs/ . A inscrição, identidade, termos e pagamento ficam com o titular. Usar um Mac próprio, emprestado ou um serviço macOS contratado explicitamente; nenhuma contratação foi feita neste lote.

No Mac com Xcode compatível com os requisitos vigentes da Apple e CocoaPods, extrair `Crypt_Royale_vVERSAO_Projeto_iOS.zip`, executar `npm ci` e `node scripts/prepare-ios.cjs`. O pacote contém o conteúdo web já gerado; o passo copia esse conteúdo para o projeto e resolve as dependências nativas. Abrir `ios/App/App.xcworkspace`, selecionar a equipe Apple e configurar assinatura. A versão pública e o build são carimbados pelo gerador único. Para trabalhar a partir do repositório completo, gerar o web pelo gerador antes de sincronizar iOS.

## Antes de TestFlight/App Store

- Habilitar e integrar Sign in with Apple (Google já é uma opção de login; conferir diretriz4.8), vincular o provedor no Firebase com a equipe Apple e validar todos os provedores em dispositivo. Isso depende da conta/equipe Apple e ainda não foi concluído.
- Revisar exclusão da identidade/conta do jogo conforme diretriz5.1.1: a ação beta atual apaga o save, preservando a identidade Firebase compartilhada com outros aplicativos; não anunciar como exclusão completa da conta Apple/Google. Implementar o fluxo adequado ao produto antes de enviar para revisão.
- Conferir privacidade, manifestos dos SDKs, coleta de dados, classificação etária, divulgação de MCT como integração pendente e ausência de promessa financeira. Não habilitar compras/VIP pagos sem StoreKit e regras das lojas.
- Validar telas/notches, orientação, áudio, retomada, login, conflito entre aparelhos, correio e progresso em iPhone/iPad. Os testes Chromium/Windows deste lote não comprovam funcionamento iOS.
- Criar o registro no App Store Connect, enviar o arquivo assinado, realizar TestFlight e preencher a ficha da loja. A publicação depende da revisão Apple.

Referências oficiais: https://developer.apple.com/programs/enroll/ ; https://developer.apple.com/app-store/review/guidelines/ ; https://capacitorjs.com/docs/ios .


## Decisão de Estratégia iOS — 31/10/2026

- Criação de conta paga no Apple Developer Program suspensa por enquanto.
- Fluxo de compilação selecionado: Opção B (Mac na nuvem / automação CI GitHub Actions) + software Xcode gratuito no ambiente macOS para geração do arquivo `.ipa`.
- Workflow oficial criado em `.github/workflows/compilar-ios.yml` rodando em runner `macos-14` com Xcode oficial.
- Custo: 100% gratuito (minutos inclusos do GitHub Actions sem cobrança de licença Apple).
- Distribuição aos usuários de iPhone: via pacote executável `.ipa` instalado por ferramentas gratuitas de sideloading (Sideloadly, AltStore, SideStore) usando qualquer Apple ID gratuita.
