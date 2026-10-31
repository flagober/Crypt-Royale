## 19/10/2026 — Correção azul: vistas de costas candidatas

Usuário apontou que personagens azuis devem defender olhando para cima. Criadas4folhas2x2 de costas, total16poses, Arqueira/Arqueiro/Guerreiro/Guerreira. Prévia blue-defense-preview.html mostra3torres e troca de classe central.16recortes/pivôs validados. Corrigido contato de brilho entre linhas usando divisão2x2 antes do isolamento. Documentação DEFESA_AZUL_COSTAS_CANDIDATA_2026-10-19.md. Runtime ainda com vistas frontais em ambas equipes: não aplicado lote novo, aprovação visual pendente conforme skill animação. Após aprovação: integrar back somente no player, manter front no enemy, origem de projétil e timing reais preservados.

---
## 19/10/2026 — Ataques frontais aprovados integrados

Usuário aprovou: EXCELENTE APROVADO!!! Runtime usa4posesfrontais por arqueiro, esquerda feminina/direita masculina; preparo/corda/soltura/recuperação ligados ao relógio real. Ataque continua54dano/1000ms/105alcance, filtros por rota/metade preservados. Primeiro disparo imediato; desenho não aplica dano. 128 testes e build isolado passaram; navegador sem erros, automático de teste desligado. Novas imagens não precisam de outra aprovação. Sem instaladores novos (publicados0.6). Ver docs/ATAQUES_FRONTAIS_INTEGRADOS_2026-10-19.md. Próximo: teste manual do usuário; eventuais ajustes de alvo/vistas conforme feedback.

---
## 19/10/2026 — Candidatas frontais dos arqueiros

Usuário pediu posição frontal para ambos. Duas novas folhas frontais2x2 produzidas e prévia archer-attack-preview.html atualizada,8recortes/pivôs validados e conferidos no navegador sem erros. Fontes laterais preservadas. Nenhuma integração de novos ataques no runtime ainda. Ver docs/ARQUEIROS_ATAQUE_FRONTAL_2026-10-19.md; screenshot arqueiros-frontais-lado-a-lado-20261019.png. Aguardando aprovação visual.

---
## 19/10/2026 — Ataques de arqueiros candidatos, aguardam revisão visual

Usuário aprovou integração anterior e pediu prosseguir. Criadas folhas2x2 próprias para preparar/puxar/soltar/recuperar, feminina direita e masculina esquerda. Prévia http://localhost:5179/archer-attack-preview.html, controles conferidos, oito recortes e pivôs validados, console sem erros. Ciclo proposto850ms, quatro poses por personagem. Metadados archer-attack-candidate-v001.json. Prompts/docs em docs/ATAQUES_ARQUEIROS_CANDIDATOS_2026-10-19.md. Novos assets ainda NÃO integrados, aguardando aprovação visual da skill de animação. Jogo continua poses únicas+recuo, instaladores0.6. ServidorVite iniciado nesta etapa, sessão82220. Aprovação anterior registrada em docs/APROVACAO_TORRES_ARQUEIROS_2026-10-19.md.

---
## Arqueiros aprovados integrados — 18/10/2026

Composição v007 aprovada integrada ao jogo local: Arqueira esquerda e Arqueiro direita nas duas equipes, verde/prata nas armaduras/flechas, capas/arcos roxo/rosa e azul. Laterais mais baixas15%, central mais alta15%. Personagens separados das bases; flechas saem do arco nos eventos reais sem alterar dano, alcance ou recarga. Arqueiros usam uma pose cada e recuo no disparo; vistas e animação desenhada completa de arco continuam pendentes. 127 testes e build passaram, navegador sem erros. Instaladores continuam0.6. Ver docs/ARQUEIROS_INTEGRADOS_2026-10-18.md e captura docs/arqueiros-integrados-20261018.png.

---
## Ajustes de arena e menu — 18/10/2026

Operador central movido para menu de três pontinhos, disponível em desktop/celular. Arena móvel ganhou45px de altura disponível. Laterais deslocadas um quadro horizontal de30px para fora (x58/302); três torres azuis desceram28px (guardas y496, central530). Mudança de posição afeta distâncias de combate, mantendo os valores de alcance e filtros por rota/metade. Faixa central e pontes preservadas conforme resposta do usuário. Construções reduzidas para72px central e60px laterais, personagens ampliados75% (base84 contra48). Origem dos projéteis acompanha canhão/espada. Margem rival64px acomoda personagem. Testes passaram; build isolado concluído. Fixtures de teste de rota e anel desacopladas das antigas coordenadas fixas. Captura docs/arena-ajustes-20261018.png. Sem novos instaladores.

---
## Escala visual das torres — 18/10/2026

Central +40% (67,2px), laterais +30% (57,2px). Personagens mantêm tamanho anterior; canhões e sombras acompanham as construções. Núcleo rival com deslocamento visual48px para caber no topo, sem mudar posição de combate. Alcance, colisões, dano e regras de rota preservados. 125 testes e build isolado passaram. Captura docs/torres-escala-20261018.png. Ajuste no jogo local, ainda sem novos instaladores.

---
## 18/10/2026 — Artes v004 aprovadas e integradas ao jogo local

Usuário: aprovado. Integração concluída no motor/renderizador: Guerreiro/Guerreira selecionáveis e persistentes por instalação; frente/esquerda/direita sem espelhamento; poses ligadas ao disparo real; bases fixas e canhões móveis sem personagens nas laterais. Filtros de rota/metade defensiva e atributos preservados. Recorte isolado por componente alfa e pivôs aprovados. Layout mobile mostra seis torres; desktop com cabeçalho em linha inteira. 125 testes passaram, build isolado passou e seleção feminina sobreviveu ao recarregamento. Teste automático sem erros de console, sem recompensa elegível. Manifesto e hashes aprovados preservados. Ver docs/INTEGRACAO_CLASSES_TORRES_2026-10-18.md e captura docs/classes-torres-no-jogo-20261018.png.

