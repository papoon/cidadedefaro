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
O símbolo (favicon / ícones PWA) do Faro Formoso representa:
- **Farol**: Torre clara com faixas terracota e lanterna acesa — o farol do Cabo de Santa Maria
- **Feixes de luz**: Orientação, o papel do guia
- **Água ondulada**: A Ria Formosa

O desenho é propositadamente simples para continuar legível a 16×16.

### Paleta de Cores
Alinhada com o design system do site (ver `.claude/skills/ui-modernization.md`):
- **Ria**: `#0f5872` - Fundo do ícone
- **Ria profunda**: `#0a3e51` - Água
- **Papel**: `#f6f1e7` - Torre e feixes de luz
- **Terra**: `#a84f26` - Faixas e cúpula do farol
- **Lanterna**: `#ffca4f` - Luz do farol

### Logos
Símbolo + "Faro Formoso" em **Fraunces** (peso 650, opsz 144, como o wordmark do site) e o lema em
**Atkinson Hyperlegible**. O texto está convertido em contornos (paths), por isso os SVG não dependem
das fontes estarem instaladas.
- **light** (fundos claros): nome `#1d2428`, lema `#5d605a`
- **dark** (fundos escuros): nome `#efe7d7`, lema `#a8a194`

Os logos não são usados pelo site (o cabeçalho usa o wordmark em texto); servem para redes sociais,
documentos e apresentações.

### Tipografia
- Título: Fraunces (serifa editorial), peso 650
- Lema: Atkinson Hyperlegible, Regular
- Ambas self-hosted em `assets/fonts/` (licença OFL)

## 📄 Assets Disponíveis

### 1. Logo Principal (`/logo/`)

#### Versão Horizontal
- **logo-horizontal-light.svg** - SVG para fundos claros (PNG a 2000px de largura)
- **logo-horizontal-light.png** - PNG para fundos claros (alta resolução)
- **logo-horizontal-dark.svg** - SVG para fundos escuros
- **logo-horizontal-dark.png** - PNG para fundos escuros (alta resolução)

**Uso recomendado**: Headers, rodapés, documentos, apresentações

#### Versão Vertical
- **logo-vertical-light.svg** - SVG para fundos claros (PNG a 1000px de largura)
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

Os assets de branding (nome, logótipos, ícones) **não** estão abrangidos pela licença ISC do código-fonte. Pertencem ao projeto **Faro Formoso**:

- ✅ Uso livre para fins relacionados ao projeto
- ✅ Modificação permitida com atribuição
- ❌ Uso comercial direto não autorizado sem permissão

## 👤 Créditos

Design criado para o projeto **Faro Formoso**  
Desenvolvido como parte da identidade visual da aplicação

---

**Última atualização**: Janeiro 2026  
**Versão**: 1.0.0
