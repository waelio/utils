<template>
  <q-page class="flex flex-center">
    <img alt="Quasar logo" src="~assets/quasar-logo-full.svg" />
  </q-page>
</template>
<script>
// import * as note from "@waelio/utils/dist/utils";

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
