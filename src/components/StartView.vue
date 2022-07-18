<!-- 
  StartVue.vue
  created.by Y.Miyamoto on 2022-07-04

  - 画面の縦・横を設定
  - 決定後 => OthelloGame.vue
 -->

<template>
  <section>
    <h2>盤面の設定</h2>
    <div class="center">
      <RangeSlider label="縦" v-model="height" />
      <RangeSlider label="横" v-model="width" />
    </div>
    <button @click="doConfirm">確定</button>
  </section>
</template>

<script>
import RangeSlider from "./parts/RangeSlider.vue";
export default {
  name: "StartView",
  data() {
    return {
      width: 6,
      height: 6,
    };
  },
  methods: {
    doConfirm() {
      this.$emit("sizeSelect", this.width, this.height);
    },
  },
  components: { RangeSlider },
};
</script>

<style>
</style>