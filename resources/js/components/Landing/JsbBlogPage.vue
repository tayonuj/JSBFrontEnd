<template>
  <PublicShell>
    <div class="jsb-gallery-page">
    <!-- HERO VIDEO (no card) -->
    <section class="jsb-gallery-hero">
      <div class="jsb-gallery-hero__inner">
        <div class="hero-video-copy">
          <div class="hero-eyebrow">Success Stories • JSB Sri Lanka</div>
          <h1>From Small Coops to Big Dreams</h1>
          <p>
            Explore real journeys of JSB-supported poultry micro-entrepreneurs,
            read their full stories as PDFs, and watch the videos that bring
            their livelihoods to life.
          </p>

          <div class="hero-pill-row">
            <span class="hero-pill">
              <span class="pill-icon">📖</span> Stories as mini blog posts
            </span>
            <span class="hero-pill">
              <span class="pill-icon">📄</span> In-app PDF reader
            </span>
            <span class="hero-pill">
              <span class="pill-icon">🎥</span> Embedded video stories
            </span>
          </div>
        </div>

        <div class="hero-video-frame">
          <iframe
              :src="heroVideoAutoplayUrl"
              title="JSB Video Story"
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
          ></iframe>
        </div>
      </div>
    </section>

    <!-- FEATURED CAROUSEL (full-width row) -->
    <section class="jsb-gallery-featured">
      <div class="jsb-gallery-featured__shell">

        <div v-if="featuredStories.length" class="jsb-gallery-carousel">
          <div class="jsb-gallery-carousel__content">
            <div class="jsb-gallery-carousel__track">
              <article
                  class="jsb-gallery-carousel__slide"
                  v-for="(story, index) in featuredStories"
                  :key="story.id"
                  :class="{ active: index === activeSlideIndex }"
                  :style="carouselSlideStyle(story)"
              >
                <div class="jsb-gallery-carousel__image-overlay"></div>
                <div class="jsb-gallery-carousel__image-copy">
                  <div class="slide-header">
                    <h3 class="slide-title">{{ story.title }}</h3>
                  </div>
                  <p class="slide-summary">
                    {{ story.shortSummary }}
                  </p>

                  <div class="slide-footer">
                    <button
                        class="btn btn-primary"
                        @click="openStory(story, 'overview')"
                    >
                      Read more
                    </button>
                    <button
                        v-if="story.pdfUrl"
                        class="btn btn-ghost btn-ghost-light"
                        @click="openStory(story, 'pdf')"
                    >
                      View PDF
                    </button>
                    <button
                        v-if="story.videoUrl"
                        class="btn btn-ghost btn-ghost-light"
                        @click="openStory(story, 'video')"
                    >
                      Watch video
                    </button>
                  </div>
                </div>
              </article>
            </div>

            <!-- Carousel controls -->
            <div class="jsb-gallery-carousel__controls">
              <button class="circle-btn" @click="prevSlide">
                ‹
              </button>
              <div class="jsb-gallery-carousel__dots">
                <button
                    v-for="(story, index) in featuredStories"
                    :key="story.id"
                    class="jsb-gallery-carousel__dot"
                    :class="{ active: index === activeSlideIndex }"
                    @click="goToSlide(index)"
                ></button>
              </div>
              <button class="circle-btn" @click="nextSlide">
                ›
              </button>
            </div>
          </div>
        </div>

        <p v-else class="empty-text">No featured stories available.</p>
      </div>
    </section>

    <!-- FILTERS + GRID -->
    <section class="jsb-gallery-grid">
      <div class="jsb-gallery-toolbar">
        <div class="jsb-gallery-toolbar__left">
          <h2>All Success Stories</h2>
        </div>

        <div class="jsb-gallery-toolbar__right">
          <div class="jsb-gallery-toolbar__group">
            <label>District</label>
            <select v-model="selectedDistrict">
              <option value="all">All districts</option>
              <option
                  v-for="district in distinctDistricts"
                  :key="district"
                  :value="district"
              >
                {{ district }}
              </option>
            </select>
          </div>

          <div class="jsb-gallery-toolbar__group">
            <label>Search</label>
            <input
                v-model="searchQuery"
                type="text"
                placeholder="Search by title, district, or keywords..."
            />
          </div>
        </div>
      </div>

      <div class="jsb-gallery-story-grid">
        <article
            v-for="story in filteredStories"
            :key="story.id"
            class="jsb-gallery-story-card"
        >
          <div class="story-thumb" v-if="story.thumbnailUrl">
            <img :src="story.thumbnailUrl" :alt="story.title" />
          </div>

          <div class="story-body">
            <div class="story-meta-top">
              <span class="meta-district">📍 {{ story.district }}</span>
              <span v-if="story.isFeatured" class="meta-featured">
                ★ Featured
              </span>
            </div>

            <h3 class="story-title">
              {{ story.title }}
            </h3>

            <p class="story-snippet">
              {{ story.shortSummary }}
            </p>

            <div class="story-tags">
              <span
                  v-for="tag in story.tags"
                  :key="tag"
                  class="tag-pill"
              >
                #{{ tag }}
              </span>
            </div>
          </div>

          <div class="story-footer">
            <button
                class="btn btn-primary"
                @click="openStory(story, 'overview')"
            >
              Read Story
            </button>
            <button
                v-if="story.pdfUrl"
                class="btn btn-ghost"
                @click="openStory(story, 'pdf')"
            >
              PDF
            </button>
            <button
                v-if="story.videoUrl"
                class="btn btn-ghost"
                @click="openStory(story, 'video')"
            >
              Video
            </button>
          </div>
        </article>

        <p v-if="!filteredStories.length" class="empty-text">
          No stories match your filters yet.
        </p>
      </div>
    </section>

    <!-- MODAL: STORY DETAIL + PDF + VIDEO -->
    <transition name="fade">
      <div
          v-if="activeStory"
          class="modal-backdrop"
          @click.self="closeStory"
      >
        <div class="modal-dialog">
          <header class="modal-header">
            <div>
              <span class="modal-district">📍 {{ activeStory.district }}</span>
              <h2>{{ activeStory.title }}</h2>
            </div>
            <button class="icon-btn" @click="closeStory">✕</button>
          </header>

          <!-- Tabs -->
          <div class="modal-tabs">
            <button
                class="tab-btn"
                :class="{ active: activeTab === 'overview' }"
                @click="activeTab = 'overview'"
            >
              Overview
            </button>
            <button
                v-if="activeStory.pdfUrl"
                class="tab-btn"
                :class="{ active: activeTab === 'pdf' }"
                @click="activeTab = 'pdf'"
            >
              PDF Story
            </button>
            <button
                v-if="activeStory.videoUrl"
                class="tab-btn"
                :class="{ active: activeTab === 'video' }"
                @click="activeTab = 'video'"
            >
              Video
            </button>
          </div>

          <!-- TAB PANELS -->
          <div class="modal-body">
            <!-- Overview -->
            <div v-if="activeTab === 'overview'" class="tab-panel">
              <p class="overview-text">
                {{ activeStory.longSummary || activeStory.shortSummary }}
              </p>

              <ul class="overview-meta-list">
                <li><strong>District:</strong> {{ activeStory.district }}</li>
                <li v-if="activeStory.beneficiaryName">
                  <strong>Beneficiary:</strong> {{ activeStory.beneficiaryName }}
                </li>
                <li v-if="activeStory.projectType">
                  <strong>Project Type:</strong> {{ activeStory.projectType }}
                </li>
              </ul>

              <div
                  v-if="activeStory.tags && activeStory.tags.length"
                  class="overview-tags"
              >
                <span
                    v-for="tag in activeStory.tags"
                    :key="tag"
                    class="tag-pill"
                >
                  #{{ tag }}
                </span>
              </div>
            </div>

            <!-- PDF -->
            <div v-if="activeTab === 'pdf'" class="tab-panel pdf-panel">
              <div v-if="activeStory.pdfUrl" class="pdf-wrapper">
                <!-- Native browser PDF viewer (no Google Docs) -->
                <iframe
                    :src="pdfViewerSrc(activeStory.pdfUrl)"
                    class="pdf-frame"
                    title="Story PDF"
                ></iframe>
              </div>
              <p class="pdf-helper">
                If the PDF does not load, you can
                <a :href="activeStory.pdfUrl" target="_blank" rel="noopener">
                  open it in a new tab
                </a>.
              </p>
            </div>

            <!-- VIDEO -->
            <div v-if="activeTab === 'video'" class="tab-panel video-panel">
              <div v-if="activeStory.videoUrl" class="modal-video-frame">
                <iframe
                    :src="activeStory.videoUrl"
                    title="Story Video"
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen
                ></iframe>
              </div>
            </div>
          </div>

          <footer class="modal-footer">
            <button class="btn btn-ghost" @click="closeStory">Close</button>
            <a
                v-if="activeStory.pdfUrl"
                :href="activeStory.pdfUrl"
                target="_blank"
                rel="noopener"
                class="btn btn-secondary"
            >
              Download PDF
            </a>
          </footer>
        </div>
      </div>
    </transition>
    </div>
  </PublicShell>
