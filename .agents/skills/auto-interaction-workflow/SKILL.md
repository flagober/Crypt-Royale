---
name: auto-interaction-workflow
description: Modos e diretrizes para execucao autonoma e continua, eliminando cliques repetitivos em 'Submit'/'Proceed' em etapas intermediarias e reservando a intervencao humana estritamente para a aprovacao visual de assets e decisoes criticas.
---

# Skill: Interação Automática e Execução Contínua (Auto-Interaction Workflow)

Esta skill estabelece o fluxo de trabalho de alta velocidade para o ecossistema MonsterCrypt e Crypt Royale, reduzindo o atrito operacional e eliminando a necessidade de o usuário clicar repetidamente em **Submit** ou botões de confirmação para tarefas técnicas intermediárias.

---

## 1. Princípio Fundamental de Autonomia

1. **Execução em Lote Sem Travamentos**:
   - O assistente deve conduzir proativamente todas as etapas técnicas intermediárias de ponta a ponta: backups, criação de scripts, processamento de imagem, alinhamento de pivôs, testes de canal alfa, montagens determinísticas e espelhamento verificado.
   - **NÃO pausar** para pedir confirmação ou autorização sobre detalhes técnicos triviais que já estão cobertos pelas regras de ouro e especificações do projeto.

2. **Eliminação de Modais e Bloqueios de Interface**:
   - **Não invocar a ferramenta `ask_question`** para decisões que o agente pode inferir logicamente a partir do contexto ou das regras do projeto. O `ask_question` força a renderização de modais bloqueantes com botões de "Submit/Skip".
   - **Definir `RequestFeedback: false`** em metadados de artefatos (`ArtifactMetadata`), a menos que seja um plano formal especificamente solicitado para autorização prévia pelo usuário. Isso evita botões suspensos de "Proceed/Submit" na interface.

3. **Portão Estrito de Intervenção Humana (Human-in-the-Loop)**:
   - A intervenção do usuário é reservada **estritamente para:**
     1. **Aprovação Visual de Imagens e Poses**: Quando uma nova imagem-mestra, pose de turnaround ou spritesheet 3x4 estiver pronta para inspeção de arte e estilo.
     2. **Decisões Críticas de Escopo / Regras de Negócio**: Mudanças em valores de MCT, contratos, exclusão de dados ou mudanças drásticas na arquitetura do jogo.

---

## 2. Apresentação para Aprovação Visual

Quando um asset ou lote de frames estiver pronto para a avaliação do Flavio:

1. **Exibição Imediata do Preview**:
   - Apresentar a imagem renderizada com sintaxe de imagem markdown absoluta `![Nome](/caminho/absoluto)`.
2. **Ficha Rápida de Inspeção**:
   - Indicar claramente:
     - **Status**: Candidata / Pose isolada / Sprite sheet montado.
     - **Resolução e Grade**: ex: `420 x 560 px` (células `140 x 140 px`).
     - **Pivô de Chão**: `[70, 128]` verificado.
     - **Verificação de Empunhadura**: Espada na mão direita anatômica e Escudo na mão esquerda anatômica preservados.
3. **Pausa para Decisão do Usuário**:
   - Apenas após exibir o asset pronto, encerrar o turno com uma chamada clara e objetiva para aprovação: `Aprovado`, `Rejeitado` ou `Ajustar detalhe`.

---

## 3. Configurações Recomendadas no Antigravity IDE / Desktop

Para que a experiência seja 100% fluida e livre de popups de aprovação no editor:

1. **Tool Execution Policy (Política de Execução de Ferramentas)**:
   - No painel lateral **Settings (Engrenagem)** -> **Agent Settings**:
   - Definir **Tool Execution Policy** para `always-proceed`. Isso autoriza o assistente a rodar comandos do terminal e ferramentas sem exigir que o usuário clique em "Approve/Submit" a cada comando.
2. **Artifact Review Mode**:
   - Definir para `always-proceed` ou `agent-decides`.
3. **Auto-Aceitação de Edições de Código / Arquivos ("Accept All")**:
   - Em `C:\Users\flavi\AppData\Roaming\Antigravity IDE\User\settings.json`, configurar `"chat.editing.autoAcceptDelay": 2`.
   - Essa configuração faz o Antigravity IDE aceitar automaticamente as alterações de arquivos após 2 segundos, eliminando a barra flutuante que exige clicar em **Accept All** / **Accept**.
4. **Manipulação de Scripts Temporários e Scratch**:
   - Para scripts auxiliares, geradores de preview e tarefas internas de processamento, escrever diretamente no disco ou executar via Node/PowerShell sem forçar a abertura de diffs pendentes no editor ativo.
5. **Comando `/goal`**:
   - Para sessões de geração autônoma de longo curso, iniciar a mensagem com o comando `/goal` (ex: `/goal produzir turnaround completo do guerreiro male tier 1`). O Antigravity opera em loop contínuo até concluir o objetivo.
