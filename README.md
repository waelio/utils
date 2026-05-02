# @waelio/utils

[![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg?color=blue)](https://paypal.me/waelio?locale.x=en_US)
[![NPM version](https://img.shields.io/npm/v/@waelio/utils.svg?label=NPM&color=red)](https://www.npmjs.com/package/@waelio/utils)
[![NPM monthly downloads](https://img.shields.io/npm/dm/@waelio/utils.svg?label=Monthly-Downloads)](https://npmjs.org/package/@waelio/utils)
[![NPM total downloads](https://img.shields.io/npm/dt/@waelio/utils.svg?label=Total-Download&color=blueviolet)](https://npmjs.org/package/@waelio/utils)

`@waelio/utils` is a small utility library for three common jobs:

- config and environment defaults
- namespaced storage powered by `store2`
- friendly notification helpers with optional Quasar integration

## Installation

```bash
npm install @waelio/utils
```

or:

```bash
yarn add @waelio/utils
```

## Recommended imports

Use the new subpath exports for the cleanest setup:

```js
import { config } from '@waelio/utils/config'
import { conf } from '@waelio/utils/conf'
import { note, configureNote } from '@waelio/utils/note'
import { store } from '@waelio/utils/store'
```

The root entry is still available when you want everything at once:

```js
import { Utils } from '@waelio/utils'

const { config, note, storage } = Utils
```

Legacy `dist/*` deep imports remain exported for compatibility, but the new subpaths are preferred.

## Quasar integration

Version 4 no longer auto-installs Quasar or Vue for you. That old magic was convenient, but also very 2021.

Instead, install Quasar in your app and wire the helper once:

```js
import { createApp } from 'vue'
import {
  Dark,
  Dialog,
  Loading,
  LoadingBar,
  Notify,
  QSpinnerGears,
  Quasar
} from 'quasar'
import { configureNote } from '@waelio/utils/note'
import App from './App.vue'

const app = createApp(App)

app.use(Quasar, {
  plugins: {
    Notify,
    Dialog,
    Loading,
    LoadingBar
  }
})

configureNote({
  Notify,
  Dialog,
  Loading,
  LoadingBar,
  Dark,
  QSpinnerGears
})

app.mount('#app')
```

After that, the notification helper can use Quasar where available and safely fall back to plain payload objects elsewhere.

## Quick examples

### Config

```js
import { config } from '@waelio/utils/config'

config.set('dev:api', 'http://localhost:3000')
config.set('credentials:token', 'secret-token')

console.log(config.get('dev:api'))
console.log(config.get('credentials:token'))
```

### Store

```js
import store from '@waelio/utils/store'

store('theme', 'dark')
console.log(store('theme'))
```

### Note

```js
import { note } from '@waelio/utils/note'

note.success('Saved successfully')
note.info('Heads up')
note.warning('Double-check this')
note.error(new Error('Something exploded politely'))
```

## Standalone / UMD

If you use the UMD bundle directly, load Quasar first if you want real UI notifications:

```html
<link
  href="https://cdn.jsdelivr.net/npm/quasar@2/dist/quasar.prod.css"
  rel="stylesheet"
/>
<script src="https://cdn.jsdelivr.net/npm/vue@3/dist/vue.global.prod.js"></script>
<script src="https://cdn.jsdelivr.net/npm/quasar@2/dist/quasar.umd.prod.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@waelio/utils@latest/dist/utils.js"></script>
<script>
  Utils.configureNote(window.Quasar)
  Utils.note.success('Loaded from CDN')
</script>
```

Without Quasar, `note.*` methods still return safe payloads and do not throw.

## Local examples

This repository includes two Vite-based examples:

- `example/vue` — a plain Vue 3 app using the library and Quasar plugins
- `example/quasar` — a Quasar-flavoured Vue 3 app using the same library helpers

Both examples point to the local package with a `file:../..` dependency so they always exercise the current checkout.

## Migrating from v3

- Vue 2 / Quasar 1 auto-registration has been removed
- call `configureNote(...)` in apps that want Quasar-backed notifications
- preferred imports are now `@waelio/utils/config`, `@waelio/utils/note`, and friends
- the repository examples now use Vite instead of Vue CLI / legacy Quasar CLI scaffolding

## Support

Ask questions in the community Discord: https://discord.gg/tBZ2Fmdb7E
