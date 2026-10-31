# Crypt Royale v0.9 — entrega de27/10/2026

Gerador único gerar_crypt_royale.bat finalizou com exit0. Versão pública0.9; técnica0.9.0; Android build7. Snapshot privado LOCALAPPDATA/MonsterCrypt/CryptRoyale/Builds/0.9-1793122548600-f1f5fd57. Chave Android preservada apenas no C.

## Entrega

- Carteira/nível na tela inicial e acessos no menu para Coleção, Classes e Campanha. Atividades/Recompensas também abre coleção. Filtro Só minhas cartas lista famílias com duplicatas, melhoria ou forma evoluída, inclusive após consumir todas as duplicatas numa melhoria.
- Níveis iniciais1–10 para monstros/classes, custos de duplicatas+Gold crescentes, XP independente para nível do jogador. Evoluções de forma por20cartas+500Gold e50cartas+1.500Gold, sem gates de nível do RPG conforme preferência expressa do Flavio.
-16famílias/48nomes de formas canônicos; classes Guerreiro/Arqueiro com ramos Paladino/Gladiador e Caçador/Franco-Atirador. Especialização por10cartas da classe+500Gold; ramo permanente, bônus inicial igual para os dois caminhos. Artes-base e habilidades atuais mantidas: ainda não há novas aparências/habilidades próprias das formas ou especializações.
-9fases em três capítulos, vitórias liberam próximo estágio, primeiras recompensas e repetições com valores visíveis e recibos únicos. Só partidas manuais elegíveis; treino livre normalizado. Níveis/formas capturados ao início da campanha, nunca alteram combate em curso ao melhorar coleção.
- Inventário/XP/recibos anteriores preservados; campo opcional de progresso e backup transacional. Progresso ainda local por instalação, sem sincronização, servidor autoritativo ou MCT.

Regras e tabela completas em PROGRESSAO_ROYALE_2026-10-27.md. Notas congeladas em dist-pacote/v0.9/notas.md; manifesto com hashes no mesmo diretório. Histórico anterior preservado.

## Artefatos

| Formato | Arquivo | Bytes | SHA256 |
| --- | --- | ---: | --- |
| Android | dist-apk/Crypt_Royale_v0.9.apk | 130687927 | 069e9f31c81afe7532d71bfd4cb0c644a0b46bf7c0d60baeb05116c8b08b09a0 |
| Windows | dist-electron/Crypt Royale Setup 0.9.exe | 234755750 | 9748cc084f7eccf7af7872028dc41f098e7102d89961a446a3d2ce9f400d2a49 |

Hashes conferidos no C e G. Windows e Android gerados do mesmo conteúdo web congelado. APK release assinado e identidade/versão verificadas; certificado SHA2568194267d13b9dce0d6cf0cc778e366de261489453b3ea8be4c5307c6ab49fe8d, idêntico à v0.8. Windows versão nativa0.9.0 e abertura empacotada confirmando exibição0.9. Instalador sem certificado Authenticode. Não foi realizado teste em aparelho Android físico.

## Verificação

153testes Node aprovados dentro da geração. Verificador de navegador com perfil isolado passou em320/390/768/1440px: legado mantido, duplo clique sem débito duplo, persistência de níveis/evolução/especialização, coleção filtrada, campanha iniciada na UI e término elegível controlado no motor real creditando e liberando fase2 exatamente uma vez. A vitória de verificação é fixture sintética, não playtest de balanceamento nem progresso real do usuário. Zero erros de página. Novas capturas docs/progressao-*.png produzidas com perfil de teste antes do incremento.

Backup inicial: C:/FlavioG/Backups/2026-10-27/141916-014-crypt09-colecao-campanha-evolucao-5781a789. Backups incrementais posteriores preservam revisões da interface/verificador e documentação. Backup de publicação do gerador143830-309-cryptroyale-before-release-publish-77b062b3. Fontes, documentação, capturas, metadados e instaladores espelhados com verificação SHA256. Web público copiado do snapshot após backup, preservando arquivos antigos sem remoção cega.

Antigravity CLI deixou estilos parciais ao atingir quota429; Codex concluiu a interface, revisou as regras e realizou testes e integração. Sem repetição automática ou troca de conta.
