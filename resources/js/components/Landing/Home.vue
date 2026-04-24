<template>
  <main class="home-page">
    <div
      class="home-parallax-layer home-page-glow home-page-glow-a"
      data-speed="0.06"
      data-direction="1"
    ></div>
    <div
      class="home-parallax-layer home-page-glow home-page-glow-b"
      data-speed="0.09"
      data-direction="-1"
    ></div>
    <div class="home-page-frost"></div>

    <section class="jsb-hero-carousel" aria-label="JSB project image carousel">
      <div class="jsb-carousel-frame">
        <div class="jsb-carousel-track" :style="carouselTrackStyle">
          <div
            v-for="(slide, index) in heroSlides"
            :key="slide.src"
            class="jsb-carousel-slide"
            :class="{ active: index === activeSlideIndex }"
            :style="{ '--slide-image': `url(${slide.src})` }"
          >
            <div class="jsb-carousel-slide-bg"></div>
            <div class="jsb-carousel-slide-media"></div>
            <div class="jsb-carousel-slide-overlay"></div>
            <div class="jsb-carousel-slide-copy">
              <span class="jsb-carousel-slide-frame" aria-hidden="true"></span>
              <h1 class="jsb-carousel-slide-title">
                <span class="jsb-carousel-slide-title-text">{{ slide.title }}</span>
              </h1>
              <router-link :to="slide.href" class="jsb-carousel-cta">
                Explore
              </router-link>
            </div>
            <img :src="slide.src" :alt="slide.alt" class="jsb-carousel-slide-image" />
          </div>
        </div>

        <div class="jsb-carousel-indicators" aria-label="Carousel indicators">
          <button
            v-for="(slide, index) in heroSlides"
            :key="`${slide.src}-indicator`"
            type="button"
            class="jsb-carousel-indicator"
            :class="{ active: index === activeSlideIndex }"
            :aria-label="`Show image ${index + 1}`"
            @click="goToSlide(index)"
          ></button>
        </div>

        <button
          type="button"
          class="jsb-scroll-cue"
          aria-label="Scroll down"
          @click="scrollToIntro"
        >
          <span class="jsb-scroll-cue-ring"></span>
          <span class="jsb-scroll-cue-arrow">↓</span>
        </button>
      </div>
    </section>

    <section class="intro-section">
      <div
        class="home-parallax-layer home-parallax-orb home-parallax-orb-a"
        data-speed="0.1"
        data-direction="1"
      ></div>
      <div
        class="home-parallax-layer home-parallax-orb home-parallax-orb-b"
        data-speed="0.16"
        data-direction="-1"
      ></div>
      <div class="home-shell">
        <article class="intro-card">
          <div class="intro-accent"></div>
          <h1>JSB – Climate &amp; Food Systems Support for Sri Lankans</h1>
          <p class="intro-description">
            Japanese Supplementary Budget (JSB) projects in Sri Lanka are financed by
            the Government of Japan as part of its global commitment to assist
            countries confronting acute humanitarian, economic, environmental, and
            climate-related challenges. In Sri Lanka, JSB support has played a pivotal
            role in responding to the recent multi-dimensional economic crisis,
            supporting vulnerable communities with food security, livelihoods, energy
            access, and wider socio-economic resilience.
          </p>
        </article>
      </div>
    </section>

    <section class="count-section" aria-labelledby="impact-heading">
      <div class="home-shell">
        <div class="section-heading">
          <p id="impact-heading" class="intro-eyebrow">JSB Impact at a Glance</p>
        </div>

        <div class="count-grid">
          <article v-for="item in animatedImpactCounts" :key="item.label" class="count-card">
            <span class="count-number">{{ item.displayValue }}</span>
            <span class="count-label">{{ item.label }}</span>
          </article>
        </div>
      </div>
    </section>

    <section class="home-map-section" aria-label="Climate Promise 1 map and filters">
      <div class="home-shell">
        <div class="home-map-panel">
          <CP1Filters
            :districts="districts"
            :sub-categories="subCategories"
            v-model:selectedDistricts="selectedDistricts"
            v-model:selectedSubCategory="selectedSubCategory"
            v-model:showBeneficiaries="showBeneficiaries"
            v-model:showBoundaries="showBoundaries"
          />

          <CP1StatsCharts
            :districts="districts"
            :sub-categories="subCategories"
            :selected-districts="selectedDistricts"
            :selected-sub-category="selectedSubCategory"
            :stats-for="statsFor"
            :current-stats="currentStats"
            :show-beneficiaries="showBeneficiaries"
            :show-boundaries="showBoundaries"
          />
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import CP1Filters from "../Projects/CP1/CP1Filters.vue";
import CP1StatsCharts from "../Projects/CP1/CP1StatsCharts.vue";
import { useCP1Data } from "../Projects/CP1/useCP1Data";

