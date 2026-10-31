# Defesa azul aprovada e integrada

Flavio aprovou explicitamente a comparação das16poses em27/10: “Aprovo o visual das quatro”. Registo em public/assets/class-tower-candidates/approval-blue-back-attacks-20261027.json com SHA256 dos quatro PNGs originais.

Equipe azul usa vistas de costas dos dois arqueiros e da central Guerreiro/Guerreira no setor frontal, olhando para cima. Rivais mantêm frente. Central mantém vistas laterais anteriores ao acompanhar alvos nas laterais; nenhuma direção foi fabricada por flip. Mãos e equipamento preservados.

isolateTowerPoses extrai componentes completos, recuperando extremidades antes cortadas pela grade2x2. A Guerreira precisa de duas regiões por linha devido a brilho conectando poses; a extração por linha conserva a espada que ultrapassa a antiga divisão de colunas. As bordas entre linhas dessa folha permanecem próximas; fonte raster aprovada não foi redesenhada nem teve pixels inventados. Cada pose tem pivô e origem de disparo explícitos. Runtime valida dimensões, recortes e pivôs, em vez de aceitar metadados divergentes silenciosamente.

Sem alteração de dano, alcance, recarga, IA ou economia. Arqueiros continuam54dano/1000ms/105alcance; soltura100ms/recuperação250ms; preparo nos300ms finais só com alvo. Central mantém tempos/eventos reais. Renderização não aplica dano.

132 testes do jogo passaram (quatro verificações novas), incluindo fontes originais, direção por equipe, extração que atravessa coluna, recarga/dano e origem do projétil. Navegador carregou16poses traseiras, sem erros, e captura docs/defesa-azul-integrada-20261027.png. Perfil de QA isolado, sem mexer nos dados do jogador.

Tentativas AntigravityCLI de revisão somente leitura: primeira falhou no hook de telemetria; após backup no C, restaurado wrapperCMD existente em hooks.json, mantendo telemetria ativa e permissões. Segunda conseguiu ler, porém retornou apenas intenção de relatório; não foi tratada como revisão concluída apesar do statusSUCCESS. Codex concluiu análise e integração. Perfil/credenciais não espelhados.