</template>

<script setup>
import { computed, ref, onMounted, onBeforeUnmount } from "vue";
import PublicShell from "./PublicShell.vue";
import { getJsbStories } from "../../data/jsbStories";

const stories = ref(getJsbStories());

/**
 * Hero video = first story that has a YouTube URL (UNDP – Jayaseel)
 */
const mainVideoUrl = computed(() => {
  const videoStory = stories.value.find((s) => !!s.videoUrl);
  return videoStory ? videoStory.videoUrl : "https://www.youtube.com/embed/wtvuqYOy7uc";
});

const heroVideoAutoplayUrl = computed(() => {
  const base = mainVideoUrl.value || "";
  if (!base) return "";

  // If your embed URL already has ?, append with & — otherwise start with ?
  const hasQuery = base.includes("?");
  return (
      base +
      (hasQuery ? "&" : "?") +
      "autoplay=1&mute=1&playsinline=1&rel=0"
  );
});


// Filters
const selectedDistrict = ref("all");
const searchQuery = ref("");

// Carousel state
const activeSlideIndex = ref(0);
let autoScrollTimer = null;

const featuredStories = computed(() =>
    stories.value.filter((s) => s.isFeatured)
);

const distinctDistricts = computed(() => {
  const set = new Set(stories.value.map((s) => s.district));
  return Array.from(set).sort();
});

