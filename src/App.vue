<template>
  <h1>Variable Othello</h1>
  <component v-bind:is="currentComponent"
   v-on:sizeSelect="boardMake"
   v-on:othelloGame="finish"/>
</template>

<script>
import SizeSelect from './components/SizeSelect.vue';
import OthelloGame from './components/OthelloGame.vue';
import ResultView from './components/ResultView.vue';


export default {
  name: 'App',
  components: {
    SizeSelect,
    OthelloGame,
    ResultView,
  },
  data() {
    return {
      currentComponent: "SizeSelect",
      width: 6,
      height: 6,
      history: Array,
    }
  },
  methods: {
    boardMake(width, height) {
      this.width = width;
      this.height = height;

      this.currentComponent = "OthelloGame";
    },
    finish(history) {
      this.history = history;

      this.currentComponent = "ResultView";
    },
  }
}
</script>

<style>
* {
  margin: 0 auto;
  text-align: center;
}
button {
  margin: 10px;
  min-width: 50px;
  padding: 10px 30px;
  border-radius: 10px;
}
</style>

