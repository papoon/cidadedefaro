# Folha de verificação — Faro Formoso (2026-11-21)

Fontes: OSM = OpenStreetMap via Overpass (dump em osm.json/pharm.json); gov.pt; DR = Diário da República; VP = VisitPortugal.

## Contactos públicos (valores canónicos usados no site)
| Entidade | Valor confirmado | Fonte | Antes no site |
|---|---|---|---|
| Hospital de Faro (ULS Algarve) | Rua Leão Penedo, 8000-386 · 289 891 100 · 37.0247,-7.9288 | DR (anúncios ULS Algarve), OSM | nome CHUA; coords no centro |
| Centro de Saúde de Faro | 8009-003; USF Al-Gharb 289 830 393, Farol 289 830 315, Golfinho 289 830 316, Ossónoba 289 830 325 · 37.0274,-7.9374 | OSM | 289 891 000/100, Rua Leão Penedo |
| USF Ria Formosa | Rua de Portugal 57, 8000-010 · 289 880 300 | OSM | Rua Leão Penedo / 289 803 100 |
| USF Ria Formosa – Montenegro | Rua Simão Fonseca Franco, 8005-217 · 289 830 530 | OSM | — |
| "USF Conde de Oeiras" | NÃO EXISTE no OSM → removida | OSM | listada |
| Farmácias de serviço | Linha 1400; farmaciasdeservico.net | rfm.pt, App Store | portaldasfarmacias.pt / farmaciaportugal.pt |
| Câmara Municipal | Largo da Sé 13, 8004-001 · 289 870 870 · geral@cm-faro.pt | OSM, Portal da Queixa | — |
| Loja de Cidadão | Largo Dr. F. Sá Carneiro (Mercado Municipal, piso 1), 8000-151 · 300 003 990 · úteis 8h30-19h30, sáb 8h30-14h | gov.pt (atualizado 17/09/2026) | Rua Brites de Almeida / 289 887 700 |
| Segurança Social | Sede: Rua Pintor Carlos Porfírio 35, 8000-241 (úteis 9h-16h); balcão na Loja; Linha 300 502 502 / 210 545 400 | seg-social.pt | Rua Conselheiro Bivar 42 / 289 891 700; Rua do Repouso |
| Finanças Faro | Mercado Municipal piso 1, 8000-151 · 289 895 100 | diretório ciberforma (não oficial) | Rua João de Deus / 289 870 500 |
| IMT Algarve | Rua Aboim Ascensão 10/14, 8004-025 · 210 488 488 | imt-ip.pt | EN125 / 289 899 230 |
| PSP Faro | Rua da PSP 32 · Comando Distrital 289 078 100 | OSM, Portugal Resident (2025) | 289 899 899 |
| Bombeiros Sapadores | Rua Monsenhor Henrique Ferreira da Silva · 289 888 000 | OSM, Postal | 289 803 550 / 289 895 100 (Finanças!) |
| FAGAR (água/resíduos) | 289 860 900 (úteis 9-18) · 808 289 808 (24h) · piquete água 962 800 111 | notícias FAGAR/comparaja | Águas do Algarve 707 50 60 50; CMF |
| E-REDES (avarias/iluminação) | 800 506 506 (24h, grátis) | selectra/idealista | EDP Distribuição; 289 870 899 |
| Próximo | 289 899 700 · Terminal Rodoviário, Av. da República 5 | Portal da Queixa | 289 899 740 / 760 |
| Rádio Táxis de Faro | 289 895 795 | gobytaxi | ok |
| Linha do Cidadão Idoso (Provedor) | 800 20 35 31, úteis 9h30-17h30 | provedor-jus.pt | 800 207 256 |
| Polícia Municipal | sede Praça da Liberdade (2025); sem telefone público encontrado | Postal | 289 870 880 |
| CPCJ Faro | sem contacto encontrado → link cnpdpcj.gov.pt | — | 289 870 870 |
| Teatro das Figuras | Rua João de Brito Vargas (Horta das Figuras) · 289 870 077 | OSM | Horta do Terminio / 289 888 110 |
| Biblioteca Municipal | Rua Pintor Carlos Porfírio (junto à Alameda João de Deus) | OSM | Rua Tenente Valadim |
| Ciência Viva | Rua Comandante Francisco Manuel · 289 890 920 · ter-dom | VP, Time Out | Sítio do Açougue |
| Hotel Mónaco | Rua Baptista Severino, 8005-237 · 289 895 060 · 3★ | VP | 289 891 100 (hospital!) |
| Stay Hotel | Rua de Portugal 17-19, 8000-281 · 289 898 080 | VP | 289 001 500 |
| 3HB Faro | Rua Vasco da Gama 33, 8000-442 · 5★ | Michelin | — |
| População | 67 566 (Censos 2021) | INE via idealista/infopedia | 64 560 |

