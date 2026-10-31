---
name: cryptcodex-gemini-accounts
description: Selecionar e autenticar as três contas Google do fluxo CryptCodex com Antigravity CLI, verificando a identidade sem copiar tokens nem confundir seleção com login.
---

# Contas do Antigravity

Contas autorizadas pelo usuário, nesta ordem:
1. `flagober@gmail.com`
2. `flaviobji@gmail.com`
3. `flaviobji2010@gmail.com`

Configuração sem segredos: `C:\MonsterCrypt_Ecosystem_V1.0\Crypt-Royale\.orchestration\config\accounts.json`. Mecanismo: `C:\MonsterCrypt_Ecosystem_V1.0\Crypt-Royale\.agents\skills\cryptcodex-antigravity\scripts\Manage-AntigravityAccount.ps1`.

- `-Action Status` mostra seleção e última confirmação; consulte `agy models` para saber se há sessão funcional. Esse comando não prova qual e-mail está autenticado.
- `-Action Select -Account 1|2|3` registra somente a conta pretendida e invalida confirmação anterior quando a seleção muda. Espelha a configuração sem tokens.
- `-Action Login -Account 1|2|3` seleciona a conta e abre `agy` no terminal atual. Se houver sessão de outra conta, o usuário executa `/logout`, reinicia `agy` e escolhe o e-mail pretendido no Google OAuth. `/logout` remove o perfil autenticado do chaveiro; não é alternância instantânea entre perfis.
- Depois do OAuth, confirme o e-mail mostrado no cabeçalho do CLI. Com evidência visual ou confirmação explícita do usuário, use `-Action Confirm -Account N -ObservedEmail <email>`. O script rejeita divergências e exige que `agy models` funcione. Não invente a identidade a partir da ordem das contas ou de uma resposta do modelo.
- Antes de cada tarefa, o runner exige seleção confirmada e verifica o login via `agy models`. Se o usuário trocar a sessão fora deste mecanismo, invalide a confirmação e confira o cabeçalho novamente.
- Não há troca automática de credenciais implementada. Em erro de autenticação ou limite, preserve resultados, informe o problema e prepare a próxima conta; conclua o login oficial antes de reenviar. Não execute o mesmo pedido simultaneamente em contas diferentes.

Credenciais ficam no mecanismo seguro do Antigravity/Windows. Nunca salve senhas, tokens, cookies ou `auth.json` nos registros ou no Drive. Não use uma chave de API como substituto silencioso das assinaturas Pro.

Documentação oficial: https://www.antigravity.google/docs/cli/install/ e https://www.agy.dev/docs/cli/reference/ .