const filteredStories = computed(() => {
  let list = [...stories.value];

  if (selectedDistrict.value !== "all") {
    list = list.filter((s) => s.district === selectedDistrict.value);
  }

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase();
    list = list.filter((s) => {
      return (
          s.title.toLowerCase().includes(q) ||
          s.district.toLowerCase().includes(q) ||
          (s.programme || "").toLowerCase().includes(q) ||
          (s.tags || []).some((t) => t.toLowerCase().includes(q))
      );
    });
  }

  return list;
});

const carouselSlideStyle = (story) => ({
  backgroundImage: `url('${story.thumbnailUrl || ""}')`,
});

// Carousel controls
const nextSlide = () => {
  if (!featuredStories.value.length) return;
  activeSlideIndex.value =
      (activeSlideIndex.value + 1) % featuredStories.value.length;
};

const prevSlide = () => {
  if (!featuredStories.value.length) return;
  activeSlideIndex.value =
      (activeSlideIndex.value - 1 + featuredStories.value.length) %
      featuredStories.value.length;
};

const goToSlide = (index) => {
  activeSlideIndex.value = index;
};

// Modal / active story
const activeStory = ref(null);
const activeTab = ref("overview");

const openStory = (story, tab = "overview") => {
  activeStory.value = story;
  activeTab.value = tab;
  document.body.classList.add("no-scroll");
};

const closeStory = () => {
  activeStory.value = null;
  document.body.classList.remove("no-scroll");
};

/**
 * PDF viewer:
 * Uses native browser PDF rendering by embedding the file directly.
 * For Drive files we converted the link to a raw file URL above.
 */
const pdfViewerSrc = (url) => {
  if (!url) return "";

  // If it's a Google Drive preview URL, just return as-is
  if (url.includes("drive.google.com/file/d/") && url.includes("/preview")) {
    return url;
  }

  // For normal PDFs on your own server / other hosts
  return `${url}#view=FitH&scrollbar=1&toolbar=1&navpanes=0`;
};


// Auto-scroll carousel
onMounted(() => {
  if (featuredStories.value.length > 1) {
    autoScrollTimer = setInterval(() => {
      nextSlide();
    }, 6000); // 6 seconds
  }
});

