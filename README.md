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

<ol>
 <li> Quasar Cli, make sure to uncomment: `quasar.conf.js` under `extras[]`

```js
// 'fontawesome-v5',`
```

#### or you can add the cdn for font-awesome in `src/index.template.html`

```html
<!-- Font-Awesome -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" crossorigin="anonymous" integrity="sha512-iBBXm8fW90+nuLcSKlbmrPcLa0OT92xO1BIsZ+ywDWZCvqsWgccV3gFoRBv0z+8dLJgyAHIhR35VZc2oM/gI1w==" />
```

</li>

<hr />

<li>Vue Cli, add the following "Material Icons, Font-Awesome 5 and Quasar CSS Classes" to public/index.html

```html
<!-- Material Icons -->
<link href="https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900|Material+Icons" rel="stylesheet" type="text/css" />
<!-- Quasar CSS Classes "min" -->
<link href="https://cdn.jsdelivr.net/npm/quasar@1.15.13/dist/quasar.min.css" rel="stylesheet" type="text/css" />
<!-- Font-Awesome -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" crossorigin="anonymous" integrity="sha512-iBBXm8fW90+nuLcSKlbmrPcLa0OT92xO1BIsZ+ywDWZCvqsWgccV3gFoRBv0z+8dLJgyAHIhR35VZc2oM/gI1w==" />
```

<hr>
<li>UMD "Standalone":

```html
<!-- Material Icons -->
<link href="https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900|Material+Icons" rel="stylesheet" type="text/css" />
<!-- Quasar CSS Classes "min" -->
<link href="https://cdn.jsdelivr.net/npm/quasar@1.15.13/dist/quasar.min.css" rel="stylesheet" type="text/css" />
<!-- Font-Awesome -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" crossorigin="anonymous" integrity="sha512-iBBXm8fW90+nuLcSKlbmrPcLa0OT92xO1BIsZ+ywDWZCvqsWgccV3gFoRBv0z+8dLJgyAHIhR35VZc2oM/gI1w==" />

<!-- Start: Only in UMD otherwise use the NPM or Yarn -->
<script src="https://cdn.jsdelivr.net/npm/@waelio/utils@latest/dist/utils.js"></script>
<!-- End: Only in UMD -->
```

</li>
</ol>

#

### Not finished testing yet!

Adding Documentation. Tests & examples regularly.

Here is a quick use in a `Quasar` Project, can be used in a `Vue` or `Nuxt` just as easily:

```javascript
// src/bootstrap.js

import { Utils } from '@waelio/utils';

const { config, note, storage } = Utils;
config.set('dev:api', 'http://localhost:3000');
console.log(
  '%cMyProject%cline:10%ccconfig',
  'color:#fff;background:#ee6f57;padding:3px;border-radius:2px',
  'color:#fff;background:#1f3c88;padding:3px;border-radius:2px',
  'color:#fff;background:rgb(3, 101, 100);padding:3px;border-radius:2px',
  config
);
// "async" is optional;
// more info on params: https://quasar.dev/quasar-cli/boot-files
export default async ({ app, store, Vue }) => {
  app.utils = Utils;

  Vue.prototype.$utils = Utils;
  Vue.prototype.$config = config;
  Vue.prototype.$note = note;
  Vue.prototype.$storage = storage;

  store.$utils = Utils;
  store.$config = config;
  store.$note = note;
  store.$storage = storage;
};

export { config, note, storage };
```

Then you can use in another `BootFile` such as `axios`

```javascript
// src/boot/axios.js

import Vue from 'vue';
import axios from 'axios';
import { config, note } from 'boot/bootstrap';
import { reParseString } from 'waelio-utils';

let instance, HTTP;
Vue.mixin({
  beforeCreate() {
    const options = this.$options;
    if (options.axios) {
      this.$axios = options.axios;
    } else if (options.parent) {
      this.$axios = options.parent.$axios;
    }
  }
});
axios.defaults.headers.post['Content-Type'] = 'application/json';
const baseURL = config.get('api');
HTTP = axios.create({
  baseURL: baseURL
});
HTTP.interceptors.request.use(
  (conf) => {
    const token = config.get('accessToken');
    if (token) {
      conf.headers.Authorization = `bearer ${token}`;
    }
    return conf;
  },
  (error) => {
    if (error) {
      note.error(error, { position: 'top-right' });
      return Promise.reject(error);
    }
  }
);
HTTP.interceptors.response.use(
  (response) => {
    const data = _.get(response, 'data');
    response = data ? reParseString(data) : response;
    return response;
  },
  (error) => {
    if (error) {
      note.error(error || error.message, { position: 'bottom' });
      return Promise.reject(error);
    }
  }
);

Vue.prototype.$HTTP = HTTP;
function updateAxios(params) {
  HTTP.interceptors.request.use(
    (conf) => {
      const token = params;
      if (token) {
        conf.headers.Authorization = `bearer ${token}`;
      }
      return conf;
    },
    (error) => {
      if (error) {
        note.error(error, { position: 'top-right' });
      }
    }
  );
}
export default function({ app, store, ssrContext }) {
  app.HTTP = HTTP;
  store.$HTTP = HTTP;

  return HTTP;
}

export { HTTP, Run, updateAxios, axios };
```

# Here is how I use it `get all at once`:
```js
import { Utils } from '@waelio/utils'
const { config, note, storage } = Utils
config.set('dev:api', 'http://localhost:3000')

// Remember in the axios.js Boot File?
const baseURL = config.get("api"); // 'http://localhost:3000'

```


# Config

```javascript
import { config } from '@waelio/utils/dist/config';

// login -> accessToken -> Save it
config.set("Token", accessToken)

```

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
