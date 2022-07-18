<template>
  <section>
    <h2>結果発表</h2>
    白: {{ white }} 黒: {{ black }}
    <h2>{{ winnerMessage }}</h2>
    <button @click="exits">スタート画面に戻る</button>
  </section>
</template>

<script>
export default {
  name: "ResultView",
  props: {
    history: Array,
  },
  data() {
    return {
      white: Number,
      black: Number,
      winnerMessage: String,
    };
  },
  methods: {
    createMessage() {
      this.white = this.history[-1]["white"];
      this.black = this.history[-1]["black"];

      let contexts = "";
      if (this.black == this.white) {
        contexts = "引き分け";
      } else {
        contexts = this.black > this.white ? "黒" : "白";
        contexts += " の勝ち!!";
      }
      this.winnerMessage = contexts;
    },
    exits() {
      location.reload();
    },
  },
  created() {
    this.createMessage();
  },
};
</script>

<style>
</style>