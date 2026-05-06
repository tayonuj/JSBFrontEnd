<template>
  <PublicShell>
    <div class="jsb-gallery-page">
      <!-- HERO CAROUSEL -->
      <section class="jsb-gallery-hero-carousel">
        <div
          v-for="(slide, index) in heroSlides"
          :key="index"
          class="hero-slide"
          :class="{ active: currentHeroSlide === index }"
        >
          <div
            class="hero-slide-bg"
            :style="{ backgroundImage: `url('${slide.image}')` }"
          ></div>
          <div class="hero-slide-overlay"></div>
          <div class="hero-slide-content">
            <div class="hero-slide-inner">
              <p class="hero-eyebrow">Project Media • JSB Sri Lanka</p>
              <h1 class="animated-text">{{ slide.title }}</h1>
              <p class="animated-text delay-1">
                {{ slide.description }}
              </p>
            </div>
          </div>
        </div>

        <div class="hero-controls">
          <button
            v-for="(_, index) in heroSlides"
            :key="index"
            class="hero-dot"
            :class="{ active: currentHeroSlide === index }"
            @click="currentHeroSlide = index"
          ></button>
        </div>
      </section>

      <!-- MEDIA TYPE TABS -->
      <section class="jsb-gallery-tabs-section">
        <div class="jsb-gallery-tabs">
          <button
            class="jsb-media-tab"
            :class="{ active: selectedMediaType === 'all' }"
            @click="selectedMediaType = 'all'"
          >
            All Media
          </button>
          <button
            class="jsb-media-tab"
            :class="{ active: selectedMediaType === 'image' }"
            @click="selectedMediaType = 'image'"
          >
            <span class="tab-icon">🖼️</span> Images
          </button>
          <button
            class="jsb-media-tab"
            :class="{ active: selectedMediaType === 'story' }"
            @click="selectedMediaType = 'story'"
          >
            <span class="tab-icon">📄</span> Success Stories
          </button>
          <button
            class="jsb-media-tab"
            :class="{ active: selectedMediaType === 'video' }"
            @click="selectedMediaType = 'video'"
          >
            <span class="tab-icon">🎥</span> Videos
          </button>
        </div>
      </section>

      <!-- FILTERS + GRID -->
      <section class="jsb-gallery-grid">
        <div class="jsb-gallery-toolbar">
          <div class="jsb-gallery-toolbar__left">
            <h2>{{ activeMediaTypeLabel }}</h2>
            <p class="results-count">{{ filteredMedia.length }} items found</p>
          </div>

          <div class="jsb-gallery-toolbar__right">
            <div class="jsb-gallery-toolbar__group">
              <label>Project</label>
              <select v-model="selectedProject">
                <option value="all">All projects</option>
                <option
                  v-for="proj in distinctProjects"
                  :key="proj"
                  :value="proj"
                >
                  {{ proj }}
                </option>
              </select>
            </div>



            <div class="jsb-gallery-toolbar__group">
              <label>Search</label>
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search media..."
              />
            </div>
          </div>
        </div>

        <div class="jsb-gallery-story-grid">
          <article
            v-for="item in filteredMedia"
            :key="item.id"
            class="jsb-gallery-story-card"
            @click="openMedia(item)"
          >
            <div class="story-thumb">
              <img :src="item.thumbnailUrl" :alt="item.title" />
              <div v-if="item.type === 'video'" class="media-type-icon video-icon">🎥</div>
              <div v-else-if="item.type === 'image'" class="media-type-icon image-icon">🖼️</div>
              <div v-else-if="item.type === 'story'" class="media-type-icon story-icon">📄</div>
            </div>

            <div class="story-body">
              <div class="story-meta-top">
                <span class="meta-district">📍 {{ item.district }}</span>
                <span class="meta-project">{{ item.programme }}</span>
              </div>

              <h3 class="story-title" v-if="item.type !== 'image'">{{ item.title }}</h3>

              <p class="story-snippet" v-if="item.description">
                {{ item.description }}
              </p>
            </div>


          </article>

          <p v-if="!filteredMedia.length" class="empty-text">
            No media items match your filters yet.
          </p>
        </div>
      </section>

      <!-- GLOBAL MODAL -->
      <transition name="fade">
        <div v-if="activeItem" class="modal-backdrop" @click.self="closeMedia">
          
          <!-- Image Modal -->
          <div v-if="activeItem.type === 'image'" class="image-modal-content">
            <button class="close-float-btn" @click="closeMedia">✕</button>
            <img :src="activeItem.url" :alt="activeItem.title" class="full-image" />
          </div>

          <!-- Video Modal -->
          <div v-if="activeItem.type === 'video'" class="video-modal-content">
            <button class="close-float-btn" @click="closeMedia">✕</button>
            <iframe
              :src="activeItem.videoUrl"
              title="Story Video"
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            ></iframe>
          </div>

          <!-- PDF Story Modal -->
          <div v-if="activeItem.type === 'story'" class="modal-dialog">
            <header class="modal-header">
              <div>
                <span class="modal-district">📍 {{ activeItem.district }}</span>
                <h2>{{ activeItem.title }}</h2>
              </div>
              <button class="icon-btn" @click="closeMedia">✕</button>
            </header>

            <div class="modal-body">
              <div class="pdf-wrapper" style="height: 100%;">
                <iframe
                  v-if="activeItem.pdfUrl"
                  :src="activeItem.pdfUrl"
                  class="pdf-frame"
                  title="Story PDF"
                  style="width: 100%; height: 100%; border: none;"
                ></iframe>
              </div>
            </div>

            <footer class="modal-footer">
              <button class="btn btn-ghost" @click="closeMedia">Close</button>
              <a
                v-if="activeItem.pdfUrl"
                :href="activeItem.pdfUrl"
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

