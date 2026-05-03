<template>
  <section class="cp-hero">
    <div class="container cp-hero-inner">
      <div class="cp-hero-text">
        <p class="cp-hero-eyebrow">Food Security Project</p>
        <h1>Food Security through Poultry and Green Agriculture</h1>
        <p class="cp-hero-lead">
          This project supports vulnerable smallholder farmers and estate sector households by providing backyard poultry units, including chicks and coops, along with renewable energy and green agriculture solutions. It aims to improve food security, create sustainable income opportunities, and strengthen rural livelihoods through climate-smart farming practices.
        </p>

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
  { src: "/images/JSB1/Picture1.jpg", alt: "Food Security project field image 1" },
  { src: "/images/JSB1/Picture10.jpg", alt: "Food Security project field image 2" },
  { src: "/images/JSB1/Picture18.png", alt: "Food Security project field image 3" },
  { src: "/images/JSB1/Picture21.jpg", alt: "Food Security project field image 4" },
  { src: "/images/JSB1/Picture27.jpg", alt: "Food Security project field image 5" },
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
