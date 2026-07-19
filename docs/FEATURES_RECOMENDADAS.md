# Funcionalidades Recomendadas

Lista de sugestões de novas funcionalidades para o Faro Formoso, organizadas por área e prioridade.
Este documento é uma proposta — não implica compromisso de implementação nem prazo definido.

Contexto do projeto: PWA 100% frontend (sem backend), bilingue PT/EN, gratuita, mantida de forma
independente. Ver [.claude/CLAUDE.md](../.claude/CLAUDE.md) e
[.claude/skills/ui-modernization.md](../.claude/skills/ui-modernization.md) para as convenções
técnicas e de design a seguir em qualquer nova funcionalidade.

## Como usar este documento

Cada item indica:
- **Esforço** — estimativa relativa (Baixo / Médio / Alto) dado que o projeto é 100% frontend, sem backend.
- **Dependências** — o que já existe no projeto e pode ser reaproveitado.

---

## 1. Alta prioridade — completar funcionalidades já iniciadas

### 1.1 Ativar o sistema de alertas em produção
**Esforço: Baixo** · Depende de: `src/ui/alerts.js`, `docs/ALERTAS.md`

O sistema de alertas locais (`window.localAlerts`) está totalmente implementado, corrigido (XSS) e
já carregado em todas as páginas via `scriptsCommon`, mas não tem nenhum produtor de conteúdo real —
apenas a página de demonstração o usa. Sugestões:
- Um ficheiro JSON estático (`assets/data/alertas.json`) com alertas atuais (obras na via pública,
  alterações de horários, eventos), lido no arranque da app e mostrado via `localAlerts.show()`.
- Um pequeno painel de administração local (ficheiro `.md`/`.json` editado manualmente antes de cada
  `git push`) já seria suficiente dado que o site não tem backend.

### 1.2 Finalizar a tradução do Guia Premium
**Esforço: Baixo** · Depende de: `assets/lang/en.json`

Ainda podem existir secções do `guia-premium.html` com chaves de tradução geradas automaticamente
(slugs sem semântica, ex. `guia_premium.key_7`) em vez de nomes descritivos — rever e normalizar
para o mesmo padrão semântico usado em `idosos.html`/`saude-onde-ir-agora.html`.

### 1.3 Auditoria de acessibilidade completa
**Esforço: Médio**

Passar a checklist de acessibilidade do skill de UI por todas as 23 páginas (contraste, foco
visível, navegação por teclado, `alt` em imagens, labels em formulários) — foi feito um pass no
design system, mas não uma auditoria página-a-página com um leitor de ecrã real.

---

## 2. Funcionalidades para residentes

### 2.1 Notificações push para alertas importantes
**Esforço: Médio-Alto** · Depende de: `sw.js`, Web Push API

