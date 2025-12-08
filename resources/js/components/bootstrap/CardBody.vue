<template>
  <div :class="['card-body', customClass]" :style="customStyle" >
    <a v-if="href" :href="href" target="_blank" class="w-100 h-100 d-block" style="text-decoration: none">
    <slot />
    </a>
    <template v-else>
      <slot />
    </template>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  customClass: {
    type: String,
    default: ''
  },
  customStyle: {
    type: Object,
    default: () => ({})
  },
  href: {
    type: String,
    required: false
  },
});
</script>

<style scoped>

</style>