Instaladores existentes continuam v0.6; nenhuma nova compilação APK/EXE nesta etapa. Gerador único fará próxima versão quando solicitado. Próximo: usuário testar integração no jogo local; nenhuma nova aprovação visual pendente para v004.

---
## 18/10/2026 — Frente e defesa por rota (v004 candidata)

Usuário aprovou v003 e confirmou: cada torre defende sua rota respeitando o meio. Implementado no motor local filtro de metade defensiva, Guardiãs esquerda x<180/direita x>180 e Núcleo cobrindo linha central/ambas as faixas somente no alcance125. Guardiãs105; dano/recargas preservados. Política src/public idêntica e testada. 120 testes de jogo +7 de prévia passaram; build isolado passou. Dois novos PNGs frontais, quatro poses cada; prévia agora frente/esquerda/direita com pés apoiados. Regra de combate já alterada no fonte; novas artes ainda candidatas, não integradas ao renderizador nem empacotadas. Instaladores seguem0.6. Ver docs/CLASSES_FRENTE_ROTAS_2026-10-18.md. Prévia http://localhost:5179/class-tower-preview.html, modo À frente/centro, classe Guerreira. Próximo: aprovação da frente e integração do conjunto visual.

---
## 18/10/2026 — Classes/torres: candidata visual v003

Prévia: http://localhost:5179/class-tower-preview.html. Central v002 com piso amplo preservada; Guardiãs em base fixa + canhão móvel com mira contínua, sem personagens; Guerreiro e Guerreira com quatro poses próprias em duas direções, sem flip global. Guerreira predominantemente prata/grafite com frisos e cristais/runa roxos/rosados discretos. Recorte por componente alfa impede fragmentos entre poses. Alvo automático/fixo/manual, seis testes passaram e UI conferida nos dois lados. Fontes, prompts e manifesto preservados. Detalhes em docs/CLASSES_MIRA_2026-10-18.md. Aguardando aprovação visual antes de integrar ao combate. Jogo/instaladores continuam v0.6; nenhum src de combate alterado.

---
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

---
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

---
# Magias candidatas v002 — 18/10/2026

Produção conjunta: Antigravity CLI Opus4.6 Thinking e revisão Codex. 16 renderizadores individuais, preparação/efeito/impacto, geometria determinística e caminho de movimento reduzido. Prévia /spell-preview.html: filtro, pausa, reiniciar, quadro, velocidade e fundos. Arte aprovada preservada, personagem voltado à direita sem espelhamento.

Verificações: node scripts/verify-spell-effects.mjs — 35 checks, zero erros; npm test — 98 testes existentes passaram. Checagem independente percorreu16efeitos com passo25ms, com/sem movimento reduzido, verificou coordenadas finitas, save/restore e imutabilidade do catálogo (21983chamadas). Navegador confirmou16efeitos carregados, filtroPatchToad, pausa/reiniciar/quadro; snapshot docs/magias-opus-v002-20261018.png. Não há prova de testes em aparelho físico.

Correções Codex: runner sem --effort para modelosClaude, exclusão de caches/artefatos nativos/assinaturas do snapshot; hook de telemetria corrigido por wrapper CMD local, mantendo ativo e sem espelhar perfil; falso positivo do verificador para Math.random em comentário corrigido para detectar chamadas; direção de sprite e rótulo aliado na prévia. Nenhuma permissão global ampliada.

CLI inicial recusou esforço; segundo run encontrou hook; terceiro leu referências mas RunCommandfoirecusado; execução final edit-only entregou código e testes, sem executar comandos. Seu statusSUCCESS isolado não foi tratado como prova: Codex executou os testes e escreveu este relatório, ausente no retornoCLI. Logs em .orchestration/runs/20261018-092120-932-2026-10-18-magias-opus-edicao.

Contas: nenhuma troca nem fallback foram necessários por cota; não há soma de cotas nem autenticação simultânea comprovada. Conta selecionada/configuração histórica não equivale a nova prova da identidade. Modelos alternativos autorizados pelo Flavio: Gemini3.8FlashHigh, Sonnet4.6 e Gemini3.1Pro quando disponível.

STATUS: aprovação visual pendente. Mecânicas de cura, dano, lentidão, camuflagem, encadeamento e demais atributos NÃO integradas ao combate; catálogo mantém mechanicsActive:false. Não houve geração de novosAPK/EXE ou alteração da versão0.3. Após aprovação, integrar efeitos/eventos e implementar/testar mecânicas em etapa delimitada. Não substituir artes aprovadas.

---
# Rotina diária e eventos — Crypt Royale 0.2.0 — 17/10/2026

Pedido atual: fases3/4 de atividades e eventos antes de retomar Guerreiro/Guerreira. Assets anteriores preservados e produção pausada. Implementados no jogo: Central de Atividades (desktop presente no cabeçalho; mobile Menu → Missões e eventos), 3 missões diárias, primeira vitória, check-in7dias, objetivo9missões semanais e evento OperaçãoVilaByte(3vitórias/5000dano/4criaturas). Gold/XP/cartas/FragmentosDeDados LOCAIS DE TESTE, sem alterar atributos de combate. Conta/ledger global, MCT, Bosses/Ecos, níveis/evoluções e habilidades NÃO implementados.

