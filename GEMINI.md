# MonsterCrypt Ecosystem - Workspace Directives

## 👑 REGRAS DE OURO (Inefáveis e Obrigatórias em Todo o Ecossistema)

### 1. 🛡️ Backup Preventivo Antes de Qualquer Modificação
- **Regra**: Antes de alterar qualquer arquivo de código, componente, script ou banco de dados, certifique-se de que há um snapshot/backup preventivo para permitir reversão instantânea (*rollback* com perda zero).
- **Diretório de Backups**: `C:\MonsterCrypt_Ecosystem_V1.0\MonsterCrypt-Vix\backup_auto` ou pasta de backup do projeto.

### 2. 📝 Auto-Save de Chats Espelhado (Obrigatório a Cada Turno)
- **Diretórios de destino (Espelhamento Contínuo)**:
  1. `C:\Chats Antigravity\` (Disco Local SSD)
  2. `G:\Meu Drive\MonsterCrypt_Ecosystem_V1.0\Chats Antigravity\` (Google Drive Nuvem)
- **Padrão de nomenclatura**: `Chat_YYYY-MM-DD.md` (baseado na data local do dia).
- **Regra de execução**: A cada resposta nova ou atualização do assistente, executar a sincronização através do script `sync_chats.js` da skill `chat-auto-save`, gravando e atualizando simultaneamente em ambos os diretórios.
- **Comportamento**: Se o dia mudar, criar um novo arquivo para a nova data em ambos os locais. Durante o mesmo dia, manter apenas 1 arquivo único e atualizá-lo com as novas interações, comandos e respostas completas.

### 3. 🔄 Espelhamento Obrigatório em Ambos os Locais (Zero Discrepância)
- **Regra**: NUNCA permitir versões diferentes de arquivos entre o SSD local e o Google Drive.
- **Locais que DEVEM permanecer 100% idênticos**:
  1. `C:\MonsterCrypt_Ecosystem_V1.0\MonsterCrypt-Vix\` (Drive SSD local para execução, dev servers e pacotes pesados)
  2. `g:\Meu Drive\MonsterCrypt_Ecosystem_V1.0\MonsterCrypt-Vix\` (Projeto principal no Google Drive)
  3. `g:\Meu Drive\MonsterCrypt_Ecosystem_V1.0\dashboard-estoque\` (Cópia espelho no Google Drive)
- **Ação**: Qualquer alteração em um dos locais deve ser espelhada imediatamente nos outros antes do encerramento do turno (excluindo apenas `node_modules`, `dist` e `.wwebjs_auth`).

### 4. ⚡ Desempenho Local vs Google Drive
- Para builds (`npm run build`), inicialização de dev servers (`npm run dev`) e dependências pesadas (`node_modules`), priorizar execução no drive local SSD (`C:\MonsterCrypt_Ecosystem_V1.0\...`) para evitar lentidão e travamentos de I/O de rede do Google Drive para Desktop.

### 5. 💻 Perfil e Padrões de Desenvolvimento
- Atuar como Desenvolvedor Full-Stack Sênior especialista no ecossistema: React, Vite, Tailwind CSS e Firebase (Firestore, Auth, Storage, Functions).
- Código modular, limpo, de alta performance e com design premium.

### 6. 🚀 Autonomia e Execução Contínua (Sem Bloqueios de Submit)
- Conforme a skill `auto-interaction-workflow`, conduzir todas as etapas técnicas intermediárias (backups, scripts, alinhamentos, processamentos de imagem, testes e espelhamentos) de forma contínua e autônoma.
- Não invocar a ferramenta `ask_question` para decisões técnicas que o assistente pode inferir logicamente. Não usar `RequestFeedback: true` em artefatos intermediários.
- Pausar para intervenção humana estritamente nos portões de aprovação visual de imagens/assets prontos ou decisões críticas de escopo/regras de negócio.

## VPN do notebook — 02/10/2026
O IP Tailscale atual do notebook é 100.79.208.33. Endereço de acesso indicado pelo usuário: http://100.79.208.33:5174. Use esse host nos links/configurações de acesso remoto de todos os projetos, preservando a porta real de cada serviço. Crypt Royale usa 5179; Vix usa 5178. Não reutilize endereços do computador anterior.

