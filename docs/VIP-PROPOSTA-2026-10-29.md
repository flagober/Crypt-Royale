# VIP e Bastião — aprovado e implementado em 29/10/2026

Flavio aprovou a proposta de sete dias e os preços abaixo. Implementação revisada por Codex após três propostas textuais do Antigravity CLI/Gemini 3.8 Flash High. Novos backups em D:\FlavioG\Backups, verificados antes de editar; nenhum backup anterior movido/apagado.

| VIP | Gold | Recarga PvE após 15 s ativo | Visual |
|---|---:|---:|---|
| 1 | 5.000 | 18 s | Moldura bronze |
| 2 | 12.000 | 16 s | Moldura prata + Guardião de Prata |
| 3 | 25.000 | 15 s | Moldura ouro + Guardião de Ouro + entrada dourada PvE |

Normal e todo PvP: 15 s ativo + 20 s de espera. Ciclos completos 35/33/31/30 s. A recarga inimiga continua após o fim do escudo; não permite renovar/acumular escudo antes da hora. Nenhuma vantagem mecânica VIP no PvP.

Validade: sete dias exatos, renovação manual do mesmo tier soma sete dias ao restante. Para trocar de tier é necessário terminar o atual, evitando descartar tempo comprado. Sem débito automático. Benefício PvE congelado no início da batalha, revalidado na próxima.

Compra exige conta pronta/sincronizada; relógio HTTPS /clock do backend Render ancora contagem monotônica, com amostra válida por 120 s, renovada a cada 60 s quando visível. Compra sempre pede horário novo. Sem confirmação online não concede benefício novo; batalha iniciada conserva seu snapshot.

Transação Firestore no save existente verifica proprietário/revisão e mantém recibo UUID antes de debitar Gold. Retry de recibo existente é resolvido antes de rejeitar revisão antiga; timeout/lost response não debita de novo. UI guarda pedido por UID no aparelho antes do envio, preserva pedido enviado ao fechar/reabrir e oferece Verificar compra. Sem débito local antecipado. Login convidado não compra.

Limite de segurança do beta: economia e save continuam no modelo existente, geridos pelo próprio jogador com regras owner-managed. Transação evita corrida/repetição acidental, mas NÃO transforma o saldo inteiro em economia antifraude autoritativa. Não habilitar dinheiro real nem prometer proteção contra adulteração deliberada sem ledger/validação de operações no servidor. Nenhuma chave administrativa nova foi usada.

Sentinela separado: 5.000 Gold + 20 Fragmentos + 50 cartas, sete dias. MCT, check-in, evoluções e dinheiro real sem mudanças.

Validação: suíte completa 248/248 antes do teste visual; build Vite concluído. QA isolado no Edge a 1200x920 e 390x844, sem overflow; botões 44 px. Resposta perdida simulada, fechamento/reabertura e retry terminaram com 45.000 de 50.000 Gold, um único recibo. Fluxo real de compra com conta Firebase ainda precisa teste de aceitação; nenhum saldo de jogador usado no QA.
