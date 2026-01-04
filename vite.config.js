import { defineConfig } from 'vite'
import { resolve } from 'path'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import { createHtmlPlugin } from 'vite-plugin-html'
import { readFileSync } from 'fs'

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
  'problemas-frequentes.html',
  'restaurantes.html',
  'saude.html',
  'saude-onde-ir-agora.html',
  'sobre-projeto.html',
  'transportes.html',
  'viver-em-faro.html'
]

// Generate pages configuration
const pages = htmlPages.map(filename => ({
  entry: 'src/core/main.js',
  filename: filename,
  template: filename,
  injectOptions: {
    data: commonData
  }
}))

export default defineConfig({
  base: '/cidadedefaro/',
  plugins: [
    createHtmlPlugin({
      minify: true,
      pages: pages
    }),
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