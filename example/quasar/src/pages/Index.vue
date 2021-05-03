<template>
  <q-page class="flex flex-center">
    <img alt="Quasar logo" src="~assets/quasar-logo-full.svg" />
  </q-page>
</template>
<script>
 import { config } from '@waelio/utils/dist/config';
 import { note } from '@waelio/utils/dist/note';
export default {
  name: "PageIndex",
  mounted() {
    this.conf = config.get("client");
    note.success("mounted");
  },
  data() {
    return {
      conf: null
    };
  }
};
</script>
