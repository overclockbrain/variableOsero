<template>
  <div class="center">
    <input type="range" min="4" max="50" step="2" v-model.number="width" />
    {{ width }}
    <input type="range" min="4" max="50" step="2" v-model.number="height" />
    {{ height }}<br />
    <button
      @click="this.$refs.othello.putCenterPieces()"
      style="margin-bottom: 10px"
    >
      確定
    </button>
  </div>
  <Othello :width="width" :height="height" ref="othello" class="center" />
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
.center {
  text-align: center;
  margin: 0 auto;
}
</style>
