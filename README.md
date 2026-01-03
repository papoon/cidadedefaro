# 🌟 Faro Formoso

<div align="center">

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
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

### Opção 3: Abrir Diretamente

Para desenvolvimento simples, você pode abrir o arquivo `index.html` diretamente no navegador. No entanto, algumas funcionalidades (como Service Worker e APIs) podem não funcionar corretamente devido a restrições CORS.

### Opção 4: Deploy Automático

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
├── index.html                    # Página inicial
├── manifest.json                 # Configuração PWA
├── sw.js                         # Service Worker para offline
│
├── 📄 Páginas HTML
├── transportes.html              # Transportes e mobilidade
├── saude.html                    # Saúde e farmácias
├── ambiente.html                 # Ambiente e sustentabilidade
├── lazer.html                    # Cultura e turismo
├── restaurantes.html             # Onde comer
├── hoteis.html                   # Onde ficar
├── oque-fazer-hoje.html          # Eventos e atividades
├── mapa.html                     # Mapa interativo
├── problemas-frequentes.html     # FAQ de problemas urbanos
├── viver-em-faro.html           # Guia para residentes
├── mobilidade.html               # Mobilidade sustentável
├── historia-faro.html           # História da cidade
├── guia-premium.html            # Guia premium para download
├── sobre-projeto.html           # Sobre o projeto
├── favoritos.html               # Favoritos salvos
├── offline.html                 # Página offline
│
├── 🎨 CSS
├── css/
│   ├── style.css                # Estilos principais
│   ├── accessibility.css        # Estilos de acessibilidade
│   └── ux.css                   # Melhorias de UX
│
├── 📜 JavaScript
├── js/
│   ├── main.js                  # Script principal
│   ├── dados-api.js             # Integração com APIs
│   ├── mapa.js                  # Funcionalidades do mapa
│   ├── search.js                # Sistema de busca
│   ├── i18n.js                  # Internacionalização
│   ├── pwa.js                   # Funcionalidades PWA
│   ├── accessibility.js         # Features de acessibilidade
│   ├── favorites.js             # Sistema de favoritos
│   ├── ux.js                    # Melhorias de UX
│   ├── restaurantes.js          # Dados de restaurantes
│   ├── hoteis.js                # Dados de hotéis
│   ├── farmacias.js             # Dados de farmácias
│   └── mobilidade.js            # Dados de mobilidade
│
├── 📊 Dados
├── data/
│   ├── municipio-faro.json      # Dados do município
│   ├── restaurantes.json        # Lista de restaurantes
│   ├── hoteis.json              # Lista de hotéis
│   └── farmacias.json           # Lista de farmácias
│
├── 🌐 Traduções
├── lang/
│   ├── pt.json                  # Traduções em Português
│   └── en.json                  # Traduções em Inglês
│
├── 📘 Documentação
├── guia-premium-faro.pdf        # Guia premium em PDF
└── README.md                    # Este arquivo
```

---

## 🎨 Páginas Disponíveis

| Página | Descrição | Link |
|--------|-----------|------|
| 🏠 **Início** | Página principal com visão geral | `index.html` |
| 🚌 **Transportes** | Informações sobre transportes públicos | `transportes.html` |
| 🏥 **Saúde** | Centros de saúde e farmácias | `saude.html` |
| 🌿 **Ambiente** | Sustentabilidade e reciclagem | `ambiente.html` |
| 🎭 **Lazer** | Cultura e turismo | `lazer.html` |
| 🍽️ **Onde Comer** | Restaurantes e cafés | `restaurantes.html` |
| 🏨 **Onde Ficar** | Hotéis e alojamentos | `hoteis.html` |
| 📅 **O que fazer hoje** | Eventos e atividades | `oque-fazer-hoje.html` |
| 🗺️ **Mapa** | Mapa interativo da cidade | `mapa.html` |
| 🛠️ **Problemas Frequentes** | FAQ de problemas urbanos | `problemas-frequentes.html` |
| 🏠 **Viver em Faro** | Guia para novos residentes | `viver-em-faro.html` |
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