V10 07/09 atualizados conferidos: 1MCT no7ºcheck-in consecutivo, mas tabela28diaslegada diverge. Nenhum valor novo MCT definido nem emissão/voucherativado. Ativação depende orçamento/identidade/servidor/ledgercompartilhado, evitando resgateduplicadoRoyale/RPG. Ciclo localGold não perdeposição porfalta; contador consecutivoseparado.

Engine rastreia implantações, dano efetivo e qualquer uso do automático. Conclusão manualmínimo30s e idempotente. Resgates explícitosúnicos, relógioSãoPaulo, semanal segunda-feira. Profilelocal cryptroyale.activities.v1 e backupanterior; falhaspreservamdados. WebLocks coordenaabas quando disponível; sem alegar segurança financeira. Abrircentralpausa simulação e isola teclado/fundo. Correção de inicialização evita recriar estado da arena/VFX a cada renderização de HUD.

94 testes e build passaram. UI no IAB tab3 mostrou checkin30Gold10XP de teste persistindo apósreload e impedindorepetição. Eventos/objetivos/caches com conteúdo conhecido visíveis. Previews docs/atividades-diarias-20261017.png e atividades-eventos-20261017.png. Servidorlocal5179 iniciado; acessoVPN100.79.208.33:5179. Progresso do navegador não se espelha C/G nem entreorigens/dispositivos; apenas arquivos do projeto. Regras de teste e pendências em docs/ATIVIDADES_E_EVENTOS.md.

Próximo: feedback de UX/balanceamento local; planejar conta/servidor/pool antes deMCT. Retomarprodução classes quandoFlaviosolicitar; continuar classes/TierII→Nexus→Bosses→habilidadesdeTODOS→novosmonstros. Não integrar os candidatos antigos do Guerreiro/Guerreira sem nova revisão/aprovação visual.

