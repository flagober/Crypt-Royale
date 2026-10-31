# Entrega confirmada — v0.5 — 18/10/2026

Gosma corrosiva doCodeSlime integrada:3s,base8dano/0,5s,contatoindividualsemacúmulo,imunidades,bolhas efeedbackverdeporperdaHP.115testes+35checksvisuais passaram; navegador confirmou40/48HPno0,5s e0/48HPaos3s/poçaencerrada na simulação real. Fonte/web/APK/Windows espelhadosSHA256. APKassinadov1/v2/v3verificado,buildAndroid3. WindowsPE0.5.0 eaberturaempacotada verificados.

Instaladores:dist-apk/Crypt_Royale_v0.5.apk e dist-electron/Crypt Royale Setup 0.5.exe. Manifesto:dist-pacote/v0.5/manifesto.json. Aplicativosinstaladosprecisamreceber0.5; progressoélocal,semnovasincronização. Androidfísicopendente; WindowssemcertificadoAuthenticode. AtualizaçãonãoemiteMCT.

---
# Code Slime — Gosma corrosiva — 18/10/2026

Regras aprovadas por Flavio: duração3000ms, raio28, dano-base8/500ms, primeiro pulso após500ms de contato; seis pulsos possíveis em contato contínuo. Uma contagem por alvo, sem multiplicação por poças sobrepostas. Saída interrompe exposição e reentrada exige novo intervalo. Tropas terrestres inimigas apenas; aliados, voadores e estruturas imunes. Pode derrotar unidades. Reduções de dano e escudos existentes continuam aplicáveis; o número flutuante informa a perda real deHP.

Lentidão anterior15% mantida somente para terrestres; visual com bolhas e pulsogreen350ms no inimigo por perdaHP, feedback de número400ms. Modo movimento reduzido respeitado. Poças não dão dano retroativo ao entrar e renderização não altera simulação. Ticks param ao término da partida.

115testes passaram, incluindo7cenáriosnovos: duração/seispulsos/morte; múltiploscontatos/nãoacúmulo; imunidades; saída/reentrada; cruzamentoexpiração/escudos; pausa/idempotência/partidanova; finitude/estadocanvas/imutabilidade. Prévia técnica corrosion-check.html usaengine real e fixture48HP, é de desenvolvimento e não integra os instaladores. Jogo recebeimplementação sem dependerda prévia.

BackuppreventivoSHA256; espelhoC/G. Preparar próximo pacote pelo geradorúnico (0.4→0.5); só confirmar instaladores apóscompilação/assinatura/smoketest.
