# Correção do monitoramento Vite — 18/10/2026

Causa do encerramento: monitoramento de APK durante publicação gerou EBUSY no FSWatcher. vite.config.js agora exclui dist, dist-apk, dist-electron, dist-pacote, android, .gradle e bináriosapk/aab/exe/blockmap. Fontes src e assets public continuam monitorados. Não altera combate nem instaladores0.5jágerados.

Verificação: scripts/check-dev-watcher.mjs iniciaViteemportaefêmera usando configuração real, carregaentradaJSX para ativar observação sobdemanda, verifica diretórios eHTTP200. Executado comAPKtemporário bloqueadoexclusivamente peloWindows, semerro. Testeadicionalno servidor5179: criação de novoAPKbloqueado apósinício e4requisiçõesHTTP200, servidorcontinuouativo. Arquivosdeprova temporáriosremovidos apósfecharalças. Servidorreiniciadooculto no5179,PID14240, comcaminhoabsoluto para detecção pelo inicializador. Não foi necessário alterar olauncher.

Auditorianpm:18alertas(10moderados,7altos,1crítico), incluindo tar na cadeia de ferramentas. npm audit --omit=dev retornou0alertas no conjunto analisado de dependências de produção; isso não é garantia geral de segurança. Alertasdebuildpendentes,sem npm audit fix --force, sem atualização de dependências e sem ampliar aprovação de scripts. Avisoelectron-winstalleréindependente deEBUSY.

Backup e espelhamentoSHA256 dos3arquivos. Versãopública0.5mantida; correçãoexclusiva doambiente dedesenvolvimento, sem regenerarAPK/EXE.
