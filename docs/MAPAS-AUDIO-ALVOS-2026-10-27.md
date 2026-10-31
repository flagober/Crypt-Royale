# Crypt Royale — Mapas, áudio e atividades — 27/10/2026

Fonte C:\MonsterCrypt_Ecosystem_V1.0\Crypt-Royale; espelho G:\Meu Drive\MonsterCrypt_Ecosystem_V1.0\Crypt-Royale. Trabalho local, backups SHA256 antes de alterar. Novas artes aprovadas pelo Flavio: “Aprovo os cinco”. Prompts em art-source/maps/maps-ui-v001-prompts.json; registro de aprovação e hashes em public/assets/maps/approval-v001.json.

## Comportamento entregue no código

- Três cenários de treino, disponíveis pelo menu Mapas e fases: Vila Byte, Minas de Cobre, Bosque de Circuitos. Seleção persistida em crypt-royale-map-v1 e mantida ao reiniciar treino. Troca altera somente mapId; não reseta relógio, tropas nem carteira. Campo e pontes mantêm geometria de combate anterior. Não há campanha, desbloqueio nem bônus por mapa.
- Assets de mapa são fundos; rio e pontes desenhados sobre eles nas coordenadas exatas do motor. Se o carregamento falhar, mensagem visível e fundo anterior de reserva. Nenhum dado do jogador é migrado ou apagado.
- XP/cartas e três abas ilustrados, demais artes aprovadas preservadas. Economia e armazenamento sem alterações.
- Copper Mole e Byte Boar com targetPolicy structures para as duas equipes. Tropas ainda podem feri-los, regras de separação permanecem; procuram a torre viva da rota. Outras cartas preservam seus alvos. Bônus e atributos anteriores mantidos.
- AudioControl corrigido pelo Antigravity CLI e revisado pelo Codex: botão sempre montado, portal fixo limitado à janela, fechar/Escape/clique fora, reposicionamento ao rolar/redimensionar, preferências mantidas. Codex adaptou testes ao runner Node do projeto e corrigiu limites em telas muito baixas. CLI terminou SUCCESS; tentou registrar chat fora da lista de arquivos e foi recusado. O Codex realizou o registro diário pelo helper autorizado, sem ampliar permissões.

## Verificação

139 testes Node passaram. Verificador .orchestration/tools/verify-royale-maps-20261027.mjs: áudio em 1440×1000, 320×568 e 400×300; carteira/abas em 320,390,768px; três mapas carregam; troca preserva relógio; escolha persiste ao recarregar; foco do seletor não reinicia no pulso da HUD; zero erros de página. Capturas docs/mapa-*-20261027.png, docs/mapas-selecao-20261027.png, docs/audio-ajustado-20261027.png e docs/central-icones*.png. Perfil do navegador isolado, dados reais intactos.

Dist-pacote contém notas e manifestos v0.3 a v0.7. Artefatos APK/EXE0.7 presentes e hashes iguais ao manifesto. Próxima entrega será0.8/build6 via gerar_crypt_royale.bat; status dos binários deve ser lido do resultado real do gerador. Não declarar Android físico testado nem assinatura Authenticode do Windows.