## Restaurantes / hotéis / farmácias
Todos os registos em assets/data/*.json têm `fonte` — contactos/horários tirados do OSM (tags phone/opening_hours/addr:*).
Removidos por não verificáveis: Farmácia Leonardo, Farmácia do Montepio, 12 restaurantes genéricos, Hospedaria Frangaria, "Algarve Race Hostel".

## Barcos e praias (praias.html, assets/data/barcos.json) — verificado 2026-11-21
| Dado | Valor | Fonte |
|------|-------|-------|
| Faro → Farol / Culatra (horários e preços 2026) | transcritos 1:1 do PDF | [Câmara de Faro, horário 2026](https://api.faro.pt/uploads/1/8/planear/como%20chegar/hor%C3%A1rio%20farol_2026.pdf) — operador Soldaria (contactos no PDF) |
| Ilha Deserta | operador privado Animaris, todo o ano, horários não publicados de forma estática → só link; "a partir de 5 €" (lancha) | ilhadeserta.com |
| Autocarros 14/16 para a Praia de Faro | percursos apenas, sem horários (a Próximo não publica PDF estável da linha 16; horários em tempo real em proximo.pt) | site do Aeroporto de Faro, PDF PXM14 da Próximo |
| Faro-Mar praia acessível + cadeira anfíbia | VisitPortugal ("Faro acessível") | visitportugal.com |
| Qualidade da água balnear | link InfoÁgua (APA) | infoagua.apambiente.pt |

**Renovar todos os anos:** o PDF da Câmara muda de nome por ano (`horário farol_<ano>.pdf`). Quando `year` em
`barcos.json` for anterior ao ano corrente, a página avisa que o horário pode estar desatualizado.

## Chegar a Faro (chegar-a-faro.html) — verificado 2026-11-21
| Dado | Valor publicado | Fonte / nota |
|------|-----------------|--------------|
| Linhas 16 e 14 (Próximo) servem o aeroporto; 16 vai ao Terminal Rodoviário (~20 min) | percursos | site do Aeroporto de Faro (não oficial), algarve-tourist, PDF PXM14 |
| Bilhete de autocarro | "cerca de 2–3 €, ao motorista" | fontes divergem: 2,25 € / 2,80 € / 2,85 € — publicado como intervalo |
| Táxi aeroporto → centro | "cerca de 10–15 € (indicativo)" | Welcome Pickups ~11/13 €, Transfeero ~10 € + 20% noite/fim de semana |
| TVDE | ponto de recolha indicado na app | Uber e Bolt (páginas FAO) |
| Site oficial da ANA (aeroportofaro.pt) | — | não legível por pedido automático (Incapsula / conteúdo por JS); rever manualmente |

## Checklist novo residente (viver-em-faro.html) — verificado 2026-11-21
| Passo | Fonte oficial | Nota |
|-------|---------------|------|
| CRUE na Câmara Municipal da área de residência; >3 meses | aima.gov.pt (Nacionais UE); balcao.cm-faro.pt (Direitos e Cidadania) | prazo de 30 dias: guias (e-konomista); taxa não publicada (fontes divergem) |
| NIF gratuito, Finanças/Loja de Cidadão com marcação; online só via mandatário | gov.pt guia NIF/NISS estrangeiros; DECO | representante fiscal: gov.pt e AT/DECO contradizem-se → não afirmado na página |
| NISS online e gratuito; carta registada | seg-social.pt; gov.pt notícia NISS online | |
| NIF+NISS+utente num Espaço Cidadão (com morada em PT) | gov.pt | |
| Utente SNS: USF da área + autorização de residência / CRUE / atestado da Junta | sns24.gov.pt (acesso de estrangeiros); ERS | |
| Freguesias de Faro: Faro (Sé e São Pedro), Montenegro, Conceição e Estoi, Santa Bárbara de Nexe | — | sem contactos publicados (não verificados) |
| Loja de Cidadão | ver linha "Loja de Cidadão" acima (gov.pt, 17/09/2026) | |

## Arrendamento (viver-em-faro.html#rental-title) — verificado 2026-11-21
| Dado | Fonte | Nota |
|------|-------|------|
| >4 500 burlas por falso arrendamento 2023–2025 | PSP via idealista/news (abr. 2026), Diário do Distrito | outras fontes dão 4 267 em 3 anos — publicado "mais de 4 500" |
| Sinais/medidas (não pagar antes de visitar, não enviar documentos) | PSP (Pplware, 24 Notícias), CGD | |
| Certidão permanente do registo predial confirma proprietário | Cofidis, CGD → predialonline.pt | custo (15 €) não publicado na página |
| Senhorio comunica contrato à AT e emite recibos eletrónicos | CGD Saldo Positivo, Santander | há dispensas legais — página diz "tem de" (regra geral) |
| Certificado energético obrigatório (em regra) | Rentila, Maxcidadela | |
| Porta 65 Jovem 18–35 anos, candidaturas no Portal da Habitação, verba limitada | gov.pt, DECO | Porta 65+ sem limite de idade (DECO) |
| Ação Social CM Faro 289 870 870 | já verificado (linha Câmara) | |

## Frases úteis (frases-uteis.html)
Conteúdo linguístico próprio (português europeu). Sem fontes externas — rever por falante nativo antes de grandes alterações.

## Camadas do mapa e secções trabalho remoto / animais — verificado 2026-11-21
| Dado | Fonte | Nota |
|------|-------|------|
| Contagens OSM (raio 6 km do centro): coworking 1, WC acessíveis 14, estacionamento PMR 4, parques caninos 2, veterinários 6 | Overpass API (consulta gerada por `construirQueryCamada`) | dados escassos → página convida a contribuir no OSM |
| Microchip + SIAC obrigatório (cães, gatos, furões), 120 dias após nascimento | DL 82/2019; Pplware; siac.pt | taxa de registo não publicada (valor atual não confirmado) |
| Cães em praias concessionadas proibidos na época balnear (regra geral); cães de assistência sempre permitidos | DECO PROteste; Postal | edital de cada praia prevalece |
| Operadoras MEO, NOS, Vodafone, Digi; roaming UE sem custos extra | conhecimento geral (regulamento UE "roam like at home") | sem preços publicados |

## Domingo e fora de época (oque-fazer-hoje.html#off-season-title) — verificado 2026-11-21
| Dado | Fonte | Nota |
|------|-------|------|
| Museu Municipal fecha à segunda, abre ao fim de semana | algarveprimeiro, explorial, rotadietamediterranica | horas exatas divergem entre fontes → não publicadas |
| Capela dos Ossos sem visitas ao domingo | algarve-tourist, portugalvisitor, petitfute | horários de semana divergem → não publicados |
| Ciência Viva ter–dom | ver linha "Ciência Viva" acima | card corrigido (antes qua–dom) |
| Barcos Farol/Culatra só mai–out; Deserta todo o ano | ver "Barcos e praias" acima | |
| Loja de Cidadão fechada ao domingo | ver linha "Loja de Cidadão" acima | |
| Fórum Algarve todos os dias | já no site | |
