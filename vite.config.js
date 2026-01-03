import { defineConfig } from 'vite'
import { resolve } from 'path'
import { viteStaticCopy } from 'vite-plugin-static-copy'

export default defineConfig({
  base: '/cidadedefaro/',
  plugins: [
    viteStaticCopy({
      targets: [
        { src: 'js', dest: '' },
        { src: 'css', dest: '' },
        { src: 'data', dest: '' },
        { src: 'lang', dest: '' },
        { src: '.well-known', dest: '' },
        { src: 'manifest.json', dest: '' },
        { src: 'robots.txt', dest: '' },
        { src: 'sitemap.xml', dest: '' },
        { src: 'sw.js', dest: '' },
        { src: 'guia-premium-faro.pdf', dest: '' },
        { src: 'CNAME', dest: '' }
      ]
    })
  ],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        ambiente: resolve(__dirname, 'ambiente.html'),
        favoritos: resolve(__dirname, 'favoritos.html'),
        'guia-premium': resolve(__dirname, 'guia-premium.html'),
        'historia-faro': resolve(__dirname, 'historia-faro.html'),
        hoteis: resolve(__dirname, 'hoteis.html'),
        lazer: resolve(__dirname, 'lazer.html'),
        mapa: resolve(__dirname, 'mapa.html'),
        mobilidade: resolve(__dirname, 'mobilidade.html'),
        offline: resolve(__dirname, 'offline.html'),
        'oque-fazer-hoje': resolve(__dirname, 'oque-fazer-hoje.html'),
        'problemas-frequentes': resolve(__dirname, 'problemas-frequentes.html'),
        restaurantes: resolve(__dirname, 'restaurantes.html'),
        saude: resolve(__dirname, 'saude.html'),
        'sobre-projeto': resolve(__dirname, 'sobre-projeto.html'),
        transportes: resolve(__dirname, 'transportes.html'),
        'viver-em-faro': resolve(__dirname, 'viver-em-faro.html'),
      }
    }
  }
})