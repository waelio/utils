# @waelio/utils

[![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg?color=blue)](https://paypal.me/waelio?locale.x=en_US)[![NPM version](https://img.shields.io/npm/v/@waelio/utils.svg?label=NPM&color=red)](https://www.npmjs.com/package/@waelio/utils)[![NPM monthly downloads](https://img.shields.io/npm/dm/@waelio/utils.svg?label=Monthly-Downloads)](https://npmjs.org/package/@waelio/utils)[![NPM total downloads](https://img.shields.io/npm/dt/@waelio/utils.svg?label=Total-Download&color=blueviolet)](https://npmjs.org/package/@waelio/utils)

## Chat Support

Ask questions at the official [Dicord Channel](https://discord.gg/tBZ2Fmdb7E)

Discord Server: https://discord.gg/tBZ2Fmdb7E

# Installation

### In Terminal:

```bash
npm install @waelio/utils
#OR
yarn add @waelio/utils
```

### If you are using Quasar Cli, make sure to uncomment `// 'fontawesome-v5',` in `quasar.conf.js` under `extras[]` or you can add the cdn for font-awesome
```html
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" integrity="sha512-iBBXm8fW90+nuLcSKlbmrPcLa0OT92xO1BIsZ+ywDWZCvqsWgccV3gFoRBv0z+8dLJgyAHIhR35VZc2oM/gI1w==" crossorigin="anonymous" />
``` 
in `src/index.template.html`
<hr />

### If you are using Vue Cli, add the following in `public/index.html`

```html
<link href="https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900|Material+Icons" rel="stylesheet" type="text/css" />
<link href="https://cdn.jsdelivr.net/npm/quasar@1.15.13/dist/quasar.min.css" rel="stylesheet" type="text/css" />
<link href="https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900|Material+Icons" rel="stylesheet" type="text/css" />
<link href="https://cdn.jsdelivr.net/npm/quasar@1.15.13/dist/quasar.min.css" rel="stylesheet" type="text/css" />
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" integrity="sha512-iBBXm8fW90+nuLcSKlbmrPcLa0OT92xO1BIsZ+ywDWZCvqsWgccV3gFoRBv0z+8dLJgyAHIhR35VZc2oM/gI1w==" crossorigin="anonymous" />
```

### In browser:

```html
<link href="https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900|Material+Icons" rel="stylesheet" type="text/css" />
<link href="https://cdn.jsdelivr.net/npm/quasar@1.15.13/dist/quasar.min.css" rel="stylesheet" type="text/css" />
<link href="https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900|Material+Icons" rel="stylesheet" type="text/css" />
<link href="https://cdn.jsdelivr.net/npm/quasar@1.15.13/dist/quasar.min.css" rel="stylesheet" type="text/css" />
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" integrity="sha512-iBBXm8fW90+nuLcSKlbmrPcLa0OT92xO1BIsZ+ywDWZCvqsWgccV3gFoRBv0z+8dLJgyAHIhR35VZc2oM/gI1w==" crossorigin="anonymous" />
<script src="https://cdn.jsdelivr.net/npm/@waelio/utils@3.0.13/dist/utils.js"></script>
```

#

## Not fully tested yet!

Documentation & examples coming soon. Needs more testing 😃

# Config

# Store

### This store is based on Store2, Documentations here [store2](https://www.npmjs.com/package/store2)

#

# Note

### Note is partially based on [Quasars Notify](https://quasar.dev/quasar-plugins/notify)

Examples:

```js
import { note } from '@waelio/utils/dist/note';

note.success('Hi');
note.info('Hi');
note.warning('Hi');
note.error('Hi');

// Log
note.log('Hi from console');
```
