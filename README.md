# @waelio/utils

[![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg?color=blue)](https://paypal.me/waelio?locale.x=en_US)
[![NPM version](https://img.shields.io/npm/v/@waelio/utils.svg?label=NPM&color=red)](https://www.npmjs.com/package/@waelio/utils)
[![NPM monthly downloads](https://img.shields.io/npm/dm/@waelio/utils.svg?label=Monthly-Downloads)](https://npmjs.org/package/@waelio/utils)
[![NPM total downloads](https://img.shields.io/npm/dt/@waelio/utils.svg?label=Total-Download&color=blueviolet)](https://npmjs.org/package/@waelio/utils)

`@waelio/utils` is a small TypeScript-friendly utility package for:

- environment/config defaults
- namespaced browser storage powered by `store2`
- optional Quasar-backed notifications
- a lightweight `uStore` facade with local, session, cookie, memory, and signal adapters

## Installation

```bash
npm install @waelio/utils
```

Or:

```bash
yarn add @waelio/utils
```

Node `>=18` is required.

## What the package exports

The root entry exports:

- `store`
- `config`
- `conf`
- `storage`
- `note`
- `Notify`
- `configureNote`
- `uStore`
- `localStorage`
- `sessionStorage`
- `cookieStorage`
- `memoryStorage`
- `signalStorage`
- `Utils`

Preferred subpath exports are also available:

- `@waelio/utils/config`
- `@waelio/utils/conf`
- `@waelio/utils/note`
- `@waelio/utils/storage`
- `@waelio/utils/store`
- `@waelio/utils/ustore`

Legacy `dist/*` deep imports still work for compatibility, but the subpaths above are the modern path.

## Recommended imports

Use subpaths when you only need one part of the package:

```ts
import { config } from "@waelio/utils/config";
import { conf } from "@waelio/utils/conf";
import { note, configureNote } from "@waelio/utils/note";
import { storage } from "@waelio/utils/storage";
import store from "@waelio/utils/store";
import { uStore, signalStorage } from "@waelio/utils/ustore";
```

Use the root entry when you want everything in one import:

```ts
import {
  Utils,
  config,
  note,
  storage,
  uStore,
  signalStorage,
} from "@waelio/utils";

console.log(Utils.Config === config);
console.log(Utils.Note === note);
console.log(Utils.Storage === storage);
console.log(Utils.uStore === uStore);
console.log(Utils.signalStorage === signalStorage);
```

## Config helpers

There are two config instances:

- `config` — backed by the package storage namespace
- `conf` — a plain config instance without the namespaced storage binding

Nested keys use `:` separators.

```ts
import { config } from "@waelio/utils/config";
import { conf } from "@waelio/utils/conf";

config.set("dev:api", "https://api.example.com");
config.set("credentials:token", "secret-token");

console.log(config.get("dev:api"));
console.log(config.get("credentials:token"));
console.log(config.has("credentials:token"));

conf.set("featureFlags:newCheckout", true);
console.log(conf.get("featureFlags:newCheckout"));
```

If you want direct access to the underlying namespaced storage instance:

```ts
import { storage } from "@waelio/utils/storage";

storage.set("theme", "dark");
console.log(storage.get("theme"));
```

## Store wrapper

`@waelio/utils/store` exposes the `store2` API as a default export.

```ts
import store from "@waelio/utils/store";

store("theme", "dark");
console.log(store("theme"));

const accountStore = store.namespace("account");
accountStore.set("id", "42");
console.log(accountStore.get("id"));
```

## uStore adapters

The package includes a lightweight `uStore` facade inspired by
[`@waelio/ustore`](https://github.com/waelio/ustore).

Available adapters:

- `uStore.config`
- `uStore.local`
- `uStore.session`
- `uStore.cookie`
- `uStore.memory`
- `uStore.signal`

The same adapters are also exported individually from the root entry and `@waelio/utils/ustore`:

- `localStorage`
- `sessionStorage`
- `cookieStorage`
- `memoryStorage`
- `signalStorage`

### Basic usage

```ts
import { uStore } from "@waelio/utils/ustore";

uStore.local.set("theme", "dark");
console.log(uStore.local.get("theme"));

uStore.session.set("step", 2);
console.log(uStore.session.has("step"));

uStore.cookie.set("bannerDismissed", true);
console.log(uStore.cookie.get("bannerDismissed"));

uStore.memory.set("draft", { title: "Hello" });
console.log(uStore.memory.get("draft"));
```

### Reactive signal storage

```ts
import { signalStorage } from "@waelio/utils/ustore";

const stop = signalStorage.subscribe("theme", (value, change) => {
  console.log("theme changed", {
    value,
    previousValue: change.previousValue,
    source: change.source,
  });
});

signalStorage.set("theme", "light");
signalStorage.remove("theme");

console.log(signalStorage.snapshot());

stop();
```

## Notification helper

`note` works with or without Quasar.

Without Quasar, methods return safe payload objects instead of throwing.

```ts
import { note } from "@waelio/utils/note";

note.success("Saved successfully");
note.info("Heads up");
note.warning("Double-check this");
note.error(new Error("Something exploded politely"));

note.loading.start({ message: "Saving..." });
note.loading.stop();

note.dialog({ title: "Delete item", message: "Are you sure?" });
```

## Quasar integration

Version 4+ does not auto-install Quasar or Vue for you.

If your app uses Quasar, wire the adapters once during startup:

```ts
import { createApp } from "vue";
import {
  Dark,
  Dialog,
  Loading,
  LoadingBar,
  Notify,
  QSpinnerGears,
  Quasar,
} from "quasar";
import { configureNote } from "@waelio/utils/note";
import App from "./App.vue";

const app = createApp(App);

app.use(Quasar, {
  plugins: {
    Notify,
    Dialog,
    Loading,
    LoadingBar,
  },
});

configureNote({
  Notify,
  Dialog,
  Loading,
  LoadingBar,
  Dark,
  QSpinnerGears,
});

app.mount("#app");
```

After that, `note.success(...)`, `note.dialog(...)`, and `note.loading.start(...)` can delegate to Quasar when available.

## Standalone / UMD

The package still ships UMD bundles in `dist/`.

If you load the browser bundle directly, load Quasar first when you want real UI notifications:

```html
<link
  href="https://cdn.jsdelivr.net/npm/quasar@2/dist/quasar.prod.css"
  rel="stylesheet"
/>
<script src="https://cdn.jsdelivr.net/npm/vue@3/dist/vue.global.prod.js"></script>
<script src="https://cdn.jsdelivr.net/npm/quasar@2/dist/quasar.umd.prod.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@waelio/utils@latest/dist/utils.js"></script>
<script>
  Utils.configureNote(window.Quasar);
  Utils.note.success("Loaded from CDN");
  Utils.uStore.local.set("mode", "cdn");
</script>
```

## Local examples

This repository includes two example apps that depend on the local checkout via `file:../..`:

- `example/vue` — Vue 3 + Vite + Quasar
- `example/quasar` — Quasar-flavoured Vue 3 + Vite example

Run either one like this:

```bash
cd example/vue
npm install
npm run dev
```

Or:

```bash
cd example/quasar
npm install
npm run dev
```

## Migrating from v3

- Vue 2 / Quasar 1 auto-registration is gone
- Quasar-backed notifications now require an explicit `configureNote(...)` call
- subpath imports are preferred over legacy deep imports
- the package source and distributed typings are now TypeScript-based

## Support

Ask questions in the community Discord: https://discord.gg/tBZ2Fmdb7E

- [https://waelio.com/packages/@waelio/utils](https://waelio.com/packages/@waelio/utils)

