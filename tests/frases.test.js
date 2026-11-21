import { describe, it, expect, vi, afterEach } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { pickVoice } from '../src/ui/frases.js'

const read = (f) => readFileSync(resolve(process.cwd(), f), 'utf8')

describe('pickVoice', () => {
  it('prefere pt-PT, depois qualquer pt, senão null', () => {
    const br = { lang: 'pt-BR', name: 'br' }, pt = { lang: 'pt_PT', name: 'pt' }, en = { lang: 'en-GB' }
    expect(pickVoice([en, br, pt])).toBe(pt)
    expect(pickVoice([en, br])).toBe(br)
    expect(pickVoice([en])).toBeNull()
    expect(pickVoice(undefined)).toBeNull()
  })
})

describe('frases-uteis.html', () => {
  const body = read('frases-uteis.html').match(/<main[\s\S]*<\/main>/)[0]

  afterEach(() => { vi.unstubAllGlobals(); vi.resetModules() })

  it('cada frase tem texto pt-PT e tradução en', () => {
    document.body.innerHTML = body
    const phrases = document.querySelectorAll('.phrase')
    expect(phrases.length).toBeGreaterThanOrEqual(30)
    phrases.forEach((li) => {
      expect(li.querySelector('.phrase-pt[lang="pt-PT"]').textContent.trim()).not.toBe('')
      expect(li.querySelector('.phrase-en[lang="en"]').textContent.trim()).not.toBe('')
    })
  })

  it('sem speechSynthesis não cria botões', async () => {
    document.body.innerHTML = body
    vi.stubGlobal('speechSynthesis', undefined)
    await import('../src/ui/frases.js')
    expect(document.querySelectorAll('.phrase-listen')).toHaveLength(0)
  })

  it('com speechSynthesis cria um botão por frase e fala em pt-PT', async () => {
    document.body.innerHTML = body
    const speak = vi.fn()
    vi.stubGlobal('speechSynthesis', { getVoices: () => [{ lang: 'pt-PT' }], speak, cancel: vi.fn(), addEventListener: vi.fn() })
    vi.stubGlobal('SpeechSynthesisUtterance', function (text) { this.text = text })
    await import('../src/ui/frases.js')
    const buttons = document.querySelectorAll('.phrase-listen')
    expect(buttons.length).toBe(document.querySelectorAll('.phrase').length)
    expect(buttons[0].getAttribute('aria-label')).toMatch(/^Ouvir: /)
    buttons[1].click()
    expect(speak).toHaveBeenCalledOnce()
    expect(speak.mock.calls[0][0]).toMatchObject({ text: 'Por favor.', lang: 'pt-PT', rate: 0.85 })
  })
})

describe('viver-em-faro.html — arrendamento', () => {
  it('tem a secção com links oficiais', () => {
    const html = read('viver-em-faro.html')
    expect(html).toContain('id="rental-title"')
    for (const url of ['predialonline.pt', 'queixaselectronicas.mai.gov.pt', 'portaldahabitacao.pt', 'candidatar-se-ao-porta-65-jovem']) {
      expect(html).toContain(url)
    }
  })
})
