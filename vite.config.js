import { defineConfig } from 'vite'
import { resolve } from 'path'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import { readFileSync } from 'fs'
import ejs from 'ejs'

// Read partials
const metaCommon = readFileSync(resolve(__dirname, 'src/partials/meta-common.html'), 'utf-8')
const header = readFileSync(resolve(__dirname, 'src/partials/header.html'), 'utf-8')
const navigation = readFileSync(resolve(__dirname, 'src/partials/navigation.html'), 'utf-8')
const footer = readFileSync(resolve(__dirname, 'src/partials/footer.html'), 'utf-8')
const scriptsCommon = readFileSync(resolve(__dirname, 'src/partials/scripts-common.html'), 'utf-8')

// Common data for all pages
const commonData = {
  metaCommon: metaCommon,
  // Inline navigation into header so nested `<%- navigation %>` is rendered
  header: header.replace(/<%-\s*navigation\s*%>/g, navigation),
  navigation: navigation,
  footer: footer,
  scriptsCommon: scriptsCommon
}

// List of all HTML pages
const htmlPages = [
  'index.html',
  'ambiente.html',
  'demo-alertas.html',
  'favoritos.html',
  'guia-premium.html',
  'historia-faro.html',
  'hoteis.html',
  'idosos.html',
  'lazer.html',
  'mapa.html',
  'mobilidade.html',
  'offline.html',
  'oque-fazer-hoje.html',
  'politica-privacidade.html',
  'problemas-frequentes.html',
  'restaurantes.html',
  'saude.html',
  'saude-onde-ir-agora.html',
  'sobre-projeto.html',
  'termos-condicoes.html',
  'transportes.html',
  'viver-em-faro.html'
]

// Generate input configuration for multi-page app
const input = htmlPages.reduce((acc, filename) => {
  const name = filename.replace('.html', '')
  acc[name] = resolve(__dirname, filename)
  return acc
}, {})

// Custom plugin to handle EJS transformation for all HTML files
function customHtmlTransform() {
  return {
    name: 'custom-html-transform',
    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        try {
          return ejs.render(html, commonData)
        } catch (error) {
          console.error('EJS rendering error:', error)
          return html
        }
      }
    }
  }
}

export default defineConfig({
  base: './',
  build: {
    rollupOptions: {
      input: input
    }
  },
  plugins: [
    customHtmlTransform(),
    viteStaticCopy({
      targets: [
        { src: 'src', dest: '' },
        { src: 'assets', dest: '' },
        { src: '.well-known', dest: '' },
        { src: 'manifest.json', dest: '' },
        { src: 'robots.txt', dest: '' },
        { src: 'sitemap.xml', dest: '' },
        { src: 'sw.js', dest: '' },
        { src: 'guia-premium-faro.pdf', dest: '' },
        { src: 'CNAME', dest: '' }
      ]
    })
  ]
})