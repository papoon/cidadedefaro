# Changelog

Todas as alterações notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

## [Não Lançado]

### 🏠 Checklist do novo residente

#### Adicionado
- **Checklist interativa em `viver-em-faro.html`**: escolha do perfil (português / UE / fora da UE), 10 passos (morada no CC, AIMA, certificado de registo UE, NIF, NISS, atestado da Junta, centro de saúde, Chave Móvel Digital, água FAGAR, carta de condução) com links oficiais, progresso guardado no dispositivo e informação da Loja de Cidadão. Funciona sem JavaScript (lista completa). Pesquisa: NIF, NISS, AIMA, etc. levam à checklist.

### ✈️ Chegar a Faro

#### Adicionado
- **Nova página `chegar-a-faro.html`**: do aeroporto ao centro (autocarros 16 e 14, táxi, TVDE), aviso para quem aterra à noite, e como seguir viagem (comboio CP, Vamus Algarve, Rede Expressos/FlixBus). Preços apresentados como indicativos. Ligada na navegação (Essencial), sitemap, pesquisa e `transportes.html`; disponível offline (SW `v12`).

### 🏖️ Praias e Ilhas

#### Adicionado
- **Nova página `praias.html`**: horários oficiais 2026 dos barcos Faro → Ilha do Farol e Culatra (Câmara de Faro), com o estado de hoje em hora de Lisboa (sem barcos / próxima partida / **último barco de regresso**), horário completo e preços; Ilha Deserta (Animaris); autocarros 14/16 para a Praia de Faro; praia acessível Faro-Mar; bandeiras e qualidade da água (InfoÁgua).
- Ligada na navegação (Lazer e cultura), sitemap, pesquisa, `lazer.html` e `oque-fazer-hoje.html`; disponível offline (SW `v11`).

### ⚠️ Avisos IPMA, urgências e ferramentas de qualidade

#### Adicionado
- **Avisos meteorológicos do IPMA** para o distrito de Faro (amarelo, laranja, vermelho) mostrados no topo de todas as páginas (`src/data/avisos-ipma.js`). A API do IPMA é tratada como *Network Only* no service worker para nunca mostrar avisos antigos.
- **Tempos de espera nas urgências**: cartão em `saude-onde-ir-agora.html` com link para o portal oficial do SNS e explicação da triagem de Manchester.
- **Calor extremo**: conselhos em `idosos.html`.
- `npm run check` (consistência i18n/páginas/sitemap/SW) e `npm test` (Vitest), ambos no CI.
- Atalhos da PWA (Onde ir agora, Mapa, Transportes, Favoritos).

#### Corrigido
- `idosos.html`: a Linha do Cidadão Idoso mostrava o número 112 em vez de 800 20 35 31.
- Duas strings por traduzir em `en.json`.

### 🎯 Reorganização da Navegação e Arquitetura de Informação

#### Alterado
- **Navegação Principal Reorganizada**: Menu principal agora organizado por prioridade de uso do utilizador
  - **Essencial** (1ª linha): Início, Saúde, Transportes, Mapa
  - **Serviços** (2ª linha): Onde Comer, Onde Ficar, Problemas
  - **Viver** (3ª linha): Viver em Faro, Idosos
  - **Lazer** (4ª linha): Lazer, Hoje
  - **Mais Info** (5ª linha): Ambiente, Mobilidade, História, Premium, Sobre, Favoritos
  
- **Cards da Homepage Reorganizados**: Ordem de exibição agora reflete a importância para utilizadores
  - Saúde e Transportes em destaque (posições 1 e 2)
  - Serviços essenciais em seguida
  - Informação de contexto no final

- **Nomes de Menu Simplificados**: Alguns itens com nomes mais curtos para melhor visualização mobile
  - "Problemas Frequentes" → "Problemas"
  - "O que fazer hoje" → "Hoje"
  - "Faro para Idosos" → "Idosos"
  - "📘 Guia Premium" → "📘 Premium"
  - "ℹ️ Sobre o Projeto" → "Sobre"

#### Melhorado
- **Centralização de Contactos de Emergência**: Informações de saúde de emergência consolidadas
  - Página `saude-onde-ir-agora.html` serve como hub central para contactos de urgência
  - Página `saude.html` agora referencia a página de emergências em vez de duplicar informação
  - Redução de contactos duplicados de 4 para 2 na página principal de saúde

- **Links Relacionados Adicionados**: Melhor navegação entre páginas similares
  - `viver-em-faro.html`: Links para Saúde, Emergências, Transportes, Problemas, Ambiente, Idosos
  - `idosos.html`: Links para Saúde, Emergências, Transportes, Viver em Faro
  - `saude-onde-ir-agora.html`: Links úteis já existentes mantidos

- **README Atualizado**: Documentação das páginas agora organizada por categorias de prioridade

#### Impacto na Usabilidade
- ✅ Navegação mais intuitiva em desktop e mobile
- ✅ Informação essencial mais acessível (menos cliques)
- ✅ Redução de duplicação de conteúdo
- ✅ Melhor SEO através de links internos relacionados
- ✅ Facilita manutenção futura (informação centralizada)

---

## Versões Anteriores

Para consultar o histórico completo de alterações, visite o [GitHub Releases](https://github.com/papoon/cidadedefaro/releases).