const heroSlides = [
  {
    src: "/images/JSB4/1.png",
    alt: "JSB supported rural energy and climate action",
    title: "Powering Rural Sri Lanka for a Just Net-Zero Future",
    href: "/climate/project/1"
  },
  {
    src: "/images/JSB4/2.png",
    alt: "Women farmers driving climate-resilient agriculture",
    title:
      "Empowering Women Farmers to Drive Sri Lanka's Climate-Resilient, Net-Zero Agriculture Future.",
    href: "/climate/project/2"
  },
  {
    src: "/images/JSB4/3.png",
    alt: "Greening dairy systems for a nature-positive future",
    title: "Greening Dairy for a Net-Zero, Nature-Positive Future.",
    href: "/climate/project/3"
  }
];

const impactCounts = [
  { value: 1200, label: "Beneficiaries reached" },
  { value: 8, label: "Districts covered" },
  { value: 65, label: "Women-led businesses" },
  { value: 40, label: "Youth enterprises" }
];

const displayedImpactValues = ref(impactCounts.map(() => 0));
const animatedImpactCounts = computed(() =>
  impactCounts.map((item, index) => ({
    ...item,
    displayValue: displayedImpactValues.value[index].toLocaleString()
  }))
);

const {
  districts,
  subCategories,
  selectedDistricts,
  selectedSubCategory,
  showBeneficiaries,
  showBoundaries,
  statsFor,
  currentStats
} = useCP1Data();

const activeSlideIndex = ref(0);
let autoplayTimer: ReturnType<typeof setInterval> | undefined;
let impactObserver: IntersectionObserver | undefined;
let impactAnimationFrame: number | undefined;
let hasAnimatedImpactCounts = false;
let parallaxScrollCleanup: (() => void) | undefined;

const carouselTrackStyle = computed(() => ({
  transform: `translateX(-${activeSlideIndex.value * 100}%)`
}));

const showNextSlide = () => {
  activeSlideIndex.value = (activeSlideIndex.value + 1) % heroSlides.length;
};

const showPreviousSlide = () => {
  activeSlideIndex.value =
    (activeSlideIndex.value - 1 + heroSlides.length) % heroSlides.length;
};

const goToSlide = (index: number) => {
  activeSlideIndex.value = index;
};

const scrollToIntro = () => {
  const introSection = document.querySelector(".intro-section");
  introSection?.scrollIntoView({ behavior: "smooth", block: "start" });
};

const animateImpactCounts = () => {
  if (hasAnimatedImpactCounts) return;
  hasAnimatedImpactCounts = true;

  const duration = 1400;
  const startTime = performance.now();

  const step = (now: number) => {
    const progress = Math.min((now - startTime) / duration, 1);
    const easedProgress = 1 - Math.pow(1 - progress, 3);

    displayedImpactValues.value = impactCounts.map((item) =>
      Math.round(item.value * easedProgress)
    );

    if (progress < 1) {
      impactAnimationFrame = requestAnimationFrame(step);
      return;
    }

    displayedImpactValues.value = impactCounts.map((item) => item.value);
  };

  impactAnimationFrame = requestAnimationFrame(step);
};

const initHomeParallax = () => {
  const layers = Array.from(
    document.querySelectorAll<HTMLElement>(".home-parallax-layer")
  );
  if (!layers.length) return;

  const onScroll = () => {
    const scrollY = window.scrollY;
    layers.forEach((layer) => {
      const speed = Number(layer.dataset.speed || "0.12");
      const direction = Number(layer.dataset.direction || "1");
      layer.style.transform = `translate3d(0, ${scrollY * speed * direction}px, 0)`;
    });
  };

  document.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  return () => document.removeEventListener("scroll", onScroll);
};

onMounted(() => {
  autoplayTimer = setInterval(showNextSlide, 5200);
  parallaxScrollCleanup = initHomeParallax();

  const impactSection = document.querySelector(".count-section");
  if (!impactSection) return;

  impactObserver = new IntersectionObserver(
    ([entry]) => {
      if (!entry?.isIntersecting) return;
      animateImpactCounts();
      impactObserver?.disconnect();
      impactObserver = undefined;
    },
    {
      threshold: 0.3
    }
  );

  impactObserver.observe(impactSection);
});

