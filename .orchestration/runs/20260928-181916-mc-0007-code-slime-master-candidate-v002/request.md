# 1. Papel e objetivo

Corrija deterministicamente a candidata V001 do MC-0007 Code Slime para criar a **V002**, neutralizando RGB oculto sob alfa zero e recriando corretamente todos os previews por `alpha_composite`. Não regenere nem altere a arte visível.

# 2. Entrada canônica e evidência do defeito

- Fonte: `E:\Projetos\MonsterCrypt\Crypt-Royale\art-source\exploration\cr_mc-0007_code-slime_master-candidate_v001.png`
- Métrica independente: 431.640 pixels possuem RGBA `(32,36,42,0)`; devem virar `(0,0,0,0)`.
- O canal alfa do candidato está correto, porém os previews V001 branco/magenta foram compostos incorretamente e exibem um retângulo cinza correspondente ao RGB oculto.

# 3. Alterações permitidas

Crie somente:

- `E:\Projetos\MonsterCrypt\Crypt-Royale\art-source\exploration\cr_mc-0007_code-slime_master-candidate_v002.png`
- `E:\Projetos\MonsterCrypt\Crypt-Royale\art-source\exploration\cr_mc-0007_code-slime_master-candidate_v002.json`
- Previews com prefixo `cr_mc-0007_code-slime_master-candidate_v002_qa_` na mesma pasta.

Processamento temporário somente em `.orchestration\temp\mc-0007-master-v002\`, removido ao finalizar. Não deixar scripts na raiz.

# 4. Ações proibidas

- Não alterar nem sobrescrever a V001.
- Não gerar nova imagem e não modificar qualquer pixel visível (`alpha > 0`).
- Não modificar o canal alfa em nenhum pixel.
- Não redimensionar, recortar, filtrar, suavizar ou reamostrar o PNG mestre.
- Não tocar outros assets, código, docs ou `approved-masters`.

# 5. Critérios de aceitação

- V002 deve continuar 2048×2048 RGBA.
- Canal alfa V002 deve ser byte a byte idêntico ao canal alfa V001: diferença zero.
- Todos os pixels com alfa 0 devem ter RGB `(0,0,0)`; `hidden_nonblack_rgb = 0`.
- Todos os pixels com alfa > 0 devem ser RGBA idênticos à V001; diferença visível zero.
- SHA-256 novo medido do disco.
- Recriar QA branco, cinza-escuro e magenta usando `Image.alpha_composite(background, foreground)`, nunca `paste` ignorando alfa.
- Nos três QA não pode existir retângulo cinza; somente personagem e três bolhas sobre o fundo escolhido.
- Recriar edge crop 4× e previews 128/96 px a partir da V002.
- JSON deve registrar: hashes V001/V002, alpha diff, visible RGBA diff, hidden nonblack antes/depois, dimensões, modo, bbox e contagens alfa.

# 6. Evidências obrigatórias

- Arquivos criados e ferramentas usadas.
- Confirmação de zero alteração visível e zero alteração no alfa.
- Métricas antes/depois medidas do disco.
- Confirmação de que temporários foram removidos e nenhum destino fora do permitido foi alterado.
- Apresentar V002 para aprovação humana, sem promover.
