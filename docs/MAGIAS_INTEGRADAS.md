# Entrega confirmada — v0.5 — 18/10/2026

Gosma corrosiva doCodeSlime integrada:3s,base8dano/0,5s,contatoindividualsemacúmulo,imunidades,bolhas efeedbackverdeporperdaHP.115testes+35checksvisuais passaram; navegador confirmou40/48HPno0,5s e0/48HPaos3s/poçaencerrada na simulação real. Fonte/web/APK/Windows espelhadosSHA256. APKassinadov1/v2/v3verificado,buildAndroid3. WindowsPE0.5.0 eaberturaempacotada verificados.

Instaladores:dist-apk/Crypt_Royale_v0.5.apk e dist-electron/Crypt Royale Setup 0.5.exe. Manifesto:dist-pacote/v0.5/manifesto.json. Aplicativosinstaladosprecisamreceber0.5; progressoélocal,semnovasincronização. Androidfísicopendente; WindowssemcertificadoAuthenticode. AtualizaçãonãoemiteMCT.

---
# Code Slime — Gosma corrosiva — 18/10/2026

Regras aprovadas por Flavio: duração3000ms, raio28, dano-base8/500ms, primeiro pulso após500ms de contato; seis pulsos possíveis em contato contínuo. Uma contagem por alvo, sem multiplicação por poças sobrepostas. Saída interrompe exposição e reentrada exige novo intervalo. Tropas terrestres inimigas apenas; aliados, voadores e estruturas imunes. Pode derrotar unidades. Reduções de dano e escudos existentes continuam aplicáveis; o número flutuante informa a perda real deHP.

Lentidão anterior15% mantida somente para terrestres; visual com bolhas e pulsogreen350ms no inimigo por perdaHP, feedback de número400ms. Modo movimento reduzido respeitado. Poças não dão dano retroativo ao entrar e renderização não altera simulação. Ticks param ao término da partida.

115testes passaram, incluindo7cenáriosnovos: duração/seispulsos/morte; múltiploscontatos/nãoacúmulo; imunidades; saída/reentrada; cruzamentoexpiração/escudos; pausa/idempotência/partidanova; finitude/estadocanvas/imutabilidade. Prévia técnica corrosion-check.html usaengine real e fixture48HP, é de desenvolvimento e não integra os instaladores. Jogo recebeimplementação sem dependerda prévia.

BackuppreventivoSHA256; espelhoC/G. Preparar próximo pacote pelo geradorúnico (0.4→0.5); só confirmar instaladores apóscompilação/assinatura/smoketest.

---
# Entrega confirmada — Crypt Royale v0.4 — 18/10/2026

16 habilidades e efeitos integrados ao combate local, incluindo cura, controle, bônus, camuflagem/revelação e auras. NúcleoOperador/TorreGuardiã possuem novos disparos/impactos e Bastião possui pulso. Fonte, web, APK e Windows atualizados e espelhados.108testes +35checksvisuais; APK release assinado; metadados e abertura Windows verificados (0.4.0/versãopública0.4). BuildAndroid2. Instaladores em dist-apk/Crypt_Royale_v0.4.apk e dist-electron/Crypt Royale Setup 0.4.exe; SHA256 no manifesto dist-pacote/v0.4/manifesto.json. Windows sem certificadoAuthenticode; instalação físicaAndroid ainda pendente.

Esta etapa antecipa as habilidades dos16monstros a pedido deFlavio, após aprovação visual18/10; referências anteriores a habilidades não implementadas ficam superadas para estes16. Classes/Guerreiro/Guerreira, Nexus eBosses continuam adiados. Parâmetrosdegameplay locais iniciais em docs/MAGIAS_INTEGRADAS.md; balanceamento futuro necessário. Progresso/economia/MCT/Marketplace não ampliados por esta integração.

---
# Magias integradas ao jogo — 18/10/2026

Correção do escopo: efeitos anteriores existiam somente na prévia. Agora engine emite eventos que o renderizador consome. Arte procedural aprovada preservada em spell-art.js, idêntica a public/spell-effects.js. Nenhum dano é executado pelo desenho. Filas por partida limitadas96efeitos/32resíduos e expiração1200ms.

16 mecânicas locais: EnxameBinário(speed+10% no alvo conjunto); Checksum(3ºdisparo+20%, reseta ao trocaralvo); Fragmentação(resíduo1500ms/raio28/lentidão15%); RastroLeal(acelera20%/800ms pertoaliadorecématingido, intervalo4s); SaltoCircuito(primeirogolpe+25% após60distância); MemóriaAlvo(600ms até115distância); CabeçadaByte(primeirogolpeestrutura+20%); PortaTravada(reduçãofrontal15% estacionado); TúnelCobre(preparação1,2s visível translúcida e avanço18 limitadoarena, uma vez); PulsoÓptico(revela2s no primeirogolpe e pode mirarcamuflado); Hotfix(45HP/4s noaliadomaisferido em70, sem autocura/torres); LógicaEncadeada(50%/25%, saltos45, alvosdistintos); KernelPanic(empurra10, primeiro/5s, semtorres/aéreo); PacoteFantasma(camuflaapós2s, +40% primeirogolpe, revela com dano); ZonaBuffer(redução12%, raio40, semacumular); CacheHit(avançoaté45 quandoalvo<=100, +30% primeirogolpe, umavez). Valores antes não especificados noGDD são parâmetros iniciais de teste e exigem balanceamento.

Torres: Núcleo72/850ms, Guardiã54/1000ms mantidos. Novos disparos/projéteis e impacto; Bastião conserva escudos120tropas/180torres por15s, com pulso visual. Anel, impacto e destruição anteriores mantidos. Prévia /tower-preview.html usa mesmo módulo das torres no jogo.

108 testes passaram, incluindo cura real, limitesHP, encadeamento, alvosdistintos, camuflagem/revelação, nãoacúmuloaura, bônusúnicos, recarga, limitesdeavanço, expiração e disparostorres/Bastião.35checksvisuais anteriores passam. UI da batalha validada com automático de teste e Bastião; essas partidas não geram recompensasdeatividade. CorreçãoLogicLizardmantida.

Nenhuma integração MCT/servidor adicionada. Recursosdeprogressão locais preservados. Empacotar pelo gerador único para0.4 Windows+Android; não editarversãomanualmente.
