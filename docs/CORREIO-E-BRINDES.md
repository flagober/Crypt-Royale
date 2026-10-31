# Correio e brindes — beta

O painel5174 tem aba Crypt Royale, restrita a Root autenticado. Busca somente jogadores que possuem save do jogo, por e-mail exato ou UID. A mensagem contém título, texto e quantidades explícitas de Gold, XP, Fragmentos de Dados, cartas de monstros e de classes. O administrador confirma o conteúdo e destinatário antes do envio. Não foram enviados brindes reais neste lote.

O servidor cria mensagem imutável em `cryptroyale_mailboxes/{uid}/messages/{grantId}` e auditoria idempotente em `cryptroyale_gift_audit`. A API precisa estar ligada para criar envios. Depois disso, o jogador consulta/resgata pelo Firebase, sem depender do notebook do administrador. O cliente lê somente sua caixa; não cria mensagens nem altera o conteúdo/recompensa.

O resgate atualiza juntos, em transação, a revisão do save, os recursos, um recibo `mail:UUID` e o marcador da mensagem. Retry, segundo aparelho e conflitos não somam o brinde novamente. Exige conta sincronizada e não substitui saves divergentes. Mostra as50 mensagens mais recentes; mensagens antigas continuam armazenadas.

## Validação

Testes de regra e UI reais com duas contas descartáveis: acesso do dono permitido, acesso de terceiros/visitante negado, criação e adulteração pelo jogador negadas, marcador de resgate sem atualização de save negado, resgate pela interface concluído e confirmado em outro navegador, sem duplicação. Fixtures e contas QA foram removidas. Nenhum progresso real foi alterado.

As regras novas foram mescladas preservando todas as regras preexistentes byte a byte. Snapshot anterior e verificação remota SHA256 ficam na pasta privada local CloudSnapshot. Configurações e credenciais de serviço permanecem somente no C.

Limite do beta: o save geral ainda é um checkpoint escrito pelo cliente, como nas versões anteriores; não é uma economia autoritativa antifraude. Não usar este mecanismo para MCT real, prêmios financeiros ou compras. A mensagem é criada no servidor, mas a economia inteira deve migrar para autoridade de servidor antes de monetização competitiva.

## Campanha proposta

Baú Fundador para os primeiros100 jogadores elegíveis, sem sorteio e com recursos virtuais. Proposta de conteúdo:500Gold,10cartas (5BitBug+5DataMouse),3Fragmentos de Dados. Definir critérios, uma conta por participante, limite, datas e condições antes de divulgar/ativar. Nenhuma campanha automática foi ativada e nenhum benefício foi concedido ao aceitar convite ou entrar no beta.

As imagens/ícone novos dependem da aprovação visual do Flavio. VIP permanece uma proposta de7dias; não está à venda nem é ativado por estes brindes.
