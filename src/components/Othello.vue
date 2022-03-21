<template>
  <table>
    <tr v-for="y in height" :key="y">
      <td v-for="x in width" :key="x" @click="change(x, y)">
        <Cell :piece="getState(x, y)" />
      </td>
    </tr>
  </table>
</template>

<script>
import Cell from "./Cell.vue";

export default {
  name: "Othello",
  props: {
    width: Number,
    height: Number,
  },
  data: function () {
    return {
      state: Array,
    };
  },
  components: {
    Cell,
  },
  methods: {
    getState(x, y) {
      return this.state[x - 1][y - 1];
    },
    setState(state, x, y) {
      this.state[x - 1][y - 1] = state;
    },
    change(x, y) {
      let state = this.getState(x, y);
      state = (state + 1) % 3;
      this.setState(state, x, y);

      const newState = this.state.slice();
      this.state = newState;
    },
    initState() {
      const state = new Array(this.width);
      for (let x = 0; x < this.width; x++) {
        state[x] = new Array(this.height).fill(0);
      }
      this.state = state;
    },
    putCenterPieces() {
      const basisX = this.width / 2 - 1;
      const basisY = this.height / 2 - 1;

      this.state[basisX][basisY] = 1;
      this.state[basisX][basisY + 1] = 2;
      this.state[basisX + 1][basisY] = 2;
      this.state[basisX + 1][basisY + 1] = 1;

      this.state = this.state.slice();
    },
  },
  created: function () {
    this.initState();
    this.putCenterPieces();
  },
  watch: {
    width: function () {
      this.initState();
    },
    height: function () {
      this.initState();
    },
  },
};
</script>

<style>
table {
  border-collapse: collapse;
}
td,
tr {
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
</style>