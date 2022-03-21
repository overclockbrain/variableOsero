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
      anime({
        targets: this.$el,
        rotateY: [180, -180],
        easing: "easeInOutQuad",
        duration: 500,
      });
      if (this.piece == 1) {
        return require("../assets/black.jpg");
      } else if (this.piece == 2) {
        return require("../assets/white.jpg");
      }
      return require("../assets/none.jpg");
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