---
# Guerreira — prévia esquerda 3 quadros montada para revisão
03/10/2026: usuário pediu prosseguir. Criado HTML separado art-source/previews/warrior-female-left-walk-v001.html com ciclo contato aprovado → neutro candidato → contato oposto imagegen candidato → neutro. Navegador confirmou3imagens carregadas, seleção/pausa/avanço/velocidade/reprodução. Prévia aberta para usuário, servidor5179. Captura/report preservados. Sem alterar imagens nem jogo, sem nova aprovação visual presumida. Próximo alinhar escala/pivôs e concluir transparência antes da folha final; manter aprovados. Backup/lote/chat espelhados SHA verificados.
---
# Guerreira — contato oposto imagegen candidato, alternância visível
03/10/2026: Nano Pro nova conversa a36bd786315f004d v003 (referência limpa) e v004 (guias vermelho/verde desenhadas na UI) ainda repetem ordem; rejeitados e preservados. Informado teste complementar skill imagegen/OpenAI integrado. Resultado female_left-opposite_imagegen_v001.png: joelheira grande/próxima esquerda em primeiro plano, joelheira distante direita recuada; alternância visível. CANDIDATA para avaliação, não aprovada automaticamente nem integrada. PNG alpha real verificado, escala/pivôs ainda precisam normalização. Preservar contato feminino Nano v004 aprovado e neutro Nano v001 candidato. Próximo aprovação deste contato, montagem/revisão ciclo1-2-3-2; demais vistas e masculino continuam pendentes. Backup e espelho SHA verificados, chat salvo.
---
# Guerreira — contato oposto ainda pendente
03/10/2026: duas tentativas Nano Pro2/2 na conversa dc88e1e17bd1e6c7 preservadas female_left-opposite_nano_v001/v002.jpg. V001 levanta bota dianteira; v002 levanta perna traseira. Nenhuma comprova troca das pernas inteira. NÃO integrar nem solicitar aprovação como correção pronta. Contato esquerdo v004 aprovado preservado; neutro v001 candidato preservado (última resposta foi prossiga, sem aprovação explícita). Falta contato oposto linha3coluna1 e revisão ciclo1-2-3-2. Próximo usar controle visual localizado, evitando repetir comandos globais. Backup e espelho SHA do lote verificados; nenhuma mudança no jogo.
---
# Guerreira — quadro neutro esquerdo candidato
03/10/2026: contato v004 APROVADO permanece preservado. Novo quadro linha3coluna2 gerado por edição localizada na mesma conversa dc88e1e17bd1e6c7, Pro2/2. Original salvo female_left-neutral_nano_v001.jpg; pernas aproximadas, botas orientadas à esquerda, espada e escudo completos, identidade/capa consistentes. AGUARDA avaliação do usuário, não integrado. Após aprovação, criar contato contrário da linha3coluna1 e revisar ciclo1-2-3-2 antes de demais direções. Fundo magenta sem alpha, spritesheets completos ainda pendentes. Backup e espelho SHA verificados.
---
# Guerreira — pose feminina v004 APROVADA
03/10/2026: Flavio respondeu “aprovada” à imagem female_left-contact_nano_v004.jpg. Preservada cópia imutável de referência em art-source/approved-poses/cr_class-warrior_tier1_female_left-contact_approved_v001.jpg, hash idêntico à candidata. Prevalece esta aprovação sobre pendência anterior de revisão. Aprovação apenas deste quadro de contato para esquerda; folhas completas masculina/feminina ainda em produção. Manter pose, identidade e equipamentos desta referência nos próximos quadros. Fundo magenta sem alpha; preparação e montagem ainda pendentes, não integrada no jogo. Backup prévio e espelho SHA verificados.
---
# Guerreira — candidata v004 por edição de uma única referência
03/10/2026: usuário pediu prosseguir. Gemini conversa dc88e1e17bd1e6c7, enviada somente pose masculina row3_col3_swap_candidate_v001; pedido edição de rosto/cabelo para feminino preservando geometria. Nano Banana Pro2/2 concluído, JPEG original preservado female_left-contact_nano_v004.jpg. Direção esquerda, postura, botas e equipamentos acompanham referência melhor que v001-v003. AGUARDA avaliação visual do usuário; não assumir aprovação. Derivada do masculino, identidade feminina requer comparação com master antes de expandir. Fundo magenta, sem alpha; não integrar ainda. Próximo confirmar quadro e depois derivar demais poses mantendo identidade aprovada e preparar animação. Backup/espelho SHA verificados, chat salvo.
---
# Pose feminina — três tentativas Nano preservadas, sem aprovação
03/10/2026: v001/v002 textuais e v003 por referência visual NÃO resolvem vista e alternância. Todas Pro2/2 baixadas como JPEG e preservadas. v003 conversa ab95e664011ace9c usa master feminino + row3_col3 masculino aprovado, mas volta rosto quase frontal. Não integrar nem declarar spritesheets masculino/feminino concluídos. Preserve quadro masculino aprovado e masters. Ângulo exato90 foi tentativa técnica, NÃO exigência nova do usuário: prevalece visual aprovado. Próximo definir controle de pose mais confiável antes de novas folhas, evitando repetir geração global. Backup e espelho SHA verificados do lote.
---
# Guerreiro/Guerreira — pose feminina isolada ainda incorreta
03/10/2026: usuário pediu prosseguir. Gemini conversa dab0670dca85323b: duas poses isoladas com Refazer com o Pro concluído 2/2. Originais JPEG baixados e preservados em art-source/sprite-sheets/work/class-warrior/cr_class-warrior_tier1_female_left-contact_nano_v001.jpg e v002.jpg. Revisão visual: ambas vista três quartos, v002 muda bota mas não perfil lateral exato nem passo amplo. NÃO aprovadas e NÃO integrar. Fundo magenta de trabalho sem alpha. Nenhuma alteração no código ou habilidades. Folhas masculina/feminina anteriores continuam pendentes.
Próximo: nova conversa Gemini com master feminino e pose masculina de referência aprovada, transferindo vista e passada; manter correção por quadro. Pedido: linha3coluna3 direita anatômica distante à frente, esquerda próxima atrás. Não trocar armas por espelhamento. Backups verificados e arquivos deste lote espelhados por SHA-256.
---
# Guerreiro e Guerreira — lote Nano Banana Pro revisado
03/10/2026: Flavio aprovou orientação direita frente/esquerda atrás linha3coluna3 e pediu seguir masculino/feminino. Geradas duas folhas pelo Gemini, ambas Refazer com o Pro versão2/2. Conversas persistentes masculina 5baadebb64277a7e e feminina dab0670dca85323b.
Feminina original localizada Downloads Gemini_Generated_Image_4vz5n44vz5n44vz5.jpg e preservada female_nano_sheet_v001.jpg (2016x2094, JPEG sem alpha). REJEITADA: grade4x4 em vez3x4, perfis errados linha3, neutras/alternância inadequadas, xadrez gravado. Não integrar.
Masculina grade3x4 visível; original ainda não localizado após downloads. Captura de revisão warrior-male-nano-review-20261003.jpg preservada, não equivale asset. Passos repetidos aparentes e fundo xadrez exigem revisão; NÃO aprovar/integrar. Candidata não exportada como spritesheet.
Descoberto que eventos download podem dar timeout embora Downloads receba arquivo: verificar pasta e inspecionar conteúdo. Não atribuir erro da imagem apenas ao mecanismo de download. Retomar por poses isoladas e montagem após verificar cada quadro, preservando aprovados. Código/habilidades inalterados.
---
# Nano Banana Pro — acesso confirmado, exportação pendente
03/10/2026: conta flagober confirmada na UI, Gemini Pro. Enviada pose row3_col3_swap_candidate_v001 pelo Gemini; imagem gerada. Menu mostrou Refazer com o Pro, acionado e concluído versão 2/2. Acesso Nano Banana Pro pelo navegador comprovado, não CLI/API. Visual geral preservado; alternância das pernas ainda requer comparação rigorosa.
Download nativo e downloadMedia falharam. Imagem abriu como documento no navegador; ao retornar a conversa momentânea não foi restaurada. Tentativa de captura local falhou porque aba deixou de pertencer à sessão; inventário final vazio. Nenhum PNG/captura foi salvo no projeto. Não considerar candidata preservada nem aprovada. Prompt preservado e espelhado. Sprites anteriores inalterados. Próximo repetir teste numa conversa persistente e garantir exportação antes de sair.
---
# Linha 2 coluna 3 aprovada; linha 3 coluna 3 candidata
03/10/2026: Flavio aprovou pose isolada row2_col3_swap_candidate_v001 (perfeito). Agora pediu inverter pernas apenas linha3coluna3: direita frente/esquerda atrás. Gerada pose isolada row3_col3_swap_candidate_v001, corpo à esquerda, equipamento preservado. Aguarda revisão do usuário. Não montar/integrar ainda; demais quadros preservados. Código/habilidades inalterados.
---
# Um quadro por vez — linha 2 coluna 3
03/10/2026: usuário pediu simplificar e inverter apenas posições das pernas desse quadro. Tentativa folha v010 repete contato, não usar. Pose isolada row2_col3_swap_candidate_v001 gerada para revisão: bota próxima mais clara à direita e distante atrás à esquerda. Ainda candidata, não montada/integrada, preservar os demais quadros da v009. Próximo aguardar avaliação deste único quadro pelo usuário. Código/habilidades inalterados.
---
# Guerreiro — revisão v009, 03/10/2026
Última orientação do usuário: linha1 fechada; coluna2 linhas2/3 pernas certas, garantir espada; coluna3 linhas2/3/4 direita à frente e esquerda atrás. Substitui orientações anteriores. Candidatas v008/v009 preservadas. Espadas visíveis nas centrais, pés traseiros completos; v009 ainda não demonstra claramente troca da perna próxima na linha2coluna3. Não declarar correção concluída nem integrar. Necessária revisão da candidata pelo usuário e correção localizada desse contato. Código/habilidades inalterados.
---
# Correção das pernas — novas instruções confirmadas
03/10/2026: direita/esquerda referem-se às pernas do personagem. Coluna 3: linha1 direita atrás/esquerda frente; linha2 direita frente/esquerda atrás; linha3 direita atrás/esquerda frente; linha4 preservar candidata isolada aprovada. Coluna2 linhas2/3: neutra de perfil, pernas juntas e pés alinhados com o corpo, sem distorção.
V006 corrige frente e melhora neutras, mas remove equipamentos das neutras. V007 restaura equipamentos, porém ainda repete contato na linha3 e corta pés da linha4. Ambas NÃO prontas, NÃO integrar. Preservar fonte anterior e pose traseira isolada aprovada. Falta montagem precisa sem regenerar quadros aprovados. Código/habilidades inalterados.
---
# Correção apenas da terceira coluna — 03/10/2026
Usuário autorizou prosseguir, preservando colunas 1 e 2. Coluna 1: direita anatômica à frente; coluna 2: neutra; coluna 3: esquerda anatômica à frente, direita atrás. Mesma sequência nas quatro direções. Nunca espelhar personagem inteiro para trocar pernas.
Tentativa folha inteira v005 rejeitada: ainda repete contato frontal e altera outros quadros. Não integrar.
Gerada candidata isolada contact-b_four-directions_candidate_v001: quatro poses para a terceira coluna. Revisão visual inicial mostra alternância. Ainda requer confirmação visual do usuário e montagem com colunas preservadas, conferência de escala/pivôs e preview animado. Nenhuma alteração de código ou habilidades.
---
# Passos — frente aprovada; direita candidata corrigida
Flavio aprovou teste frontal front-step-test_v002 (“perfeito”). Seq anatômica: direitaavançada/neutra/esquerdaavançada. Folha masculina v004 repetiu contato, NÃO usar. Teste direita v002 corrige alternância da perna próxima/luminosa e distante/escura; aguarda aprovação. Ainda faltam esquerda/costas eGuerreira. Não integrar. Continuar porlinhas; preserve frenteaprovada. Código/habilidades inalterados.

