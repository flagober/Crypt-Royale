# Crypt Royale — Gerador único de instaladores

Entrada pública: **gerar_crypt_royale.bat** na pasta C:\MonsterCrypt_Ecosystem_V1.0\Crypt-Royale. Se aberto pelo espelho, encaminha para o C. Não compilar dentro do Google Drive. Não reutiliza configurações, autenticação ou conectores do Vix.

## Comandos

- `gerar_crypt_royale.bat` — próxima versão para Windows e Android.
- `gerar_crypt_royale.bat --verificar` — preflight de JDK/SDK/dependências; não muda versão ou cria chave.
- `gerar_crypt_royale.bat --manter-versao` — repetir uma versão já publicada, sem incrementar. Útil para repetir geração após falha de cópia/espelho; não é o fluxo padrão para mudanças novas.

Versão pública curta: 0.2 → 0.3 → 0.4 → ... → 0.10. Electron/package.json/package-lock.json usam versão técnica equivalente, como 0.3.0. Android usa versionName0.3 e versionCode crescente. O app exibe a versão pública de versao.json. Ambos são gerados em um só comando; nenhuma etapa interna incrementa de novo. Se uma compilação falhar, a fonte preserva a versão anterior e a cópia de diagnóstico permanece no C. Nenhum instalador anterior é removido.

## Fluxo

1. Verificar fonte local, metadados do espelho, Node/dependências, JDK17, Android SDK Platform34 e BuildTools34.0.0. Drive mais recente provoca interrupção para conferência; nunca importa código antigo automaticamente.
2. Adquirir trava exclusiva; criar cópia local congelada com código/arte de runtime/fontes nativas e lockfile. Excluir caches, instaladores antigos, perfis e segredos. Chave Android nunca entra na cópia.
3. Avançar versão somente nessa cópia, instalar pelo lockfile, executar testes e construir uma única pasta web.
4. Inserir notas e metadados idênticos para ambos; gerar APK release, assinar e verificar a assinatura. Conferir applicationId, versionName e versionCode do binário.
5. Gerar instalador Windows NSIS e abrir o aplicativo empacotado em smoke test oculto com perfil temporário próprio. Conferir nome/versão nas propriedades nativas do EXE, arena, versão exibida e imagens carregadas, sem instalar no Windows nem alterar dados do jogador.
6. Conferir conteúdo web e notas dos dois formatos e detectar mudanças na fonte durante a geração. Mudança concorrente interrompe a publicação.
7. Backup antes de substituir arquivos públicos; publicar os dois artefatos, notas e manifesto com hashes. Atualizar os metadados da fonte e espelhar os arquivos publicados com verificação SHA256.

## Saídas

- dist-electron/Crypt Royale Setup VERSAO.exe — instalador Windows x64, NSIS, por usuário, escolha de pasta e atalhos.
- dist-apk/Crypt_Royale_vVERSAO.apk — APK release assinado para instalação direta Android.
- dist-pacote/vVERSAO/notas.md — notas comuns congeladas.
- dist-pacote/vVERSAO/manifesto.json — versão/build, tamanhos, hashes dos artefatos, notas, metadados, fonte e conteúdo web.

Instalações Windows anteriores precisam receber o novo instalador. APKs precisam ser atualizados no Android. Espelhar o projeto não atualiza automaticamente aplicativos já instalados.

## Identidade, assinatura e dados

- applicationId/namespace Android: com.monstercrypt.cryptroyale. Não é o app do Vix.
- Windows: Crypt Royale; dados em %APPDATA%/MonsterCrypt/CryptRoyale. A atualização mantém a pasta e o instalador não foi configurado para apagá-la.
- Android: dados privados do próprio aplicativo e origem https://cryptroyale.local, mantidos nas atualizações com a mesma identidade/chave. Desinstalar ou limpar os dados pode apagar o progresso.
- Chave de assinatura e credencial ficam somente em %LOCALAPPDATA%/MonsterCrypt/CryptRoyale/Signing. Não espelhar no Drive, enviar por chat ou empacotar. A mesma chave é necessária para atualizar o APK; não apagar a pasta Signing. Fazer backup privado seguro adicional antes de trocar de computador.
- O APK possui assinatura própria; não foi enviado a uma loja. O instalador Windows não possui certificado Authenticode de editor. Não foi feita instalação no celular físico nesta geração; a validação do APK é de compilação, metadados e assinatura.
- O progresso do navegador, Windows e Android é independente nesta etapa. Atualizações mantêm a identidade da instalação, mas não importam sessão nem saldo de outro dispositivo. Recursos continuam locais de teste, sem distribuição MCT.

## Ambiente

Electron estável44.9.0 e electron-builder26.15.3; Capacitor6.2.2 e SDK34, seguindo a cadeia Android já disponível no notebook/Vix. Essa configuração produz APK para testes internos; publicação em loja e migração para SDK/Capacitor mais recentes são etapas próprias. Java17 é selecionado explicitamente para Gradle8.2.1, sem trocar o Java global nem desativar proteções do Windows.

Referências primárias consultadas: https://www.electronjs.org/docs/latest/api/protocol/ , https://www.electronjs.org/docs/latest/tutorial/security e https://capacitorjs.com/docs/v6/android .
