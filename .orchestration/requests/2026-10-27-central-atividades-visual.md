# Implementação visual — Central de atividades Vila Byte

Flavio autorizou nova apresentação rica da central/check-in, com presentes, moedas, gemas e efeitos, inspiração de qualidade de jogos de estratégia mobile e identidade própria do Crypt Royale. Código original está em src/ActivitiesPanel.jsx. Codex está tratando separadamente integração de defesa azul e novas ilustrações. Não tocar nesses escopos.

**Entregue código nos DOIS arquivos autorizados; não termine apenas prometendo implementar.** Ferramentas próprias de leitura e edição, sem shell/RunCommand/subagentes. Edite em accept-edits. Se um acesso for recusado, relate; não amplie permissões. Tempo limite600s.

Regras: fonte C:\MonsterCrypt_Ecosystem_V1.0\Crypt-Royale; espelho G homônimo; não importar G. Backups SHA256 antes de editar (runner realiza), chat sem credenciais, espelho verificado por lote. Nunca acessar Signing/.env/.keys/perfis/caches/outros projetos. Não executar install/build/servidores ou mudar versões.

## Entradas somente leitura
src/ActivitiesPanel.jsx, src/game/activities.js e src/game/cards.js. Não altere atividades, economia, armazenamento, App.jsx, index.css, dano, assets ou pacote.

## Saídas autorizadas
Criar src/ActivitiesPanelV2.jsx exportando ActivitiesPanelV2 e src/activities-v2.css (importado pelo novo componente). Nenhum outro arquivo. Codex fará preview separado para aprovação visual antes de trocar o componente do jogo.

## Contrato e visual
- Mantenha props profile,now,onClaim,onClose,busy,message,onRetryBattle e todas as atividades existentes (daily/events/collection). Use activityView/CHECKIN_REWARDS/CARD_BY_ID reais; valores não podem ser inventados. Nome Vila Byte · Central de atividades, título Sua jornada continua.
- Design premium e legível: navy profundo, painéis azul/roxo, detalhes ciano e ouro, bordas robustas, sombra e brilho controlados. Identidade original, sem logos, coroas ou arte de terceiros.
- Hero assimétrico: título à esquerda, baú ilustrado à direita, resumo do dia, bônus diário em destaque. Carteira compacta Gold/XP/Cartas/Fragmentos de Dados. Abas grandes/claras.
- Check-in7dias com ilustrações grandes de prêmio, valor REAL, estados Recebido/Hoje/Bloqueado. Destaque do dia atual e dia7 com baú premium. Linha7cards em desktop, rolagem horizontal somente no contêiner em celular, botão resgate atual sempre acessível e mínimo44px. Não overflow do documento em320px.
- Missões, primeira vitória e semana/eventos com imagem de presente/baú, progresso ilustrado e estados persistidos. Recompensas/cartas e recibos reais mantidos.
- Imagens estarão nestes caminhos públicos, sem precisar ler ou gerar os arquivos: /assets/rewards/vila-byte-chest-v001.png, vila-byte-coins-v001.png, vila-byte-fragments-v001.png, vila-byte-gift-v001.png. Cristais significam Fragmentos de Dados EXISTENTES, nunca criar saldo de gemas/diamantes. XP pode usar ícone Lucide. Não usar emojis como substituto das ilustrações.
- Animação breve de recompensa só após novo recibo confirmado em profile.receipts; nunca ao montar, clicar com erro ou recarregar. Observe chave/quantidade dos recibos com useRef+useEffect. Sem créditos, resgates automáticos ou sons adicionais. Permitido toast/efeito CSS não modal de curta duração com aria-live polite e partículas determinísticas. Use prefers-reduced-motion:reduce; animação não controla saldo.
- Preserve role dialog, aria-modal, fechar, foco inicial/trap, Escape pelo fluxo existente, busy e botões desativados. Não roubar foco ao resgatar. Abas com aria-pressed; progressbar limites; imagens decorativas alt vazio e tamanhos definidos. Estilos prefixados av2 para não afetar arena.
- Preserve explicação de progresso local/teste e MCT indisponível; pode colocar detalhes em painel discreto acessível no rodapé sem prometer dinheiro. Não ocultar informações essenciais ou criar recompensas aleatórias.

Ao terminar, responda com arquivos realmente criados e pontos que Codex precisa testar. Codex executará testes, build, análise mobile e integração posterior. Não declare testes executados nem aprovação visual.
