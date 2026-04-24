<template>
  <section class="cp-hero">
    <div class="container cp-hero-inner">
      <div class="cp-hero-text">
        <p class="cp-hero-eyebrow">Climate Promise • Component 4</p>
        <h1>Clean Energy and Resilient Livelihood Support for Vulnerable Households</h1>
        <p class="cp-hero-lead">
          Component 4 focuses on strengthening household resilience in Nuwara Eliya
          through targeted support for clean energy access and climate-adaptive
          livelihoods. The programme links vulnerable families with practical inputs
          such as cookstoves, poultry support, solar solutions, and insect proof net
          systems to improve living conditions, reduce daily vulnerability, and support
          safer income opportunities.
        </p>

        <div class="cp-hero-badges">
          <div class="cp-hero-badge">
            <span class="dot dot-green"></span>
            Clean energy & household resilience
          </div>
          <div class="cp-hero-badge">
            <span class="dot dot-blue"></span>
            Women-led household support
          </div>
          <div class="cp-hero-badge">
            <span class="dot dot-gold"></span>
            Livelihood inputs for vulnerable communities
          </div>
        </div>
      </div>

      <div class="cp-hero-media">
        <div class="cp-hero-image main-image hero-carousel">
          <div class="hero-carousel-track" :style="carouselTrackStyle">
            <div
              v-for="image in carouselImages"
              :key="image.src"
              class="hero-carousel-slide"
            >
              <img :src="image.src" :alt="image.alt" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";

const carouselImages = [
  { src: "/images/JSB4/1.png", alt: "Climate Promise component 4 image 1" },
  { src: "/images/JSB4/2.png", alt: "Climate Promise component 4 image 2" },
  { src: "/images/JSB4/3.png", alt: "Climate Promise component 4 image 3" },
  { src: "/images/JSB4/4.png", alt: "Climate Promise component 4 image 4" },
  { src: "/images/JSB4/5.png", alt: "Climate Promise component 4 image 5" },
  { src: "/images/JSB4/6.png", alt: "Climate Promise component 4 image 6" },
  { src: "/images/JSB4/7.png", alt: "Climate Promise component 4 image 7" }
];

const activeImageIndex = ref(0);
let autoplayTimer: ReturnType<typeof setInterval> | null = null;

const carouselTrackStyle = computed(() => ({
  transform: `translateX(-${activeImageIndex.value * 100}%)`
}));

const startAutoplay = () => {
  autoplayTimer = setInterval(() => {
    activeImageIndex.value = (activeImageIndex.value + 1) % carouselImages.length;
  }, 2800);
};

onMounted(() => {
  startAutoplay();
});

onBeforeUnmount(() => {
  if (autoplayTimer) {
    clearInterval(autoplayTimer);
  }
});
</script>

<style scoped>
.hero-carousel {
  display: flex;
  align-items: stretch;
}

.hero-carousel-track {
  display: flex;
  height: 100%;
  width: 100%;
  transition: transform 0.6s ease;
}

.hero-carousel-slide {
  display: flex;
  align-items: stretch;
  min-width: 100%;
  height: 100%;
}

.hero-carousel-slide > img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
</style>
