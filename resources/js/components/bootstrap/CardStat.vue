<template>
  <div class="card overflow-hidden" style="min-width: 12rem">
    <div class="bg-holder bg-card" :style="{ backgroundImage: `url(/assets/img/icons/spot-illustrations/corner-${imageIndex}.png)` }"></div>
    <!--/.bg-holder-->
    <div class="card-body position-relative">
      <h6>{{ title }} <span class="badge badge-soft-warning rounded-pill ms-2">{{ badgeText }}</span></h6>
      <div :class="`display-4 fs-4 mb-2 fw-normal font-sans-serif ${textClass}`" :data-countup="countupData">
        {{ count }}
      </div>
      <a class="fw-semi-bold fs--1 text-nowrap" :href="href">More Details<span class="fas fa-angle-right ms-1" data-fa-transform="down-1"></span></a>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  badgeText: {
    type: String,
    required: true
  },
  count: {
    type: Number,
    required: true
  },
  href: {
    type: String,
    required: true
  },
  imageIndex: {
    type: Number,
    required: true,
    validator: (value) => value >= 1 && value <= 7
  },
  textClass: {
    type: String,
    required: false
  }
});

const countupData = computed(() => {
  return JSON.stringify({endValue: props.count, decimalPlaces: 2, suffix: 'k'});
});
</script>
