# PvP amistoso 1v1

Node.js24, WebSocket e simulação autoritativa. Início local: `npm run pvp:server`; escuta 127.0.0.1:5181. O proxy do Vite usa `/pvp-socket`. Endpoints: GET `/health`, WS `/pvp`. Não expõe API de compras, save ou recompensas.

Produção exige hostname próprio e TLS válido. Defina a URL `wss://.../pvp` em src/pvp-config.json somente depois de testar a VM e duas contas Firebase reais. Sem URL, o app de distribuição mostra Em preparação. Não usar `ws://` público, token em querystring ou chave de serviço no cliente. O servidor recebe o IDtoken no primeiro frame e consulta apenas o save do dono.

Variáveis: `PORT` (5181), `PVP_HOST` (127.0.0.1), `PVP_ORIGINS` (lista exata separada por vírgulas). O contêiner usa 0.0.0.0 internamente, e o compose publica somente 127.0.0.1:5181 no host. Origem Electron `null` e origens nativas só são aceitas com token válido. Revisar origens reais em cada plataforma; não usar curingas. Desenvolvimento remoto segue Tailscale100.79.208.33:5179, nunca notebook anterior.

Modelo inicial: um processo, salas em memória, dois jogadores por sala, tick100ms, combate3min e pausa/reconexão30s. Não escalar múltiplas réplicas sem mover as salas para autoridade coordenada. Reiniciar cancela amistosos sem gravar resultados na economia. Teto configurado64salas, ainda não é capacidade medida em Oracle. O save Base/Job e inventário segue no Firebase, sem cópia para o servidor PvP.

Preparação Oracle: conferir cadastro/tenancy, região e selo Always Free com estimativa0; créditos de30dias não equivalem a gratuidade permanente. Não ativar plano pago nem criar segunda conta gratuita. Definir DNS e Caddy/ACME em80/443. Não expor porta5181 ou SSH para qualquer IP; chaves SSH/certificados ficam em locais privados fora do projeto/Drive. Criar VM/acesso público somente após a revisão da configuração concreta.

Arquivos Docker/Caddy fornecidos são modelos não implantados. Com Docker instalado e contexto revisado: `docker compose -f server/compose.yaml up --build -d`. Caddyfile.example usa PVP_DOMAIN do domínio controlado pelo usuário. Só alterar DNS depois de confirmar destino e certificado; não contornar avisos TLS. Não coletar ou registrar frames/autenticação em logs.

Testes locais: `node --test src/pvp/*.test.js`. Testes usam autenticação injetada por código, sem flag ou rota para habilitar bypass no processo de produção. O ambiente visual em .orchestration/qa é loopback e não entra no Docker nem nas entregas. Não modificar contas reais para testar Base7.
