# Vila Byte — Central de atividades ilustrada

Pedido adicional do Flavio: enriquecer check-in e atividades com presentes, bônus, moedas e gemas, mantendo identidade própria do jogo. Quatro artes novas produzidas por image_gen integrado com transparência real; aprovadas explicitamente: “Aprovo as quatro artes”. Arquivos em public/assets/rewards/vila-byte-{chest,coins,fragments,gift}-v001.png; prompts em art-source/rewards/rewards-v001-prompts.json.

AntigravityCLI Opus4.6Thinking criou ActivitiesPanelV2.jsx e activities-v2.css, escopo delimitado com backup. Codex revisou, aumentou o destaque das ilustrações, integrou ao App, ajustou duração/limpeza do toast, foco do elemento summary e movimento reduzido. Revisão não inferida somente do status do CLI: alterações e testes conferidos.

Hero com baú, carteira ilustrada, sete prêmios visíveis em desktop e rolagem dentro do contêiner no celular, dia atual destacado, sétimo dia dourado, presentes nos objetivos e efeito breve após novo recibo confirmado. Eventos e coleção mantidos. Cristais ilustram Fragmentos de Dados existentes: sem carteira de gemas, novos valores, resgate automático ou MCT. Recompensas continuam locais de teste e sem saldo comercial.

Validado em navegador/perfil isolado: quatro imagens RGBA com canto transparente; recompensas reais30Gold10XP no primeiro dia; clique duplo só gera um recibo; recarregar/reabrir preserva o resgate sem repetir toast; prévia demonstrativa terceiro dia50Gold; abas; larguras320/390/768 sem transbordamento; movimento reduzido. 132 testes do jogo e build web aprovados.

Prévia de demonstração sem armazenamento real: http://localhost:5179/activities-preview.html. Integração real no botão presente da arena ou Menu→Missões e eventos. Capturas desktop/mobile em docs/central-atividades-20261027.png e docs/central-atividades-mobile-20261027.png.

Novo pacote0.7 deve ser gerado pelo coordenador após todos os insumos concluídos. Nenhum dado real de jogador foi alterado pelo QA.