---
# Correção das caminhadas — pernas alternadas obrigatórias
03/10/2026: Flavio apontou mesma perna repetida nas3colunas. Regra adicionada ao GDD. Masters/vistas aprovados; caminhadas NÃO aprovadas/não integradas. Tentativas masculino v001-v003 e feminino v001-v004 preservadas: várias repetem pernas ou alteram direção no quadrocentral. NÃO considerar fontes prontas. Tira frontal masculina repete contato; rejeitada. Pose única male_shield-leg-forward_candidate_v001.png finalmente gerou perna oposta avançada; usar abordagem poseindividual a seguir, mantendoescala/face/equipamento e revisando cada direção. Próximo concluir contatoA/neutro/contatoB por direção para ambos e apresentarpreview animado. Código inalterado, habilidades adiadas.

---
# Guerreiro/Guerreira Base — vistas candidatas
03/10/2026: ambos masters aprovados e preservados em approved-masters. Quatro vistas candidatas v001 produzidas separadamente para masculino/feminino. Direções frente/direita/esquerda/costas, armas/lado anatômico revisados. Aguardar aprovação antes de caminhada12poses de cada. Na fonte de animação reforçar vistas frontal/traseira retas, sem rosto visível nas costas, margens maiores para espada. Código/habilidades não alterados.

---
# Guerreira Base — master candidata aguarda aprovação
03/10/2026: Guerreiro masculino aprovado pelo Flavio, preservado em approved-masters/cr_class-warrior_tier1_male_master_v001.png. Guerreira candidata v001 gerada com essa referência, inspecionada: identidade feminina, equipamento/paleta de classe coerentes, corpo inteiro sem corte. Aguardar aprovação antes das quatro vistas de Guerreiro e Guerreira. Código/habilidades não alterados.

---
# Guerreiro Base — master candidato aguarda aprovação
03/10/2026: imagem-mestra masculina candidata v002 produzida com referências técnicas Ryan/Mya e promptcanônicoV10. V001 preservada; v002 corrigeenquadramento. Aguardar aprovação doFlavio antes deGuerreira eposterioresvistas/animação. Fontes: art-source/master-candidates/cr_class-warrior_tier1_male_master_candidate_v002.png. Código não alterado; habilidades continuamadiadas.

---
# GDD consolidado — próximo: Guerreiro/Guerreira
03/10/2026: docs/GDD_CRYPT_ROYALE.md v0.1 reúne estado implementado, direções aprovadas, propostas e decisões abertas. Próxima produção: primeiro master GuerreiroBase, referência canônica MDsV10/30 e38; depois Guerreira, vistas, animações e integração. Não implementar habilidades ainda. Nenhum código alterado neste lote. Promoção300MCT permanece pendente porconta/global. Ordem classesBase/TierII→Nexus→Bossespiloto→habilidadesdetodos→novosmonstros preservada.