O service worker já existe; adicionar suporte a Push API (com um serviço gratuito como
[ntfy.sh](https://ntfy.sh) ou Web Push nativo) permitiria notificar utilizadores sobre alertas
importantes mesmo com a app fechada — sem precisar de backend próprio.

### 2.2 Calendário de recolha de lixo/reciclagem por zona
**Esforço: Médio** · Depende de: `ambiente.html`, dados da Câmara Municipal de Faro

Muitas cidades têm horários de recolha diferentes por freguesia/zona. Um pequeno formulário
"a minha zona" (guardado em `localStorage`, como já se faz com favoritos) que filtra/realça os dias
de recolha aplicáveis seria um upgrade natural da secção de reciclagem existente.

### 2.3 Checklist interativa "Novo Residente em Faro"
**Esforço: Médio** · Depende de: `viver-em-faro.html`, `src/utils/favorites.js`

Uma checklist com passos (registo na Junta de Freguesia, Segurança Social, centro de saúde, NIF,
etc.), com progresso guardado em `localStorage` (mesmo padrão de `favorites.js`), útil para quem
está a mudar-se para Faro.

### 2.4 Simulador de custo de vida
**Esforço: Médio** · Depende de: `viver-em-faro.html` (já tem `.cost-grid`)

Formulário simples (renda estimada, nº de pessoas, transporte) que soma valores já existentes na
página de custo de vida e devolve uma estimativa mensal — cálculo 100% no cliente, sem API externa.

---

## 3. Funcionalidades para visitantes/turistas

### 3.1 Roteiros/itinerários pré-definidos
**Esforço: Médio** · Depende de: `oque-fazer-hoje.html`, `mapa.html`, Leaflet

"Faro em 1 dia", "Faro em fim-de-semana", "Faro com crianças" — sequências de pontos de interesse
já existentes no mapa, apresentadas como uma lista ordenada com tempos estimados e um link que abre
o mapa com esses pontos destacados.

### 3.2 Modo offline mais completo para o Guia Premium
**Esforço: Baixo-Médio** · Depende de: `guia-premium.html`, `sw.js`

O guia já é descarregável em PDF; garantir que todos os recursos referenciados por
`guia-premium.html` (mapas offline, imagens) estão corretamente listados em `sw.js`'s `HTML_PAGES`
para que o guia completo funcione sem rede após a primeira visita — ver as notas sobre bundling e
hashing em `.claude/CLAUDE.md` antes de mexer em `sw.js`.

### 3.3 Integração com previsão do tempo
**Esforço: Baixo** · API externa gratuita (Open-Meteo, sem chave necessária)

Um pequeno widget na homepage/página de lazer com a previsão do tempo em Faro (relevante para
decidir praia vs. atividades interiores) — Open-Meteo é gratuito, sem necessidade de chave de API,
compatível com a filosofia "sem backend" do projeto.

### 3.4 Eventos em destaque com filtro por data
**Esforço: Médio** · Depende de: `oque-fazer-hoje.html`, `assets/data/*.json`

Atualmente os eventos parecem estáticos por página; um ficheiro `assets/data/eventos.json` com
datas reais permitiria filtrar "hoje", "este fim-de-semana", "este mês" com JS puro, sem alterar a
arquitetura 100% estática.

---

## 4. Melhorias técnicas/plataforma

### 4.1 Testes automatizados
**Esforço: Médio** · Nenhuma dependência nova obrigatória (ex. Vitest + Playwright)

O projeto não tem atualmente nenhuma framework de testes (identificado em revisões anteriores).
Prioridades sugeridas:
- Testes unitários para lógica pura (`src/utils/search.js`, `src/utils/favorites.js`, `src/intl/i18n.js`).
- Um teste E2E básico por página crítica (mapa carrega, pesquisa funciona, favoritos persistem).
- Um script de CI que valida consistência entre `vite.config.js`, `sw.js` e
  `src/partials/navigation.html` (já identificado como fonte de bugs recorrentes — ver
  `.claude/CLAUDE.md`).

### 4.2 Validação automática de traduções em CI
**Esforço: Baixo**

Um script simples que compara chaves entre `assets/lang/pt.json` e `assets/lang/en.json` e falha o
build se houver chaves em falta ou strings idênticas suspeitas de tradução esquecida — problema já
identificado e corrigido manualmente no `guia-premium.html` nesta sessão; automatizar evita que
regresse.

### 4.3 Geração automática do manifesto de precache do Service Worker
**Esforço: Médio** · Depende de: `sw.js`, `vite.config.js`

Como documentado em `.claude/CLAUDE.md`, `sw.js` e `vite.config.js` são listas mantidas à mão e já
divergiram no passado (páginas em falta no precache). Considerar `vite-plugin-pwa` com estratégia
`injectManifest`, que gera a lista de precache automaticamente a partir do output real do build —
elimina esta classe de bug de raiz.

### 4.4 Analytics respeitador da privacidade
**Esforço: Baixo** · Ex. Plausible, Umami ou GoatCounter (self-hosted ou serviço gratuito)

Para perceber que páginas são mais usadas sem comprometer o objetivo de "sem tracking" já afirmado
no site (`docs/ALERTAS.md` menciona explicitamente "Sem tracking" como critério de aceitação) —
qualquer solução aqui tem de ser sem cookies e sem dados pessoais para não contradizer essa promessa.

### 4.5 Formulário de reporte de problemas/sugestões
**Esforço: Baixo** · Serviço externo gratuito (Formspree, Netlify Forms, ou simplesmente `mailto:`)

`problemas-frequentes.html` já lista problemas comuns; um formulário simples para os utilizadores
reportarem problemas não listados ou sugerirem conteúdo, sem necessitar de backend próprio.

---

## 5. Ideias de maior esforço (médio/longo prazo)

### 5.1 App companion / atalhos no ecrã principal por categoria
**Esforço: Alto**

Shortcuts do PWA Manifest (`manifest.json` já suporta `shortcuts`) para acesso direto a
"Emergências", "Mapa", "Favoritos" a partir do ícone da app no telemóvel, sem abrir a homepage.

### 5.2 Modo "visita guiada" com narração por voz
**Esforço: Alto** · Depende de: `src/ui/voice-navigation.js` (já existe navegação por voz)

Já existe suporte a navegação por voz; estender para um modo de "audioguia" simples usando a Web
Speech API para ler descrições de pontos de interesse enquanto o utilizador caminha pela cidade.

### 5.3 Suporte a mais idiomas (francês, espanhol, alemão)
**Esforço: Alto** · Depende de: `src/intl/i18n.js`

O sistema de i18n já é genérico o suficiente para suportar mais idiomas além de PT/EN — Faro recebe
muitos turistas franceses, espanhóis e alemães. Cada novo idioma implica traduzir integralmente
`assets/lang/*.json` (atualmente ~1700 linhas), pelo que só compensa com tradução profissional ou
colaboração da comunidade.

---

## Notas finais

- Qualquer nova funcionalidade deve seguir a checklist de nova página em
  [.claude/skills/ui-modernization.md](../.claude/skills/ui-modernization.md) (partials partilhados,
  tokens de design, traduções PT+EN completas, acessibilidade, responsividade, sem `innerHTML` com
  conteúdo dinâmico).
- Antes de mexer em `sw.js` ou dependências, rever as notas específicas em
  [.claude/CLAUDE.md](../.claude/CLAUDE.md) sobre bundling/hashing do Vite e sincronização de
  `package-lock.json` — já causaram falhas de deploy no passado.
