<template>
  <div>
    {{ label }}:
    <input
      type="range"
      min="4"
      max="16"
      step="2"
      :value="modelValue"
      @input="$emit('update:modelValue', Number($event.target.value))"
    />
    {{ modelValue }}
  </div>
</template>

<script>
export default {
  name: "RangeSlider",
  props: {
    label: String,
    modelValue: Number,
  },
  data() {
    return {
      value: 6,
    };
  },
};
</script>

<style>
</style>