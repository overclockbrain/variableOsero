<template>
  <div class="center">
    <input type="range" min="4" max="50" step="2" v-model.number="width" />
    {{ width }}
    <input type="range" min="4" max="50" step="2" v-model.number="height" />
    {{ height }}
    <br />
  </div>
  <Othello :width="width" :height="height" class="center" />
</template>

<script>
import Othello from "./components/Othello.vue";

export default {
  name: "App",
  data() {
    return {
      width: 4,
      height: 4,
    };
  },
  components: {
    Othello,
  },
};
</script>

<style scoped>
.center {
  text-align: center;
  margin: 0 auto;
}
</style>
