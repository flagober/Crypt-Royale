# Pacote0.11 — compilado; envio Google Play exige minSDK24

Gerador único concluído com exit0 em27/10/2026. APK, AAB assinado e Windows compilados da mesma fonte congelada;161 testes passaram, assinatura AAB/bundletool/API36 e smoke Windows verificados. Nove arquivos publicados pelo gerador espelhados com SHA256;154 arquivos web conferidos contra o manifesto.

- APK132023569bytes · SHA25639e8024963f295043ec8484544b36ff0985bcffcb721243e9f82eebe4f0bebf9.
- Windows234865815bytes · SHA256c6f0c3f2c98d93606b2acdf3f81f3c9d826e2319ed52334327569177fc59ee4b.
- AAB129215500bytes · SHA256f7476c52fa03934e51cfe469c4f0ed32af73284650737856f456538e9a932078.

Firebase real verificou acesso individual e recuperação em dois navegadores isolados; nenhuma conta real do jogador foi usada nos testes. Google nativo/Windows requer teste com o titular. Conta de desenvolvedor flagober criou Crypt Royale, pacote com.monstercrypt.cryptroyale, app4972181214995920647, após aprovação explícita das declarações pelo Flavio.

O AAB0.11 foi enviado, mas o Console mostrou erro: Proteção Automática requer minSDK24, enquanto0.11 usava22. Não houve liberação deste pacote aos testadores. Corrigir em0.12/build10, mantendo proteção ativada e preservando0.11. Não enfraquecer a segurança para contornar essa validação.
