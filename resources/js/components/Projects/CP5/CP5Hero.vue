<template>
  <section class="cp-hero">
    <div class="container cp-hero-inner">
      <div class="cp-hero-text">
        <p class="cp-hero-eyebrow">Climate Promise • Component 5</p>
        <h1>Project media and stories are being assembled</h1>
        <p class="cp-hero-lead">
          This temporary page uses the same gallery, story, and video navigation pattern as the food security project while final CP5 content is being prepared.
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
  { src: "/images/project-jsb.jpg", alt: "Climate Promise component 5 image 1" },
  { src: "/images/project-jsb-2.jpg", alt: "Climate Promise component 5 image 2" },
  { src: "/images/chicken_farmers.jpg", alt: "Climate Promise component 5 image 3" },
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
