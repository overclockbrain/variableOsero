<template>
  <input type="range" min="4" max="50" step="2" v-model.number="width" />
  {{ width }}
  <input type="range" min="4" max="50" step="2" v-model.number="height" />
  {{ height }}
  <Othello :width="width" :height="height" />
</template>

<script>
import Othello from "./components/Othello.vue";

export default {
  name: "App",
  components: {
    Othello,
  },
  data: function () {
    return {
      width: 4,
      height: 4,
    };
  },
};
</script>

<style>
</style>
