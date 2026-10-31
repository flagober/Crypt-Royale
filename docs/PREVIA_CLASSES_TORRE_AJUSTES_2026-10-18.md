# Revisão visual das classes e torres — v002

Solicitação: harmonizar as duas torres laterais sem personagens, remover fragmento da segunda pose do Guerreiro, ampliar a plataforma da central para os pés e recolorir a armadura/escudo da Guerreira em roxo e rosa escuros.

Prévia: http://localhost:5179/class-tower-preview.html
VPN: http://100.79.208.33:5179/class-tower-preview.html

## Alterações

- Central v002: piso circular amplo com beiral deslocado para fora; PNG 1201×1309 com alfa. Pés apoiados em [280,255] no canvas 560×600. Removida a oscilação vertical de corpo inteiro que deslocava o contato dos pés.
- Guardiã v001: torre mecânica autônoma, núcleo ciano, placas grafite e detalhes laranja/violeta no estilo da central, sem personagem. PNG 1201×1309 com alfa. A mesma arte é utilizada nas duas laterais na prévia; não foi gerada uma segunda arquitetura distinta.
- Guerreira v002: armadura, escudo e tiara em ametista, ameixa e rosa-magenta escuro; capa violeta, cabelo prateado e lâmina ciano preservados. PNG 2172×724, quatro poses em uma vista.
- Guerreiro: arquivo PNG v001 preservado integralmente. Componentes alfa detectaram 1055 pixels intrusos em x=0..26, y=320..393 da segunda célula (coordenadas locais). O recorte dessa célula passa de x=543 a x=573, largura 513 e pivô local x=207; preserva a posição do personagem e exclui a sobra da capa vizinha. Corpo principal começa em x=54 na célula original.
- A revisão da Guerreira encontrou sobras separadas também nas células 2 e 4. Recortes locais iniciam em x=30 e x=20 respectivamente, antes dos corpos principais (x=57 e x=30). Pivôs compensados. Pequenas franjas de brilho fazem parte da arte candidata, não foi aplicado corte indiscriminado de transparência.
- Nova área Conjunto defensivo: central com classe selecionável e duas laterais sem personagens. Controles e animação existentes preservados.

## Produção de imagens

Ferramenta integrada image_gen, três chamadas. Arquivos novos preservam todas as artes v001.

Prompts:
1. Editar a torre vazia: alterar somente o topo, pelo menos dobrar o piso útil, plataforma com cerca de 70% da largura da base, beiral baixo e externo; conservar reator, base, estilo e perspectiva, sem personagem ou texto, transparência real.
2. Editar somente as cores da armadura e escudo da Guerreira nas quatro poses para ametista, ameixa e rosa-magenta escuros; manter poses, anatomia, cabelo prateado, espada direita/escudo esquerdo e lâmina ciano, sem torre/fundo/texto, transparência real.
3. Gerar uma Guardiã menor e compacta da mesma família visual: placas grafite, núcleo e emissor mecânico de cristal ciano, detalhes laranja e violeta, base sólida, sem personagens, silhuetas humanas, cenário ou texto, transparência real. Arte reutilizada nas duas laterais.

## Verificação e escopo

- Dimensões e transparência real verificadas via bitmap RGBA; sintaxe JS verificada com node --check.
- Prévia carregada no navegador. Segunda pose conferida sem os fragmentos identificados; piso agora visível ao redor dos pés de ambos. Conjunto com duas Guardiãs sem ocupantes conferido e seletor da central testado com Guerreira.
- Screenshot: docs/classes-torre-ajustes-20261018.png.
- Sem alterações no src, dano, regras, versão ou instaladores. Nova arte continua candidata para aprovação visual antes de integração ao combate.
- Backups verificados: C:\FlavioG\Backups\2026-10-18\191341-530-class-tower-v002-d19a2943; 191605-869-female-frame2-crop-36f556df; 191647-070-female-frame4-crop-5c896b38.

Próxima etapa: aprovação visual dos ajustes e, então, integração ao renderizador e aos eventos de ataque sem mudar atributos por aparência.
