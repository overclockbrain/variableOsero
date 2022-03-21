<template>
  <Othello :width="8" :height="8" />
</template>

<script>
import Othello from "./components/Othello.vue";

export default {
  name: "App",
  components: {
    Othello,
  },
};
</script>

<style>
</style>
