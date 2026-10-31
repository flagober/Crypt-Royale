# Execução SOMENTE ferramentas de leitura/edição
Codex já fez backup SHA256 integral antes da tarefa e preservou public/spell-effects-v001.js. Não execute RunCommand, shell, scripts, mkdir ou comandos de backup/testes: foram recusados no headless. Esta solicitação não contorna a recusa: esses comandos não são necessários, Codex executará os testes ao fim. Use ferramentas próprias de leitura e edição em accept-edits para implementar os arquivos permitidos. Não delegue a subagentes: produza diretamente. Entregue código, não somente plano. Ao precisar testar, escreva scripts/verify-spell-effects.mjs para Codex executar depois. O runner realizará backup fresco antes de chamar você e espelhará seus arquivos. Não alterar permissões.
# Colaboração Codex + Antigravity — efeitos de 16 monstros
Fonte C:\MonsterCrypt_Ecosystem_V1.0\Crypt-Royale; espelho G:\Meu Drive\MonsterCrypt_Ecosystem_V1.0\Crypt-Royale. Não importar cópias antigas. Backup SHA256 antes de alterar; preservar candidatos; chat sem credenciais. Runner faz backup e espelha lote; Codex revisa resultado.

## Objetivo
Aperfeiçoar as candidatas visuais das16magias, hoje simplificadas e compartilhando poucos padrões. Criar efeitos específicos, legíveis e coerentes com fantasia de cada monstro. Somente prévia para aprovação visual: não alterar combate, economia, recompensas ou instaladores. Guerreiro/Guerreira adiados.

## Entradas
public/spell-preview.html, public/spell-effects.js, public/spell-catalog.json, public/animation-audit.json; src/game/cards.js (somente leitura); docs/Crypt_Royale_Catalogo_16_Cartas_v1.0.gdd (fonte de nomes e mecânicas propostas, não declarar implementadas).

## Arquivos autorizados
Modificar apenas public/spell-preview.html e public/spell-effects.js. Criar public/spell-effects-v002.js, docs/MAGIAS_CANDIDATAS_V002.md e scripts/verify-spell-effects.mjs se necessário. Não modificar catálogos canônicos. Preservar v001 antes de substituir. Não acessar segredos, perfis, .env, .keys, assinaturas, credenciais, caches nem instalar dependências.

## Critérios
1. Cada magia precisa ter identidade temporal e geométrica própria: Enxame Binário, Checksum, Fragmentação, Rastro Leal, Salto de Circuito, Memória de Alvo, Cabeçada de Byte, Porta Travada, Túnel de Cobre, Pulso Óptico, Hotfix, Lógica Encadeada, Kernel Panic, Pacote Fantasma, Zona de Buffer, Cache Hit.
2. Mostrar preparação/efeito/impacto quando aplicável. Hotfix afeta aliado; proteção/aura ao redor do próprio personagem; resíduo no chão; encadeamento entre alvos distintos. Não desenhar todos os efeitos num alvo genérico indistintamente.
3. Preparar API de desenho pura, sem aplicar dano ou mutar entidades. save/restore balanceados, animação termina, reduz movimento sem flashes; custo de partículas limitado e determinístico.
4. Prévia responsiva inclusive320px: controles compactos, seletores de monstro, reproduzir/pausar, reiniciar, quadro a quadro, velocidade e fundo. Evitar cabeçalho fixo ocupando toda tela. Arte aprovada preservada; sem flip global.
5. Identificar explicitamente candidatas/mecânicas inativas; não declarar habilidades integradas.
6. Validar desenho com contexto simulado: finitude de coordenadas, estado restaurado, ausência de mutação dos parâmetros, expiração e movimento reduzido para16poderes. Executar node scripts/verify-spell-effects.mjs se criado. Não executar comandos financeiros, serviços alheios, geração APK/EXE ou alteração de versão.
7. Relatório final com arquivos efetivamente alterados, comandos executados, testes e pendências. Se acesso/comando recusado, relatar sem contornar permissões.