<script setup lang="ts">
import { computed, ref, onMounted, onBeforeUnmount } from "vue";
import PublicShell from "./PublicShell.vue";
import { getAllMedia, MediaType, MediaItem } from "../../data/jsbMediaGallery";

const heroSlides = [
  {
    image: "/Images/JSB1/01.b.jpg",
    title: "Empowering Rural Communities",
    description: "Witness the impact of JSB initiatives across various districts through authentic visual storytelling."
  },
  {
    image: "/Images/JSB1/02.a.jpg",
    title: "Building Resilient Livelihoods",
    description: "Discover how we are fostering sustainable economic growth in rural areas."
  },
  {
    image: "/Images/JSB3/JSB3_2.jpg",
    title: "Stories & Visuals from the Field",
    description: "Explore real journeys of project beneficiaries and browse our extensive photo galleries."
  },
  {
    image: "/Images/JSB3/JSB3_3.jpg",
    title: "Mountain Community Support",
    description: "See the difference made in the lives of those living in remote regions."
  },
  {
    image: "/Images/JSB4/1.png",
    title: "Sustainable Livelihoods in Action",
    description: "Watch the videos and read the stories that bring our sustainable development initiatives to life."
  },
  {
    image: "/Images/JSB4/2.png",
    title: "Clean Energy & Agriculture",
    description: "Learn about our efforts to introduce innovative, eco-friendly farming practices."
  }
];

const currentHeroSlide = ref(0);
let heroTimer: ReturnType<typeof setInterval> | null = null;

onMounted(() => {
  heroTimer = setInterval(() => {
    currentHeroSlide.value = (currentHeroSlide.value + 1) % heroSlides.length;
  }, 6000);
});

onBeforeUnmount(() => {
  if (heroTimer) clearInterval(heroTimer);
});

const allMedia = ref<MediaItem[]>(getAllMedia());

const selectedProject = ref("all");

const selectedMediaType = ref<MediaType | "all">("all");
const searchQuery = ref("");

