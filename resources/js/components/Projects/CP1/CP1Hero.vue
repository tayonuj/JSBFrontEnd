<template>
  <section class="cp-hero">
    <div class="container cp-hero-inner">
      <div class="cp-hero-text">
        <p class="cp-hero-eyebrow">Climate Promise • Component 1</p>
        <h1>Climate-resilient Livelihoods for Rural Communities</h1>
        <p class="cp-hero-lead">
          Climate Promise 1 focuses on helping small-scale farmers and
          micro-enterprises adapt to a changing climate. Through training,
          climate-smart inputs and targeted grants, the project works with
          communities to secure more stable, sustainable incomes.
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
        <div class="cp-hero-image main-image">
          <img src="/images/climate-farmers-2.jpg" alt="Farmers in a field" />
        </div>
        <div class="cp-hero-image floating-image floating-image-1">
          <img src="/images/chicken_1.jpg" alt="Training session" />
        </div>
        <div class="cp-hero-image floating-image floating-image-2">
          <img src="/images/chicken_farmers.jpg" alt="Climate smart tools" />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  openMedia: [tab: "images" | "stories" | "videos"];
}>();
</script>
