<template>
  <section class="cp-hero">
    <div class="container cp-hero-inner">
      <div class="cp-hero-text">
        <p class="cp-hero-eyebrow">Climate Promise • Component 4</p>
        <h2>Addressing the climate crisis and human security through NDC planning and implementation - Empowering Women Farmers to Drive Sri Lanka’s Climate-Resilient, Net-Zero Agriculture Future
          </h2>
        <p class="cp-hero-lead">
          The project focused on accelerating a just transition in Sri Lanka’s agriculture sector by promoting renewable energy-based technologies among smallholder farmers, particularly women. Implemented by UNDP with a grant of USD 1 million from the Government of Japan, it targeted climate-vulnerable communities in Kilinochchi and Nuwara Eliya. The initiative strengthened energy security, enhanced agricultural productivity, and supported resilient livelihoods through solar-powered irrigation, clean energy systems, and climate-smart practices. It directly benefited 2,024 individuals and indirectly reached around 4,500 community members. Overall, the project contributed to improved food security, women’s empowerment, and progress toward net-zero development pathways.
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
        <div class="cp-hero-image main-image cp-hero-video">
          <iframe
            :src="videoEmbedUrl"
            title="Climate Promise component 4 video"
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen
            referrerpolicy="strict-origin-when-cross-origin"
          ></iframe>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  openMedia: [tab: "images" | "stories" | "videos"];
}>();

const videoId = "FjCv4abeaME";
const videoEmbedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&rel=0`;
</script>

<style scoped>
.cp-hero-eyebrow {
  color: #1f7a3f;
}

.cp-hero-media {
  display: flex;
  align-items: flex-start;
}

.cp-hero-video {
  display: flex;
  align-items: stretch;
  flex: 1 1 auto;
  height: clamp(320px, 30vw, 420px);
  overflow: hidden;
  border-radius: 24px;
}

.cp-hero-video iframe {
  width: 100%;
  height: 100%;
  display: block;
  border: 0;
}

@media (max-width: 1024px) {
  .cp-hero-media,
  .cp-hero-video {
    min-height: 220px;
    height: 220px;
  }
}
</style>