---
# Ordem atual — classes, Nexus, Bosses; habilidades depois
03/10/2026: Flavio confirmou produção gradual. Concluir classes-base/TierII, Nexus e lote deBosses planejado ANTES de implementar habilidades. Depois finalizar habilidades de TODOS os conteúdos criados; só então novo lote demonstros. Consultar docs/ROTEIRO_PRODUCAO_ROYALE.md. CryptDex preserva primeira aparência masculina/feminina encontrada, variantes não duplicam progresso. Recompensa300MCT ainda sem definição porconta/global. Entradas anteriores abaixo são histórico, não ordem vigente.

---
# Quatro renovações concluídas — próxima etapa: habilidades
Pixel Pup master/carta/spritesheet v002 integrados. 78 testes/build passaram. Bit Bug, Data Mouse, Code Slime e Pixel Pup renovados; originais preservados. Próximo: auditar habilidades previstas dos16 monstros e implementar pendências conforme plano do Flavio. Movimento/espaçamento já aprovado. Item3 permanece adiado até depois das habilidades.

---
# Renovação — Pixel Pup: caminhada candidata
Masterv002 e turnaround aprovados. Fonte de caminhada candidata v001 gerada, 12poses frente/direita/esquerda/costas, com margens transparentes. Aguardar aprovação visual do Flavio antes de empacotar/integrar carta e spritesheet v002. Depois completar renovações e iniciar habilidades conforme plano. Code Slime já integrado,77testes/build passaram.

---
# Renovação — Pixel Pup: quatro vistas candidatas
Master v002 aprovado pelo Flavio e preservado em approved-masters. Turnaround candidato v001 gerado/revisado: frente, direita, esquerda, costas. Aguardar aprovação antes de caminhada de12poses e integração. Manter habilidades para depois da integração do Pixel Pup.

---
# Renovação — Pixel Pup: master candidato
Candidata v002 gerada via imagegen, preservando identidade (orelhas caídas, coleira ciano, cauda pixel) e adicionando volume/expressão. Aguardar aprovação do Flavio antes de quatro vistas e animação. Code Slime integrado, 77 testes/build passaram. Pixel Pup é último dos quatro a renovar; habilidades depois da integração final.

---
# Renovação — Code Slime integrado
Master/carta/spritesheet v002 integrados. 77 testes e build passaram. Bit Bug e Data Mouse renovados antes. Próximo renovar Pixel Pup0010 com aprovação visual; habilidades somente após concluir as quatro renovações. Fontes e versões anteriores preservadas. Fonte técnica da animação: candidata v006, isolamento de quadros da v004 aprovada.

---
# Renovação — Code Slime: animação candidata
Master v002 e quatro vistas aprovados. Animação elástica com 12 poses gerada e revisada; candidata v004 tem três bolhas por pose. V001–v003 preservadas como tentativas com inconsistências. Aguardar aprovação visual do Flavio antes de integrar spritesheet e carta. No empacotamento preservar bolhas destacadas e usar limites por pose, não apenas componente do corpo. Depois renovar Pixel Pup0010; habilidades depois das quatro renovações.

---
# Renovação — Data Mouse integrado
Master/carta/animação v002 integrados.76testes/build passaram. Bit Bug renovado anteriormente. Próximo Code Slime0007,depoisPixel Pup0010;habilidades depois,conforme plano.

---

# Renovação — Bit Bug integrado
Novo visual aprovado: masterv002,carta v002,spritesheetv005.75testes/build passaram. Próximo renovarData Mouse0004,Code Slime0007,Pixel Pup0010,com aprovação visual; habilidades depois.

---

# Estabilidade nas batalhas corrigida
Faixas esquerda/direita até centro, ataque estacionário em alcance e aproximação pelo lado próximo.74testes/build passaram. Aguardar avaliação visual do Flavio, depois renovar0001/0004/0007/0010 conforme plano.

---

# Etapa atual — posicionamento das tropas
Implementado espaçamento/separação e posições ao redor dos alvos.72testes/build passaram. Avaliação visual em partida ainda pendente. Próximo renovar0001/0004/0007/0010com aprovações visuais; depois habilidades; item3doFlavio depois disso.

---

# 16 monstros cadastrados — aguardar pedido do Flavio
Cache Mantis integrado com carta/caminhada;68testes/build passaram. Contagem16 confirmada em CARDS. Habilidades ainda pendentes; NÃO iniciar agora. Flavio pediu conversar após terminar Cache Mantis, antes de prosseguir.

---

# Pedido do Flavio — pausa após Cache Mantis
Concluir Cache Mantis MC0049 com aprovações visuais e integração. Ao terminar, aguardar o pedido do Flavio ANTES de iniciar habilidades ou qualquer próxima etapa.

---

# Etapa atual — Buffer Bison integrado
15 dos16 cadastrados. Carta/caminhada integradas,67testes/build passaram. Próximo Cache Mantis MC0049. Depois auditar e implementar habilidades dos16 conforme Flavio.

---

# Etapa atual — Packet Fox MC-0040 integrado
Carta e caminhada integradas; 66 testes e build passaram. Próximo Buffer Bison MC-0046, depois Cache Mantis MC-0049. Manter habilidades para depois de completar os16, conforme ordem do Flavio.

---

# Ordem confirmada pelo Flavio — 02/10/2026
Concluir visuais e integração dos 16 monstros iniciais antes de iniciar implementação das habilidades. Etapa atual: Packet Fox MC-0040, imagem-mestra candidata; depois Buffer Bison e Cache Mantis. Ao concluir os 16, auditar todas as habilidades previstas e implementar/testar pendências.

---

# Retomada atual — Kernel Goat MC-0037
Carta e caminhada integradas; 65 testes/build passaram. Kernel Panic pendente. Próximo: Packet Fox MC-0040.

---

# Retomada atual — Logic Lizard MC-0034
Integrado: carta e caminhada, três nós na cauda corrigidos; 64 testes e build passaram. Lógica Encadeada pendente. Próximo: Kernel Goat MC-0037.

