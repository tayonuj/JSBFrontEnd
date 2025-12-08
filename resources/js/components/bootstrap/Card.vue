<template>
  <div :class="['card h-100', customClass]" :style="customStyle" ref="card">
    <slot />
    <div class="card-arrow">
      <div class="card-arrow-top-left"></div>
      <div class="card-arrow-top-right"></div>
      <div class="card-arrow-bottom-left"></div>
      <div class="card-arrow-bottom-right"></div>
    </div>
  </div>
</template>
<script setup>

const props = defineProps({
  customClass: {
    type: String,
    default: ''
  },
  customStyle: {
    type: Object,
    default: () => ({})
  }
});

</script>
<style scoped>
</style>