onBeforeUnmount(() => {
  if (autoScrollTimer) {
    clearInterval(autoScrollTimer);
    autoScrollTimer = null;
  }
});
</script>

<style scoped>
.jsb-gallery-page {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 0;
  background:
    radial-gradient(circle at top left, rgba(45, 116, 225, 0.08), transparent 26%),
    linear-gradient(180deg, #eef4fb 0%, #f5f8fc 100%);
  border-radius: 24px;
}

.section {
  width: 100%;
}

.jsb-gallery-hero,
.jsb-gallery-featured,
.jsb-gallery-grid {
  margin: 0;
}

.jsb-gallery-hero__inner,
.jsb-gallery-featured__shell,
.jsb-gallery-grid {
  padding: 1.5rem;
  border-radius: 24px;
  border: 1px solid rgba(16, 24, 40, 0.06);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(246, 249, 253, 0.98) 100%);
  box-shadow: 0 10px 32px rgba(16, 24, 40, 0.06);
}

.jsb-gallery-hero__inner {
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(320px, 0.95fr);
  gap: 1.5rem;
  background:
    radial-gradient(circle at top right, rgba(42, 123, 243, 0.14), transparent 28%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(246, 249, 253, 0.98) 100%);
}

.hero-video-copy {
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 0;
}

.hero-eyebrow {
  margin: 0 0 0.85rem;
  font-size: 0.82rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  font-weight: 700;
  color: #1c63d6;
}

.hero-video-copy h1 {
  margin: 0 0 1rem;
  color: #12233f;
  font-size: clamp(2rem, 4vw, 3.3rem);
  line-height: 0.98;
  letter-spacing: -0.04em;
}

.hero-video-copy p {
  margin: 0;
  max-width: 42rem;
  color: #62708a;
  line-height: 1.75;
}

.hero-pill-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 1.35rem;
}

.hero-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 0.95rem;
  border-radius: 999px;
  background: linear-gradient(180deg, #fbfdff 0%, #f2f7fd 100%);
  border: 1px solid rgba(16, 24, 40, 0.08);
  color: #51607b;
  font-size: 0.88rem;
  font-weight: 600;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.95);
}

.pill-icon {
  font-size: 0.95rem;
}

.hero-video-frame,
.modal-video-frame,
.pdf-wrapper {
  overflow: hidden;
  border-radius: 20px;
  border: 1px solid rgba(16, 24, 40, 0.05);
  background: linear-gradient(180deg, #edf4fb 0%, #e5eef8 100%);
}

.hero-video-frame iframe,
.modal-video-frame iframe {
  display: block;
  width: 100%;
  min-height: 360px;
  border: 0;
}

.jsb-gallery-featured__shell {
  position: relative;
  overflow: hidden;
}

.jsb-gallery-carousel {
  position: relative;
  overflow: hidden;
  border-radius: 22px;
  min-height: 420px;
  border: 1px solid rgba(16, 24, 40, 0.06);
  background: #0f1f37;
}

.jsb-gallery-carousel__content {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  padding: 0;
}

.jsb-gallery-carousel__track {
  display: grid;
}

.jsb-gallery-carousel__slide {
  display: none;
  position: relative;
  min-height: 420px;
  padding: 2rem;
  align-items: end;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
}

.jsb-gallery-carousel__slide.active {
  display: grid;
}

.jsb-gallery-carousel__image-overlay {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(90deg, rgba(7, 18, 34, 0.88) 0%, rgba(7, 18, 34, 0.62) 46%, rgba(7, 18, 34, 0.28) 100%),
    linear-gradient(180deg, rgba(7, 18, 34, 0.12) 0%, rgba(7, 18, 34, 0.54) 100%);
}

.jsb-gallery-carousel__image-copy {
  position: relative;
  z-index: 1;
  width: min(100%, 42rem);
}

.jsb-gallery-carousel__slide.active .slide-header,
.jsb-gallery-carousel__slide.active .slide-summary,
.jsb-gallery-carousel__slide.active .slide-footer {
  animation: slideReveal 0.7s ease both;
}

.jsb-gallery-carousel__slide.active .slide-summary {
  animation-delay: 0.12s;
}

.jsb-gallery-carousel__slide.active .slide-footer {
  animation-delay: 0.2s;
}

.slide-header {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.slide-district-pill,
.meta-tag,
.meta-district,
.meta-featured,
.tag-pill,
.modal-district {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.45rem 0.8rem;
  border-radius: 999px;
  font-size: 0.82rem;
  font-weight: 600;
}

.slide-district-pill,
.meta-district,
.modal-district {
  background: rgba(255, 255, 255, 0.16);
  color: #ffffff;
  backdrop-filter: blur(10px);
}

.meta-featured {
  background: #fff2df;
  color: #f09a2d;
}

.meta-tag,
.tag-pill {
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.18);
  color: #ffffff;
  backdrop-filter: blur(8px);
}

.slide-title {
  margin: 0;
  color: #ffffff;
  font-size: clamp(1.65rem, 3vw, 2.4rem);
  line-height: 1.05;
  letter-spacing: -0.04em;
  text-shadow: 0 10px 28px rgba(0, 0, 0, 0.28);
}

.slide-summary {
  margin: 1rem 0 0;
  color: rgba(255, 255, 255, 0.88);
  line-height: 1.75;
  max-width: 46rem;
  text-shadow: 0 8px 20px rgba(0, 0, 0, 0.22);
}

.slide-meta,
.story-tags,
.overview-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  margin-top: 1rem;
}

