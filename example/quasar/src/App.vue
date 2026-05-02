<template>
  <q-layout view="lHh Lpr lFf" class="app-shell">
    <q-page-container>
      <q-page class="window-height flex flex-center q-pa-lg">
        <q-card class="demo-card shadow-24">
          <q-card-section>
            <div class="text-overline text-positive">@waelio/utils</div>
            <div class="text-h3 q-mt-sm q-mb-sm">{{ title }}</div>
            <div class="text-body1 text-grey-3">
              A Quasar + Vite example wired to the local package checkout.
            </div>
          </q-card-section>

          <q-separator dark />

          <q-card-section class="row q-col-gutter-md">
            <div class="col-12 col-sm-6">
              <q-banner rounded class="bg-dark text-white">
                <template #avatar>
                  <q-icon name="rocket_launch" color="positive" />
                </template>
                Launch count: <strong>{{ launches }}</strong>
              </q-banner>
            </div>
            <div class="col-12 col-sm-6">
              <q-banner rounded class="bg-dark text-white">
                <template #avatar>
                  <q-icon name="inventory_2" color="info" />
                </template>
                Storage key: <strong>quasar-example-launches</strong>
              </q-banner>
            </div>
          </q-card-section>

          <q-card-actions align="left" class="q-pa-md q-gutter-sm">
            <q-btn
              color="positive"
              unelevated
              icon="celebration"
              label="Celebrate"
              @click="celebrate"
            />
            <q-btn
              color="warning"
              flat
              icon="warning"
              label="Warn me"
              @click="warn"
            />
            <q-btn
              color="info"
              flat
              icon="settings"
              label="Show config"
              @click="showConfig"
            />
          </q-card-actions>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { config, storage } from "@waelio/utils/config";
import { note } from "@waelio/utils/note";

config.set("example:title", "Quasar + Vite example");

const title = config.get("example:title");
const launches = ref(Number(storage.get("quasar-example-launches") || 0) + 1);

storage.set("quasar-example-launches", launches.value);

const celebrate = () => note.success(`Quasar example visit #${launches.value}`);
const warn = () => note.warning("Warnings are still better than surprises.");
const showConfig = () =>
  note.info(`Config title: ${config.get("example:title")}`, { timeout: 2500 });

onMounted(() => {
  note.info(`Quasar example booted (${launches.value} launches)`);
});
</script>

<style scoped>
.app-shell {
  min-height: 100vh;
  background:
    radial-gradient(circle at top, rgba(16, 185, 129, 0.18), transparent 28%),
    linear-gradient(180deg, #020617 0%, #111827 100%);
}

.demo-card {
  width: min(48rem, 100%);
  border-radius: 28px;
  background: rgba(15, 23, 42, 0.86);
  color: white;
  border: 1px solid rgba(148, 163, 184, 0.18);
}
</style>