const activeMediaTypeLabel = computed(() => {
  if (selectedMediaType.value === "image") return "Image Gallery";
  if (selectedMediaType.value === "video") return "Video Gallery";
  if (selectedMediaType.value === "story") return "Success Stories";
  return "All Media & Stories";
});

const distinctProjects = computed(() => {
  const set = new Set(allMedia.value.map((m) => m.programme).filter(p => p && p !== "UNDP"));
  return Array.from(set).sort();
});



const filteredMedia = computed(() => {
  let list = [...allMedia.value];

  if (selectedMediaType.value !== "all") {
    list = list.filter((m) => m.type === selectedMediaType.value);
  }

  if (selectedProject.value !== "all") {
    list = list.filter((m) => m.programme === selectedProject.value);
  }



  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase();
    list = list.filter((m) => {
      return (
        m.title.toLowerCase().includes(q) ||
        m.district.toLowerCase().includes(q) ||
        (m.programme || "").toLowerCase().includes(q) ||
        (m.description || "").toLowerCase().includes(q)
      );
    });
  }

  return list;
});

// Modal Logic
const activeItem = ref<MediaItem | null>(null);

const openMedia = (item: MediaItem) => {
  activeItem.value = item;
  document.body.classList.add("no-scroll");
};

const closeMedia = () => {
  activeItem.value = null;
  document.body.classList.remove("no-scroll");
};
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

.jsb-gallery-hero-carousel {
  position: relative;
  width: 100%;
  height: clamp(400px, 45vh, 600px);
  border-radius: 24px;
  overflow: hidden;
  margin: 0;
  box-shadow: 0 10px 32px rgba(16, 24, 40, 0.08);
  background: #0f1f37;
}

.hero-slide {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  visibility: hidden;
  transition: opacity 1s ease, visibility 1s ease;
  display: flex;
  align-items: center;
}

.hero-slide.active {
  opacity: 1;
  visibility: visible;
}

.hero-slide-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  transform: scale(1.05);
  transition: transform 6s ease;
}

.hero-slide.active .hero-slide-bg {
  transform: scale(1);
}

.hero-slide-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, rgba(10, 20, 38, 0.85) 0%, rgba(10, 20, 38, 0.5) 50%, rgba(10, 20, 38, 0.1) 100%),
              linear-gradient(180deg, rgba(10, 20, 38, 0.2) 0%, rgba(10, 20, 38, 0.7) 100%);
}

.hero-slide-content {
  position: relative;
  z-index: 2;
  padding: 3rem;
  width: 100%;
}

.hero-slide-inner {
  max-width: 48rem;
}

.hero-eyebrow {
  margin: 0 0 1rem;
  font-size: 0.85rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  font-weight: 700;
  color: #6bb2ff;
  opacity: 0;
  transform: translateY(20px);
}

.animated-text {
  color: #ffffff;
  margin: 0 0 1.25rem;
  opacity: 0;
  transform: translateY(20px);
}

