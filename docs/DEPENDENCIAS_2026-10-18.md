# Entrega confirmada — manutenção v0.6 — 18/10/2026

Auditoria18→13alertas:0críticos,5altos,8moderados.5alertasremovidos,13continuampendentes,semocultação. Arquivosdecombate(37src)preservados; CSSaprovadoidêntico. Antesdecarimbarv0.6,JSgeradotambémidênticoà0.5;pacote0.6mudaosmetadadosdeversão.115testes,buildweb,watcherHTTP200,extraçãorealCapacitor6/tar7tantoenoraizquantoemnpmcilimpopassaram. AndroidBUILD SUCCESSFUL,assinaturav1/v2/v3everão0.6/code4verificadas. WindowsPE0.6.0eaberturaempacotada0.6verificados. Fonte/web/instaladoresespelhadosSHA256.

Instaladores:dist-apk/Crypt_Royale_v0.6.apk e dist-electron/Crypt Royale Setup 0.6.exe. Manifesto:dist-pacote/v0.6/manifesto.json. WindowssemcertificadoAuthenticode; instalaçãofísicaAndroidnãorepetidanestaetapa.13alertasestãonasferramentas,auditoriaproduçãosemalertas,semgarantiadesegurançageral.

---
# Revisão de dependências — 18/10/2026

Flavio confirmou corretos os16poderes/torres, legibilidade/balanceamento da gosma e desempenho em grupos. Esta etapa segue para ferramentas de build, sem mudança no conteúdo aprovado.

Auditoria:18alertas(10moderados7altos1crítico) →13(8moderados5altos0críticos). Correções fixadas: source-map-js1.2.2; postcss-selector-parser7.1.6; tar7.5.22 somente noCapacitorCLI6.2.2. Não usados npm audit fix --force ou migraçãoCLI/Android/Tailwind. npm audit não é garantia geral de segurança.

Interop tar: CLI6 usa defaultimportTS para pacoteCommonJS; tar7 exporta funçõesnomeadas. postinstall scripts/prepare-build-tools.cjs adaptaexatamente1linha em@capacitor/cli6.2.2/dist/util/template.js, recusa versão/conteúdodivergentes, éidempotente e aplica apósnpmci. Semdesativarvalidações ouintegridadedownloads. Teste scripts/check-build-tools.cjs cria arquivo confiável, gera.tar.gz eusaextractTemplate realCLI6 comtar7, conferindoconteúdo. AndroidSDK34/JDK17/Capacitorcore6mantidos.

13pendências nãoocultadas:5altos ligadosàbraces3/Tailwind3 e8moderadosna cadeiaelectron-builder/@electron/get3/global-agent/roarr/sprintf-js. Registro npm ainda oferece braces3.0.3/sprintf-js1.1.3, versõesafetadas. @electron/get5 mudouAPIdeopçõesdownload/proxy; builder26.15.3 usaopçõesGot/progress. Substituiçãoforçada porget5poderiaquebrardownloads,portanto nãoaplicada. Próximas opções: migraçãoTailwind4comrevisãovisual e atualizaçãocompatíveldobuilder quandohouverfix. Alertasfornecidos emdocs/audit-before-20261018.json e audit-after-20261018.json. Semaprovação genéricadescripts: aviso electron-winstaller/Squirrelpersistente,NSISnãorequerseuinstalador.

115testes passaram. BuildJS eCSS idênticos byteabyteàv0.5 aprovada; todososarquivossrc batemcomSHA256domanifesto0.5. TestewatcherHTTP200passou. Gerarpacote0.6paraverificarcadeianativa e postinstall eminstalaçãolimpa; só afirmarinstaladoresapósconcluir.

Nota debackup: comandoinicialfalhouporaspasantesdecriarbackupnovo; package/lockoriginais jáexistiamnapastacongelada0.5enocópiaGintacta. ConferidoscontraSHA256domanifesto0.5 e preservadosembackupverificadoantesdecontinuar. Demaisarquivosnovos/inalteradosregistradosnobackup. Nenhumoriginalperdido.

Fontesprimárias: https://github.com/isaacs/node-tar/security/advisories/GHSA-23hp-3jrh-7fpw ; https://github.com/postcss/postcss-selector-parser/security/advisories/GHSA-rj75-hqrm-r3gf ; https://github.com/electron/get/releases/tag/v5.0.0 .
