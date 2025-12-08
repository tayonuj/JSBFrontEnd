<template>
  <div class="card overflow-hidden" style="min-width: 12rem">
    <div class="bg-holder bg-card" :style="{ backgroundImage: `url(/assets/img/icons/spot-illustrations/corner-${imageIndex}.png)` }"></div>
    <!--/.bg-holder-->
    <div class="card-body position-relative">
      <component v-if="title" :is="headingTag" class="custom-heading">
        {{ title }}
      </component>

      <!-- <h4>{{ title }} </h4> -->
      <div :class="`display-4 fs-4 mb-2 fw-normal font-sans-serif ${textClass}`" :data-countup="countupData">
        <span :class="`${icon}`" :style="{ color: iconColor }"></span>
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
    default: ''
  },
  headingTag: {
      type: String,
      default: 'h4',  
      validator: function (value) {
        return ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].indexOf(value) !== -1;
      }
    },

  badgeText: {
    type: String,
    default: ''
  },
  icon: {
    type: String,
    default: ''
  },
  href: {
    type: String,
    default: ''
  },
  imageIndex: {
    type: Number,
    required: true,
    validator: (value) => value >= 1 && value <= 7
  },
  textClass: {
    type: String,
    default: ''
  },
  iconColor: {
    type: String,
    required: false,
    default: '#000' // Default color if not provided
  }
});

const countupData = computed(() => {
  return JSON.stringify({endValue: props.count, decimalPlaces: 2, suffix: 'k'});
});
</script>
