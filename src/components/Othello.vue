<template>
  <table>
    <tr v-for="y in height" :key="y">
      <td v-for="x in width" :key="x">
        <img :src="getImgSrc(x, y)" @click="change($event, x, y)" />
      </td>
    </tr>
  </table>
</template>

<script>
import anime from "animejs";

export default {
  name: "Othello",
  props: {
    width: Number,
    height: Number,
  },
  data() {
    return {
      state: Array,
    };
  },
  methods: {
    /** 盤面の状態を取得
     * @param {number} x 盤面のx座標
     * @param {number} y 盤面のy座標
     *
     * @return 指定した座標の状態
     */
    getState(x, y) {
      return this.state[x - 1][y - 1];
    },
    /** 盤面の状態を設定
     * @param {state} state 設定する値
     * @param {number} x 盤面のx座標
     * @param {number} y 盤面のy座標
     */
    setState(state, x, y) {
      this.state[x - 1].splice(y - 1, 1, state);
    },
    /** 画像のソースを取得
     * @param {number} x 盤面のx座標
     * @param {number} y 盤面のy座標
     *
     * @return {string} 画像のソース
     */
    getImgSrc(x, y) {
      const state = this.getState(x, y);

      if (state == 1) {
        return require("../assets/black.jpg");
      } else if (state == 2) {
        return require("../assets/white.jpg");
      }
      return require("../assets/none.jpg");
    },
    /** プロパティの値「width,height」で盤面を初期化
     */
    initState() {
      this.state = new Array(this.width);

      for (let x = 0; x < this.width; x++) {
        this.state[x] = new Array(this.height).fill(0);
      }

      const basisX = this.width / 2;
      const basisY = this.height / 2;

      this.setState(1, basisX, basisY);
      this.setState(2, basisX, basisY + 1);
      this.setState(2, basisX + 1, basisY);
      this.setState(1, basisX + 1, basisY + 1);
    },
    change(event, x, y) {
      const state = this.getState(x, y);
      let newState = 1;

      /** アニメーションの動作に使用
       * @type {HTMLElement}
       */
      const element = event.target;

      if (state != 0) {
        anime({
          targets: element,
          rotateY: [180, -180],
          easing: "easeInOutQuad",
          duration: 500,
        });

        newState = (state % 2) + 1;
        this.setState(newState, x, y);
      } else {
        this.setState(newState, x, y);
      }
    },
  },
  created() {
    this.initState();
  },
  watch: {
    width() {
      this.initState();
    },
    height() {
      this.initState();
    },
  },
};
</script>

<style scoped>
table {
  border-collapse: collapse;
}
tr,
td {
  height: 60px;
  padding: 0;
}
td {
  text-align: center;
  width: 60px;
  height: 60px;
  border: 1px solid black;
  background-color: lime;
}
img {
  vertical-align: middle;
  width: 60px;
}
</style>