onBeforeUnmount(() => {
  if (autoplayTimer) {
    clearInterval(autoplayTimer);
  }

  if (impactObserver) {
    impactObserver.disconnect();
  }

  if (impactAnimationFrame) {
    cancelAnimationFrame(impactAnimationFrame);
  }

  parallaxScrollCleanup?.();
});
</script>

<style scoped>
.home-page {
  --undp-blue: #006eb6;
  --undp-blue-dark: #003b73;
  --undp-blue-soft: #eef8ff;
  --undp-text: #e6f2ff;
  --undp-muted: #adc6de;
  --undp-border: rgba(189, 220, 247, 0.22);
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  background:
    radial-gradient(circle at top left, rgba(82, 162, 219, 0.22), transparent 24%),
    radial-gradient(circle at 85% 18%, rgba(62, 126, 186, 0.2), transparent 20%),
    linear-gradient(180deg, #031a33 0%, #08345c 22%, #0d4d82 52%, #123f67 100%);
  color: var(--undp-text);
}

.home-shell {
  position: relative;
  z-index: 1;
  width: min(1600px, calc(100vw - 20px));
  margin: 0 auto;
}

.jsb-hero-carousel {
  position: relative;
  z-index: 1;
  background: transparent;
}

.jsb-carousel-frame {
  position: relative;
  width: 100%;
  height: 100vh;
  min-height: 680px;
  overflow: hidden;
  background: linear-gradient(180deg, rgba(1, 12, 26, 0.96) 0%, rgba(3, 18, 36, 0.94) 100%);
}

.jsb-carousel-frame::after {
  content: "";
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  background:
    linear-gradient(90deg, rgba(1, 12, 26, 0.76) 0%, rgba(1, 12, 26, 0.42) 32%, rgba(1, 12, 26, 0.1) 62%, rgba(1, 12, 26, 0.2) 100%),
    linear-gradient(180deg, rgba(1, 12, 26, 0.12), rgba(1, 12, 26, 0.34));
}

.jsb-carousel-track {
  display: flex;
  width: 100%;
  height: 100%;
  transition: transform 0.65s ease;
}

.jsb-carousel-slide {
  position: relative;
  min-width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.jsb-carousel-slide-overlay {
  position: absolute;
  inset: 0;
  z-index: 1;
  background: rgba(1, 12, 26, 0.18);
}

.jsb-carousel-slide-copy {
  position: absolute;
  z-index: 2;
  left: clamp(24px, 5vw, 72px);
  bottom: clamp(56px, 9vw, 110px);
  max-width: min(980px, 72vw);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 18px;
}

.jsb-carousel-slide-title {
  position: relative;
  margin: 0;
  max-width: 100%;
  overflow: hidden;
}

.jsb-carousel-slide-frame {
  position: absolute;
  left: -26px;
  top: -18px;
  width: 188px;
  height: 164px;
  border: 7px solid rgba(230, 242, 255, 0.88);
  clip-path: polygon(0 0, 64% 0, 38% 100%, 0 100%);
  opacity: 0;
  transform: translateX(-34px);
}

.jsb-carousel-slide.active .jsb-carousel-slide-frame {
  animation: heroFrameIn 0.9s cubic-bezier(0.22, 1, 0.36, 1) 0.08s both;
}

.jsb-carousel-slide-title-text {
  display: block;
  max-width: 100%;
  color: #f4fbff;
  font-size: clamp(1.48rem, 2.2vw, 2.75rem);
  line-height: 1.12;
  letter-spacing: -0.05em;
  text-wrap: pretty;
  text-shadow: 0 14px 40px rgba(0, 8, 20, 0.42);
  opacity: 0;
  transform: translateY(-26px);
}

.jsb-carousel-slide.active .jsb-carousel-slide-title-text {
  animation: heroTitleIn 0.95s cubic-bezier(0.22, 1, 0.36, 1) 0.22s both;
}

.jsb-carousel-cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 138px;
  height: 48px;
  padding: 0 22px;
  border: 1px solid rgba(180, 217, 247, 0.22);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  color: #ffffff;
  font-size: 0.92rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  text-decoration: none;
  box-shadow: 0 16px 34px rgba(0, 10, 24, 0.24);
  backdrop-filter: blur(16px) saturate(140%);
  -webkit-backdrop-filter: blur(16px) saturate(140%);
  opacity: 0;
  transform: translateY(24px);
  transition: background 0.2s ease, border-color 0.2s ease;
}

.jsb-carousel-slide.active .jsb-carousel-cta {
  animation: heroButtonIn 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.46s both;
}

.jsb-carousel-cta:hover {
  transform: translateY(-2px);
  background: rgba(255, 255, 255, 0.14);
  border-color: rgba(205, 233, 255, 0.3);
}

.jsb-carousel-slide-bg {
  position: absolute;
  inset: 0;
  background-image: var(--slide-image);
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  transform: scale(1.04);
  filter: blur(18px);
  opacity: 0.22;
}

.jsb-carousel-slide-media {
  position: absolute;
  inset: 0;
  z-index: 0;
  background-image: var(--slide-image);
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
}

.jsb-carousel-slide-image {
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
  pointer-events: none;
}

@keyframes heroFrameIn {
  0% {
    opacity: 0;
    transform: translateX(-34px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes heroTitleIn {
  0% {
    opacity: 0;
    transform: translateY(-26px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes heroButtonIn {
  0% {
    opacity: 0;
    transform: translateY(24px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.jsb-carousel-indicators {
  position: absolute;
  z-index: 2;
  left: 50%;
  bottom: 58px;
  display: flex;
  gap: 8px;
  padding: 8px 10px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.16);
  transform: translateX(-50%);
  border: 1px solid rgba(255, 255, 255, 0.24);
  backdrop-filter: blur(18px) saturate(150%);
  -webkit-backdrop-filter: blur(18px) saturate(150%);
}

.jsb-carousel-indicator {
  width: 8px;
  height: 8px;
  padding: 0;
  border: 0;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.4);
  cursor: pointer;
  transition: width 0.18s ease, background 0.18s ease;
}

.jsb-carousel-indicator.active {
  width: 28px;
  background: rgba(255, 255, 255, 0.95);
}

.jsb-scroll-cue {
  position: absolute;
  right: 24px;
  bottom: 18px;
  z-index: 2;
  width: 42px;
  height: 42px;
  padding: 0;
  border: 0;
  border-radius: 999px;
  background: transparent;
  color: #ffffff;
  cursor: pointer;
}

.jsb-scroll-cue-ring {
  position: absolute;
  inset: 0;
  border: 1px solid rgba(214, 235, 255, 0.34);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(14px) saturate(140%);
  -webkit-backdrop-filter: blur(14px) saturate(140%);
  animation: heroScrollSpin 3.6s linear infinite;
}

.jsb-scroll-cue-arrow {
  position: relative;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  font-size: 1.1rem;
  line-height: 1;
  animation: heroScrollBounce 1.8s ease-in-out infinite;
}

@keyframes heroScrollSpin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes heroScrollBounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(4px);
  }
}

.intro-section {
  position: relative;
  padding: 54px 0 36px;
  overflow: hidden;
  background: transparent;
}

.intro-card {
  position: relative;
  z-index: 1;
  max-width: 100%;
  padding: clamp(28px, 3vw, 42px);
  border: 1px solid rgba(196, 224, 248, 0.14);
  border-radius: 30px;
  background: linear-gradient(135deg, rgba(15, 55, 94, 0.52), rgba(8, 33, 61, 0.3));
  box-shadow: 0 26px 70px rgba(0, 13, 28, 0.3);
  backdrop-filter: blur(18px) saturate(150%);
  -webkit-backdrop-filter: blur(18px) saturate(150%);
  text-align: left;
}

.intro-eyebrow {
  margin: 0 0 10px;
  color: #8fd4ff;
  font-size: 0.74rem;
  font-weight: 800;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.intro-accent {
  width: 84px;
  height: 3px;
  margin: 0 0 18px;
  border-radius: 999px;
  background: linear-gradient(90deg, rgba(143, 212, 255, 0.02), #69c7ff, rgba(143, 212, 255, 0.02));
}

.intro-card h1 {
  max-width: 1120px;
  margin: 0;
  color: #f5fbff;
  font-size: clamp(1.75rem, 3.2vw, 3rem);
  line-height: 1.04;
  letter-spacing: -0.06em;
}

.intro-description {
  max-width: 1120px;
  margin: 18px 0 0;
  color: rgba(229, 241, 252, 0.86);
  font-size: 1.02rem;
  line-height: 1.8;
}

.count-section {
  position: relative;
  padding: 24px 0 64px;
}

.home-map-section {
  position: relative;
  padding: 0 0 64px;
}

.home-map-panel {
  padding: 0;
  border: 0;
  border-radius: 0;
  background: transparent;
  box-shadow: none;
}

.home-map-panel :deep(.container) {
  width: 100%;
  max-width: none;
  padding-left: 0;
  padding-right: 0;
}

.home-map-panel :deep(.cp-filters) {
  padding-top: 0;
}

.home-map-panel :deep(.cp-filters-bar),
.home-map-panel :deep(.cp-stat-card),
.home-map-panel :deep(.cp-chart-card),
.home-map-panel :deep(.cp-map-card) {
  border: 1px solid rgba(201, 225, 245, 0.14);
  background: linear-gradient(180deg, rgba(13, 50, 87, 0.42) 0%, rgba(9, 35, 62, 0.28) 100%);
  box-shadow: 0 16px 34px rgba(0, 10, 24, 0.24);
  backdrop-filter: blur(16px) saturate(135%);
  -webkit-backdrop-filter: blur(16px) saturate(135%);
}

.home-map-panel :deep(.cp-filter-title),
.home-map-panel :deep(.cp-stat-label),
.home-map-panel :deep(.cp-chart-header h3),
.home-map-panel :deep(.cp-map-header h3) {
  color: #e6f2ff;
}

.home-map-panel :deep(.cp-filter-sub),
.home-map-panel :deep(.cp-stat-footnote),
.home-map-panel :deep(.cp-chart-header p),
.home-map-panel :deep(.cp-map-header p),
.home-map-panel :deep(.cp-map-footnote) {
  color: #adc6de;
}

.home-map-panel :deep(.cp-filter-divider) {
  background: rgba(201, 225, 245, 0.18);
}

.home-map-panel :deep(.cp-stat-value),
.home-map-panel :deep(.cp-stat-value-large) {
  color: #dff3ff;
}

.home-map-panel :deep(.cp-stat-card-primary) {
  background: linear-gradient(180deg, rgba(18, 79, 133, 0.56) 0%, rgba(10, 47, 82, 0.44) 100%);
}

.home-map-panel :deep(.cp-stat-chip) {
  border: 1px solid rgba(201, 225, 245, 0.14);
  background: rgba(255, 255, 255, 0.08);
  color: #dff3ff;
}

.home-map-panel :deep(.chip),
.home-map-panel :deep(.cp-chip-toggle),
.home-map-panel :deep(.cp-chip-compact) {
  border: 1px solid rgba(201, 225, 245, 0.16);
  background: rgba(255, 255, 255, 0.06);
  color: #d9edff;
}

.home-map-panel :deep(.chip:hover) {
  background: rgba(255, 255, 255, 0.1);
}

.home-map-panel :deep(.chip.active),
.home-map-panel :deep(.cp-chip-toggle.active),
.home-map-panel :deep(.cp-chip-compact.active) {
  border-color: rgba(132, 205, 255, 0.48);
  background: linear-gradient(180deg, rgba(69, 151, 214, 0.42) 0%, rgba(30, 95, 148, 0.4) 100%);
  color: #ffffff;
}

.home-map-panel :deep(.cp-stat-icon) {
  color: #8fd4ff;
}

.home-map-panel :deep(.cp-progress-container) {
  background: rgba(201, 225, 245, 0.12);
}

.home-map-panel :deep(.cp-progress-bar) {
  background: linear-gradient(90deg, #69c7ff, #2b93e0);
}

.home-map-panel :deep(.cp-map) {
  box-shadow: inset 0 0 0 1px rgba(201, 225, 245, 0.08);
}

.home-map-panel :deep(.cp-chart-container) {
  border-radius: 14px;
}

.home-map-panel :deep(.cp-main) {
  padding-top: 0.35rem;
}

.home-map-panel :deep(.cp-map-card) {
  border: 1px solid rgba(201, 225, 245, 0.14);
}

.home-page-frost {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.03), rgba(194, 223, 248, 0.05) 18%, rgba(255, 255, 255, 0.02) 48%, rgba(194, 223, 248, 0.06) 100%);
  backdrop-filter: blur(4px) saturate(108%);
  -webkit-backdrop-filter: blur(4px) saturate(108%);
}

.home-page-glow {
  position: absolute;
  z-index: 0;
  border-radius: 999px;
  pointer-events: none;
  filter: blur(22px);
  opacity: 0.72;
}

.home-page-glow-a {
  top: 10%;
  left: -120px;
  width: 460px;
  height: 460px;
  background: radial-gradient(circle, rgba(98, 177, 232, 0.2) 0%, rgba(98, 177, 232, 0.06) 58%, transparent 78%);
}

.home-page-glow-b {
  top: 48%;
  right: -140px;
  width: 520px;
  height: 520px;
  background: radial-gradient(circle, rgba(152, 211, 255, 0.12) 0%, rgba(79, 146, 204, 0.06) 52%, transparent 78%);
}

.home-parallax-layer {
  position: absolute;
  inset: auto;
  pointer-events: none;
  will-change: transform;
}

.home-parallax-orb {
  border-radius: 999px;
  filter: blur(8px);
  opacity: 0.65;
}

.home-parallax-orb-a {
  top: 24px;
  right: -70px;
  width: 320px;
  height: 320px;
  background: radial-gradient(circle, rgba(145, 214, 255, 0.42) 0%, rgba(145, 214, 255, 0.08) 58%, transparent 75%);
}

.home-parallax-orb-a[data-speed] {
  transform: translate3d(0, 0, 0);
}

.home-parallax-orb-b {
  bottom: -110px;
  left: -50px;
  width: 260px;
  height: 260px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.04) 60%, transparent 78%);
}

.section-heading {
  margin-bottom: 18px;
  text-align: center;
}

.count-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 18px;
}

.count-card {
  position: relative;
  min-height: 136px;
  padding: 26px 22px 22px;
  border: 1px solid rgba(201, 225, 245, 0.14);
  border-radius: 18px;
  background: linear-gradient(180deg, rgba(13, 50, 87, 0.42) 0%, rgba(9, 35, 62, 0.28) 100%);
  text-align: center;
  box-shadow: 0 16px 34px rgba(0, 10, 24, 0.24);
  backdrop-filter: blur(16px) saturate(135%);
  -webkit-backdrop-filter: blur(16px) saturate(135%);
}

.count-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 50%;
  width: 56px;
  height: 3px;
  border-radius: 999px;
  background: var(--undp-blue);
  transform: translateX(-50%);
}

.count-number {
  display: block;
  color: #dff3ff;
  font-size: clamp(2rem, 3vw, 2.6rem);
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.04em;
}

.count-label {
  display: block;
  margin-top: 14px;
  color: #b8d0e5;
  font-size: 0.9rem;
  font-weight: 700;
  line-height: 1.4;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

@media (max-width: 900px) {
  .home-shell {
    width: min(100% - 20px, 1600px);
  }

  .jsb-carousel-frame {
    min-height: 560px;
  }

  .jsb-carousel-slide-copy {
    max-width: min(860px, 78vw);
    bottom: 86px;
  }

  .count-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .home-page-glow-a {
    width: 320px;
    height: 320px;
    left: -90px;
  }

  .home-page-glow-b {
    width: 360px;
    height: 360px;
    right: -100px;
  }

}

@media (max-width: 640px) {
  .jsb-carousel-frame {
    min-height: 460px;
  }

  .jsb-carousel-slide-copy {
    left: 18px;
    right: 18px;
    bottom: 78px;
    max-width: none;
    gap: 14px;
  }

  .jsb-carousel-slide-frame {
    left: -10px;
    top: -10px;
    width: 126px;
    height: 116px;
    border-width: 5px;
  }

  .jsb-carousel-slide-title-text {
    font-size: clamp(1.18rem, 4.4vw, 1.75rem);
  }

  .jsb-carousel-slide-image {
    padding: 0;
  }

  .intro-section {
    padding: 34px 0 24px;
  }

  .intro-card {
    padding: 22px 18px;
    border-radius: 22px;
  }

  .count-grid {
    grid-template-columns: 1fr;
  }

  .home-map-section {
    padding-bottom: 52px;
  }

  .home-page-glow-a {
    width: 220px;
    height: 220px;
    left: -80px;
  }

  .home-page-glow-b {
    width: 240px;
    height: 240px;
    right: -90px;
  }

  .home-parallax-orb-a {
    width: 220px;
    height: 220px;
    right: -80px;
  }

  .home-parallax-orb-b {
    width: 180px;
    height: 180px;
    left: -60px;
  }
}
</style>
