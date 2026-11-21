import { describe, it, expect, beforeAll, vi } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const lang = (code) => JSON.parse(readFileSync(resolve(process.cwd(), `assets/lang/${code}.json`), 'utf8'))

const waitFor = (event) => new Promise((resolve) => document.addEventListener(event, resolve, { once: true }))

describe('i18n', () => {
  beforeAll(async () => {
    vi.stubGlobal('fetch', vi.fn(async (url) => {
      const code = String(url).match(/lang\/(\w+)\.json/)[1]
      return { ok: true, json: async () => lang(code) }
    }))
    document.body.innerHTML = '<span id="t" data-i18n="nav.home">?</span><a id="a" data-i18n="nav.map" data-i18n-attr="aria-label">Mapa</a>'
    const loaded = waitFor('i18nLoaded')
    await import('../src/intl/i18n.js')
    await loaded
  })

  it('carrega português por omissão e traduz elementos', () => {
    expect(window.i18n.getCurrentLanguage()).toBe('pt')
    expect(document.getElementById('t').textContent).toBe(lang('pt').nav.home)
    expect(document.documentElement.lang).toBe('pt')
  })

  it('traduz atributos com data-i18n-attr sem mexer no texto', () => {
    const a = document.getElementById('a')
    expect(a.getAttribute('aria-label')).toBe(lang('pt').nav.map)
    expect(a.textContent).toBe('Mapa')
  })

  it('devolve null para chaves inexistentes', () => {
    expect(window.i18n.t('nao.existe')).toBeNull()
    expect(window.i18n.t('nav')).toBeTypeOf('object')
  })

  it('muda para inglês e guarda a escolha', async () => {
    const loaded = waitFor('i18nLoaded')
    window.i18n.switchLanguage('en')
    await loaded
    expect(document.getElementById('t').textContent).toBe(lang('en').nav.home)
    expect(localStorage.getItem('guiafaro-lang')).toBe('en')
  })
})
