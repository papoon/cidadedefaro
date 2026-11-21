import { describe, it, expect, beforeEach, vi } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { loadState, saveState, appliesTo, progress, STORAGE_KEY } from '../src/ui/checklist.js'

describe('lógica da checklist', () => {
  beforeEach(() => localStorage.clear())

  it('estado por omissão e recuperação de JSON corrompido', () => {
    expect(loadState()).toEqual({ profile: null, done: [] })
    localStorage.setItem(STORAGE_KEY, '{oops')
    expect(loadState()).toEqual({ profile: null, done: [] })
  })

  it('ignora perfis desconhecidos e ids que não são strings', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ profile: 'marte', done: ['nif', 3, null] }))
    expect(loadState()).toEqual({ profile: null, done: ['nif'] })
  })

  it('guarda sem duplicados', () => {
    saveState({ profile: 'eu', done: ['nif', 'nif', 'niss'] })
    expect(loadState()).toEqual({ profile: 'eu', done: ['nif', 'niss'] })
  })

  it('não rebenta se o armazenamento falhar', () => {
    const broken = { getItem: () => { throw new Error('x') }, setItem: () => { throw new Error('x') } }
    expect(loadState(broken)).toEqual({ profile: null, done: [] })
    expect(() => saveState({ profile: 'pt', done: [] }, broken)).not.toThrow()
  })

  it('appliesTo e progress contam só os passos do perfil', () => {
    expect(appliesTo('eu noneu', 'pt')).toBe(false)
    expect(appliesTo('eu noneu', null)).toBe(true)
    const steps = [{ id: 'a', profiles: 'pt' }, { id: 'b', profiles: 'eu noneu' }, { id: 'c', profiles: 'pt eu noneu' }]
    expect(progress(steps, 'pt', ['a', 'b'])).toEqual({ completed: 1, total: 2 })
    expect(progress(steps, null, ['a', 'b'])).toEqual({ completed: 2, total: 3 })
  })
})

describe('checklist em viver-em-faro.html', () => {
  const page = readFileSync(resolve(process.cwd(), 'viver-em-faro.html'), 'utf8')
  const section = page.match(/<section class="info-section checklist"[\s\S]*?<\/section>/)[0]

  async function mount() {
    vi.resetModules()
    document.body.innerHTML = section
    await import('../src/ui/checklist.js')
    return document.querySelector('[data-checklist]')
  }

  beforeEach(() => localStorage.clear())

  it('filtra por perfil, mostra progresso e persiste marcações', async () => {
    const root = await mount()
    expect(root.classList.contains('checklist-enhanced')).toBe(true)
    const visible = () => [...root.querySelectorAll('[data-step]')].filter((li) => !li.hidden).map((li) => li.dataset.step)
    expect(visible()).toHaveLength(10)

    const pt = root.querySelector('input[value="pt"]')
    pt.checked = true
    pt.dispatchEvent(new Event('change'))
    expect(visible()).toEqual(['cc_address', 'sns', 'cmd', 'water'])

    const box = root.querySelector('#step-sns')
    box.checked = true
    box.dispatchEvent(new Event('change'))
    expect(root.querySelector('[data-checklist-progress]').textContent).toBe('1 de 4 passos concluídos')
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY))).toEqual({ profile: 'pt', done: ['sns'] })

    // Recarregar: estado restaurado
    const again = await mount()
    expect(again.querySelector('#step-sns').checked).toBe(true)
    expect(again.querySelector('input[value="pt"]').checked).toBe(true)

    again.querySelector('[data-checklist-reset]').click()
    expect(again.querySelector('#step-sns').checked).toBe(false)
  })

  it('cada passo tem caixa e label associados', () => {
    document.body.innerHTML = section
    document.querySelectorAll('[data-step]').forEach((li) => {
      const box = li.querySelector('input[type="checkbox"]')
      expect(li.querySelector(`label[for="${box.id}"]`)).not.toBeNull()
    })
  })
})