.slide-footer,
.story-footer,
.modal-footer {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 0.95rem;
}

.jsb-gallery-carousel__controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0 1.5rem 1.5rem;
  margin-top: -5rem;
  position: relative;
  z-index: 2;
}

.circle-btn {
  width: 42px;
  height: 42px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.12);
  color: #ffffff;
  font-size: 1.3rem;
  line-height: 1;
  backdrop-filter: blur(10px);
}

.jsb-gallery-carousel__dots {
  display: flex;
  gap: 0.55rem;
}

.jsb-gallery-carousel__dot {
  width: 10px;
  height: 10px;
  padding: 0;
  border: 0;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.3);
}

.jsb-gallery-carousel__dot.active {
  width: 28px;
  background: linear-gradient(90deg, #ffffff, rgba(255, 255, 255, 0.58));
}

.jsb-gallery-toolbar {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.jsb-gallery-toolbar__left h2 {
  margin: 0;
  color: #12233f;
  font-size: clamp(1.6rem, 3vw, 2.2rem);
  letter-spacing: -0.04em;
}

.jsb-gallery-toolbar__right {
  display: grid;
  grid-template-columns: minmax(180px, 240px) minmax(260px, 360px);
  gap: 0.9rem;
}

.jsb-gallery-toolbar__group {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}

.jsb-gallery-toolbar__group label {
  font-size: 0.82rem;
  font-weight: 700;
  color: #51607b;
}

.jsb-gallery-toolbar__group select,
.jsb-gallery-toolbar__group input {
  min-height: 46px;
  padding: 0 0.95rem;
  border-radius: 14px;
  border: 1px solid rgba(16, 24, 40, 0.08);
  background: linear-gradient(180deg, #fbfdff 0%, #f2f7fd 100%);
  color: #223352;
  outline: none;
}

.jsb-gallery-toolbar__group input::placeholder {
  color: #7b879b;
}

.jsb-gallery-story-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
}

.jsb-gallery-story-card {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-radius: 22px;
  border: 1px solid rgba(16, 24, 40, 0.06);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(245, 248, 252, 0.98) 100%);
  box-shadow: 0 10px 32px rgba(16, 24, 40, 0.05);
}

.story-thumb {
  aspect-ratio: 16 / 10;
  overflow: hidden;
  background: linear-gradient(180deg, #edf4fb 0%, #e5eef8 100%);
}

.story-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.story-body {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  padding: 1.2rem 1.2rem 0.8rem;
  min-width: 0;
}

.story-meta-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.story-title {
  margin: 0;
  color: #12233f;
  font-size: 1.3rem;
  line-height: 1.2;
}

.story-snippet,
.overview-text,
.pdf-helper {
  margin: 0;
  color: #62708a;
  line-height: 1.7;
}

.story-footer {
  padding: 0 1.2rem 1.2rem;
  margin-top: auto;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 42px;
  padding: 0 1rem;
  border-radius: 999px;
  border: 1px solid rgba(16, 24, 40, 0.08);
  text-decoration: none;
  font-weight: 600;
  background: linear-gradient(180deg, #fbfdff 0%, #f2f7fd 100%);
  color: #51607b;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.95);
}

.btn-primary,
.btn-secondary {
  background: linear-gradient(135deg, #2c7ef3 0%, #1958c5 100%);
  color: #fff;
  border-color: transparent;
  box-shadow: 0 10px 20px rgba(37, 100, 214, 0.22);
}

.btn-ghost {
  background: linear-gradient(180deg, #fbfdff 0%, #f2f7fd 100%);
  color: #51607b;
}

.btn-ghost-light {
  background: rgba(255, 255, 255, 0.12);
  color: #ffffff;
  border-color: rgba(255, 255, 255, 0.18);
  box-shadow: none;
  backdrop-filter: blur(10px);
}

.empty-text {
  margin: 0;
  color: #62708a;
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: rgba(12, 22, 40, 0.42);
  backdrop-filter: blur(10px);
}

.modal-dialog {
  width: min(100%, 1080px);
  max-height: calc(100vh - 4rem);
  overflow: auto;
  border-radius: 24px;
  border: 1px solid rgba(16, 24, 40, 0.06);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.99) 0%, rgba(245, 248, 252, 0.99) 100%);
  box-shadow: 0 24px 64px rgba(16, 24, 40, 0.18);
}

.modal-header,
.modal-body,
.modal-footer {
  padding-inline: 1.5rem;
}

.modal-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  padding-top: 1.5rem;
}

.modal-header h2 {
  margin: 0.8rem 0 0;
  color: #12233f;
  font-size: 2rem;
  line-height: 1.1;
  letter-spacing: -0.04em;
}

.icon-btn {
  width: 40px;
  height: 40px;
  border-radius: 999px;
  border: 1px solid rgba(16, 24, 40, 0.08);
  background: linear-gradient(180deg, #fbfdff 0%, #f2f7fd 100%);
  color: #51607b;
}

.modal-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  padding: 1rem 1.5rem 0;
}

.tab-btn {
  min-height: 40px;
  padding: 0 0.95rem;
  border-radius: 999px;
  border: 1px solid rgba(16, 24, 40, 0.08);
  background: linear-gradient(180deg, #fbfdff 0%, #f2f7fd 100%);
  color: #51607b;
  font-weight: 600;
}

.tab-btn.active {
  background: linear-gradient(135deg, #2c7ef3 0%, #1958c5 100%);
  color: #fff;
  border-color: transparent;
}

.modal-body {
  padding-top: 1.25rem;
  padding-bottom: 1rem;
}

.overview-meta-list {
  margin: 1rem 0 0;
  padding-left: 1rem;
  color: #51607b;
  line-height: 1.8;
}

.pdf-frame {
  width: 100%;
  min-height: 70vh;
  border: 0;
}

.modal-footer {
  padding-bottom: 1.5rem;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@keyframes slideReveal {
  from {
    opacity: 0;
    transform: translateY(18px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 1180px) {
  .jsb-gallery-hero__inner,
  .jsb-gallery-toolbar,
  .jsb-gallery-toolbar__right,
  .jsb-gallery-story-grid {
    grid-template-columns: 1fr;
  }

  .jsb-gallery-hero__inner {
    display: grid;
  }

  .jsb-gallery-toolbar {
    align-items: stretch;
    flex-direction: column;
  }

  .jsb-gallery-toolbar__right {
    width: 100%;
  }

  .jsb-gallery-story-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 860px) {
  .jsb-gallery-hero__inner,
  .jsb-gallery-featured__shell,
  .jsb-gallery-grid,
  .modal-header,
  .modal-body,
  .modal-footer {
    padding: 1rem;
  }

  .jsb-gallery-hero__inner {
    grid-template-columns: 1fr;
  }

  .jsb-gallery-story-grid {
    grid-template-columns: 1fr;
  }

  .jsb-gallery-carousel__content {
    padding: 0;
  }

  .jsb-gallery-carousel__slide {
    min-height: 360px;
    padding: 1.25rem;
  }

  .jsb-gallery-carousel__image-copy {
    width: 100%;
  }

  .jsb-gallery-carousel__controls {
    margin-top: -4.5rem;
    padding: 0 1rem 1rem;
  }

  .modal-backdrop {
    padding: 1rem;
  }

  .modal-header h2 {
    font-size: 1.6rem;
  }
}
</style>