---

# Retomada atual — Patch ToadMC-0028
Integrado,carta/saltos,63testes/build passaram. Hotfix pendente. Próximo Logic LizardMC-0034,aguardar pedido.

---

# Retomada atual — Fiber FinchMC-0025
Integrado,carta/voo aprovados,62testes/build passaram. Pulso Óptico pendente. Próximo Patch ToadMC-0028,aguardar pedido.

---

# Retomada atual — Copper Mole MC-0022
Integrado em02/10/2026,carta/walk aprovados,61testes/build passaram. Habilidade Túnel de Cobre pendente. Próximo Fiber FinchMC-0025,aguardar pedido.

---

# Retomada atual — Socket Crab MC-0031
02/10/2026: integrado,carta e caminhada aprovadas,60testes/build passaram. Próximo da lista Copper Mole MC-0022; aguardar pedido. Modo automático interno disponível ao lado de Som.

---

# Retomada atual — Byte Boar MC-0019
02/10/2026: integrado, master e corrida aprovados,55testes e build passaram. Fontes preservadas para MonsterCrypt. Próximo Socket Crab MC-0031, aguardar pedido. Relatório mc-0019-byte-boar-integration-20261002.md.

---

# Retomada atual — Cache Crow MC-0016
Atualizado02/10/2026: master e voo aprovados pelo usuário, spritesheet e carta integrados.54testes e build passaram; espelho verificado. Gemini sem parecer: resposta vazia e comando negado, revisão externa pendente. Relatório mc-0016-cache-crow-integration-20261002.md. Preservar master e fontes. Próximo da lista Byte Boar MC-0019; não iniciar sem pedido.

---
# Ponto de retomada — Circuit Hare (MC-0013)

Atualizado em 02/10/2026: Circuit Hare integrado e validado.

## Estado atual

- Usuário aprovou as animações em 02/10/2026.
- Folha final `public/assets/units/circuit-hare-spritesheet-v001.png`: 420x560, 12 quadros, ordem down/right/left/up, ciclo 0/1/2/1, 110ms por quadro.
- Carta `public/assets/cards/circuit-hare-card_v001.webp` exportada da imagem-mestra aprovada.
- Renderizador e catálogo de cartas atualizados. Testes: 53/53 passaram; build de produção passou.
- Hook de telemetria do Antigravity corrigido sem desativar o plugin. Gemini conseguiu ler os arquivos e retornou APPROVE na execução `20261002-071509-786-mc-0013-integration-review-20261002`.
- Backup anterior: `C:\FlavioG\Backups\2026-10-02\071116-906-circuit-hare-integration-e8231ee4`; snapshots adicionais preservados nos mesmos diretórios diários.
- Relatório: `.orchestration/reports/mc-0013-circuit-hare-integration-v001-20261002.md`.
- Não regenerar a animação aprovada ao retomar. Próximo personagem ainda não foi solicitado pelo usuário.

## Histórico de 01/10 (estado anterior, superado pela integração acima)

- Usuário confirmou visualmente o Circuit Hare e autorizou prosseguir.
- Fonte de trabalho: C:\FlavioG\Crypt-Royale; espelho no G:\Meu Drive\MonsterCrypt_Ecosystem_V1.0\Crypt-Royale.
- Master aprovado existente: art-source/approved-masters/cr_mc-0013_circuit-hare_master_v001.png e JSON (29/09/2026).
- Turnaround existente: art-source/turnarounds/cr_mc-0013_circuit-hare_turnaround-candidate_v001.png e JSON; quatro vistas front/right/left/back.
- Fonte nova da animação: art-source/sprite-sheets/work/mc-0013/cr_mc-0013_circuit-hare_animation-source_v001.png, gerada com imagegen e referências do master/turnaround; copiada e espelhada. Ainda NÃO está integrada no jogo.
- Revisão via Gemini: execução 20261001-164417-429-mc-0013-resume-turnaround-review-20261001. O agente não conseguiu ler os arquivos por um caminho malformado no hook do plugin datacloud_telemetry. SUCCESS da chamada não significa revisão aprovada; corrigir o hook e refazer a revisão.
- Próximos passos: resolver leitura do Gemini, revisar source das animações, montar sheet 420x560 (3 colunas x 4 linhas; células 140; pivô 70/128), criar carta, integrar no render/cards, testar e espelhar. Preservar todos os candidatos.

Após desligamento, não reenviar pedidos cegamente. Conferir metadados/resultados e arquivos já produzidos. Este documento deve ser atualizado conforme o trabalho avançar.



































## Pausa autorizada — 05/10/2026
Produção de sprites temporariamente pausada a pedido do Flavio para análise e integração do LPC Character MCP. Base instalada em C:\FlavioG\lpc-character-mcp-main; plano em docs\PLANO_ECOSSISTEMA.md. Nenhuma nova aprovação de sprite inferida. Retomar o ponto artístico anterior após esta avaliação; Map Studio e catálogo de jogo não alterados nesta etapa.

## Laboratório de animações — 05/10/2026
Implementado src/game/sprite-animation.js: perfil legado e seleção configurável de quadros, offsets, repouso e ciclo/one-shot. Renderizador do Royale usa seletor compartilhado mantendo configurações atuais. animation-preview.html compara Circuit Hare atual com referência LPC de oito quadros, preservando créditos em public/assets/animation-lab. Referência não entra em batalhas. 81 testes passaram; build passou; HTTP da página/módulo/imagem verificado. Ferramenta do navegador expirou duas vezes; funcionamento visual e controles ainda não confirmados pela interface. Prévia disponível em http://localhost:5179/animation-preview.html (apenas desenvolvimento; build atual tem index.html como entrada). Próximo: conferir visualmente, produzir oito poses próprias de classe masculina/feminina com imagem-mestra aprovada e aprovação visual antes de publicação. Nenhum novo frame próprio foi produzido neste lote. Map Studio/MonsterCrypt runtime ainda não alterados.

