<script setup>
import { onMounted, ref } from "vue";
import { config, storage } from "@waelio/utils/config";
import { note } from "@waelio/utils/note";

config.set("example:title", "Vue 3 + Vite example");

const title = config.get("example:title");
const launches = ref(Number(storage.get("vue-example-launches") || 0) + 1);

storage.set("vue-example-launches", launches.value);

const celebrate = () => note.success(`Welcome back! Visit #${launches.value}`);
const warn = () =>
  note.warning("This is the Quasar-backed note helper talking.");

onMounted(() => {
  note.info(`Vue example booted (${launches.value} launches)`);
});
</script>

<template>
  <main class="page-shell">
    <section class="card">
      <p class="eyebrow">@waelio/utils</p>
      <h1>{{ title }}</h1>
      <p>
        This example uses the local checkout via a <code>file:../..</code>
        dependency, so it always exercises the version you are editing.
      </p>

      <dl class="stats">
        <div>
          <dt>Launch count</dt>
          <dd>{{ launches }}</dd>
        </div>
        <div>
          <dt>Stored key</dt>
          <dd>vue-example-launches</dd>
        </div>
      </dl>

      <div class="actions">
        <button type="button" @click="celebrate">Show success</button>
        <button type="button" class="secondary" @click="warn">
          Show warning
        </button>
      </div>
    </section>
  </main>
</template>

<style scoped>
:global(body) {
  margin: 0;
  font-family:
    Inter,
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    sans-serif;
  background:
    radial-gradient(circle at top, rgba(66, 184, 131, 0.25), transparent 30%),
    linear-gradient(180deg, #0f172a 0%, #111827 100%);
  color: #e5e7eb;
}

:global(*) {
  box-sizing: border-box;
}

.page-shell {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 2rem;
}

.card {
  width: min(42rem, 100%);
  padding: 2rem;
  border-radius: 24px;
  background: rgba(15, 23, 42, 0.82);
  border: 1px solid rgba(148, 163, 184, 0.2);
  box-shadow: 0 30px 80px rgba(15, 23, 42, 0.45);
}

.eyebrow {
  margin: 0 0 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: #86efac;
  font-size: 0.82rem;
}

h1 {
  margin: 0 0 1rem;
  font-size: clamp(2rem, 4vw, 3rem);
}

p {
  color: #cbd5e1;
  line-height: 1.7;
}

code {
  padding: 0.15rem 0.4rem;
  border-radius: 999px;
  background: rgba(30, 41, 59, 0.9);
}

.stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr));
  gap: 1rem;
  margin: 1.75rem 0;
}

.stats div {
  padding: 1rem;
  border-radius: 18px;
  background: rgba(15, 23, 42, 0.7);
  border: 1px solid rgba(148, 163, 184, 0.16);
}

dt {
  font-size: 0.85rem;
  color: #94a3b8;
}

dd {
  margin: 0.45rem 0 0;
  font-size: 1.25rem;
  font-weight: 700;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

button {
  appearance: none;
  border: none;
  border-radius: 999px;
  padding: 0.9rem 1.25rem;
  font-weight: 700;
  cursor: pointer;
  background: linear-gradient(135deg, #22c55e, #14b8a6);
  color: #0f172a;
}

button.secondary {
  background: rgba(15, 23, 42, 0.95);
  color: #e2e8f0;
  border: 1px solid rgba(148, 163, 184, 0.25);
}
</style>
