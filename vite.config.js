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
  header: header,
  navigation: navigation,
  footer: footer,
  scriptsCommon: scriptsCommon
}

export default defineConfig({
  base: '/cidadedefaro/',
  plugins: [
    createHtmlPlugin({
      minify: true,
      pages: [
        {
          entry: 'src/core/main.js',
          filename: 'index.html',
          template: 'index.html',
          injectOptions: {
            data: commonData
          }
        },
        {
          entry: 'src/core/main.js',
          filename: 'ambiente.html',
          template: 'ambiente.html',
          injectOptions: {
            data: commonData
          }
        },
        {
          entry: 'src/core/main.js',
          filename: 'demo-alertas.html',
          template: 'demo-alertas.html',
          injectOptions: {
            data: commonData
          }
        },
        {
          entry: 'src/core/main.js',
          filename: 'favoritos.html',
          template: 'favoritos.html',
          injectOptions: {
            data: commonData
          }
        },
        {
          entry: 'src/core/main.js',
          filename: 'guia-premium.html',
          template: 'guia-premium.html',
          injectOptions: {
            data: commonData
          }
        },
        {
          entry: 'src/core/main.js',
          filename: 'historia-faro.html',
          template: 'historia-faro.html',
          injectOptions: {
            data: commonData
          }
        },
        {
          entry: 'src/core/main.js',
          filename: 'hoteis.html',
          template: 'hoteis.html',
          injectOptions: {
            data: commonData
          }
        },
        {
          entry: 'src/core/main.js',
          filename: 'idosos.html',
          template: 'idosos.html',
          injectOptions: {
            data: commonData
          }
        },
        {
          entry: 'src/core/main.js',
          filename: 'lazer.html',
          template: 'lazer.html',
          injectOptions: {
            data: commonData
          }
        },
        {
          entry: 'src/core/main.js',
          filename: 'mapa.html',
          template: 'mapa.html',
          injectOptions: {
            data: commonData
          }
        },
        {
          entry: 'src/core/main.js',
          filename: 'mobilidade.html',
          template: 'mobilidade.html',
          injectOptions: {
            data: commonData
          }
        },
        {
          entry: 'src/core/main.js',
          filename: 'offline.html',
          template: 'offline.html',
          injectOptions: {
            data: commonData
          }
        },
        {
          entry: 'src/core/main.js',
          filename: 'oque-fazer-hoje.html',
          template: 'oque-fazer-hoje.html',
          injectOptions: {
            data: commonData
          }
        },
        {
          entry: 'src/core/main.js',
          filename: 'problemas-frequentes.html',
          template: 'problemas-frequentes.html',
          injectOptions: {
            data: commonData
          }
        },
        {
          entry: 'src/core/main.js',
          filename: 'restaurantes.html',
          template: 'restaurantes.html',
          injectOptions: {
            data: commonData
          }
        },
        {
          entry: 'src/core/main.js',
          filename: 'saude.html',
          template: 'saude.html',
          injectOptions: {
            data: commonData
          }
        },
        {
          entry: 'src/core/main.js',
          filename: 'saude-onde-ir-agora.html',
          template: 'saude-onde-ir-agora.html',
          injectOptions: {
            data: commonData
          }
        },
        {
          entry: 'src/core/main.js',
          filename: 'sobre-projeto.html',
          template: 'sobre-projeto.html',
          injectOptions: {
            data: commonData
          }
        },
        {
          entry: 'src/core/main.js',
          filename: 'transportes.html',
          template: 'transportes.html',
          injectOptions: {
            data: commonData
          }
        },
        {
          entry: 'src/core/main.js',
          filename: 'viver-em-faro.html',
          template: 'viver-em-faro.html',
          injectOptions: {
            data: commonData
          }
        }
      ]
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