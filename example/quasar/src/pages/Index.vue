<template>
  <q-page class="flex flex-center">
    <img alt="Quasar logo" src="~assets/quasar-logo-full.svg" />
  </q-page>
</template>
<script>
 import { utils } from '@waelio/utils/dist/';
 console.log('%cMyProject%cline:7%cutils', 'color:#fff;background:#ee6f57;padding:3px;border-radius:2px', 'color:#fff;background:#1f3c88;padding:3px;border-radius:2px', 'color:#fff;background:rgb(38, 157, 128);padding:3px;border-radius:2px', utils)

export default {
  name: "PageIndex",
  mounted() {
    // this.conf = config.get("client");
    // note.success("mounted");
  },
  data() {
    return {
      conf: null
    };
  }
};
</script>
