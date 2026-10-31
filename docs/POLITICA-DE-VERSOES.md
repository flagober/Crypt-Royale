# Numeração pública — decisão de28/10/2026

Solicitação: a versão já publicada0.16 permanece. As próximas serão0.2,0.3,0.4,0.5… Este é um reinício explícito da sequência pública do Crypt Royale, não uma renomeação retroativa dos pacotes entregues. O link da faixa de teste continua https://play.google.com/apps/internaltest/4701495716764622459 .

## Gerador
- Transição única da0.16/build14, ciclo original, para0.2/build15 no ciclo2. As próximas seguem0.3/build16,0.4/build17 e assim por diante. Nenhum pacote novo é gerado apenas para registrar esta preferência.
- Android versionName/interface/nomes dos arquivos usam o número público. versionCode segue crescente. Metadados técnicos Windows/npm também seguem crescentes:0.17.0 na futura0.2,0.18.0 na futura0.3. Não exibir a versão técnica como número público.
- `--manter-versao` repete a versão/ciclo/códigos atuais; não dispara o reinício. `--verificar` mostra a próxima prevista sem alterar arquivos ou assinar nada.
- Como já existem arquivos históricos0.3,0.4 etc., o ciclo novo será salvo em `dist-pacote/ciclo-2`, `dist-apk/ciclo-2` e `dist-electron/ciclo-2`. Os nomes públicos continuam versionados e o histórico anterior permanece em seus caminhos originais.
- Antes da próxima geração, registrar notas reais0.2, com `cicloVersao: 2` no primeiro item de src/data/release-history.json e o cabeçalho correspondente no Markdown. Não inventar alterações futuras. As notas antigas continuam visíveis; ciclos distintos não compartilham a mesma chave da interface.
- A conferência do espelho usa o build crescente; um número público antigo numericamente maior não deve impedir o novo ciclo. Mesmo build com metadados divergentes continua bloqueado para análise.

Esta decisão é específica do Crypt Royale. Não altera outros aplicativos, IDs de pacote, chaves, dados, convites, versão publicada ou requisitos das lojas.
