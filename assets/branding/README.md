# 🎨 Faro Formoso - Branding Assets

Esta pasta contém todos os assets de marca (logo, ícones, favicons) do projeto **Faro Formoso**.

## 📁 Estrutura de Pastas

```
assets/branding/
├── logo/           # Logos principais (horizontal e vertical)
├── icon/           # Ícone/símbolo simplificado
├── favicon/        # Favicons para browsers
├── pwa/            # Ícones para Progressive Web App
└── README.md       # Este arquivo
```

## 🎯 Design e Conceito

### Conceito Visual
O logo do Faro Formoso representa:
- **Letra F**: Inicial de "Faro" e "Formoso", elemento principal do design
- **Onda dourada**: Representa o mar e as praias da Ria Formosa
- **Círculo azul**: Simboliza o céu, o mar e a cidade de Faro
- **Ponto branco**: Representa o sol do Algarve

### Paleta de Cores
- **Azul principal**: `#667eea` - Representa o céu e o mar
- **Dourado/Areia**: `#f5d076` - Representa as praias e o sol
- **Branco**: `#ffffff` - Clareza e simplicidade
- **Texto escuro**: `#2c3e50` - Para legibilidade em fundos claros

### Tipografia
- Fonte: System fonts (sans-serif) para melhor compatibilidade
- Estilo: Limpo, moderno, sem serifas
- Peso: Bold para o título, Regular para o subtítulo

## 📄 Assets Disponíveis

### 1. Logo Principal (`/logo/`)

#### Versão Horizontal
- **logo-horizontal-light.svg** - SVG para fundos claros (2000px width)
- **logo-horizontal-light.png** - PNG para fundos claros (alta resolução)
- **logo-horizontal-dark.svg** - SVG para fundos escuros
- **logo-horizontal-dark.png** - PNG para fundos escuros (alta resolução)

**Uso recomendado**: Headers, rodapés, documentos, apresentações

#### Versão Vertical
- **logo-vertical-light.svg** - SVG para fundos claros (1000px width)
- **logo-vertical-light.png** - PNG para fundos claros (alta resolução)
- **logo-vertical-dark.svg** - SVG para fundos escuros
- **logo-vertical-dark.png** - PNG para fundos escuros (alta resolução)

**Uso recomendado**: Redes sociais, perfis, documentos verticais

### 2. Ícone/Símbolo (`/icon/`)

- **icon-symbol.svg** - Ícone vetorial (60x60)
- **icon-symbol.png** - Ícone PNG 512x512

**Uso recomendado**: App mobile, botões, menus, quando o espaço é limitado

### 3. Favicons (`/favicon/`)

- **favicon.svg** - Favicon vetorial (recomendado para browsers modernos)
- **favicon.ico** - Favicon multi-tamanho (16x16, 32x32, 48x48)
- **favicon-16x16.png** - Favicon 16x16 (abas do browser)
- **favicon-32x32.png** - Favicon 32x32 (abas do browser retina)
- **favicon-48x48.png** - Favicon 48x48 (ícones de desktop)

**Uso**: Automaticamente usado pelos browsers

### 4. PWA Icons (`/pwa/`)

- **icon-192x192.png** - Ícone PWA 192x192
- **icon-512x512.png** - Ícone PWA 512x512
- **icon-maskable.svg** - Ícone adaptativo (maskable) para PWA
- **apple-touch-icon.png** - Ícone 180x180 para iOS/Safari

**Uso**: Definido no `manifest.json` para instalação da PWA

## 🔧 Como Usar

### No HTML (já implementado)
```html
<!-- Favicons -->
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="icon" type="image/x-icon" href="/favicon.ico">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
```

### No manifest.json (já implementado)
```json
{
  "icons": [
    {
      "src": "/assets/branding/pwa/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/assets/branding/pwa/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

### Em Redes Sociais
Use o **icon-512x512.png** para perfis de redes sociais:
- Twitter/X
- Facebook
- Instagram
- LinkedIn

### Em Documentos
Use as versões **PNG de alta resolução** dos logos:
- Apresentações PowerPoint/Google Slides
- Documentos PDF
- Material impresso

## ✅ Diretrizes de Uso

### ✓ Pode fazer:
- Usar o logo em fundos claros (versão light) ou escuros (versão dark)
- Redimensionar proporcionalmente
- Usar em materiais promocionais do projeto
- Adicionar margem/espaçamento ao redor do logo

### ✗ Não fazer:
- Distorcer ou esticar o logo
- Mudar as cores do logo
- Adicionar efeitos (sombras, bordas, gradientes)
- Usar fontes diferentes no texto
- Separar o ícone do texto sem necessidade

### Espaçamento Mínimo
Mantenha um espaço mínimo ao redor do logo equivalente à altura da letra "F" no ícone.

### Tamanho Mínimo
- **Digital**: 120px de largura (horizontal) ou 80px de altura (vertical)
- **Impresso**: 3cm de largura (horizontal) ou 2cm de altura (vertical)

## 🎨 Variações de Cor (quando necessário)

Se precisar adaptar para casos específicos:
- **Monocromático**: Use apenas o azul (#667eea) ou preto
- **Fundo colorido**: Prefira a versão com fundo transparente
- **Contraste**: Garanta sempre contraste mínimo de 4.5:1 (WCAG AA)

## 📱 Compatibilidade

### Browsers
- ✅ Chrome/Edge (todas versões modernas)
- ✅ Firefox (todas versões modernas)
- ✅ Safari (macOS e iOS)
- ✅ Opera

### Dispositivos
- ✅ Desktop (Windows, macOS, Linux)
- ✅ Mobile (iOS, Android)
- ✅ Tablets

### PWA
- ✅ Instalável em Android
- ✅ Instalável em iOS (Safari)
- ✅ Instalável em desktop (Chrome, Edge)

## 🔄 Atualização dos Assets

Se precisar atualizar os assets:

1. Edite o arquivo SVG fonte
2. Regenere as versões PNG:
```bash
cd assets/branding
rsvg-convert -w 2000 logo/logo-horizontal-light.svg -o logo/logo-horizontal-light.png
```
3. Regenere os favicons e ícones PWA
4. Teste em diferentes browsers e dispositivos

## 📄 Licença

Todos os assets de branding são parte do projeto **Faro Formoso** e seguem a mesma licença do projeto.

- ✅ Uso livre para fins relacionados ao projeto
- ✅ Modificação permitida com atribuição
- ❌ Uso comercial direto não autorizado sem permissão

## 👤 Créditos

Design criado para o projeto **Faro Formoso**  
Desenvolvido como parte da identidade visual da aplicação

---

**Última atualização**: Janeiro 2026  
**Versão**: 1.0.0