.hero-slide-content h1.animated-text {
  font-size: clamp(2.2rem, 4vw, 3.8rem);
  line-height: 1.05;
  letter-spacing: -0.03em;
  text-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.hero-slide-content p.animated-text {
  font-size: clamp(1.05rem, 1.5vw, 1.25rem);
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.85);
  max-width: 42rem;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.hero-slide.active .hero-eyebrow,
.hero-slide.active .animated-text {
  animation: slideUpFade 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.hero-slide.active .hero-eyebrow { animation-delay: 0.2s; }
.hero-slide.active h1.animated-text { animation-delay: 0.4s; }
.hero-slide.active p.animated-text.delay-1 { animation-delay: 0.6s; }

@keyframes slideUpFade {
  0% {
    opacity: 0;
    transform: translateY(30px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.hero-controls {
  position: absolute;
  bottom: 2rem;
  left: 3rem;
  display: flex;
  gap: 0.5rem;
  z-index: 10;
}

.hero-dot {
  width: 32px;
  height: 4px;
  background: rgba(255, 255, 255, 0.3);
  border: none;
  border-radius: 999px;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 0;
}

.hero-dot.active {
  background: #ffffff;
  width: 48px;
}

.jsb-gallery-grid {
  margin: 0;
}

.jsb-gallery-grid {
  padding: 1.5rem;
  border-radius: 24px;
  border: 1px solid rgba(16, 24, 40, 0.06);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(246, 249, 253, 0.98) 100%);
  box-shadow: 0 10px 32px rgba(16, 24, 40, 0.06);
}



.jsb-gallery-tabs-section {
  padding: 0 1rem;
}

.jsb-gallery-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
}

.jsb-media-tab {
  border: 1px solid rgba(16, 24, 40, 0.08);
  background: linear-gradient(180deg, #fbfdff 0%, #f2f7fd 100%);
  color: #51607b;
  border-radius: 999px;
  padding: 0.85rem 1.45rem;
  min-width: 140px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.6rem;
  font-weight: 600;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.95);
  transition: border-color 0.2s ease, color 0.2s ease, transform 0.2s ease,
    box-shadow 0.2s ease, background 0.2s ease;
  cursor: pointer;
}

.jsb-media-tab.active {
  background: linear-gradient(135deg, #2c7ef3 0%, #1958c5 100%);
  color: #ffffff;
  border-color: transparent;
  box-shadow: 0 10px 20px rgba(37, 100, 214, 0.22);
}

.jsb-media-tab:not(.active):hover {
  transform: translateY(-1px);
  border-color: rgba(31, 111, 229, 0.22);
  color: #1f6fe5;
}

.jsb-gallery-toolbar {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(16, 24, 40, 0.06);
}

.jsb-gallery-toolbar__left h2 {
  margin: 0 0 0.4rem;
  color: #12233f;
  font-size: clamp(1.6rem, 3vw, 2rem);
  letter-spacing: -0.04em;
}

.results-count {
  margin: 0;
  color: #62708a;
  font-size: 0.9rem;
}

.jsb-gallery-toolbar__right {
  display: grid;
  grid-template-columns: minmax(140px, 1fr) minmax(200px, 1.5fr);
  gap: 1rem;
}

.jsb-gallery-toolbar__group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.jsb-gallery-toolbar__group label {
  font-size: 0.8rem;
  font-weight: 600;
  color: #51607b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.jsb-gallery-toolbar__group select,
.jsb-gallery-toolbar__group input {
  padding: 0.75rem 1rem;
  border-radius: 12px;
  border: 1px solid #d0d7e2;
  background: #ffffff;
  color: #12233f;
  font-size: 0.95rem;
  font-family: inherit;
  transition: all 0.2s ease;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.02);
}

.jsb-gallery-toolbar__group select:focus,
.jsb-gallery-toolbar__group input:focus {
  outline: none;
  border-color: #1f6fe5;
  box-shadow: 0 0 0 4px rgba(31, 111, 229, 0.1);
}

.jsb-gallery-story-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
}

.jsb-gallery-story-card {
  display: flex;
  flex-direction: column;
  background: #ffffff;
  border-radius: 20px;
  border: 1px solid rgba(16, 24, 40, 0.06);
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(16, 24, 40, 0.04);
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
  cursor: pointer;
}

.jsb-gallery-story-card:hover {
  transform: translateY(-4px);
  border-color: rgba(31, 111, 229, 0.26);
  box-shadow: 0 16px 32px rgba(16, 24, 40, 0.08);
}

.story-thumb {
  position: relative;
  width: 100%;
  height: 200px;
  background: #eef4fb;
}

.story-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.media-type-icon {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 36px;
  height: 36px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(8px);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.story-body {
  padding: 1.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.story-meta-top {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.meta-district,
.meta-project {
  display: inline-flex;
  align-items: center;
  padding: 0.35rem 0.7rem;
  background: #f2f7fd;
  color: #1f6fe5;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.meta-project {
  background: #fff3e0;
  color: #e65100;
}

.story-title {
  margin: 0;
  font-size: 1.35rem;
  color: #12233f;
  line-height: 1.3;
}

.story-snippet {
  margin: 0;
  color: #62708a;
  font-size: 0.95rem;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.story-footer {
  padding: 0 1.5rem 1.5rem;
  margin-top: auto;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.8rem 1.25rem;
  border-radius: 999px;
  font-weight: 600;
  font-size: 0.95rem;
  text-decoration: none;
  cursor: pointer;
  border: 1px solid transparent;
  transition: all 0.2s ease;
  width: 100%;
}

.btn-primary {
  background: linear-gradient(135deg, #2c7ef3 0%, #1958c5 100%);
  color: #ffffff;
  box-shadow: 0 6px 16px rgba(37, 100, 214, 0.2);
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 20px rgba(37, 100, 214, 0.3);
}

.btn-secondary {
  background: #ffffff;
  color: #12233f;
  border-color: #d0d7e2;
}

.btn-ghost {
  background: transparent;
  color: #51607b;
}

.btn-ghost:hover {
  background: rgba(16, 24, 40, 0.05);
  color: #12233f;
}

.empty-text {
  grid-column: 1 / -1;
  text-align: center;
  padding: 4rem 1rem;
  color: #62708a;
  font-size: 1.1rem;
  background: #ffffff;
  border-radius: 20px;
  border: 1px dashed #d0d7e2;
}

/* Modal Styles */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(16, 24, 40, 0.85);
  backdrop-filter: blur(8px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.close-float-btn {
  position: absolute;
  top: -40px;
  right: 0;
  background: none;
  border: none;
  color: white;
  font-size: 2rem;
  cursor: pointer;
}

.image-modal-content {
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
}

.full-image {
  max-width: 100%;
  max-height: 90vh;
  border-radius: 8px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  object-fit: contain;
}

.video-modal-content {
  position: relative;
  width: 100%;
  max-width: 1000px;
  aspect-ratio: 16/9;
  background: #000;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.video-modal-content iframe {
  width: 100%;
  height: 100%;
  border: none;
}

.modal-dialog {
  background: #fff;
  width: 100%;
  max-width: 1000px;
  height: 90vh;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
}

.modal-header {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  background: #fbfdff;
}

.modal-header h2 {
  margin: 0.2rem 0 0;
  font-size: 1.4rem;
  color: #12233f;
}

.modal-district {
  display: inline-block;
  font-size: 0.8rem;
  color: #62708a;
  font-weight: 600;
  text-transform: uppercase;
}

.icon-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  line-height: 1;
  color: #62708a;
  cursor: pointer;
  padding: 0.5rem;
  transition: color 0.2s;
}

.icon-btn:hover {
  color: #12233f;
}

.modal-body {
  flex: 1;
  background: #f5f8fc;
  position: relative;
  overflow: hidden;
}

.modal-footer {
  padding: 1rem 1.5rem;
  background: #ffffff;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-footer .btn {
  width: auto;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 991px) {
  .hero-slide-content {
    padding: 2rem;
  }
  
  .hero-controls {
    left: 2rem;
    bottom: 1.5rem;
  }

  .jsb-gallery-toolbar__right {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 768px) {
  .jsb-gallery-toolbar {
    flex-direction: column;
    align-items: flex-start;
  }

  .jsb-gallery-toolbar__right {
    width: 100%;
    grid-template-columns: 1fr;
  }

  .modal-backdrop {
    padding: 1rem;
  }
  
  .modal-dialog {
    height: 95vh;
  }
  
  .close-float-btn {
    top: -30px;
    right: 0;
  }
}
</style>
