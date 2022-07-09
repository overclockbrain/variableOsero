<!-- 
  SizeSelect.vue
  created.by Y.Miyamoto on 2022-07-04

  - 画面の縦・横を設定
  - 決定後 => OthelloGame.vue

 -->

<template>
  <h2>盤面の設定</h2>
  <div class="center">
    横： <input type="range" min="4" max="16" step="2" v-model.number="width"> {{width}} <br>
    縦： <input type="range" min="4" max="16" step="2" v-model.number="height"> {{height}}
  </div>
  <button v-on:click="doConfilm()">確定</button>
</template>

<script>
export default {
  name: "SizeSelect",
  data() {
    return {
      width: 6,
      height: 6,
    }
  },
  methods: {
    doConfilm() {
      this.$emit('sizeSelect', this.width, this.height);
    }
  }
}
</script>

<style>

</style>