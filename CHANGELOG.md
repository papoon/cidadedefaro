# Changelog

Todas as alterações notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

## [Não Lançado]

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
