# Corrigir áudio — implementação delimitada

Flavio mostrou popover de som cortando acima da tela no desktop e botão de áudio que desaparece ao abrir. Corrigir mantendo as funções de volume/mudo/modos/trilha/estado de desbloqueio.

Fonte C:\MonsterCrypt_Ecosystem_V1.0\Crypt-Royale, espelho G homônimo. Backup SHA256 antes de modificar (runner realiza), chat diário sem credenciais, espelhamento verificado após lote. Não importar G; não acessar Signing/.env/.keys/perfis/dependências/caches/outros projetos. Não executar shell/RunCommand/subagentes nem ampliar permissões. Use leitura/edição próprias em accept-edits e ENTREGUE código, não apenas plano. Codex testa depois.

Leia somente src/AudioControl.jsx e src/game/audio-manager.js. Alterar apenas src/AudioControl.jsx; opcionalmente criar src/audio-popover.js (cálculo puro) e src/audio-popover.test.js. Não modificar App/CSS global/atividades/motor/assets/pacote. Codex trata mapas, alvos e ilustrações em paralelo; não tocar nesses escopos nem atribuir suas mudanças à sua tarefa.

Critérios:
1. Botão Volume2/VolumeX SEMPRE presente e44x44, com aria-expanded/aria-controls. Clicar alterna painel; isOpen não remove o botão.
2. Painel em portal document.body, posição fixed e z-index adequado. Anchor por ref/rect, preferir abaixo do cabeçalho, escolher acima só se há espaço, clamp lateral/margens8px. Largura até288px respeitando viewport320; maxHeight e overflow-y:auto para tela baixa. Usar useLayoutEffect/resize/scroll para recalcular e limpar ouvintes.
3. Fechar por Escape (sem propagar para outro diálogo), clique fora com refs de botão/painel, botãoFechar; retornar foco ao trigger ao Escape/Fechar; abrir e fechar não muda preferências. Reposicionar sem travar foco/interações de range/select.
4. Preserve engine/AudioManager e todo conteúdo funcional/semântica. Não iniciar música diferente só por abrir painel, não alterar volume salvo automaticamente. Mostrar faixa atual e estado de autoplay real.
5. Evitar listeners/intervals vazando. Declarar título e role=dialog não modal com aria-labelledby para painel. Elementos tocáveis44px, modo/select e range acessíveis. Ícones devem continuar visíveis em PC/celular.
6. CSS local via classes Tailwind/estilo inline. Não usar bottom-full fixo desktop. Se criar função pura de posicionamento, testes reais para viewport curta/largura320/anchor nas bordas e retorno finito.

Ao terminar, liste arquivos efetivamente editados e testes que Codex precisa executar. Não declare testes ou aprovação que não fez.
