<template>
  <img :src="imgsrc" />
</template>

<script>
import anime from "animejs";

export default {
  name: "Cell",
  props: {
    piece: Number,
  },
  computed: {
    imgsrc: function () {
      if (this.piece == 1) {
        return require("../assets/black.jpg");
      } else if (this.piece == 2) {
        return require("../assets/white.jpg");
      }
      return require("../assets/none.jpg");
    },
  },
  watch: {
    piece: function (newVal, oldVal) {
      if (oldVal != 0) {
        anime({
          targets: this.$el,
          rotateY: [180, -180],
          easing: "easeInOutQuad",
          duration: 500,
        });
      }
    },
  },
};
</script>

<style>
img {
  vertical-align: middle;
  width: 100%;
}
</style>