# 🌟 Faro Formoso

<div align="center">

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![PWA](https://img.shields.io/badge/PWA-5A0FC8?style=for-the-badge&logo=pwa&logoColor=white)

**Faro Formoso — viver, descobrir e participar na cidade**

**Guia completo e gratuito para viver e visitar Faro, Portugal**

[🌐 Ver Site](https://papoon.github.io/cidadedefaro) • [🐛 Reportar Bug](https://github.com/papoon/cidadedefaro/issues) • [✨ Sugerir Funcionalidade](https://github.com/papoon/cidadedefaro/issues)

</div>

---

## 📋 Sobre o Projeto

O **Faro Formoso** é uma Progressive Web App (PWA) de utilidade pública que oferece informações essenciais sobre a cidade de Faro, Portugal. Desenvolvido de forma independente e completamente gratuito, o guia reúne num único local tudo o que residentes e visitantes precisam saber sobre a cidade.

### 🎯 Objetivo Social

Este projeto tem como missão democratizar o acesso à informação sobre Faro, facilitando o dia a dia de moradores e turistas através de:

- 🚌 **Transportes públicos** e mobilidade urbana
- 🏥 **Serviços de saúde** e farmácias
- 🌿 **Informações ambientais** e sustentabilidade
- 🎭 **Cultura e turismo** com pontos de interesse
- 🍽️ **Restaurantes e hotéis** com informações úteis
- 🏠 **Guia prático** para novos residentes
- 👴👵 **Apoio à terceira idade** com informação acessível para seniores
- ❓ **Problemas frequentes** e suas soluções

---

## ✨ Funcionalidades Principais

- 🌐 **Bilíngue**: Suporte completo para Português e Inglês
- 📱 **PWA**: Instalável como app e funciona offline
- 🌙 **Modo Escuro**: Alternância entre tema claro e escuro
- ♿ **Acessibilidade**: Compatível com leitores de tela e WCAG
- ⭐ **Sistema de Favoritos**: Salve seus locais preferidos
- 🔍 **Busca Global**: Encontre rapidamente o que procura
- 🗺️ **Mapas Interativos**: Visualize localizações com Leaflet.js e OpenStreetMap
- 📘 **Guia Premium**: Conteúdo detalhado com mapas offline disponível para download
- 🔄 **Sem Backend**: 100% frontend, rápido e leve

---

## 💻 Tecnologias Utilizadas

### Frontend
- **HTML5** - Estrutura semântica e acessível
- **CSS3** - Design responsivo e moderno com flexbox e grid
- **JavaScript (ES6+)** - Funcionalidades interativas e dinâmicas

### PWA & Performance
- **Service Worker** - Cache inteligente e suporte offline
- **Web App Manifest** - Instalação como aplicação nativa
- **LocalStorage** - Armazenamento local de preferências e favoritos

### Bibliotecas & Ferramentas
- **Leaflet.js** - Mapas interativos
- **OpenStreetMap** - Dados cartográficos abertos
- **Internacionalização (i18n)** - Sistema customizado de tradução

### Padrões & Boas Práticas
- **Responsive Design** - Adaptável a todos os dispositivos
- **WCAG Compliance** - Diretrizes de acessibilidade web
- **Progressive Enhancement** - Funcionalidade básica garantida em todos os navegadores
- **Semantic HTML** - Markup significativo para melhor SEO e acessibilidade

---

## 🔌 APIs e Fontes de Dados

O projeto integra dados de múltiplas fontes públicas e abertas:

| API/Fonte | Descrição | URL |
|-----------|-----------|-----|
| 🗺️ **GEO API PT** | Dados geográficos e demográficos dos municípios portugueses | [geoapi.pt](https://geoapi.pt) |
| 🏛️ **Câmara Municipal de Faro** | Informações oficiais sobre serviços municipais | [cm-faro.pt](https://www.cm-faro.pt) |
| 🏥 **Portal do Cidadão** | Serviços de saúde e farmácias | [portaldocidadao.pt](https://www.portaldocidadao.pt) |
| 🏖️ **Turismo de Portugal** | Informações turísticas oficiais e eventos | [visitportugal.com](https://www.visitportugal.com) |
| 🗺️ **OpenStreetMap** | Mapas colaborativos abertos | [openstreetmap.org](https://www.openstreetmap.org) |
| 🚌 **Proximo Autocarro** | Transportes públicos e horários | [proximoautocarro.pt](https://www.proximoautocarro.pt) |

---

## 🚀 Como Executar

### Opção 1: Servidor Local Simples (Desenvolvimento Rápido)

1. **Clone o repositório**
```bash
git clone https://github.com/papoon/cidadedefaro.git
cd cidadedefaro
```

2. **Inicie um servidor local**

Com Python 3:
```bash
python -m http.server 8000
```

Com Python 2:
```bash
python -m SimpleHTTPServer 8000
```

Com Node.js (http-server):
```bash
npx http-server -p 8000
```

Com PHP:
```bash
php -S localhost:8000
```

3. **Abra no navegador**
```
http://localhost:8000
```

### Opção 2: Com Vite (Recomendado para Desenvolvimento)

O projeto usa Vite para otimização e build. Para desenvolvimento com hot-reload:

1. **Clone o repositório**
```bash
git clone https://github.com/papoon/cidadedefaro.git
cd cidadedefaro
```

2. **Instale as dependências**
```bash
npm install
```

3. **Inicie o servidor de desenvolvimento**
```bash
npm run dev
```

4. **Ou faça o build para produção**
```bash
npm run build
npm run preview
```

O site estará disponível em `http://localhost:5173` (dev) ou `http://localhost:4173/cidadedefaro/` (preview).

### Opção 3: Com Docker (Desenvolvimento Isolado)

Para desenvolvimento com Docker, sem precisar instalar Node.js localmente:

1. **Clone o repositório**
```bash
git clone https://github.com/papoon/cidadedefaro.git
cd cidadedefaro
```

2. **Inicie o container com Docker Compose**
```bash
docker compose up
# ou para versões antigas do Docker Compose
docker-compose up
```

Ou construa e execute manualmente com Docker:
```bash
docker build -t cidadedefaro .
docker run -p 5173:5173 -v $(pwd):/app -v /app/node_modules cidadedefaro
```

3. **Acesse no navegador**
```
http://localhost:5173
```

O Docker Compose automaticamente:
- Instala as dependências do Node.js
- Inicia o servidor de desenvolvimento Vite
- Habilita hot-reload (mudanças no código atualizam automaticamente)
- Expõe a porta 5173 para acesso local

Para parar o container: `Ctrl+C` ou `docker compose down` (ou `docker-compose down`)

### Opção 4: Abrir Diretamente

Para desenvolvimento simples, você pode abrir o arquivo `index.html` diretamente no navegador. No entanto, algumas funcionalidades (como Service Worker e APIs) podem não funcionar corretamente devido a restrições CORS.

### Opção 5: Deploy Automático

O projeto está configurado com deploy automático para GitHub Pages:
- **Deploy automático**: Todo push para a branch `main` gera um novo deploy
- **Build com Vite**: O workflow do GitHub Actions compila o projeto automaticamente
- **URL de produção**: https://papoon.github.io/cidadedefaro/

Outros serviços de hospedagem gratuita compatíveis:
- **Netlify**
- **Vercel**
- **Cloudflare Pages**

---

## 📁 Estrutura do Projeto

```
cidadedefaro/
│
├── 📄 Páginas HTML (root)             # Páginas finais HTML
├── index.html                         # Página inicial
├── transportes.html                   # Transportes e mobilidade
├── saude.html                         # Saúde e farmácias
├── ambiente.html                      # Ambiente e sustentabilidade
├── lazer.html                         # Cultura e turismo
├── restaurantes.html                  # Onde comer
├── hoteis.html                        # Onde ficar
├── mapa.html                          # Mapa interativo
├── ... (outras páginas HTML)
│
├── src/
│   ├── partials/                      # Componentes HTML reutilizáveis
│   │   ├── meta-common.html           # Meta tags comuns e stylesheets
│   │   ├── header.html                # Cabeçalho com dark mode toggle
│   │   ├── navigation.html            # Menu de navegação principal
│   │   ├── footer.html                # Rodapé
│   │   └── scripts-common.html        # Scripts comuns
│   │
│   ├── core/                          # Scripts principais
│   │   └── main.js                    # Script principal
│   │
│   ├── intl/                          # Internacionalização
│   │   └── i18n.js                    # Sistema de tradução
│   │
│   ├── ui/                            # Interface e UX
│   │   ├── accessibility.js           # Features de acessibilidade
│   │   ├── voice-navigation.js        # Navegação por voz
│   │   ├── alerts.js                  # Sistema de alertas
│   │   └── ux.js                      # Melhorias de UX
│   │
│   ├── utils/                         # Utilitários
│   │   ├── pwa.js                     # Funcionalidades PWA
│   │   ├── favorites.js               # Sistema de favoritos
│   │   └── search.js                  # Sistema de busca
│   │
│   └── data/                          # Scripts de dados
│       ├── dados-api.js               # Integração com APIs
│       ├── restaurantes.js            # Dados de restaurantes
│       ├── hoteis.js                  # Dados de hotéis
│       ├── farmacias.js               # Dados de farmácias
│       └── mobilidade.js              # Dados de mobilidade
│
├── assets/
│   ├── styles/                        # Estilos CSS
│   │   ├── style.css                  # Estilos principais
│   │   ├── accessibility.css          # Estilos de acessibilidade
│   │   ├── ux.css                     # Melhorias de UX
│   │   ├── voice-navigation.css       # Estilos de navegação por voz
│   │   └── alerts.css                 # Estilos de alertas
│   │
│   ├── data/                          # Dados JSON
│   │   ├── municipio-faro.json        # Dados do município
│   │   ├── restaurantes.json          # Lista de restaurantes
│   │   ├── hoteis.json                # Lista de hotéis
│   │   └── farmacias.json             # Lista de farmácias
│   │
│   └── lang/                          # Traduções
│       ├── pt.json                    # Traduções em Português
│       └── en.json                    # Traduções em Inglês
│
├── manifest.json                      # Configuração PWA
├── sw.js                              # Service Worker para offline
├── vite.config.js                     # Configuração do Vite com partials
├── guia-premium-faro.pdf              # Guia premium em PDF
└── README.md                          # Este arquivo
```

### 🔧 Sistema de Partials

O projeto utiliza **vite-plugin-html** para reutilização de componentes HTML através de partials:

- **Partials** são fragmentos HTML reutilizáveis em `src/partials/`
- Durante o build, os partials são injetados nas páginas usando sintaxe EJS (`<%- nomePartial %>`)
- Elimina duplicação de código (header, footer, navigation, scripts)
- Facilita manutenção e garante consistência visual

**Exemplo de uso em uma página:**
```html
<!DOCTYPE html>
<html lang="pt">
<head>
    <title>Minha Página</title>
    <%- metaCommon %>
</head>
<body>
    <%- header %>
    <main>
        <!-- Conteúdo específico da página -->
    </main>
    <%- footer %>
    <%- scriptsCommon %>
</body>
</html>
```

---

## 🎨 Páginas Disponíveis

As páginas estão organizadas por ordem de prioridade para os utilizadores:

### 🔴 Essencial (Uso Diário)
| Página | Descrição | Link |
|--------|-----------|------|
| 🏠 **Início** | Página principal com visão geral | `index.html` |
| 🏥 **Saúde** | Centros de saúde, hospitais e farmácias | `saude.html` |
| 🚨 **Saúde: Onde Ir Agora** | Contactos de emergência e urgências | `saude-onde-ir-agora.html` |
| 🚌 **Transportes** | Informações sobre transportes públicos | `transportes.html` |
| 🗺️ **Mapa** | Mapa interativo da cidade | `mapa.html` |

### 🟠 Serviços (Uso Frequente)
| Página | Descrição | Link |
|--------|-----------|------|
| 🍽️ **Onde Comer** | Restaurantes e cafés | `restaurantes.html` |
| 🏨 **Onde Ficar** | Hotéis e alojamentos | `hoteis.html` |
| 🛠️ **Problemas Frequentes** | FAQ de problemas urbanos | `problemas-frequentes.html` |

### 🟢 Viver (Residentes)
| Página | Descrição | Link |
|--------|-----------|------|
| 🏠 **Viver em Faro** | Guia para novos residentes | `viver-em-faro.html` |
| 👴👵 **Faro para Idosos** | Apoios, serviços e atividades para seniores | `idosos.html` |

### 🔵 Lazer e Turismo
| Página | Descrição | Link |
|--------|-----------|------|
| 🎭 **Lazer** | Cultura e turismo | `lazer.html` |
| 📅 **O que fazer hoje** | Eventos e atividades | `oque-fazer-hoje.html` |

### ⚪ Mais Informações
| Página | Descrição | Link |
|--------|-----------|------|
| 🌿 **Ambiente** | Sustentabilidade e reciclagem | `ambiente.html` |
| 🚴 **Mobilidade** | Mobilidade sustentável | `mobilidade.html` |
| 📖 **História** | História de Faro | `historia-faro.html` |
| 📘 **Guia Premium** | Download do guia offline | `guia-premium.html` |
| ℹ️ **Sobre o Projeto** | Informações sobre o projeto | `sobre-projeto.html` |
| ⭐ **Favoritos** | Seus locais favoritos | `favoritos.html` |

---

## 🔮 Possíveis Melhorias

### A Curto Prazo
- [ ] Adicionar mais pontos de interesse turístico
- [ ] Integrar API de previsão do tempo
- [ ] Implementar sistema de avaliações de locais
- [ ] Adicionar notificações push para eventos
- [ ] Criar modo de navegação por voz

### A Médio Prazo
- [ ] Backend para sincronização de favoritos entre dispositivos
- [ ] Sistema de comentários e reviews de usuários
- [ ] Integração com redes sociais
- [ ] App nativa para iOS e Android (React Native/Flutter)
- [ ] Gamificação com badges e conquistas

### A Longo Prazo
- [ ] Expansão para outras cidades do Algarve
- [ ] Plataforma multiusuário com perfis
- [ ] API pública para desenvolvedores
- [ ] Sistema de recomendações personalizadas com IA
- [ ] Integração com assistentes virtuais (Alexa, Google Assistant)

---

## 🤝 Como Contribuir

Contribuições são bem-vindas! Siga estes passos:

1. **Fork** o projeto
2. Crie uma **branch** para sua feature (`git checkout -b feature/MinhaFeature`)
3. **Commit** suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. **Push** para a branch (`git push origin feature/MinhaFeature`)
5. Abra um **Pull Request**

### Diretrizes de Contribuição

- Mantenha o código limpo e bem documentado
- Siga os padrões de código existentes
- Teste suas alterações em diferentes navegadores
- Garanta que o código seja acessível (WCAG)
- Adicione traduções para PT e EN quando aplicável

---

## 📝 Licença

Este projeto é **código aberto** e está disponível para uso público livre. Todo o conteúdo pode ser consultado, utilizado e modificado livremente.

### Condições de Uso
✅ Consulta livre por qualquer pessoa  
✅ Código-fonte disponível para estudo e contribuição  
✅ Finalidade educacional e informativa  
✅ Dados de APIs externas sujeitos às respectivas licenças

---

## 👤 Autor

Desenvolvido e mantido de forma independente como projeto pessoal de utilidade pública.

**GitHub**: [@papoon](https://github.com/papoon)  
**Projeto**: [cidadedefaro](https://github.com/papoon/cidadedefaro)

---

## 💝 Apoiar o Projeto

Este projeto é **100% gratuito** e continuará sempre assim. Se é útil para você, considere fazer uma doação voluntária:

☕ [Apoiar no Buy Me a Coffee](https://www.buymeacoffee.com/faroformoso)

Sua contribuição ajuda a manter o projeto ativo e a adicionar novas funcionalidades!

---

## 📞 Contacto

- 🐛 **Reportar Bugs**: [Abrir Issue](https://github.com/papoon/cidadedefaro/issues/new)
- 💡 **Sugestões**: [Abrir Issue](https://github.com/papoon/cidadedefaro/issues/new)
- 📧 **Outras Questões**: Através do GitHub Issues

---

<div align="center">

**Feito com ❤️ para a comunidade de Faro**

⭐ Se este projeto foi útil para você, considere dar uma estrela no GitHub!

</div>
