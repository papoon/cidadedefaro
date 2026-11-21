import { describe, it, expect, vi, afterEach } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const json = readFileSync(resolve(process.cwd(), 'assets/data/barcos.json'), 'utf8')

async function renderAt(isoUtc) {
  vi.resetModules()
  vi.useFakeTimers({ now: new Date(isoUtc), toFake: ['Date'] })
  vi.stubGlobal('fetch', vi.fn(async () => ({ ok: true, json: async () => JSON.parse(json) })))
  document.body.innerHTML = '<div id="ferry-routes"></div>'
  await import('../src/data/barcos.js')
  await vi.waitFor(() => expect(document.querySelectorAll('.ferry-route').length).toBe(2))
  return document.getElementById('ferry-routes')
}

afterEach(() => vi.useRealTimers())

describe('praias.html — renderização dos barcos', () => {
  it('em agosto às 11h (Lisboa) mostra próxima partida e último regresso', async () => {
    const c = await renderAt('2026-08-10T10:00:00Z')
    const farol = c.querySelector('[aria-labelledby="ferry-farol"] .ferry-today').textContent
    expect(farol).toContain('12:25')
    expect(farol).toContain('19:30')
    expect(c.querySelectorAll('.ferry-table').length).toBe(4) // 3 épocas Farol + 1 Culatra
    expect(c.querySelector('.ferry-source a').href).toContain('api.faro.pt')
  })

  it('em novembro mostra que não há barcos', async () => {
    const c = await renderAt('2026-11-21T10:00:00Z')
    c.querySelectorAll('.ferry-today').forEach((el) => {
      expect(el.classList.contains('is-closed')).toBe(true)
      expect(el.textContent).toContain('Sem barcos hoje')
    })
  })
})
