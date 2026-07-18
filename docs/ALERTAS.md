# Sistema de Alertas Locais Não Intrusivos

## Visão Geral

Sistema de alertas discreto e não intrusivo para informar utilizadores sobre eventos importantes, alterações relevantes ou situações excecionais no Faro Formoso.

## Características

- ✅ **Banner discreto** - Não bloqueia a navegação
- ✅ **Alertas categorizados** - 5 tipos distintos (info, warning, event, success, important)
- ✅ **Possibilidade de fechar** - Botão de fechar em todos os alertas
- ✅ **Persistência opcional** - Alertas dispensados não aparecem novamente
- ✅ **Sem tracking** - Nenhum dado enviado para servidores externos
- ✅ **Sem notificações invasivas** - Tudo controlado localmente
- ✅ **Compatível com modo escuro** - Estilos adaptados automaticamente
- ✅ **Totalmente acessível** - Suporte para teclado e leitores de ecrã

## Como Usar

### Incluir ficheiros no HTML

O sistema já está incluído em todas as páginas via `assets/styles/alerts.css`
(em `src/partials/meta-common.html`) e `src/ui/alerts.js` (em
`src/partials/scripts-common.html`). Não é necessário adicionar manualmente
em novas páginas, desde que estas usem os partials comuns.

Para incluir manualmente numa página que não usa os partials:

```html
<link rel="stylesheet" href="assets/styles/alerts.css">
<script type="module" src="src/ui/alerts.js"></script>
```

### Mostrar um alerta

```javascript
window.localAlerts.show({
    id: 'my-alert',
    type: 'info',
    title: 'Título do Alerta',
    message: 'Mensagem do alerta aqui.',
    dismissible: true,
    persistent: false
});
```

### Tipos disponíveis

- **`info`** - Informação geral (azul, ℹ️)
- **`warning`** - Avisos importantes (laranja, ⚠️)
- **`event`** - Eventos e novidades (roxo, 📅)
- **`success`** - Confirmações (verde, ✅)
- **`important`** - Alertas críticos (vermelho, ❗)

## Demonstração

Visite `/demo-alertas.html` para ver exemplos interativos.

## Notas de Segurança

`title` e `message` são sempre inseridos como texto simples (não são
interpretados como HTML), para evitar XSS a partir de conteúdo de alertas.
Se precisar de um link dentro de um alerta, adicione-o via JavaScript
manipulando o DOM diretamente em vez de passar HTML na `message`.
