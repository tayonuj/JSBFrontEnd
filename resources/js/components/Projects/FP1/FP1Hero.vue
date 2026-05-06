<template>
  <section class="cp-hero">
    <div class="container cp-hero-inner">
      <div class="cp-hero-text">
        <p class="cp-hero-eyebrow">Food Security Project</p>
        <h2>Strengthening Smallholder Farmers and Micro/Home-Based Agriculture industries for Enhanced Food & Livelihood Security</h2>
        <p class="cp-hero-lead">
          The project aimed to strengthen food and livelihood security in Sri Lanka by supporting smallholder farmers, particularly women, affected by the economic crisis. Implemented by UNDP with financial support from the Government of Japan, the project had a total grant value of USD 2,777,777 and targeted 8,000 women smallholder farmers, directly benefiting 32,000 vulnerable community members across seven Dry Zone districts. The initiative promoted climate-smart backyard poultry systems, livelihood diversification, and micro-enterprise development through training, provision of essential inputs, and strengthening of local value chains. Overall, the project contributed to enhancing rural resilience, improving nutrition and income, and supporting a gender-responsive economic recovery in Sri Lanka.        </p>

        <div class="cp-hero-badges">
          <button
            type="button"
            class="cp-hero-badge cp-hero-badge-button"
            @click="emit('openMedia', 'images')"
          >
            <span class="dot dot-green"></span>
            Photo gallery
          </button>
          <button
            type="button"
            class="cp-hero-badge cp-hero-badge-button"
            @click="emit('openMedia', 'stories')"
          >
            <span class="dot dot-blue"></span>
            Success stories
          </button>
          <button
            type="button"
            class="cp-hero-badge cp-hero-badge-button"
            @click="emit('openMedia', 'videos')"
          >
            <span class="dot dot-gold"></span>
            Video gallery
          </button>
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
const emit = defineEmits<{
  openMedia: [tab: "images" | "stories" | "videos"];
}>();

import { computed, onBeforeUnmount, onMounted, ref } from "vue";

const carouselImages = [
  { src: "/Images/JSB1/01.a.jpg", alt: "Food Security project field image 1" },
  { src: "/Images/JSB1/02.c.jpg", alt: "Food Security project field image 2" },
  { src: "/Images/JSB1/Asoka 1.jpg", alt: "Food Security project field image 3" },
  { src: "/Images/JSB1/Danushka 03.png", alt: "Food Security project field image 4" },
  { src: "/Images/JSB1/Niluka.jpg", alt: "Food Security project field image 5" },
    { src: "/Images/JSB1/Nimala 01.png", alt: "Nimala 01.png" },

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
.cp-hero-eyebrow {
  color: #1f7a3f;
}

.cp-hero-media {
  display: flex;
  align-items: flex-start;
}

.hero-carousel {
  display: flex;
  align-items: stretch;
  flex: 1 1 auto;
  height: clamp(320px, 30vw, 420px);
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

@media (max-width: 1024px) {
  .cp-hero-media,
  .hero-carousel {
    min-height: 220px;
    height: 220px;
  }
}
</style>