## Preparação da caminhada do Guerreiro — 05/10/2026
Aplicada a skill monstercrypt-animation-pipeline para estruturar e consolidar a caminhada do Guerreiro Masculino Tier 1 como piloto do ecossistema.
1. Linha 2 Coluna 2 (Perfil Direito - Neutro / Passing): corrigida de forma definitiva, eliminando o corte na lâmina da espada rúnica, garantindo o perfil puro de um único pé (sem fragmento de sombra atrás do calcanhar e sem duplo polegar à frente) com sola assentada em Y=361.
2. Spritesheets montados: master transparente 1086x1448 e folha oficial 420x560 (células 140x140, pivô [70,128], linhas down/right/left/up, ciclo 0/1/2/1) em art-source/sprite-sheets/work/class-warrior/.
3. Metadados formais registrados em art-source/metadata/cr_class-warrior_tier1_male_walk_manifest.json com a declaração dos dois perfis (Royale 3x4 legado e Caminhada Expandida de 8 fases anatômicas).
4. Visualizador e laboratório atualizados: animation-preview.html inclui o Guerreiro lado a lado com Circuit Hare e a referência LPC de ritmo (porta 5179 / VPN 100.79.208.33:5179). warrior-male-walk-v001.html e reviews de grade 3x4 e tira da Linha 2 gerados. 81 testes passaram. Próximo: avaliação visual do Flavio antes de integração ao catálogo em batalha.

## Candidato próprio oito poses — Guerreiro frente — 05/10/2026
image_gen gerou down8 v001 e correção v002. v002 salvo em art-source/sprite-sheets/work/class-warrior e prévia warrior-down8-preview.html. Apenas direção frontal candidata, sem repouso, pivô não normalizado; aguardar revisão visual. Preservar a folha legada e produção recente do Antigravity. Não declarar32frames/finalização/integração em batalha. Relatório warrior-down8-candidate-20261005.md.

## Revisão dos fragmentos de capa — 05/10/2026
Flavio aprovou caminhada frontal v002 e apontou fragmentos da capa perto da espada nos quadros2e6. Gerada limpezaimage_gen v003 preservada como alternativa, não substitui automaticamente a aprovação v002. A prévia continua mostrando pixels da fonte aprovada v002; recorte remove faixa periférica esquerda de18px entrey210..350 nas células2e6 para evitar entrada de capa vizinha. Conferir visualmente se não corta o brilho da espada. Fonte v002 inalterada. Não declarar teste visual por navegador: HTTP verificado apenas.

## Perfil direito oito poses — 05/10/2026
Frente v002 com correção de visor aceita pelo Flavio (agora sim). Criado candidato right8_v001 via image_gen, com prévia warrior-right8-preview.html. Candidato4x2, oito poses, perfil olhando à direita. Conferir alternância anatômica na segunda metade e fechamento8→1; não afirmar perfeita continuidade ou pivô final. Fonte/metadata preservados, espada em primeiro plano e escudo ao fundo na referência. Aguardar aprovação visual do perfil antes de esquerda/costas. Não integrado às batalhas.

## Perfil direito — chão corrigido — 05/10/2026
Flavio apontou desnível nos quadros5..8. FonteRGBA preservada. Bases das botas no atlas local:424,424,421,419,408,407,408,407. Visor ajustaY por0,0,3,5,16,17,16,17px-fonte, escalados para canvas444, e desenha chão verde constante. Correção vertical apenas; pivô horizontal e folha final140pendentes. Metadados registram medidas/deslocamentos; aguardar conferência visual. Não regenerar poses por desnível de exportação.

## Perfil direito — alternância pendente — 05/10/2026
Usuário confirmou frames1..4 aceitáveis, mas frames5..8 repetem direitaatrás/centro; precisam direitaàfrente/esquerdaatrás. Conferida referênciaLPC. Três tentativasimage_gen: fullsheetv002 ainda repete; secondhalfrejected e frame5rejected também com fundo indevido. Preservados como estudos, não publicados. Visor permanecev001 com apoioverticalcorrigido. Não alegar correção feita; alternância ainda pendente. Próxima tentativa deve validar isoladamente contatoquadro5 e garantir transparência antes de ampliar.

## Quadro6 — perna esquerda atrás — 05/10/2026
Usuário reforça segunda coluna esquerdaatrás e pede observar laboratório/LPC. Interpretado linha2col2=quadro6 conforme contexto anterior. NavegadorIAB nãoabriu (timeout); HTTP e fonte do laboratório consultados. Tentativaimage_gen localizada frame6 produziu alterações, mas não demonstrou troca anatômica inequívoca na sobreposição das coxas. Candidato preservado apenas em art-source, NÃO substituir visor nem declarar corrigido. Frente aceita e chão do perfil direito preservados. Alternância de apoio continua pendente; não avançar esquerda/costas como se direita estivesse aprovada.

## Perfil direito — pés3/7 revisados — 05/10/2026
Usuário aponta pés virados parafora coluna3deambaslinhas e alternânciapendente. image_gen criou feetcandidatev001 (pés em perfil) e legscandidatev003 (tentativa posterior). Prévia agora exibe v003 como NÃOAPROVADO, pernas ainda emrevisão. Apoios verticais remediados: bases423,423,423,421,408,409,410,409; chão423. Não declarar troca anatômica concluída. Fontesanteriorespreservadas; não integrado ao jogo.









